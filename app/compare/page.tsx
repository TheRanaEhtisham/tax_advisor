import { products } from "@/data/products";
import Link from "next/link";

const compareFeatures: { key: keyof typeof products[0]["supports"]; label: string }[] = [
  { key: "salaryIncome", label: "Salary Income" },
  { key: "studentIncome", label: "Student Income" },
  { key: "medicalExpenses", label: "Medical Expenses" },
  { key: "donations", label: "Donations" },
  { key: "employmentExpenses", label: "Employment Expenses" },
  { key: "investmentIncome", label: "Investment Income" },
  { key: "capitalGains", label: "Capital Gains" },
  { key: "foreignIncome", label: "Foreign Income" },
  { key: "rentalIncome", label: "Rental Income" },
  { key: "freelanceIncome", label: "Freelance Income" },
  { key: "gigWorkIncome", label: "Gig-Work Income" },
  { key: "businessExpenses", label: "Business Expenses" },
  { key: "homeOfficeExpenses", label: "Home-Office Expenses" },
  { key: "vehicleExpenses", label: "Vehicle Expenses" },
  { key: "expertHelp", label: "Expert Help" },
  { key: "fullService", label: "Full Service Filing" },
  { key: "corporateFiling", label: "Corporate Filing" },
  { key: "nilCorporateReturn", label: "Nil Corporate Return" },
];

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Compare Products</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Full feature comparison across all {products.length} products.
        </p>
      </div>

      {/* Scrollable comparison table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-4 font-semibold text-gray-700 min-w-[160px] sticky left-0 bg-gray-50 z-10">
                Feature
              </th>
              {products.map((p) => (
                <th key={p.id} className="py-4 px-4 text-center font-semibold text-gray-700 min-w-[120px]">
                  <div>{p.name}</div>
                  <div className="font-bold text-gray-900 mt-0.5">
                    {p.price === 0 ? "Free" : `$${p.price} CAD`}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {compareFeatures.map((feature, i) => (
              <tr key={feature.key} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className={`py-3 px-4 font-medium text-gray-700 sticky left-0 z-10 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  {feature.label}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-center">
                    {p.supports[feature.key] ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold text-xs">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-400 text-xs">
                        ✕
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td className="py-4 px-4 font-semibold text-gray-700 sticky left-0 bg-gray-50">
                Price
              </td>
              {products.map((p) => (
                <td key={p.id} className="py-4 px-4 text-center">
                  <div className="font-bold text-gray-900 text-base">
                    {p.price === 0 ? "Free" : `$${p.price}`}
                  </div>
                  {p.price > 0 && <div className="text-xs text-gray-400">{p.currency}</div>}
                  <Link
                    href="/recommend"
                    className="mt-2 inline-block text-xs text-blue-600 hover:underline"
                  >
                    Get Started
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Scroll horizontally to see all products. ✓ = supported, ✕ = not supported.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition-colors text-center"
        >
          View All Products
        </Link>
        <Link
          href="/recommend"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center"
        >
          Find My Product
        </Link>
      </div>
    </div>
  );
}
