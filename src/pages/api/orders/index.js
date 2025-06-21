import { getServerSession } from "next-auth";
import PayOS from "@payos/node";
import Counter from "@/models/Counter";
import Order from "@/models/Order";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]";

async function getNextOrderCode() {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "orderCode" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  await dbConnect();

  const { products, shipping_address, totalPrice } = req.body;

  if (!products || !shipping_address || !totalPrice) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const orderCode = await getNextOrderCode();
    const newOrder = await Order.create({
      userId: session.user.email,
      products,
      shipping_address,
      totalPrice,
      status: "unpaid",
      orderCode,
    });

    const payOS = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY
    );

    const paymentLink = await payOS.createPaymentLink({
      orderCode,
      amount: totalPrice,
      description: `Order payment #${newOrder._id.toString().slice(-6)}`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
    });

    return res.status(200).json({
      status: "Success",
      url: paymentLink.checkoutUrl,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return res.status(500).json({
      status: "Fail",
      message: "Something went wrong: " + error.message,
    });
  }
}
