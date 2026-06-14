import { AIResponse } from "./types";
import { products } from "@/data/products";

const DISCLAIMER =
  "This is general product guidance only and is not tax, legal, or financial advice. Please consult a qualified tax professional for advice specific to your situation.";

const UNSAFE_PATTERNS = [
  /guarantee.*refund/i,
  /refund.*guarantee/i,
  /definitely qualify/i,
  /tax authority will accept/i,
  /legal advice/i,
  /professional tax advice/i,
  /you must use/i,
  /you will get.*refund/i,
  /will get.*money back/i,
  /sure.*refund/i,
];

const UNSAFE_RESPONSE: AIResponse = {
  answer:
    "I cannot guarantee refunds or tax outcomes. I can only provide general product guidance based on the product rules. Please consult a qualified tax professional for tax advice.",
  disclaimer: DISCLAIMER,
};

type KeywordMap = {
  keywords: RegExp[];
  products: string[];
  answer: string;
  confidence: "low" | "medium" | "high";
  reasons: string[];
};

const keywordRules: KeywordMap[] = [
  {
    keywords: [/incorporated|corporation|corp\b|corporate/i],
    products: ["business-corporate", "nil-corporate-return"],
    answer:
      "Based on the provided product rules, if you have an incorporated company with revenue, Business Corporate (CAD $400) appears suitable. If your company had no revenue, Nil Corporate Return (CAD $175) is the appropriate product. Both handle corporate tax filings. These products do not cover personal tax returns.",
    confidence: "high",
    reasons: [
      "User mentioned incorporated company or corporation.",
      "Corporate filing requires Business Corporate or Nil Corporate Return.",
    ],
  },
  {
    keywords: [/no revenue|nil return|zero revenue|no income.*company/i],
    products: ["nil-corporate-return"],
    answer:
      "Based on the provided product rules, Nil Corporate Return (CAD $175) appears suitable for incorporated companies that had no revenue during the tax year.",
    confidence: "high",
    reasons: [
      "User mentioned no revenue for the company.",
      "Nil Corporate Return is designed for incorporated companies with nil returns.",
    ],
  },
  {
    keywords: [/expert.*file.*me|file.*for me|someone.*file|hands.?off/i],
    products: ["expert-full-service"],
    answer:
      "Based on the provided product rules, Expert Full Service (CAD $250) appears suitable. A tax expert will prepare and file your return for you, including document upload and progress tracking.",
    confidence: "high",
    reasons: [
      "User wants an expert to file the return.",
      "Expert Full Service provides full filing by a tax expert.",
    ],
  },
  {
    keywords: [/expert help|help.*filing|chat.*expert|expert.*chat|video.*expert|expert.*video/i],
    products: ["expert-assist"],
    answer:
      "Based on the provided product rules, Expert Assist (CAD $120) appears suitable. You can file yourself while getting expert help via chat or video call, with an expert review before filing.",
    confidence: "high",
    reasons: [
      "User wants expert help while filing.",
      "Expert Assist provides expert chat, video call, and review before filing.",
    ],
  },
  {
    keywords: [/freelan|self.?employ|gig.?work|contractor|sole prop/i],
    products: ["self-employed"],
    answer:
      "Based on the provided product rules, Self-Employed (CAD $70) appears suitable for freelancers, contractors, gig workers, and sole proprietors. It supports freelance income, gig-work income, business expenses, home-office expenses, and vehicle expenses.",
    confidence: "high",
    reasons: [
      "User mentioned freelance, self-employment, or gig work.",
      "Self-Employed covers freelance and gig-work income with business expense deductions.",
    ],
  },
  {
    keywords: [/home.?office|vehicle expense|business expense/i],
    products: ["self-employed"],
    answer:
      "Based on the provided product rules, Self-Employed (CAD $70) appears suitable. It specifically supports home-office expenses, vehicle expenses, and business expenses for self-employed individuals.",
    confidence: "high",
    reasons: [
      "User mentioned home-office, vehicle, or business expenses.",
      "Self-Employed is the appropriate product for these deductions.",
    ],
  },
  {
    keywords: [/investment income|capital gain|rental income|foreign income/i],
    products: ["premier"],
    answer:
      "Based on the provided product rules, Premier (CAD $50) appears suitable. It supports investment income, capital gains, rental income, and foreign income, in addition to everything in Deluxe.",
    confidence: "high",
    reasons: [
      "User mentioned investment, capital gains, rental, or foreign income.",
      "Premier covers these income types.",
    ],
  },
  {
    keywords: [/medical expense|donation|employment expense/i],
    products: ["deluxe"],
    answer:
      "Based on the provided product rules, Deluxe (CAD $30) appears suitable. It supports medical expenses, donations, and employment expenses, in addition to everything in Free.",
    confidence: "high",
    reasons: [
      "User mentioned medical expenses, donations, or employment expenses.",
      "Deluxe covers common deductions and expenses.",
    ],
  },
  {
    keywords: [/salary|simple|basic|just salary|only salary|student/i],
    products: ["free"],
    answer:
      "Based on the provided product rules, Free (CAD $0) appears suitable for simple personal tax situations with salary income or student income and no special deductions.",
    confidence: "medium",
    reasons: [
      "User mentioned salary or simple personal return.",
      "Free covers basic personal returns at no cost.",
    ],
  },
  {
    keywords: [/difference.*premier.*self.?employ|difference.*self.?employ.*premier/i],
    products: ["premier", "self-employed"],
    answer:
      "Based on the provided product rules: Premier (CAD $50) is designed for investment income, capital gains, rental income, and foreign income — it does not support freelance or self-employment income. Self-Employed (CAD $70) is designed for freelancers, contractors, and gig workers — it supports freelance income, gig-work income, business expenses, home-office expenses, and vehicle expenses, but does not cover capital gains or foreign income.",
    confidence: "high",
    reasons: [
      "User asked about the difference between Premier and Self-Employed.",
      "Premier targets investment/rental income; Self-Employed targets freelance/gig income.",
    ],
  },
  {
    keywords: [/can i use free|free.*work|use.*free product/i],
    products: ["free"],
    answer:
      "Based on the provided product rules, Free (CAD $0) supports only salary income, student income, basic personal returns, and simple tax slips. It does not support medical expenses, donations, investment income, rental income, self-employment income, or expert help. If your situation involves any of those, a different product would appear more suitable.",
    confidence: "medium",
    reasons: [
      "User asked about the Free product suitability.",
      "Free is limited to simple personal returns.",
    ],
  },
];

