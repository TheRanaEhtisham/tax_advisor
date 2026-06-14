"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { Product } from "@/lib/types";

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

function validateProduct(p: Product): string[] {
  const issues: string[] = [];
  if (!p.id) issues.push("Missing: id");
  if (!p.name) issues.push("Missing: name");
  if (typeof p.price !== "number" || p.price < 0) issues.push("Invalid: price");
  if (!p.currency) issues.push("Missing: currency");
  if (!p.description) issues.push("Missing: description");
  if (!p.bestFor || p.bestFor.length === 0) issues.push("Missing: bestFor");
  if (!p.category) issues.push("Missing: category");
  const supportKeys = Object.keys(featureLabels);
  supportKeys.forEach((k) => {
    if (!(k in p.supports)) issues.push(`Missing support field: ${k}`);
  });
  return issues;
}

export default function AdminProductsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [exportDone, setExportDone] = useState(false);

  function handleExport() {
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.json";
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  }

  const selectedProduct = products.find((p) => p.id === selected);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin / Product Config</h1>
          <p className="text-gray-500 mt-1">
            Read-only view of all product configurations. Select a product to inspect it in detail.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          {exportDone ? "Exported!" : "Export JSON"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Products ({products.length})
          </h2>
          <div className="space-y-2">
            {products.map((p) => {
              const issues = validateProduct(p);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id === selected ? null : p.id)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-colors ${
                    selected === p.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {p.id} &bull; {p.price === 0 ? "Free" : `$${p.price} ${p.currency}`}
                      </div>
                    </div>
                    {issues.length > 0 ? (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        {issues.length} issue{issues.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                        Valid
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Detail */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <ProductDetail product={selectedProduct} />
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <p className="text-lg font-semibold">Select a product to view its configuration</p>
              <p className="text-sm mt-1">All schema fields and validation results will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schema Reference */}
      <div className="mt-12 bg-gray-900 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-3 text-sm">Product Schema (TypeScript)</h2>
        <pre className="text-green-400 text-xs overflow-x-auto leading-relaxed">
{`export type Product = {
  id: string;
  name: string;
  price: number;
  currency: "CAD";
  description: string;
  bestFor: string[];
  category: "personal" | "self-employed" | "expert" | "corporate";
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
};`}
        </pre>
      </div>
    </div>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const issues = validateProduct(product);

  const supported = Object.entries(product.supports)
    .filter(([, v]) => v)
    .map(([k]) => featureLabels[k] ?? k);

  const unsupported = Object.entries(product.supports)
    .filter(([, v]) => !v)
    .map(([k]) => featureLabels[k] ?? k);

  const fields = [
    { label: "Product ID", value: product.id },
    { label: "Name", value: product.name },
    { label: "Price", value: product.price === 0 ? "Free" : `$${product.price} ${product.currency}` },
    { label: "Category", value: product.category },
    { label: "Description", value: product.description },
    { label: "Best For", value: product.bestFor.join(", ") },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{product.id}</p>
        </div>
        {issues.length > 0 ? (
          <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
            {issues.length} validation issue{issues.length > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
            Schema valid
          </span>
        )}
      </div>

      {issues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <h3 className="font-semibold text-red-800 text-sm mb-1">Validation Issues</h3>
          <ul className="text-sm text-red-700 space-y-0.5">
            {issues.map((issue) => <li key={issue}>&bull; {issue}</li>)}
          </ul>
        </div>
      )}

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.label} className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{f.label}</div>
            <div className="text-sm text-gray-800 font-medium">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Supports */}
      <div>
        <h3 className="font-semibold text-gray-700 text-sm mb-2">Supported Features ({supported.length})</h3>
        <div className="flex flex-wrap gap-1.5">
          {supported.length > 0 ? supported.map((f) => (
            <span key={f} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
              &#10003; {f}
            </span>
          )) : <span className="text-xs text-gray-400">None</span>}
        </div>
      </div>

      {/* Does Not Support */}
      <div>
        <h3 className="font-semibold text-gray-700 text-sm mb-2">Unsupported Features ({unsupported.length})</h3>
        <div className="flex flex-wrap gap-1.5">
          {unsupported.length > 0 ? unsupported.map((f) => (
            <span key={f} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
              &#10005; {f}
            </span>
          )) : <span className="text-xs text-gray-400">None</span>}
        </div>
      </div>

      {/* Raw JSON */}
      <details className="group">
        <summary className="text-sm font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none">
          View Raw JSON
        </summary>
        <pre className="mt-3 bg-gray-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed">
          {JSON.stringify(product, null, 2)}
        </pre>
      </details>
    </div>
  );
}
