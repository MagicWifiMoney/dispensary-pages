import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripe, PLANS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { plan } = await req.json();

  if (plan !== "starter" && plan !== "pro") {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const planConfig = PLANS[plan as keyof typeof PLANS];

  if (!planConfig.priceId) {
    return NextResponse.json(
      { error: "Stripe price ID not configured. Set STRIPE_STARTER_PRICE_ID and STRIPE_PRO_PRICE_ID in .env" },
      { status: 500 }
    );
  }

  let sub = await prisma.subscription.findUnique({ where: { userId } });

  let customerId = sub?.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: session.user.email || undefined,
      metadata: { userId },
    });
    customerId = customer.id;

    if (!sub) {
      sub = await prisma.subscription.create({
        data: { userId, stripeCustomerId: customerId },
      });
    } else {
      await prisma.subscription.update({
        where: { userId },
        data: { stripeCustomerId: customerId },
      });
    }
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/settings?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/settings?canceled=true`,
    metadata: { userId, plan },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
