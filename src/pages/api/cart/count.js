import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ count: 0 });

  const userId = session.user.email;

  try {
    const cartItems = await Cart.find({ userId });
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ count: 0 });
  }
}
