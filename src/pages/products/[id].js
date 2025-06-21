import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useCartHelper } from "../../helpers/useCartHelper";
import Loading from "@/components/Loading";

export default function ProductDetail() {
  const router = useRouter();
  const { query, isReady } = router;
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [cartItem, setCartItem] = useState(null);
  const [error, setError] = useState(null);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const { addToCart, updateCartQuantity } = useCartHelper();

  // Fetch product
  useEffect(() => {
    if (!isReady || !query.id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
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

  // Fetch cart item after product + session loaded
  useEffect(() => {
    if (!product || !session) return;

    const fetchCartItem = async () => {
      try {
        const res = await fetch(`/api/cart/check?productId=${product._id}`);
        const data = await res.json();
        if (data) {
          setCartItem(data);
          setQuantity(data.quantity || 1);
        }
      } catch (err) {
        console.error("Failed to fetch cart item:", err);
      }
    };

    fetchCartItem();
  }, [product, session]);

  const handleAddToCart = async () => {
    if (!session) {
      toast.info("Please login to add items to your cart.");
      return;
    }

    await addToCart(product._id, 1);
    setCartItem({ productId: product._id, quantity: 1 });
    setQuantity(1);
  };

  // const handleDelete = async () => {
  //   await fetch(`/api/products/${query.id}`, { method: "DELETE" });
  //   toast.success("Deleted successfully!");
  //   router.push("/");
  // };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-xl font-semibold">
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
        style={{ flexBasis: "50vw" }}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="object-cover shadow-lg"
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

          {/* Size (hiển thị tĩnh) */}
          <div className="max-w-md mb-8">
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
          <p className="text-sm text-gray-500 italic">
            Size selection is not available for this product.
          </p>
        </div>

        {/* Cart interaction */}
        <div className="mt-6 max-w-md">
          {!cartItem ? (
            <button
              onClick={handleAddToCart}
              className="w-full py-3 text-center font-semibold bg-black text-white hover:bg-gray-800 transition rounded"
            >
              🛒 Add to Cart
            </button>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    updateCartQuantity(
                      product,
                      -1,
                      quantity,
                      (newQty) => setQuantity(newQty),
                      () => {
                        setQuantity(1);
                        setCartItem(null);
                      }
                    )
                  }
                  className="p-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() =>
                    updateCartQuantity(product, 1, quantity, (newQty) =>
                      setQuantity(newQty)
                    )
                  }
                  className="p-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* 
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
        )} */}
      </section>
    </main>
  );
}
