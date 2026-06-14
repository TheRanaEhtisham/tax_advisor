"use client";

import { useState } from "react";
import Link from "next/link";
import { QuestionnaireAnswers, RecommendationResult, FilingType, HelpPreference } from "@/lib/types";

const TOTAL_STEPS = 5; // Steps shown dynamically; incorporated = 5 steps, else 4

type Step = 1 | 2 | 3 | 4 | 5 | 6; // 6 = result

const incomeOptions = [
  { id: "salaryIncome", label: "Salary income" },
  { id: "studentIncome", label: "Student income" },
  { id: "investmentIncome", label: "Investment income" },
  { id: "capitalGains", label: "Capital gains" },
  { id: "rentalIncome", label: "Rental income" },
  { id: "freelanceIncome", label: "Freelance income" },
  { id: "gigWorkIncome", label: "Gig-work income" },
  { id: "businessRevenue", label: "Business revenue" },
  { id: "foreignIncome", label: "Foreign income" },
];

const deductionOptions = [
  { id: "medicalExpenses", label: "Medical expenses" },
  { id: "donations", label: "Donations" },
  { id: "employmentExpenses", label: "Employment expenses" },
  { id: "homeOfficeExpenses", label: "Home-office expenses" },
  { id: "vehicleExpenses", label: "Vehicle expenses" },
  { id: "businessExpenses", label: "Business expenses" },
  { id: "noDeductions", label: "No special deductions" },
];

const initialAnswers: QuestionnaireAnswers = {
  filingType: null,
  incomeSources: [],
  deductions: [],
  helpPreference: null,
  hasRevenue: null,
};

