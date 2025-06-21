"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function MyOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/orders/user")
      .then((res) => res.json())
      .then(setOrders)
      .catch((err) => console.error(err));
  }, [session]);

  if (status === "loading") return <p className="p-4">Loading...</p>;
  if (!session) return <p className="p-4">Please login to view your orders.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">🧾 My Orders</h1>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 rounded-md p-4 shadow-sm"
            >
              <div className="flex justify-between text-sm text-gray-600">
                <span>Order ID: #{order.orderCode || order._id.slice(-6)}</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold text-gray-700">
                  Payment status:
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-sm font-medium capitalize
      ${
        order.status === "paid"
          ? "bg-green-100 text-green-700"
          : order.status === "unpaid"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-200 text-gray-600"
      }
    `}
                >
                  {order.status}
                </span>
              </div>

              <div className="text-right mt-3">
                <Link
                  href={`/orders/${order._id}`}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
