import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ProductDetail() {
  const router = useRouter();
  const { query, isReady } = router;
  const { data: session, status } = useSession();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sizes = ["S", "M", "L", "XL", "XXL"];
  useEffect(() => {
    if (!isReady || !query.id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${query.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isReady, query.id]);

  const handleDelete = async () => {
    await fetch(`/api/products/${query.id}`, { method: "DELETE" });
    toast.success("Deleted successfully!");
    router.push("/");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 text-xl">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold text-xl">
        Error: {error}
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-medium text-xl">
        No product found
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Left: Image */}
      <section
        className="flex-shrink-0 p-8 bg-white flex items-center justify-center"
        style={{ flexBasis: "50vw" }} // ảnh chiếm 50% viewport width
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={800} // bạn có thể tăng kích thước ảnh lên cho chuẩn
            height={800}
            className="object-cover shadow-lg ml-50"
            priority
          />
        ) : (
          <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </section>

      {/* Right: Info */}
      <section className="w-2/3 bg-white p-12 flex flex-col">
        <div>
          <h1 className="text-3xl font-medium text-gray-800 mb-6 relative inline-block">
            {product.name}
            <span className="absolute left-0 -bottom-3 w-28 h-1.5 rounded-full bg-pink-300"></span>
          </h1>

          <p className="text-gray-600 text-medium mb-8 leading-relaxed max-w-2xl">
            {product.description}
          </p>

          <p className="text-2xl font-bold text-red-500 mb-12">
            {product.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>

          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-gray-600 mb-3">
              Select Size
            </h3>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-pink-100 hover:border-pink-300 transition"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {status === "authenticated" && (
          <div className="flex mt-8 space-x-4 max-w-md">
            <Link
              href={`/products/edit/${product._id}`}
              className="flex-1 py-3 text-center font-semibold bg-black text-white hover:bg-gray-800 transition"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 text-center font-semibold border border-black text-black bg-white hover:bg-gray-100 transition"
            >
              Delete
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
