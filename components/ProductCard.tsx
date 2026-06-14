import Link from "next/link";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
  highlighted?: boolean;
  showCTA?: boolean;
};

const featureLabels: Record<string, string> = {
  salaryIncome: "Salary Income",
  studentIncome: "Student Income",
  medicalExpenses: "Medical Expenses",
  donations: "Donations",
  employmentExpenses: "Employment Expenses",
  investmentIncome: "Investment Income",
  capitalGains: "Capital Gains",
  foreignIncome: "Foreign Income",
  rentalIncome: "Rental Income",
  freelanceIncome: "Freelance Income",
  gigWorkIncome: "Gig-Work Income",
  businessExpenses: "Business Expenses",
  homeOfficeExpenses: "Home-Office Expenses",
  vehicleExpenses: "Vehicle Expenses",
  expertHelp: "Expert Help",
  fullService: "Full Service Filing",
  corporateFiling: "Corporate Filing",
  nilCorporateReturn: "Nil Corporate Return",
};

const topFeatures = [
  "salaryIncome",
  "medicalExpenses",
  "investmentIncome",
  "freelanceIncome",
  "expertHelp",
  "fullService",
  "corporateFiling",
];

export default function ProductCard({ product, highlighted = false, showCTA = true }: Props) {
  const displayedFeatures = topFeatures.filter(
    (f) => product.supports[f as keyof typeof product.supports]
  );

  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-4 transition-shadow ${
        highlighted
          ? "border-blue-500 shadow-lg shadow-blue-100 bg-blue-50"
          : "border-gray-200 bg-white hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{product.description}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-gray-900">
            {product.price === 0 ? "Free" : `$${product.price}`}
          </span>
          {product.price > 0 && (
            <div className="text-xs text-gray-400">{product.currency}</div>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Best for</p>
        <ul className="text-sm text-gray-700 space-y-0.5">
          {product.bestFor.slice(0, 2).map((b) => (
            <li key={b} className="flex items-center gap-1.5">
              <span className="text-blue-500">&#10003;</span> {b}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Key Features</p>
        <div className="flex flex-wrap gap-1.5">
          {displayedFeatures.map((f) => (
            <span
              key={f}
              className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full"
            >
              {featureLabels[f]}
            </span>
          ))}
          {displayedFeatures.length === 0 && (
            <span className="text-xs text-gray-400">Corporate filing only</span>
          )}
        </div>
      </div>

      {showCTA && (
        <div className="mt-auto pt-2">
          <Link
            href="/recommend"
            className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
              highlighted
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
