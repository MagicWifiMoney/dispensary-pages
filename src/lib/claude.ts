import Anthropic from "@anthropic-ai/sdk";
import { getCompliancePrompt } from "./compliance";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type PageType =
  | "location"
  | "strain"
  | "product-category"
  | "blog"
  | "deals";

interface GeneratePageInput {
  dispensaryName: string;
  city: string;
  state: string;
  keyword: string;
  pageType: PageType;
  brandVoice?: string;
  license?: string;
  address?: string;
  phone?: string;
  website?: string;
}

interface GeneratedPageOutput {
  htmlContent: string;
  seoTitle: string;
  seoMeta: string;
  ogTitle: string;
  ogDescription: string;
  jsonLd: string;
  internalLinks: string[];
}

const PAGE_TYPE_INSTRUCTIONS: Record<PageType, string> = {
  location: `Generate a LOCAL LANDING PAGE optimized for local SEO. Include:
- Hero section with dispensary name, city, and state
- Introduction paragraph about the dispensary's presence in the local area
- Products/services highlights section
- Store hours/location info placeholder section
- FAQ section with 5+ locally-relevant Q&As
- Strong CTA for visiting or ordering`,

  strain: `Generate a STRAIN INFORMATION PAGE. Include:
- Hero section with the strain/keyword name
- Detailed strain overview (type, effects, flavor profile)
- Terpene profile section
- Best uses and occasions section
- FAQ section with 5+ strain-specific Q&As
- CTA to visit dispensary for this strain`,

  "product-category": `Generate a PRODUCT CATEGORY PAGE. Include:
- Hero section for the product category
- Category overview and what customers can expect
- Featured product types within this category
- How to choose the right product section
- FAQ section with 5+ category-specific Q&As
- CTA to browse or visit`,

  blog: `Generate an SEO BLOG POST. Include:
- Engaging headline and intro hook
- Well-structured body with H2/H3 subheadings
- Informative, educational content about the topic
- Key takeaways or summary section
- FAQ section with 5+ topic-related Q&As
- CTA to learn more or visit the dispensary`,

  deals: `Generate a DEALS & PROMOTIONS PAGE. Include:
- Eye-catching hero section about current offers
- Featured deals section with placeholder deal cards
- Loyalty program information section
- How to redeem deals section
- FAQ section with 5+ deals-related Q&As
- Urgent CTA (limited time, visit now)`,
};

export async function generatePage(
  input: GeneratePageInput
): Promise<GeneratedPageOutput> {
  const complianceRules = getCompliancePrompt(input.state);
  const pageInstructions = PAGE_TYPE_INSTRUCTIONS[input.pageType];

  const systemPrompt = `You are an expert cannabis dispensary SEO content writer. You generate high-quality, compliant, locally-optimized pages for cannabis dispensaries.

${complianceRules}

BRAND VOICE: ${input.brandVoice || "Professional, knowledgeable, and welcoming. Authoritative but approachable."}

OUTPUT FORMAT: You MUST respond with valid JSON only. No markdown fences, no explanation. The JSON must have these exact keys:
{
  "htmlContent": "Full HTML content (everything inside <body>, no <html>/<head> tags). Use semantic HTML5 with Tailwind-style inline classes.",
  "seoTitle": "SEO title tag (60 chars max, include city + state + keyword)",
  "seoMeta": "Meta description (155 chars max, compelling + keyword-rich)",
  "ogTitle": "Open Graph title",
  "ogDescription": "Open Graph description",
  "jsonLd": "Complete LocalBusiness JSON-LD as a JSON string",
  "internalLinks": ["Array of 5 suggested internal page URLs/topics for interlinking"]
}`;

  const userPrompt = `Generate a ${input.pageType.toUpperCase()} page for:

Dispensary: ${input.dispensaryName}
Location: ${input.city}, ${input.state}
Target Keyword: "${input.keyword}"
${input.license ? `License #: ${input.license}` : ""}
${input.address ? `Address: ${input.address}` : ""}
${input.phone ? `Phone: ${input.phone}` : ""}
${input.website ? `Website: ${input.website}` : ""}

${pageInstructions}

IMPORTANT REQUIREMENTS:
1. The HTML must include a FAQPage schema (application/ld+json) with at least 5 Q&As embedded in the HTML
2. Include a LocalBusiness JSON-LD in the jsonLd field
3. Naturally incorporate the target keyword "${input.keyword}" throughout (aim for 1-2% density)
4. Include "${input.city}" and "${input.state}" naturally for local SEO
5. All content must be compliant with ${input.state} cannabis advertising regulations
6. HTML should use modern semantic elements (section, article, nav, etc.)
7. Style the HTML with inline Tailwind-like classes for dark theme (bg-gray-900, text-white, etc.) with green (#22C55E) accents
8. Include a prominent CTA section
9. Do NOT include any <html>, <head>, or <body> wrapper tags - just the inner content`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const parsed = JSON.parse(text);

  return {
    htmlContent: parsed.htmlContent,
    seoTitle: parsed.seoTitle,
    seoMeta: parsed.seoMeta,
    ogTitle: parsed.ogTitle,
    ogDescription: parsed.ogDescription,
    jsonLd: typeof parsed.jsonLd === "string" ? parsed.jsonLd : JSON.stringify(parsed.jsonLd),
    internalLinks: parsed.internalLinks || [],
  };
}