export function simulateAI(question: string): AIResponse {
  // Safety check
  if (UNSAFE_PATTERNS.some((p) => p.test(question))) {
    return UNSAFE_RESPONSE;
  }

  // Match keyword rules
  for (const rule of keywordRules) {
    if (rule.keywords.some((k) => k.test(question))) {
      const recommendedProduct = rule.products[0];
      return {
        answer: rule.answer,
        recommendedProduct: products.find((p) => p.id === recommendedProduct)?.name,
        confidence: rule.confidence,
        reasons: rule.reasons,
        disclaimer: DISCLAIMER,
      };
    }
  }

  // Fallback
  return {
    answer:
      "Based on the provided product rules, I was unable to identify a specific product match from your question. Could you describe your income sources, deductions, or whether you need expert help? I can then provide more relevant product guidance.",
    disclaimer: DISCLAIMER,
  };
}

export function buildSystemPrompt(): string {
  const productSummary = products
    .map(
      (p) =>
        `- ${p.name} (CAD $${p.price}): ${p.description} Supports: ${Object.entries(p.supports)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(", ")}.`
    )
    .join("\n");

  return `You are a tax software product assistant. You help users choose the right tax software product based on their tax situation.

PRODUCTS:
${productSummary}

RECOMMENDATION RULES (priority order):
1. Incorporated company → Business Corporate (with revenue) or Nil Corporate Return (no revenue)
2. Wants expert to file → Expert Full Service
3. Wants expert help while filing → Expert Assist
4. Freelance/gig/self-employed income or expenses → Self-Employed
5. Investment, capital gains, rental, or foreign income → Premier
6. Medical expenses, donations, or employment expenses → Deluxe
7. Simple salary/student return → Free

SAFETY RULES:
- Do not provide tax, legal, financial, or accounting advice
- Do not guarantee refunds or tax outcomes
- Do not say "you definitely qualify" or "you must use"
- Always include: "This is general product guidance only and is not tax, legal, or financial advice."
- Always say "Based on the provided product rules..." or "This product appears suitable..."`;
}
