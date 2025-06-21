"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session, status } = useSession();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  const totalPrice = cart.reduce((total, item) => {
    return total + item.quantity * (item.productId?.price || 0);
  }, 0);

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error("Please enter your shipping address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          products: cart.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          shipping_address: address,
          totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create order.");
      }

      toast.success("Order created successfully!");
      sessionStorage.setItem("orderId", data.orderId);
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) return <p className="p-4">Loading...</p>;
  if (!session)
    return (
      <p className="p-4">
        Please{" "}
        <Link href="/auth/login" className="underline text-blue-500">
          login
        </Link>{" "}
        to continue.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

      <div className="space-y-6">
        {/* User Info + Shipping */}
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm space-y-3">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <p className="text-sm text-gray-600">{session.user.email}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Shipping Address
            </label>
            <textarea
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-black/10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Truong Dai Hoc FPT Quy Nhơn, Binh Dinh"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-5 rounded border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between text-sm text-gray-600 mb-2"
            >
              <span>
                {item.productId?.name} × {item.quantity}
              </span>
              <span>
                {(item.productId?.price * item.quantity).toLocaleString(
                  "vi-VN"
                )}{" "}
                VND
              </span>
            </div>
          ))}
          <hr className="my-3 border-gray-200" />
          <div className="flex justify-between text-base font-bold text-gray-800 mb-3">
            <span>Total</span>
            <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
          </div>

          {/* Payment Integration UI */}
          <div className="bg-gray-50 rounded p-3 mb-4 border border-dashed border-gray-200">
            <p className="text-sm text-gray-600">
              💳 You will be redirected to <strong>PayOS</strong> for secure
              payment.
            </p>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || submitting}
            className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? "Processing..." : "Confirm and Pay with PayOS"}
          </button>
        </div>
      </div>
    </div>
  );
}
