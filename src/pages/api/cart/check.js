import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { productId } = req.query;
  const userId = session.user.email;

  try {
    const cartItem = await Cart.findOne({ userId, productId });
    res.status(200).json(cartItem || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
