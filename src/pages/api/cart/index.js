import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]";
import Cart from "@/models/Cart";
import "@/models/Product";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const userId = session.user.email;

  if (req.method === "GET") {
    try {
      const cart = await Cart.find({ userId }).populate("productId");
      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  } else if (req.method === "POST") {
    const { productId, quantity } = req.body;

    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

    try {
      const existingItem = await Cart.findOne({ userId, productId });

      if (existingItem) {
        existingItem.quantity += quantity;
        await existingItem.save();
        return res.status(200).json({ message: "Increased quantity" });
      }

      const newCartItem = await Cart.create({ userId, productId, quantity: 1 });
      return res.status(201).json(newCartItem);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  } else if (req.method === "DELETE") {
    console.log("ádasdasd");
    const { productId } = req.body;

    try {
      const deletedItem = await Cart.findOneAndDelete({ userId, productId });
      if (!deletedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      return res.status(200).json({ message: "Removed from cart" });
    } catch (err) {
      console.error("Error deleting cart item:", err);
      return res.status(500).json({ message: "Error removing from cart" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
