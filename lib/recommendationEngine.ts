import { QuestionnaireAnswers, RecommendationResult } from "./types";
import { products, getProductById } from "@/data/products";

const DISCLAIMER =
  "This recommendation provides general product guidance only and is not tax, legal, or financial advice. Please consult a qualified tax professional for advice specific to your situation.";

export function getRecommendation(answers: QuestionnaireAnswers): RecommendationResult {
  const { filingType, incomeSources, deductions, helpPreference, hasRevenue } = answers;

  const matchedInputs: string[] = [];
  const reasons: string[] = [];

  // Rule 1: Incorporated company — highest priority
  if (filingType === "incorporated") {
    if (hasRevenue === false) {
      matchedInputs.push("incorporatedCompany", "noRevenue");
      reasons.push(
        "You selected incorporated company.",
        "Your company had no revenue.",
        "Nil Corporate Return is designed for incorporated companies filing a nil return."
      );
      return buildResult("nil-corporate-return", reasons, matchedInputs, "high");
    }
    matchedInputs.push("incorporatedCompany", "hasRevenue");
    reasons.push(
      "You selected incorporated company.",
      "Your company had revenue.",
      "Business Corporate handles corporate tax returns with business revenue."
    );
    return buildResult("business-corporate", reasons, matchedInputs, "high");
  }

  // Rule 2: Expert Full Service
  if (helpPreference === "expert-file") {
    matchedInputs.push("wantsExpertToFile");
    reasons.push(
      "You want an expert to file for you.",
      "Expert Full Service includes document upload, expert preparation, and expert filing."
    );
    return buildResult("expert-full-service", reasons, matchedInputs, "high");
  }

  // Rule 3: Expert Assist
  if (helpPreference === "expert-help") {
    matchedInputs.push("wantsExpertHelp");
    reasons.push(
      "You want expert help while filing.",
      "Expert Assist provides expert chat and video call support during filing."
    );
    return buildResult("expert-assist", reasons, matchedInputs, "high");
  }

  // Rule 4: Self-Employed
  const selfEmployedTriggers: string[] = [];
  if (filingType === "freelancer") selfEmployedTriggers.push("freelancerFilingType");
  if (incomeSources.includes("freelanceIncome")) selfEmployedTriggers.push("freelanceIncome");
  if (incomeSources.includes("gigWorkIncome")) selfEmployedTriggers.push("gigWorkIncome");
  if (incomeSources.includes("businessRevenue")) selfEmployedTriggers.push("businessRevenue");
  if (deductions.includes("businessExpenses")) selfEmployedTriggers.push("businessExpenses");
  if (deductions.includes("homeOfficeExpenses")) selfEmployedTriggers.push("homeOfficeExpenses");
  if (deductions.includes("vehicleExpenses")) selfEmployedTriggers.push("vehicleExpenses");

  if (selfEmployedTriggers.length > 0) {
    selfEmployedTriggers.forEach((t) => matchedInputs.push(t));
    reasons.push(
      ...selfEmployedTriggers.map((t) => `You selected ${formatLabel(t)}.`),
      "Self-Employed supports freelance income, gig-work income, and business-related expenses."
    );
    return buildResult("self-employed", reasons, matchedInputs, "high");
  }

  // Rule 5: Premier
  const premierTriggers: string[] = [];
  if (incomeSources.includes("investmentIncome")) premierTriggers.push("investmentIncome");
  if (incomeSources.includes("capitalGains")) premierTriggers.push("capitalGains");
  if (incomeSources.includes("rentalIncome")) premierTriggers.push("rentalIncome");
  if (incomeSources.includes("foreignIncome")) premierTriggers.push("foreignIncome");

  if (premierTriggers.length > 0) {
    premierTriggers.forEach((t) => matchedInputs.push(t));
    reasons.push(
      ...premierTriggers.map((t) => `You selected ${formatLabel(t)}.`),
      "Premier supports investment income, capital gains, rental income, and foreign income."
    );
    const upgrade =
      deductions.some((d) =>
        ["medicalExpenses", "donations", "employmentExpenses"].includes(d)
      )
        ? undefined
        : undefined;
    return buildResult("premier", reasons, matchedInputs, "high", upgrade);
  }

  // Rule 6: Deluxe
  const deluxeTriggers: string[] = [];
  if (deductions.includes("medicalExpenses")) deluxeTriggers.push("medicalExpenses");
  if (deductions.includes("donations")) deluxeTriggers.push("donations");
  if (deductions.includes("employmentExpenses")) deluxeTriggers.push("employmentExpenses");

  if (deluxeTriggers.length > 0) {
    deluxeTriggers.forEach((t) => matchedInputs.push(t));
    reasons.push(
      ...deluxeTriggers.map((t) => `You selected ${formatLabel(t)}.`),
      "Deluxe supports medical expenses, donations, and employment expenses."
    );
    return buildResult("deluxe", reasons, matchedInputs, "high");
  }

  // Rule 7: Free
  matchedInputs.push("simplePersonalReturn");
  reasons.push(
    "You have a simple personal tax situation.",
    "No special deductions or complex income sources were selected.",
    "Free covers salary income and student income at no cost."
  );

  const hasComplexIncome = incomeSources.some((s) =>
    ["investmentIncome", "capitalGains", "rentalIncome", "foreignIncome", "freelanceIncome", "gigWorkIncome", "businessRevenue"].includes(s)
  );

  const optionalUpgrade =
    !hasComplexIncome
      ? {
          productId: "deluxe",
          productName: "Deluxe",
          reason:
            "If you have medical expenses or donations, consider upgrading to Deluxe (CAD $30).",
        }
      : undefined;

  return buildResult("free", reasons, matchedInputs, "high", optionalUpgrade);
}

function buildResult(
  productId: string,
  reasons: string[],
  matchedInputs: string[],
  confidence: "low" | "medium" | "high",
  optionalUpgrade?: { productId: string; productName: string; reason: string },
  warnings?: string[]
): RecommendationResult {
  const product = getProductById(productId);
  if (!product) throw new Error(`Product ${productId} not found`);

  return {
    recommendedProductId: productId,
    recommendedProductName: product.name,
    price: product.price,
    confidence,
    reasons,
    matchedInputs,
    optionalUpgrade,
    warnings,
    disclaimer: DISCLAIMER,
  };
}

function formatLabel(key: string): string {
  const labels: Record<string, string> = {
    freelancerFilingType: "Freelancer / self-employed filing type",
    freelanceIncome: "freelance income",
    gigWorkIncome: "gig-work income",
    businessRevenue: "business revenue",
    businessExpenses: "business expenses",
    homeOfficeExpenses: "home-office expenses",
    vehicleExpenses: "vehicle expenses",
    investmentIncome: "investment income",
    capitalGains: "capital gains",
    rentalIncome: "rental income",
    foreignIncome: "foreign income",
    medicalExpenses: "medical expenses",
    donations: "donations",
    employmentExpenses: "employment expenses",
    incorporatedCompany: "incorporated company",
    noRevenue: "no revenue",
    hasRevenue: "company had revenue",
    wantsExpertHelp: "wanting expert help while filing",
    wantsExpertToFile: "wanting an expert to file for you",
    simplePersonalReturn: "simple personal return",
  };
  return labels[key] ?? key;
}

export { products };
