"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCartHelper } from "@/helpers/useCartHelper";
import CartItem from "@/components/CartItem";

export default function CartPage() {
  const { data: session, status } = useSession();
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCartQuantity } = useCartHelper();

  useEffect(() => {
    if (session) {
      fetch("/api/cart")
        .then((res) => res.json())
        .then((data) => setCart(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const handleUpdateQuantity = (product, change) => {
    const currentItem = cart.find((item) => item.productId._id === product._id);
    if (!currentItem) return;

    updateCartQuantity(
      product,
      change,
      currentItem.quantity,
      (newQty) => {
        if (newQty === 0) {
          setCart((prev) =>
            prev.filter((item) => item.productId._id !== product._id)
          );
        } else {
          setCart((prev) =>
            prev.map((item) =>
              item.productId._id === product._id
                ? { ...item, quantity: newQty }
                : item
            )
          );
        }
      },
      () => {
        setCart((prev) =>
          prev.filter((item) => item.productId._id !== product._id)
        );
      }
    );
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * (item.productId?.price || 0),
    0
  );

  if (status === "loading" || loading) return <p className="p-4">Loading...</p>;

  if (!session) {
    return (
      <p className="p-4">
        Please{" "}
        <Link href="/auth/login" className="underline text-blue-500">
          login
        </Link>{" "}
        to view your cart.
      </p>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        Your cart is empty.{" "}
        <Link href="/" className="text-blue-500 underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">🛒 Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onQuantityChange={handleUpdateQuantity}
            />
          ))}
        </div>

        {/* Summary Box */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-20 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
          </div>

          <div className="flex justify-between text-gray-500 mb-6 text-sm">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr className="border-t border-gray-200 my-4" />

          <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
            <span>Total</span>
            <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center py-3 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
