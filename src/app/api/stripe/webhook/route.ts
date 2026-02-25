import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

interface SubscriptionData {
  id: string;
  status: string;
  current_period_end: number;
  items: { data: Array<{ price: { id: string } }> };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = (await getStripe().subscriptions.retrieve(
      session.subscription as string
    )) as unknown as SubscriptionData;

    await prisma.subscription.update({
      where: { stripeCustomerId: session.customer as string },
      data: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        plan: session.metadata?.plan || "starter",
        status: "active",
      },
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as unknown as SubscriptionData;
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        status: subscription.status === "active" ? "active" : "inactive",
      },
    });
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as unknown as SubscriptionData;
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: "canceled", plan: "free" },
    });
  }

  return NextResponse.json({ received: true });
}
