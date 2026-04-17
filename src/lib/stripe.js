import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
  apiVersion: "2024-04-10",
});

export default stripe;

// Price ID → plan name mapping
export const PRICE_TO_PLAN = {
  [process.env.STRIPE_PRICE_ESSENTIEL]: "free",
  [process.env.STRIPE_PRICE_STARTER]:   "starter",
  [process.env.STRIPE_PRICE_PRO]:       "pro",
};

// Plan name → price ID mapping
export const PLAN_TO_PRICE = {
  free:    process.env.STRIPE_PRICE_ESSENTIEL,
  starter: process.env.STRIPE_PRICE_STARTER,
  pro:     process.env.STRIPE_PRICE_PRO,
};
