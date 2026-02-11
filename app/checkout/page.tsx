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
import { ChevronDown, ChevronUp, Lock, AlertCircle, X } from "lucide-react";

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
    <main className="min-h-screen bg-background pb-12">
      <header className="border-b border-border/40 py-4 bg-background sticky top-0 z-10">
        <div className="container max-w-4xl px-4 flex items-center justify-between mx-auto">
          <div className="text-lg font-bold tracking-tight">Checkout</div>
          <div className="text-sm text-muted-foreground"><Lock className="w-3 h-3 inline mr-1" />Secure Checkout</div>
        </div>
      </header>

      <section className="container max-w-4xl px-4 mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          {/* LEFT COLUMN - FORM */}

          <div className="order-2 md:order-1 space-y-8">
            {/* ERROR ALERT */}
            {paymentError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Failed</AlertTitle>
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            )}

            {/* CONTACT */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Contact Information</h2>
              {/* ... existing contact form ... */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className={attempted && !nameValid ? "border-destructive" : ""}
                  />
                  {attempted && !nameValid && <p className="text-xs text-destructive">Enter valid full name</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className={attempted && !phoneValid ? "border-destructive" : ""}
                  />
                  {attempted && !phoneValid && <p className="text-xs text-destructive">Enter valid mobile number</p>}
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Shipping Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={(e) => setField("pincode", e.target.value)}
                    className={attempted && !pincodeValid ? "border-destructive" : ""}
                  />
                  {pincodeStatus === "loading" && <p className="text-xs text-muted-foreground">Detecting location...</p>}
                  {pincodeStatus === "failed" && <p className="text-xs text-destructive">Could not detect location. Enter manually.</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="House no, Street, Area"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className={attempted && !addressValid ? "border-destructive" : ""}
                  />
                  {attempted && !addressValid && <p className="text-xs text-destructive">Enter complete address</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <h2 className="text-lg font-medium">Payment Method</h2>

              {/* Online Payment Option */}
              <div
                className={`bg-muted/30 p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-[#e26a00] bg-[#e26a00]/5' : 'border-border/60 hover:border-border'
                  }`}
                onClick={() => setPaymentMethod('online')}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[#e26a00]' : 'border-foreground/30'
                    }`}>
                    {paymentMethod === 'online' && (
                      <div className="h-2 w-2 rounded-full bg-[#e26a00]"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm">Pay Online (Recommended)</span>
                    <p className="text-xs text-muted-foreground mt-0.5">UPI, Cards, Net Banking - Instant confirmation</p>
                  </div>
                </div>
              </div>

              {/* COD Option */}
              <div
                className={`bg-muted/30 p-4 border rounded-sm transition-colors ${!codAvailable
                  ? 'opacity-50 cursor-not-allowed border-border/60'
                  : paymentMethod === 'cod'
                    ? 'border-[#e26a00] bg-[#e26a00]/5 cursor-pointer'
                    : 'border-border/60 hover:border-border cursor-pointer'
                  }`}
                onClick={() => codAvailable && setPaymentMethod('cod')}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${!codAvailable
                    ? 'border-gray-300 bg-gray-100'
                    : paymentMethod === 'cod' ? 'border-[#e26a00]' : 'border-foreground/30'
                    }`}>
                    {paymentMethod === 'cod' && (
                      <div className="h-2 w-2 rounded-full bg-[#e26a00]"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm flex items-center gap-2">
                      Cash on Delivery (COD)
                      {!codAvailable && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">UNAVAILABLE</span>}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">Pay when you receive the product</p>
                    {!codAvailable && (
                      <p className="text-xs text-destructive mt-1">
                        Not available for: {codRestrictedItems.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email field for online payment */}
              {paymentMethod === 'online' && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">For payment receipt and order updates</p>
                </div>
              )}
            </div>

            {/* FINAL CTA MOBILE */}
            <Button
              size="lg"
              className="w-full md:hidden uppercase tracking-widest font-bold h-12"
              onClick={placeOrder}
              disabled={submitting}
            >
              {submitting ? "Processing..." : paymentMethod === 'cod' ? `Place Order - ₹${total.toLocaleString()}` : `Proceed to Payment - ₹${(total - cart.reduce((acc, item) => acc + (item.prepaid_discount || 0) * item.qty, 0)).toLocaleString()}`}
            </Button>

          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="order-1 md:order-2">
            <div className="bg-muted/20 p-6 rounded-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between md:hidden" onClick={() => setShowSummary(!showSummary)}>
                <span className="font-medium text-lg">Order Summary</span>
                {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>

              <div className={`${showSummary ? 'block' : 'hidden'} md:block space-y-4`}>
                {cart.map((item, i) => (
                  <div key={`${item.product_id}-${i}`} className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 flex-1">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border bg-muted/50">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}

                <div className="border-t border-border/40 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>

                  {/* Prepaid Savings Nudge */}
                  {paymentMethod === 'online' && (
                    <div className="flex justify-between text-sm text-saffron-600 font-medium">
                      <span>Prepaid Savings</span>
                      <span>-₹{cart.reduce((acc, item) => acc + (item.prepaid_discount || 0) * item.qty, 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/40 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{(paymentMethod === 'online'
                    ? total - cart.reduce((acc, item) => acc + (item.prepaid_discount || 0) * item.qty, 0)
                    : total).toLocaleString()}</span>
                </div>

                {/* FINAL CTA DESKTOP */}
                <Button
                  size="lg"
                  className="w-full hidden md:flex uppercase tracking-widest font-bold h-12"
                  onClick={placeOrder}
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : paymentMethod === 'cod' ? "Place Order" : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* OTP MODAL (P1-1) */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background max-w-sm w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center space-y-4">
              <div className="bg-saffron-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-saffron-600" />
              </div>
              <h2 className="text-2xl font-bold">Verify Phone</h2>
              <p className="text-sm text-muted-foreground">
                Enter the 4-digit code sent to <br />
                <span className="font-semibold text-foreground">{form.phone}</span>
              </p>

              <div className="pt-4">
                <Input
                  type="text"
                  placeholder="0 0 0 0"
                  className="text-center text-2xl tracking-[0.5em] font-bold h-14"
                  maxLength={4}
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value.replace(/\D/g, ''));
                    setOtpError("");
                  }}
                />
                {otpError && <p className="text-xs text-destructive mt-2">{otpError}</p>}
              </div>

              <Button
                className="w-full mt-6 h-12 font-bold uppercase tracking-widest"
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
                      // Recurse to place order now that verified
                      // In a real app, you'd mark 'verified' in state
                      placeOrder();
                    } else {
                      setOtpError("Invalid code. Please try again (Hint: use 1234)");
                    }
                  } catch (err) {
                    setOtpError("Verification failed.");
                  } finally {
                    setVerifyingOtp(false);
                  }
                }}
                disabled={verifyingOtp || otpValue.length !== 4}
              >
                {verifyingOtp ? "Verifying..." : "Confirm COD Order"}
              </Button>

              <button
                className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                onClick={() => {
                  setShowOtpModal(false);
                  placeOrder(); // Retry sending OTP
                }}
              >
                Resend Code
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