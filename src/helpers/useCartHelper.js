import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export function useCartHelper() {
  const { fetchCartCount } = useCart();

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Failed to add to cart.");
        return;
      }

      toast.success("Added to cart!");
      fetchCartCount();
    } catch (err) {
      toast.error("Error adding to cart.");
    }
  };

  const removeFromCart = async (productId, onSuccess) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        toast.error("Failed to remove product.");
        return;
      }

      toast.success("Product removed from cart.");
      fetchCartCount();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Error removing product.");
    }
  };

  const updateCartQuantity = (
    product,
    change,
    currentQuantity,
    onUpdate,
    onRemove
  ) => {
    const newQty = currentQuantity + change;

    if (currentQuantity === 1 && change === -1) {
      confirmAlert({
        title: "Remove from Cart",
        message: "Do you want to remove this product from your cart?",
        buttons: [
          {
            label: "Yes",
            onClick: () =>
              removeFromCart(product._id, () => {
                if (onRemove) onRemove();
              }),
          },
          {
            label: "No",
            onClick: () => {},
          },
        ],
      });
      return;
    }

    if (newQty < 1) return;

    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity: change }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        if (onUpdate) onUpdate(newQty);
        fetchCartCount();
      })
      .catch(() => toast.error("Error updating cart."));
  };

  return {
    addToCart,
    removeFromCart,
    updateCartQuantity,
  };
}