export default function RecommendPage() {
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIncorporated = answers.filingType === "incorporated";
  const totalSteps = isIncorporated ? 5 : 4;

  function stepLabel(s: number) {
    const labels = ["Filing Type", "Income Sources", "Deductions", "Help Preference"];
    if (isIncorporated) labels.push("Company Revenue");
    return labels[s - 1] ?? "";
  }

  function toggleMulti(
    field: "incomeSources" | "deductions",
    value: string
  ) {
    setAnswers((prev) => {
      const current = prev[field];
      if (field === "deductions") {
        if (value === "noDeductions") {
          return { ...prev, deductions: current.includes("noDeductions") ? [] : ["noDeductions"] };
        }
        const withoutNo = current.filter((v) => v !== "noDeductions");
        return {
          ...prev,
          deductions: withoutNo.includes(value)
            ? withoutNo.filter((v) => v !== value)
            : [...withoutNo, value],
        };
      }
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  }

  function validate(): string | null {
    if (step === 1 && !answers.filingType) return "Please select a filing type.";
    if (step === 2 && answers.incomeSources.length === 0) return "Please select at least one income source.";
    if (step === 4 && !answers.helpPreference) return "Please select your help preference.";
    if (step === 5 && isIncorporated && answers.hasRevenue === null) return "Please answer the company revenue question.";
    return null;
  }

  async function handleNext() {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);

    const nextStep = step + 1;

    // Skip step 5 if not incorporated
    if (step === 4 && !isIncorporated) {
      await submitRecommendation();
      return;
    }

    if (step === 5 && isIncorporated) {
      await submitRecommendation();
      return;
    }

    setStep(nextStep as Step);
  }

  function handleBack() {
    setError(null);
    if (step === 1) return;
    // Skip step 5 backwards if not incorporated
    setStep((prev) => (prev - 1) as Step);
  }

  async function submitRecommendation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get recommendation.");
      setResult(data);
      setStep(6);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setAnswers(initialAnswers);
    setResult(null);
    setError(null);
    setStep(1);
  }

  // Progress
  const progressPercent = step === 6 ? 100 : Math.round(((step - 1) / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Find My Product</h1>
          <p className="text-gray-500 mt-1">Answer a few questions to get your personalized recommendation.</p>
        </div>

        {/* Progress Bar */}
        {step !== 6 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Step {step} of {totalSteps}</span>
              <span>{stepLabel(step)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Step 1: Filing Type */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What are you filing for?</h2>
              <p className="text-gray-500 text-sm mb-6">Select the option that best describes your situation.</p>
              <div className="flex flex-col gap-3">
                {[
                  { value: "personal", label: "Personal return", desc: "Salary, student, or personal income" },
                  { value: "freelancer", label: "Freelancer / self-employed", desc: "Freelance, contracts, gig work, sole proprietorship" },
                  { value: "incorporated", label: "Incorporated company", desc: "Corporation filing a corporate tax return" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((p) => ({ ...p, filingType: opt.value as FilingType }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                      answers.filingType === opt.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${answers.filingType === opt.value ? "border-blue-600 bg-blue-600" : "border-gray-400"}`} />
                    <div>
                      <div className="font-semibold text-gray-900">{opt.label}</div>
                      <div className="text-gray-500 text-sm">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Income Sources */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Which income sources apply to you?</h2>
              <p className="text-gray-500 text-sm mb-6">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {incomeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleMulti("incomeSources", opt.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                      answers.incomeSources.includes(opt.id)
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center ${answers.incomeSources.includes(opt.id) ? "border-blue-600 bg-blue-600" : "border-gray-400"}`}>
                      {answers.incomeSources.includes(opt.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Deductions */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Which deductions or expenses apply?</h2>
              <p className="text-gray-500 text-sm mb-6">Select all that apply. Selecting &quot;No special deductions&quot; clears other selections.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {deductionOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleMulti("deductions", opt.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors ${
                      answers.deductions.includes(opt.id)
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center ${answers.deductions.includes(opt.id) ? "border-blue-600 bg-blue-600" : "border-gray-400"}`}>
                      {answers.deductions.includes(opt.id) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Help Preference */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">How much help do you want?</h2>
              <p className="text-gray-500 text-sm mb-6">Choose the level of assistance you prefer.</p>
              <div className="flex flex-col gap-3">
                {[
                  { value: "self", label: "I want to file myself", desc: "No expert involvement — you handle everything" },
                  { value: "expert-help", label: "I want expert help while filing", desc: "File yourself with expert chat or video call support" },
                  { value: "expert-file", label: "I want an expert to file for me", desc: "A tax expert prepares and files your return" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((p) => ({ ...p, helpPreference: opt.value as HelpPreference }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                      answers.helpPreference === opt.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${answers.helpPreference === opt.value ? "border-blue-600 bg-blue-600" : "border-gray-400"}`} />
                    <div>
                      <div className="font-semibold text-gray-900">{opt.label}</div>
                      <div className="text-gray-500 text-sm">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Company Revenue (only for incorporated) */}
          {step === 5 && isIncorporated && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Did the company have revenue?</h2>
              <p className="text-gray-500 text-sm mb-6">This determines which corporate product applies.</p>
              <div className="flex flex-col gap-3">
                {[
                  { value: true, label: "Yes, company had revenue", desc: "The company earned business income" },
                  { value: false, label: "No, company had no revenue", desc: "The company earned no income (nil return)" },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    onClick={() => setAnswers((p) => ({ ...p, hasRevenue: opt.value }))}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
                      answers.hasRevenue === opt.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${answers.hasRevenue === opt.value ? "border-blue-600 bg-blue-600" : "border-gray-400"}`} />
                    <div>
                      <div className="font-semibold text-gray-900">{opt.label}</div>
                      <div className="text-gray-500 text-sm">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Result */}
          {step === 6 && result && (
            <ResultScreen result={result} onRestart={restart} />
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          {step !== 6 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {loading ? "Loading..." : step === totalSteps ? "Get Recommendation" : "Next"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultScreen({
  result,
  onRestart,
}: {
  result: RecommendationResult;
  onRestart: () => void;
}) {
  const confidenceColors = {
    high: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-green-600">&#10003;</span>
        </div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Recommended Product</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{result.recommendedProductName}</h2>
        <div className="text-2xl font-bold text-blue-600 mt-1">
          {result.price === 0 ? "Free" : `CAD $${result.price}`}
        </div>
        <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold mt-2 ${confidenceColors[result.confidence]}`}>
          {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} Confidence
        </span>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">Why this product?</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-500 shrink-0 mt-0.5">&#8250;</span> {r}
            </li>
          ))}
        </ul>
      </div>

      {result.matchedInputs.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 text-sm">Matched Inputs</h3>
          <div className="flex flex-wrap gap-2">
            {result.matchedInputs.map((m) => (
              <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.optionalUpgrade && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 text-sm mb-1">Optional Upgrade</h3>
          <p className="text-sm text-amber-700">{result.optionalUpgrade.reason}</p>
        </div>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <div className="border border-red-200 bg-red-50 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 text-sm mb-1">Warnings</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">{result.disclaimer}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
        <Link
          href="/products"
          className="flex-1 text-center bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          View All Products
        </Link>
        <Link
          href="/assistant"
          className="flex-1 text-center border border-blue-600 text-blue-600 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Ask AI Assistant
        </Link>
      </div>
    </div>
  );
}
