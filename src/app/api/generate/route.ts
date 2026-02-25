import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePage, PageType } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const { dispensaryName, city, state, keyword, pageType } = body;

  if (!dispensaryName || !city || !state || !keyword || !pageType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const dispensary = await prisma.dispensary.findUnique({
    where: { userId },
  });

  try {
    const result = await generatePage({
      dispensaryName,
      city,
      state,
      keyword,
      pageType: pageType as PageType,
      brandVoice: dispensary?.brandVoice || undefined,
      license: dispensary?.license || undefined,
      address: dispensary?.address || undefined,
      phone: dispensary?.phone || undefined,
      website: dispensary?.website || undefined,
    });

    const page = await prisma.generatedPage.create({
      data: {
        userId,
        title: result.seoTitle,
        pageType,
        keyword,
        city,
        state,
        htmlContent: result.htmlContent,
        seoTitle: result.seoTitle,
        seoMeta: result.seoMeta,
        ogTitle: result.ogTitle,
        ogDescription: result.ogDescription,
        jsonLd: result.jsonLd,
        internalLinks: JSON.stringify(result.internalLinks),
      },
    });

    return NextResponse.json({ page, ...result });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate page. Check your ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }
}
