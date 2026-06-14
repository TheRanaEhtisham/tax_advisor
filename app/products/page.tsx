"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

const categoryLabels: Record<string, string> = {
  personal: "Personal",
  "self-employed": "Self-Employed",
  expert: "Expert",
  corporate: "Corporate",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc">("price-asc");

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.bestFor.some((b) => b.toLowerCase().includes(q)) ||
          Object.entries(p.supports).some(
            ([k, v]) => v && featureLabels[k]?.toLowerCase().includes(q)
          )
      );
    }

    list.sort((a, b) =>
      sortBy === "price-asc" ? a.price - b.price : b.price - a.price
    );

    return list;
  }, [search, category, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Tax Software Products</h1>
        <p className="text-gray-500 mt-2 text-lg">
          All available products. Filter, search, and compare to find the right fit.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="search"
          placeholder="Search by name, feature, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl font-semibold">No products match your search.</p>
          <button
            onClick={() => { setSearch(""); setCategory("all"); }}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductDetailCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          href="/compare"
          className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-xl font-medium hover:bg-blue-50 transition-colors"
        >
          Compare All Products
        </Link>
        <Link
          href="/recommend"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Find My Product
        </Link>
      </div>
    </div>
  );
}

function ProductDetailCard({ product }: { product: Product }) {
  const supported = Object.entries(product.supports)
    .filter(([, v]) => v)
    .map(([k]) => featureLabels[k] ?? k);

  const unsupported = Object.entries(product.supports)
    .filter(([, v]) => !v)
    .map(([k]) => featureLabels[k] ?? k);

  const categoryColors: Record<string, string> = {
    personal: "bg-blue-100 text-blue-700",
    "self-employed": "bg-purple-100 text-purple-700",
    expert: "bg-amber-100 text-amber-700",
    corporate: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-xl">{product.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[product.category]}`}>
              {categoryLabels[product.category]}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{product.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-gray-900">
            {product.price === 0 ? "Free" : `$${product.price}`}
          </div>
          {product.price > 0 && <div className="text-xs text-gray-400">{product.currency}</div>}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Best For</p>
        <ul className="text-sm text-gray-700 space-y-0.5">
          {product.bestFor.map((b) => (
            <li key={b} className="flex items-center gap-1.5">
              <span className="text-blue-500 shrink-0">&#10003;</span> {b}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Supports</p>
        <div className="flex flex-wrap gap-1.5">
          {supported.map((f) => (
            <span key={f} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>

      {unsupported.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Does Not Support</p>
          <div className="flex flex-wrap gap-1.5">
            {unsupported.slice(0, 4).map((f) => (
              <span key={f} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
            {unsupported.length > 4 && (
              <span className="text-xs text-gray-400">+{unsupported.length - 4} more</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto pt-2">
        <Link
          href="/recommend"
          className="block text-center py-2.5 rounded-lg text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
        >
          Get Started with {product.name}
        </Link>
      </div>
    </div>
  );
}
