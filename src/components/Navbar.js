import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-md transition-colors duration-300 hover:bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-800 hover:text-gray-600 transition-colors duration-300"
          >
            ClothCart
          </Link>

          {/* Navigation Links */}
          <div className="space-x-4 flex items-center">
            {/* Always show Home */}
            <Link
              href="/"
              className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              Home
            </Link>

            {status === "authenticated" && (
              <>
                <Link
                  href="/products/create"
                  className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
                >
                  Create Product
                </Link>
              </>
            )}

            {/* Auth Buttons */}
            {status === "loading" ? null : session ? (
              <>
                <span className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200 cursor-pointer">
                  Hi, {session.user.email.split("@")[0]}
                </span>

                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-700 hover:text-black transition-colors duration-200 font-medium px-3 py-1 rounded hover:bg-gray-100 border border-gray-300 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
