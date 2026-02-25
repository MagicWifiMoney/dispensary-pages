import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const dispensary = await prisma.dispensary.findUnique({
    where: { userId },
  });

  return NextResponse.json(dispensary);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const dispensary = await prisma.dispensary.upsert({
    where: { userId },
    update: {
      name: body.name,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      phone: body.phone,
      website: body.website,
      license: body.license,
      brandVoice: body.brandVoice,
    },
    create: {
      userId,
      name: body.name,
      address: body.address,
      city: body.city,
      state: body.state || "MN",
      zipCode: body.zipCode,
      phone: body.phone,
      website: body.website,
      license: body.license,
      brandVoice: body.brandVoice,
    },
  });

  return NextResponse.json(dispensary);
}
