"use client";

import { getCart, clearCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Field from "./Field";

type CartItem = {
  product_id: string;
  title: string;
  price: number;
  qty: number;
};

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<
  "idle" | "loading" | "success" | "failed"
>("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const items = getCart();
    if (!items.length) {
      router.push("/products");
      return;
    }
    setCart(items);
    if (window.innerWidth >= 768) setShowSummary(true);
  }, [router]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  useEffect(() => {
  const pin = form.pincode;

  if (pin.length !== 6) {
    setPincodeStatus("idle");
    return;
  }

  let cancelled = false;
  setPincodeStatus("loading");

  fetch(`https://api.postalpincode.in/pincode/${pin}`)
    .then(res => res.json())
    .then(data => {
      if (cancelled) return;

      const ok =
        Array.isArray(data) &&
        data[0]?.Status === "Success" &&
        data[0]?.PostOffice?.length;

      if (!ok) {
        setPincodeStatus("failed");
        return;
      }

      const po = data[0].PostOffice[0];

      setForm(prev => ({
        ...prev,
        city: prev.city || po.District || "",
        state: prev.state || po.State || "",
        _pincodeMeta: {
  source: "indiapost",
  pincode: po.Pincode,
  post_office_count: data[0].PostOffice.length,
  post_offices: data[0].PostOffice.map((po: any) => ({
    name: po.Name,
    branch_type: po.BranchType,
    delivery_status: po.DeliveryStatus,
    district: po.District,
    state: po.State,
    region: po.Region,
    circle: po.Circle,
    country: po.Country,
  })),
},

      }));

      setPincodeStatus("success");
    })
    .catch(() => {
      if (!cancelled) setPincodeStatus("failed");
    });

  return () => {
    cancelled = true;
  };
}, [form.pincode]);


  /* ---------- VALIDATION ---------- */
  const nameValid =
    /^[A-Za-z]{2,}(\s[A-Za-z]{2,})+$/.test(form.name.trim());
  const phoneValid = /^[6-9]\d{9}$/.test(form.phone);
  const addressValid = form.address.trim().length >= 10;
  const pincodeValid = /^\d{6}$/.test(form.pincode);

  const isValid =
    nameValid && phoneValid && addressValid && pincodeValid;

  const setField = (k: string, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  /* ---------- SUBMIT ---------- */
  const placeOrder = async () => {
    setAttempted(true);
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, cart }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error();

      clearCart();
      router.push(`/order-success?order_id=${data.order_id}`);
    } catch {
      setSubmitting(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-6">
      {/* HEADER */}
      <h1 className="text-lg font-semibold">Checkout</h1>
      <div className="text-3xl font-bold mt-1">₹{total}</div>
      <div className="text-sm text-gray-500 mt-0.5 mb-4">
        Free shipping · Easy returns
      </div>

      {/* SUMMARY */}
      <button
        onClick={() => setShowSummary(!showSummary)}
        className="text-sm font-medium mb-2"
      >
        Order Summary ({cart.length} item{cart.length > 1 ? "s" : ""})
        <span className="ml-1">{showSummary ? "▲" : "▼"}</span>
      </button>

      {showSummary && (
        <div className="border rounded px-3 py-2 mb-4 text-sm">
          {cart.map((item, i) => (
            <div
              key={`${item.product_id}-${i}`}
              className="flex justify-between mb-1"
            >
              <div>
                {item.title}
                <div className="text-xs text-gray-400">
                  Qty: {item.qty}
                </div>
              </div>
              ₹{item.price * item.qty}
            </div>
          ))}
          <div className="flex justify-between border-t pt-1 mt-2 font-medium">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      )}

   {/* FORM — TIGHT SPACING */}
<div className="space-y-3 mt-2">
  {/* Name */}
  <Field
    name="name"
    autoComplete="name"
    placeholder="Full Name (as on delivery)"
    value={form.name}
    onChange={v => setField("name", v)}
    error={attempted && !nameValid ? "Enter full name" : ""}
  />

  {/* Phone */}
  <Field
    name="tel"
    autoComplete="tel"
    inputMode="numeric"
    placeholder="Mobile Number"
    value={form.phone}
    onChange={v => setField("phone", v)}
    error={attempted && !phoneValid ? "Enter valid mobile" : ""}
  />

  {/* Address */}
  <Field
    name="street-address"
    autoComplete="street-address"
    placeholder="Full Address (House, Street, Area)"
    value={form.address}
    onChange={v => setField("address", v)}
    textarea
    error={attempted && !addressValid ? "Enter complete address" : ""}
  />

  {/* Pincode */}
  <Field
    name="postal-code"
    autoComplete="postal-code"
    inputMode="numeric"
    placeholder="Pincode"
    value={form.pincode}
    onChange={v => setField("pincode", v)}
    error={attempted && !pincodeValid ? "Invalid pincode" : ""}
  />
  {pincodeStatus === "loading" && (
  <div className="mt-1 text-xs text-gray-500">
    Detecting city & state…
  </div>
)}

{pincodeStatus === "failed" && (
  <div className="mt-1 text-xs text-gray-500">
    Couldn’t auto-detect location. Please enter city & state manually.
  </div>
)}

  {/* City / State */}
  <div className="grid grid-cols-2 gap-2">
    <Field
      name="address-level2"
      autoComplete="address-level2"
      placeholder="City"
      value={form.city}
      onChange={v => setField("city", v)}
    />
    <Field
      name="address-level1"
      autoComplete="address-level1"
      placeholder="State"
      value={form.state}
      onChange={v => setField("state", v)}
    />
  </div>
</div>


      {/* PAYMENT */}
      <div className="mt-5">
        <div className="text-sm font-semibold mb-2">
          Payment Method
        </div>

        <div className="flex gap-2 items-start pl-2 border-l-2 border-black">
          <div className="w-2 h-2 bg-black rounded-full mt-1.5" />
          <div>
            <div className="text-sm font-medium">
              Cash on Delivery
            </div>
            <div className="text-xs text-gray-500">
              Pay only after delivery
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-1 pl-4">
          Online payment · Extra 10% off coming soon
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={placeOrder}
        disabled={submitting}
        className="w-full bg-black text-white py-3 rounded font-semibold mt-5 disabled:opacity-50"
      >
        {submitting ? "Placing Order…" : "Place Order"}
      </button>

      {/* TRUST */}
      <div className="text-[11px] text-gray-500 mt-2 text-center leading-snug">
        Safe & secure payments · Free doorstep delivery · 7-day easy
        returns · No spam or pre-delivery calls
      </div>
    </main>
  );
}