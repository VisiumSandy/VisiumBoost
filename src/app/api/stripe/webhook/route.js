import { NextResponse } from "next/server";
import stripe, { PRICE_TO_PLAN } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { logPayment, logServerError } from "@/lib/discord";

// App Router: disable body buffering so we can read the raw stream for Stripe signature
export const dynamic = "force-dynamic";

async function handleSubscriptionUpsert(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = PRICE_TO_PLAN[priceId] || "free";

  const isActive = ["active", "trialing"].includes(subscription.status);

  await connectDB();
  await User.findByIdAndUpdate(userId, {
    plan: isActive ? plan : "free",
    stripeSubscriptionId: subscription.id,
    // Clear trial when a real subscription is active
    ...(isActive ? { trialEndsAt: null } : {}),
  });
}

async function handleCheckoutCompleted(session) {
  const userId = session.metadata?.userId;
  const plan   = session.metadata?.plan;
  if (!userId || !plan) return;

  await connectDB();
  await User.findByIdAndUpdate(userId, {
    plan,
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription,
    trialEndsAt: null,
  });
}

async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await connectDB();
  await User.findByIdAndUpdate(userId, {
    plan: "free",
    stripeSubscriptionId: null,
  });
}

export async function POST(req) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        logPayment({ event: "new", email: session.customer_email, plan: session.metadata?.plan, amount: session.amount_total });
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object;
        await handleSubscriptionUpsert(sub);
        const plan = PRICE_TO_PLAN[sub.items?.data?.[0]?.price?.id] || "free";
        logPayment({ event: "updated", plan, email: sub.metadata?.userId || "—" });
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await handleSubscriptionDeleted(sub);
        logPayment({ event: "deleted", email: sub.metadata?.userId || "—" });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        logPayment({ event: "failed", email: invoice.customer_email || "—", amount: invoice.amount_due });
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    logServerError({ route: "/api/stripe/webhook", message: err.message });
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
