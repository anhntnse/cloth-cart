import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findById(id);
        return res.status(200).json(product);
      } catch {
        return res.status(404).json({ error: 'Product not found' });
      }

    case 'PUT':
      try {
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updated);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    case 'DELETE':
      try {
        await Product.findByIdAndDelete(id);
        return res.status(204).end();
      } catch {
        return res.status(400).json({ error: 'Failed to delete' });
      }

    default:
      return res.status(405).end();
  }
}
