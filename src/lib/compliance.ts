export const STATE_COMPLIANCE: Record<
  string,
  { rules: string[]; notes: string }
> = {
  MN: {
    rules: [
      "No health or medical claims about cannabis products",
      "No content targeting minors or using youth-appealing imagery",
      "Must include dispensary license number",
      "No price comparisons with illicit market",
      "Include 'Must be 21+' disclaimer",
    ],
    notes:
      "Minnesota legalized adult-use in 2023. Office of Cannabis Management (OCM) regulates.",
  },
  CO: {
    rules: [
      "No health claims without FDA approval",
      "No content appealing to children",
      "Must include license number on all marketing",
      "No consumption depicted in advertising",
      "Include 'Must be 21+' disclaimer",
      "No claims of organic/pesticide-free without certification",
    ],
    notes:
      "Colorado MED (Marijuana Enforcement Division) regulates. Mature market since 2014.",
  },
  CA: {
    rules: [
      "No health claims or therapeutic benefits",
      "No images attractive to minors",
      "Must include license number (C-XX-XXXXXXX format)",
      "Include CA universal cannabis symbol where applicable",
      "Include 'For use only by adults 21 and older' warning",
      "No false or misleading statements",
    ],
    notes:
      "California DCC (Department of Cannabis Control) regulates. Prop 64 since 2016.",
  },
  IL: {
    rules: [
      "No health or medical claims",
      "No marketing to persons under 21",
      "Must include dispensary license number",
      "No depictions of cannabis consumption",
      "Include 'Must be 21+' disclaimer",
      "No testimonials from healthcare professionals",
    ],
    notes:
      "Illinois IDFPR regulates. Adult-use since Jan 2020 via Cannabis Regulation and Tax Act.",
  },
  MI: {
    rules: [
      "No health claims or therapeutic benefit claims",
      "No content targeting individuals under 21",
      "Must include license number",
      "No misleading representations",
      "Include 'Must be 21+' disclaimer",
      "Must not promote overconsumption",
    ],
    notes:
      "Michigan CRA (Cannabis Regulatory Agency) regulates. Adult-use since Dec 2019.",
  },
};

export const SUPPORTED_STATES = Object.keys(STATE_COMPLIANCE);

export function getCompliancePrompt(state: string): string {
  const compliance = STATE_COMPLIANCE[state];
  if (!compliance) {
    return "Follow general cannabis advertising best practices: no health claims, no targeting minors, include age verification disclaimer.";
  }

  return `
STATE COMPLIANCE RULES FOR ${state}:
${compliance.rules.map((r) => `- ${r}`).join("\n")}

Context: ${compliance.notes}

CRITICAL: All generated content MUST comply with these rules. Violations can result in license revocation.
  `.trim();
}
