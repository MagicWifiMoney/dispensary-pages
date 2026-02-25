import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  starter: {
    name: "Starter",
    price: 49,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    features: [
      "10 pages/month",
      "SEO metadata generation",
      "JSON-LD schema markup",
      "HTML & Markdown export",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    features: [
      "Unlimited pages",
      "SEO metadata generation",
      "JSON-LD schema markup",
      "HTML & Markdown export",
      "Internal linking suggestions",
      "Multi-dispensary support",
      "Priority support",
      "Custom brand voice",
    ],
  },
} as const;
