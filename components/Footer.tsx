import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-white text-lg">TaxAdvisor</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered tax software product recommendations. Find the right product for your tax
              situation quickly and easily.
            </p>
            <p className="text-xs mt-4 text-gray-500">
              This tool provides general product guidance only and is not tax, legal, or financial
              advice.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare</Link></li>
              <li><Link href="/recommend" className="hover:text-white transition-colors">Find My Product</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/assistant" className="hover:text-white transition-colors">AI Assistant</Link></li>
              <li><Link href="/admin/products" className="hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} TaxAdvisor. For demonstration purposes only.</span>
          <span>Not affiliated with any real tax authority or software company.</span>
        </div>
      </div>
    </footer>
  );
}
