import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      const products = await Product.find({});
      return res.status(200).json(products);

    case 'POST':
      try {
        const product = await Product.create(req.body);
        return res.status(201).json(product);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).end();
  }
}
