import { useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function PaymentSuccess() {
  useEffect(() => {
    const updateOrderStatus = async () => {
      const orderId = sessionStorage.getItem("orderId");
      if (!orderId) return;

      try {
        const res = await fetch(`/api/orders/${orderId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "paid" }),
        });

        if (!res.ok) throw new Error();
        toast.success("Order status updated to paid.");
        sessionStorage.removeItem("orderId");
      } catch {
        toast.error("Failed to update order status.");
      }
    };

    updateOrderStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Success
      </h1>
      <p className="text-gray-700 mb-6">Thank you for your purchase.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
