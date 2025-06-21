"use client";
import Image from "next/image";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function CartItem({ item, onQuantityChange }) {
  const handleDecrease = () => onQuantityChange(item.productId, -1);
  const handleIncrease = () => onQuantityChange(item.productId, 1);

  return (
    <div className="flex gap-4 items-center border-b border-gray-200 pb-4">
      {item.productId?.image && (
        <Image
          src={item.productId.image}
          alt={item.productId.name}
          width={80}
          height={100}
          className="object-cover rounded"
        />
      )}

      <div className="flex-1">
        <h2 className="font-semibold">{item.productId?.name}</h2>
        <p className="text-sm text-gray-600">
          Price: {item.productId?.price.toLocaleString("vi-VN")} VND
        </p>
        <div className="flex items-center gap-4 mt-1">
          <button
            onClick={handleDecrease}
            className="p-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            <FiMinus />
          </button>
          <span className="text-lg font-semibold">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="p-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      <p className="font-semibold text-red-500 whitespace-nowrap">
        {(item.productId?.price * item.quantity).toLocaleString("vi-VN")} VND
      </p>
    </div>
  );
}
