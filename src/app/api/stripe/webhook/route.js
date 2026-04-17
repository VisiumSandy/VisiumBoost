import { NextResponse } from "next/server";
import stripe, { PRICE_TO_PLAN } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

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
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpsert(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        console.warn(`[stripe] invoice.payment_failed customer=${invoice.customer} amount=${invoice.amount_due}`);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
