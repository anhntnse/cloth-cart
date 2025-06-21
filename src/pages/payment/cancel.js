import { useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function PaymentCancel() {
  useEffect(() => {
    toast.info("Payment was cancelled.");
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Payment Cancelled
      </h1>
      <p className="text-gray-700 mb-6">
        You have cancelled the payment. Your order was not processed.
      </p>
      <Link
        href="/cart"
        className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        Back to Cart
      </Link>
    </div>
  );
}
