"use client";

import { getCart, clearCart, getDirectCheckoutItem, clearDirectCheckout, CartItem } from "@/lib/cart";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming you have these or use div
import {
  ChevronDown,
  ChevronUp,
  Lock,
  X,
  AlertCircle,
  CheckCircle2,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

// Local type removed to use imported CartItem from @/lib/cart

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [email, setEmail] = useState("");

  // New State for Features
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [codAvailable, setCodAvailable] = useState(true);
  const [codRestrictedItems, setCodRestrictedItems] = useState<string[]>([]);

  // OTP States (P1-1)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    // Handle Payment Errors
    if (errorParam) {
      if (errorParam === 'invalid') setPaymentError("Payment validation failed. Please try again.");
      else if (errorParam === 'payment_failed') setPaymentError("Payment was declined or failed. Please try again.");
      else setPaymentError("An error occurred during checkout.");
    }

    // Check for direct checkout item first (Buy Now flow)
    let items: CartItem[] = [];
    const directItem = getDirectCheckoutItem();
    if (directItem) {
      items = [directItem];
    } else {
      items = getCart();
    }

    if (!items.length) {
      router.push("/products");
      return;
    }

    setCart(items);
    if (window.innerWidth >= 768) setShowSummary(true);

    // Check COD Availability
    checkCODAvailability(items);
  }, [router, searchParams]); // searchParams added dependency

  const checkCODAvailability = async (items: CartItem[]) => {
    const ids = items.map(i => i.product_id);
    const { data } = await supabaseBrowser
      .from('products')
      .select('id, title, cod_enabled')
      .in('id', ids);

    if (data) {
      const restricted = data.filter(p => p.cod_enabled === false);
      if (restricted.length > 0) {
        setCodAvailable(false);
        setCodRestrictedItems(restricted.map(p => p.title));
        setPaymentMethod('online'); // Force switch to online
      }
    }
  };

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

    // P1-1: COD Verification Step
    if (paymentMethod === 'cod' && !showOtpModal) {
      try {
        setSubmitting(true);
        const res = await fetch("/api/otp/send", {
          method: "POST",
          body: JSON.stringify({ phone: form.phone }),
        });
        const data = await res.json();
        if (data.success) {
          setShowOtpModal(true);
        } else {
          setPaymentError("Failed to send verification code. Please try again.");
        }
      } catch (err) {
        setPaymentError("Verification service unavailable.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    try {
      setSubmitting(true);

      if (paymentMethod === 'cod') {
        // COD Flow - Create order directly
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, cart, payment_method: 'cod', otp_verified: true }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error();

        // Clear both cart and direct checkout
        clearCart();
        clearDirectCheckout();
        router.push(`/order-success?order_id=${data.order_id}`);
      } else {
        // Online Payment Flow - Initiate PayU payment
        const res = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: total,
            productinfo: cart.map(item => item.title).join(', '),
            firstname: form.name.split(' ')[0],
            email: email || `${form.phone}@customer.com`,
            phone: form.phone,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.paymentUrl) throw new Error('Payment initiation failed');

        // Create hidden form and submit to PayU
        const paymentForm = document.createElement('form');
        paymentForm.method = 'POST';
        paymentForm.action = data.paymentUrl;

        Object.keys(data).forEach(key => {
          if (key !== 'paymentUrl') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = data[key];
            paymentForm.appendChild(input);
          }
        });

        document.body.appendChild(paymentForm);
        paymentForm.submit();
      }
    } catch (error) {
      setSubmitting(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#fafafa] pb-12">
      <header className="border-b border-neutral-100 py-6 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container max-w-5xl px-6 flex items-center justify-between mx-auto">
          <div className="text-2xl font-black text-neutral-900 tracking-tighter italic">Easy D2C.</div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-neutral-900" />
            <span>Secure 256-bit SSL Checkout</span>
          </div>
        </div>
      </header>

      <section className="container max-w-5xl px-6 mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN - FORM */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-12">
            {/* ERROR ALERT */}
            {paymentError && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-900">Payment Failed</p>
                  <p className="text-xs text-red-700 mt-0.5">{paymentError}</p>
                </div>
              </div>
            )}

            {/* CONTACT */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold ring-4 ring-neutral-50">1</div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase tracking-widest text-xs">Customer Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Full Delivery Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className={`h-12 rounded-xl bg-white border-neutral-100 focus:ring-neutral-900 transition-all ${attempted && !nameValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Phone Number (For Tracking)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400">+91</span>
                    <Input
                      id="phone"
                      placeholder="00000 00000"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className={`h-12 pl-12 rounded-xl bg-white border-neutral-100 focus:ring-neutral-900 transition-all ${attempted && !phoneValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold ring-4 ring-neutral-50">2</div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase tracking-widest text-xs">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Pincode</Label>
                  <div className="relative">
                    <Input
                      id="pincode"
                      placeholder="6-digit pincode"
                      inputMode="numeric"
                      value={form.pincode}
                      onChange={(e) => setField("pincode", e.target.value)}
                      className={`h-12 rounded-xl bg-white border-neutral-100 focus:ring-neutral-900 transition-all ${attempted && !pincodeValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {pincodeStatus === "loading" && <div className="w-4 h-4 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />}
                      {pincodeStatus === "success" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {pincodeStatus === "failed" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Full Address Details</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder="House no, Street Name, Landmark / Colony"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className={`rounded-xl bg-white border-neutral-100 focus:ring-neutral-900 transition-all ${attempted && !addressValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      className="h-12 rounded-xl bg-white border-neutral-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">State</Label>
                    <Input
                      id="state"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                      className="h-12 rounded-xl bg-white border-neutral-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="space-y-6 pt-12 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold ring-4 ring-neutral-50">3</div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase tracking-widest text-xs">Payment Information</h2>
              </div>

              <div className="grid gap-3">
                {/* Online Payment Option */}
                <div
                  className={`group p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${paymentMethod === 'online'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xl'
                    : 'border-neutral-100 bg-white hover:border-neutral-200'
                    }`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-white' : 'border-neutral-200'
                        }`}>
                        {paymentMethod === 'online' && <div className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-wider">Pay Online (Secure)</p>
                        <p className={`text-[10px] font-bold mt-1 ${paymentMethod === 'online' ? 'text-neutral-400' : 'text-neutral-500'
                          }`}>UPI, Cards, Net Banking & Wallets</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-50 grayscale group-hover:grayscale-0 transition-all">
                      {/* SVG Logos would go here */}
                      <div className="w-8 h-5 bg-neutral-200 rounded" />
                      <div className="w-8 h-5 bg-neutral-200 rounded" />
                    </div>
                  </div>
                  {paymentMethod === 'online' && (
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 -rotate-12 translate-x-8 -translate-y-8 pointer-events-none" />
                  )}
                </div>

                {/* COD Option */}
                <div
                  className={`p-6 rounded-2xl border transition-all relative ${!codAvailable
                    ? 'opacity-40 cursor-not-allowed border-neutral-100'
                    : paymentMethod === 'cod'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xl'
                      : 'border-neutral-100 bg-white hover:border-neutral-200 cursor-pointer'
                    }`}
                  onClick={() => codAvailable && setPaymentMethod('cod')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-white' : 'border-neutral-200'
                        }`}>
                        {paymentMethod === 'cod' && <div className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-wider">Cash on Delivery</p>
                        <p className={`text-[10px] font-bold mt-1 ${paymentMethod === 'cod' ? 'text-neutral-400' : 'text-neutral-500'
                          }`}>Pay ₹{total.toLocaleString()} when order arrives</p>
                      </div>
                    </div>
                    {!codAvailable && (
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-widest">Disabled</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm sticky top-32 space-y-8">
              <div className="flex items-center justify-between border-b border-neutral-50 pb-6 lg:hidden" onClick={() => setShowSummary(!showSummary)}>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-black text-neutral-900 truncate">Show Order Summary</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-neutral-900 text-lg">₹{total.toLocaleString()}</span>
                  {showSummary ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </div>

              <div className={`${showSummary ? 'block' : 'hidden'} lg:block space-y-6`}>
                <div className="space-y-4">
                  {cart.map((item, i) => (
                    <div key={`${item.product_id}-${i}`} className="flex justify-between items-center gap-4 group">
                      <div className="flex gap-4 flex-1 items-center">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 group-hover:shadow-md transition-all">
                          <Image src={item.image || "/placeholder.png"} alt={item.title} fill className="object-cover" />
                          <div className="absolute top-0 right-0 w-6 h-6 bg-neutral-900 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white -translate-x-1 translate-y-1 shadow-sm">
                            {item.qty}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-neutral-900 truncate tracking-tight">{item.title}</p>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Fast Shipping</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-neutral-900">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-50 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-neutral-900">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  {paymentMethod === 'online' && (
                    <div className="flex justify-between text-xs font-bold text-neutral-900 uppercase tracking-widest pt-2 border-t border-white/50">
                      <span>Prepaid Bonus</span>
                      <span className="text-green-600">-₹{cart.reduce((acc, item) => acc + (item.prepaid_discount || 0) * item.qty, 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Grant Total</p>
                    <p className="text-3xl font-black text-neutral-900 tracking-tighter">
                      ₹{(paymentMethod === 'online'
                        ? total - cart.reduce((acc, item) => acc + (item.prepaid_discount || 0) * item.qty, 0)
                        : total).toLocaleString()}
                    </p>
                  </div>
                  <Lock className="w-5 h-5 text-neutral-300 mb-2" />
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 bg-neutral-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neutral-800 shadow-xl transition-all group"
                  onClick={placeOrder}
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-neutral-500 rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{paymentMethod === 'cod' ? "Confirm Order" : "Pay & Checkout"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-2 pt-2">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 border border-neutral-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Money back guarantee • Quality Assured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP SUPPORT FLOAT */}
      <a
        href="https://wa.me/911234567890?text=I'm%20at%20checkout%20and%20need%20help!"
        target="_blank"
        className="fixed bottom-8 right-8 z-[100] bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-neutral-900 px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-neutral-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Need help with your order?
        </div>
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* OTP MODAL (P1-1) - UPGRADED VISUALS */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white max-w-sm w-full p-10 rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-center space-y-6">
              <div className="bg-neutral-50 w-20 h-20 rounded-[2rem] border border-neutral-100 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="h-8 w-8 text-neutral-900" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-7">Verify Device</h2>
                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                  Enter the code sent to <br />
                  <span className="text-neutral-900 font-black">{form.phone}</span>
                </p>
              </div>

              <div className="pt-4">
                <Input
                  type="text"
                  placeholder="• • • •"
                  className="text-center text-3xl tracking-[0.5em] font-black h-16 rounded-2xl bg-neutral-50 border-none focus:ring-2 focus:ring-neutral-900 transition-all"
                  maxLength={4}
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value.replace(/\D/g, ''));
                    setOtpError("");
                  }}
                />
                {otpError && <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mt-3">{otpError}</p>}
              </div>

              <Button
                className="w-full h-14 bg-neutral-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-neutral-800 shadow-xl transition-all"
                onClick={async () => {
                  if (otpValue.length !== 4) return;
                  setVerifyingOtp(true);
                  try {
                    const res = await fetch("/api/otp/verify", {
                      method: "POST",
                      body: JSON.stringify({ phone: form.phone, otp: otpValue }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setShowOtpModal(false);
                      placeOrder();
                    } else {
                      setOtpError("Invalid code. Try 1234");
                    }
                  } catch (err) {
                    setOtpError("Verification failed.");
                  } finally {
                    setVerifyingOtp(false);
                  }
                }}
                disabled={verifyingOtp || otpValue.length !== 4}
              >
                {verifyingOtp ? "Verifying..." : "Confirm & Place Order"}
              </Button>

              <button
                className="text-[10px] text-neutral-400 font-black uppercase tracking-widest hover:text-neutral-900 transition-colors"
                onClick={() => {
                  setShowOtpModal(false);
                  placeOrder();
                }}
              >
                Resend SMS Code
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}