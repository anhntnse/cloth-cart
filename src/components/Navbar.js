import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md transition-colors duration-300 hover:bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-800 hover:text-gray-600 transition-colors duration-300"
          >
            ClothCart
          </Link>

          {/* Navigation Links */}
          <div className="space-x-8 flex items-center">
            <Link
              href="/"
              className="text-lg text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              Home
            </Link>
            <Link
              href="/products/create"
              className="text-lg text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              Create Product
            </Link>
            <Link
              href="/products/manage"
              className="text-lg text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              Product Management
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
