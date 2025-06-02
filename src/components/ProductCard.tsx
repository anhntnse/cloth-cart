import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden shadow hover:shadow-lg transition bg-white mb-10">
      <Link href={`/products/${product._id}`}>
        <div className="relative">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={400}
              className="w-full h-[450px] object-fit"
            />
          )}

          <div className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow hover:scale-105 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 8.25c0-2.485-2.01-4.5-4.5-4.5a4.497 4.497 0 00-3.75 1.987A4.497 4.497 0 009.75 3.75c-2.49 0-4.5 2.015-4.5 4.5 0 4.83 9 10.5 9 10.5s9-5.67 9-10.5z"
              />
            </svg>
          </div>
        </div>

        <div className="p-2">
          <h2 className="text-xs font-medium text-center mb-0.5 line-clamp-2">
            {product.name}
          </h2>
          <p className="text-red-500 text-sm text-center font-semibold mb-0.5">
            {product.price.toLocaleString("vi-VN")} VND
          </p>
        </div>
      </Link>
    </div>
  );
}
