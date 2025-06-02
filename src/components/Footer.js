import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 border-t border-gray-300 mt-50">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">ClothCart</h2>
          <p className="text-sm text-gray-600">
            Discover the best fashion essentials for your style. Quality products, fair prices, delivered to your door.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/">
                <span className="text-gray-700 hover:text-black transition-colors duration-300">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/products/create">
                <span className="text-gray-700 hover:text-black transition-colors duration-300">Create Product</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="text-gray-700 hover:text-black transition-colors duration-300">About Us</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span className="text-gray-700 hover:text-black transition-colors duration-300">Contact</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Email: support@clothcart.com</li>
            <li>Phone: +84 987 654 321</li>
            <li>Location: 123 Fashion Street, HCMC</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ClothCart. All rights reserved.
      </div>
    </footer>
  );
}
