"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cartCount } = useCart();

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
            <Link
              href="/"
              className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              Home
            </Link>

            {/* Add New Product */}
            {/* {status === "authenticated" && (
              <>
                <Link
                  href="/products/create"
                  className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
                >
                  Create Product
                </Link>
              </>
            )} */}

            {/* Cart with quantity */}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
            >
              <FiShoppingCart className="mr-1" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {status === "authenticated" && (
              <Link
                href="/orders"
                className="text-medium text-gray-700 hover:text-black transition-colors duration-300 font-medium px-3 py-2 rounded hover:bg-gray-200"
              >
                Order History
              </Link>
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
