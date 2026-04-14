import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST() {
  const session = getCurrentUser();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(session.id).select("stripeCustomerId");
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "Aucun abonnement actif" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/dashboard?stripe=portal`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ error: "Erreur portail Stripe" }, { status: 500 });
  }
}
