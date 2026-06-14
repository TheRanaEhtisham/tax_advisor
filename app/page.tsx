import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const steps = [
  {
    step: "1",
    title: "Answer a Few Questions",
    desc: "Tell us about your income sources, deductions, and how much help you want.",
  },
  {
    step: "2",
    title: "Get Your Recommendation",
    desc: "Our engine matches your answers to the right product using clear business rules.",
  },
  {
    step: "3",
    title: "File with Confidence",
    desc: "Start with the product that fits your situation, or ask our AI assistant for more help.",
  },
];

const faqs = [
  {
    q: "Is this real tax advice?",
    a: "No. TaxAdvisor provides general product guidance only. It is not tax, legal, or financial advice. Please consult a qualified tax professional.",
  },
  {
    q: "Can I compare products before deciding?",
    a: "Yes. Visit the Compare page to see a full feature-by-feature comparison of all available products.",
  },
  {
    q: "What if I have both freelance and investment income?",
    a: "Our recommendation wizard handles complex situations. Higher-priority rules (like Self-Employed) will take precedence. You can also ask the AI assistant for guidance.",
  },
  {
    q: "Do I need an account?",
    a: "No account required to browse products or get a recommendation.",
  },
  {
    q: "Can a tax expert file for me?",
    a: "Yes. Expert Full Service (CAD $250) lets a tax expert prepare and file your return.",
  },
];

export default function HomePage() {
  const previewProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            AI-powered recommendations
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Find Your Perfect
            <br />
            <span className="text-yellow-300">Tax Software</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Answer a few simple questions and get a personalized recommendation. From simple
            personal returns to incorporated businesses — we have a product for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recommend"
              className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Find My Product
            </Link>
            <Link
              href="/compare"
              className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Compare Products
            </Link>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
          <p className="text-gray-500 mt-2">From free to full-service, there is a plan for every situation.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
          >
            View all {products.length} products &rarr;
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-2">Get a recommendation in under 2 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                  <p className="text-gray-500 mt-1 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/recommend"
              className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
            >
              Start the Wizard
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-5">
              <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
              <p className="text-gray-500 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Not sure where to start?</h2>
          <p className="text-blue-100 mb-6">
            Ask our AI assistant a question, or run through the recommendation wizard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assistant"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Ask the AI Assistant
            </Link>
            <Link
              href="/recommend"
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Take the Quiz
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
