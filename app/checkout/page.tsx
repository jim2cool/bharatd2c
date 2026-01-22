"use client";

import { getCart, clearCart } from "@/lib/cart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [amount, setAmount] = useState<number>(0);
  const [productId, setProductId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    payment_mode: "cod",
  });

  /* Load from cart */
  useEffect(() => {
  const cart = getCart();

  if (!cart.length) {
    alert("Cart is empty");
    router.push("/products");
    return;
  }

  const item = cart[0];

  setProductId(item.product_id);
  setAmount(item.price * item.qty);
}, [router]);


  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (form.name.trim().length < 2) {
      alert("Please enter a valid name");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert("Enter a valid 10-digit Indian mobile number");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      alert("Enter a valid 6-digit pincode");
      return;
    }

    if (form.address.trim().length < 10) {
      alert("Please enter a complete address");
      return;
    }

    if (!productId || amount <= 0) {
      alert("Invalid cart. Please try again.");
      return;
    }

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          total_amount: amount,
          ...form,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok || data?.success) {
        clearCart();
        router.push("/order-success");
      } else {
        alert("Order failed. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-4">Checkout</h1>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        className="w-full p-2 mb-2 border"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="w-full p-2 mb-2 border"
      />

      <input
        name="address"
        placeholder="Address"
        onChange={handleChange}
        className="w-full p-2 mb-2 border"
      />

      <input
        name="pincode"
        placeholder="Pincode"
        onChange={handleChange}
        className="w-full p-2 mb-4 border"
      />

      <h3 className="font-medium mb-2">Payment</h3>

      <label className="block mb-2">
        <input type="radio" checked readOnly /> Cash on Delivery
      </label>

      <label className="block opacity-50 mb-4">
        <input type="radio" disabled /> Online Payment (Coming Soon)
      </label>

      <div className="mb-4 text-sm text-gray-600">
        Amount payable: <b>₹{amount}</b>
      </div>

      <button
        onClick={placeOrder}
        className="w-full bg-black text-white py-3 text-lg font-semibold"
      >
        Place Order
      </button>
    </main>
  );
}
