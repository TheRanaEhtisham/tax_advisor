export type Product = {
  id: string;
  name: string;
  price: number;
  currency: "CAD";
  description: string;
  bestFor: string[];
  supports: {
    salaryIncome: boolean;
    studentIncome: boolean;
    medicalExpenses: boolean;
    donations: boolean;
    employmentExpenses: boolean;
    investmentIncome: boolean;
    capitalGains: boolean;
    foreignIncome: boolean;
    rentalIncome: boolean;
    freelanceIncome: boolean;
    gigWorkIncome: boolean;
    businessExpenses: boolean;
    homeOfficeExpenses: boolean;
    vehicleExpenses: boolean;
    expertHelp: boolean;
    fullService: boolean;
    corporateFiling: boolean;
    nilCorporateReturn: boolean;
  };
  category: "personal" | "self-employed" | "expert" | "corporate";
};

export type FilingType = "personal" | "freelancer" | "incorporated";

export type HelpPreference = "self" | "expert-help" | "expert-file";

export type QuestionnaireAnswers = {
  filingType: FilingType | null;
  incomeSources: string[];
  deductions: string[];
  helpPreference: HelpPreference | null;
  hasRevenue: boolean | null;
};

export type RecommendationResult = {
  recommendedProductId: string;
  recommendedProductName: string;
  price: number;
  confidence: "low" | "medium" | "high";
  reasons: string[];
  matchedInputs: string[];
  optionalUpgrade?: {
    productId: string;
    productName: string;
    reason: string;
  };
  warnings?: string[];
  disclaimer: string;
};

export type AIResponse = {
  answer: string;
  recommendedProduct?: string;
  confidence?: "low" | "medium" | "high";
  reasons?: string[];
  disclaimer: string;
};
