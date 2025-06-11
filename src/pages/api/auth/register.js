import bcrypt from "bcrypt";
import User from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  await dbConnect();
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already in use" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();

  return res.status(201).json({ message: "User created" });
}
