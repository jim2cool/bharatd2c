"use client";

import { getCart, clearCart, getDirectCheckoutItem, clearDirectCheckout, CartItem } from "@/lib/cart";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateRiskScore, RiskResult } from "@/lib/rto-engine";
import { getSessionSignals, useAdaptiveTracking, getSessionRTOModifier } from "@/lib/adaptive-engine";
import { getDeviceFingerprint } from "@/lib/fingerprint";
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
  ArrowRight,
  Plus,
  Check,
  MessageCircle
} from "lucide-react";
import { calculatePrepaidDiscount, type PrepaidRule, type CartItemForDiscount } from "@/lib/utils/discount-engine";
import { calculatePartialAmount } from "@/lib/utils/payment-utils";
import { supabaseBrowser } from "@/lib/supabase-browser";

// Local type removed to use imported CartItem from @/lib/cart

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  // Activate Session Intelligence
  useAdaptiveTracking();

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
  const [rtoResult, setRtoResult] = useState<RiskResult | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'partial_cod'>('cod');
  const [email, setEmail] = useState("");
  const [createAccount, setCreateAccount] = useState(false);

  // Discount Engine
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState<{ code: string; type: string; value: number } | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [discountMessage, setDiscountMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setDiscountMessage(null);
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        body: JSON.stringify({ code: discountCode, order_amount: total }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.discount);
        setDiscountMessage({ text: "Discount applied successfully!", type: 'success' });
      } else {
        setDiscountMessage({ text: data.error || "Invalid discount code", type: 'error' });
      }
    } catch (err) {
      setDiscountMessage({ text: "Failed to validate code", type: 'error' });
    } finally {
      setApplyingDiscount(false);
    }
  };

  // Placeholder for stacking engine (moved lower for variable visibility)

  // New State for Features
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [codAvailable, setCodAvailable] = useState(true);
  const [codRestrictedItems, setCodRestrictedItems] = useState<string[]>([]);
  const [store, setStore] = useState<any>(null);
  const [prepaidRules, setPrepaidRules] = useState<PrepaidRule[]>([]);
  const [stackingLogic, setStackingLogic] = useState<'highest_only' | 'stack_all'>('highest_only');
  const [productCollections, setProductCollections] = useState<Record<string, string[]>>({});
  const [isPartialForced, setIsPartialForced] = useState(false);
  const [partialAmount, setPartialAmount] = useState(0);
  const [productWeights, setProductWeights] = useState<Record<string, number>>({});

  // OTP States (P1-1)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    // 1. Handle Payment Errors & Restore Form
    if (errorParam) {
      if (errorParam === 'invalid') setPaymentError("Payment validation failed. Please try again.");
      else if (errorParam === 'payment_failed') setPaymentError("Payment was declined or failed. Please try again.");
      else setPaymentError("An error occurred during checkout.");

      // Restore form from previous attempt
      const savedForm = localStorage.getItem('checkout_form_draft');
      const savedEmail = localStorage.getItem('checkout_email_draft');
      if (savedForm) {
        try {
          setForm(JSON.parse(savedForm));
          if (savedEmail) setEmail(savedEmail);
          setPaymentMethod('online'); // Assume they want to try online again if they were redirected back
        } catch (e) {
          console.error("Failed to restore checkout draft");
        }
      }
    }

    // 2. Load Cart Items
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

    // 3. Operational Logic
    checkCODAvailability(items);
    fetchStoreData();
  }, [router, searchParams]);

  // LIVE PERSISTENCE: Save draft as they type
  useEffect(() => {
    if (form.name || form.phone || form.address) {
      localStorage.setItem('checkout_form_draft', JSON.stringify(form));
      localStorage.setItem('checkout_email_draft', email);
    }
  }, [form, email]);

  const clearDraft = () => {
    localStorage.removeItem('checkout_form_draft');
    localStorage.removeItem('checkout_email_draft');
  };

  const fetchStoreData = async () => {
    const { data: storeData } = await supabaseBrowser
      .from('stores')
      .select('id, name, logo_url, prepaid_stacking_logic, partial_cod_config')
      .single();

    if (storeData) {
      setStore(storeData);
      setStackingLogic(storeData.prepaid_stacking_logic || 'highest_only');

      // Fetch prepaid rules
      const { data: rules } = await supabaseBrowser
        .from('prepaid_configs')
        .select('*')
        .eq('store_id', storeData.id)
        .eq('is_active', true);

      if (rules) setPrepaidRules(rules as PrepaidRule[]);
    }
  };

  // Sales Engine: Cross-sell & Bundles (P8: Centralized)
  const [crossSellProducts, setCrossSellProducts] = useState<any[]>([]);
  const [bundleDiscount, setBundleDiscount] = useState(0);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // --- STACKING ENGINE (P8) ---
  const getCalculatedPrepaidDiscount = (baseAmount: number) => {
    if (paymentMethod !== 'online' || total === 0) return 0;

    // Use ratio to pass effective price after bundle/promo discounts to the engine
    const ratio = baseAmount / total;

    const itemsForEngine: CartItemForDiscount[] = cart.map(item => ({
      product_id: item.product_id,
      price: item.price * ratio,
      qty: item.qty,
      collection_ids: productCollections[item.product_id] || []
    }));

    return calculatePrepaidDiscount(itemsForEngine, prepaidRules, stackingLogic as any); // Cast as any if type mismatch persists, or fix upstream
  };

  const subtotal = total;
  const afterBundle = subtotal - bundleDiscount;

  let promoSavings = 0;
  if (discount) {
    if (discount.type === 'percentage') {
      promoSavings = Math.round(afterBundle * (discount.value / 100));
    } else {
      promoSavings = Math.min(afterBundle, discount.value);
    }
  }
  const afterPromo = Math.max(0, afterBundle - promoSavings);

  // Prepaid is applied on top of the amount after other discounts
  const prepaidSavings = getCalculatedPrepaidDiscount(afterPromo);
  const checkoutTotalFinal = Math.max(0, Math.round(afterPromo - prepaidSavings));

  const finalTotal = () => {
    return checkoutTotalFinal;
  };

  const checkCODAvailability = async (items: CartItem[]) => {
    const ids = items.map(i => i.product_id);
    const { data } = await supabaseBrowser
      .from('products')
      .select(`
        id, 
        title, 
        cod_enabled, 
        bundle_settings,
        weight_grams,
        partial_cod_enabled,
        use_store_partial_settings,
        product_collections ( collection_id )
      `)
      .in('id', ids);

    if (data) {
      // 1. COD Check
      const restricted = data.filter(p => p.cod_enabled === false);
      if (restricted.length > 0) {
        setCodAvailable(false);
        setCodRestrictedItems(restricted.map(p => p.title));
        setPaymentMethod('online');
      }

      // 2. Fetch Cross-sell Products
      const crossSellIds = Array.from(new Set(data.flatMap(p => p.bundle_settings?.cross_sell_product_ids || [])));
      if (crossSellIds.length > 0) {
        const { data: crossData } = await supabaseBrowser
          .from('products')
          .select('id, title, price, mrp, images, bundle_settings')
          .in('id', crossSellIds)
          .eq('status', 'published')
          .limit(4);
        if (crossData) setCrossSellProducts(crossData);
      }

      // 3. Calculate Multi-purchase Bundle Discount (Dynamic Tiers)
      let totalBDiscount = 0;
      items.forEach(item => {
        const pData = data.find(p => p.id === item.product_id);
        const bs = pData?.bundle_settings;

        // NEW: Check dynamic tiers first
        if (bs?.enabled && bs.tiers && bs.tiers.length > 0) {
          const sortedTiers = [...bs.tiers].sort((a, b) => b.qty - a.qty);
          const matchingTier = sortedTiers.find(t => item.qty >= t.qty);
          if (matchingTier) {
            totalBDiscount += (item.price * item.qty) * (matchingTier.discount / 100);
          }
        }
        // Legacy fallback
        else if (bs?.multi_purchase_enabled && item.qty >= (bs.multi_qty || 1)) {
          if (bs.multi_discount_type === 'percentage') {
            totalBDiscount += (item.price * item.qty) * (bs.multi_discount_value / 100);
          } else if (bs.multi_discount_type === 'flat') {
            totalBDiscount += (bs.multi_discount_value || 0);
          }
        }
      });
      setBundleDiscount(Math.round(totalBDiscount));

      // Build product → collection map from joined data
      const colMap: Record<string, string[]> = {};
      data.forEach((p: any) => {
        colMap[p.id] = (p.product_collections || []).map((c: any) => c.collection_id);
      });
      setProductCollections(colMap);

      // --- NEW: Partial COD Pre-resolution ---
      const totalWeight = items.reduce((sum, item) => {
        const weight = data.find(p => p.id === item.product_id)?.weight_grams || 500;
        return sum + (weight * item.qty);
      }, 0);

      const hasProductForcingPartial = data.some(p => p.partial_cod_enabled && !p.use_store_partial_settings);

      const storeConfig = store?.partial_cod_config || {};
      const storeEnabled = storeConfig.enabled === true;

      if (storeEnabled || hasProductForcingPartial) {
        setIsPartialForced(true);
        const amt = calculatePartialAmount(total, totalWeight, storeConfig);
        setPartialAmount(amt);
        // If forced, default to partial_cod
        setPaymentMethod('partial_cod');
      }
    }
  };


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

        // RTO Assessment (New High-Resolution Engine)
        const runRiskCheck = async () => {
          const signals = getSessionSignals();
          // We can't easily get cross-store/same-address count on client without more queries, 
          // so we rely on what we have + session signals.
          const result = await calculateRiskScore({
            pincode: pin,
            category: 'default',
            payment_mode: paymentMethod === 'online' ? 'online' : 'cod',
            total_amount: total,
            name: form.name,
            address: form.address,
            phone: form.phone,
            order_timestamp: new Date().toISOString(),
            session_signals: signals
          });
          setRtoResult(result);

          // Auto-Action: Force Online if high risk
          if (result.action_type === 'prepaid_only' || result.action_type === 'auto_cancel') {
            setPaymentMethod('online');
          } else if (result.action_type === 'partial_prepaid') {
            setPaymentMethod('partial_cod');
          }
        };
        runRiskCheck();
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
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isValid =
    nameValid &&
    phoneValid &&
    addressValid &&
    pincodeValid &&
    (paymentMethod === 'cod' || emailValid);

  const setField = (k: string, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  /* ---------- SUBMIT ---------- */
  const placeOrder = async () => {
    setAttempted(true);
    if (!isValid || submitting) return;

    // Compute RTO intelligence signals at submit time
    const sessionScore = getSessionRTOModifier();
    const fingerprint = getDeviceFingerprint();

    // P1-1: COD Verification Step (Driven by RTO Layer 3)
    const needsVerification = paymentMethod === 'cod' && rtoResult?.action_type === 'whatsapp_confirm';

    if (needsVerification && !showOtpModal) {
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
          setPaymentError("Verification failed. Our risk engine requires phone confirmation for this zone.");
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
          body: JSON.stringify({
            ...form,
            cart,
            payment_method: 'cod',
            otp_verified: true,
            session_score: sessionScore,
            device_fingerprint: fingerprint,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error();

        // Clear both cart, direct checkout and draft
        clearCart();
        clearDirectCheckout();
        clearDraft();
        router.push(`/order-success?order_id=${data.order_id}`);
      } else {
        // Online or Partial COD Flow - Initiate PayU payment
        const isPartial = paymentMethod === 'partial_cod';
        const payAmount = isPartial ? partialAmount : finalTotal();

        const res = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: payAmount,
            productinfo: cart.map(item => item.title).join(', '),
            firstname: form.name.split(' ')[0],
            email: email || `${form.phone}@customer.com`,
            phone: form.phone,
            udf1: isPartial ? 'partial_cod' : '',
            // Pass metadata to be saved upon callback
            udf2: JSON.stringify({
              form,
              cart,
              rto_score: rtoResult?.score,
              rto_level: rtoResult?.level,
              session_score: sessionScore,
              device_fingerprint: fingerprint,
            })
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
    <main className="min-h-screen bg-[var(--bg-primary)] pb-12">
      <header className="border-b border-[var(--border)] py-6 bg-[var(--bg-primary)] sticky top-0 z-50 shadow-sm">
        <div className="container max-w-5xl px-6 flex items-center justify-between mx-auto">
          {store?.logo_url ? (
            <Image src={store.logo_url} alt={store.name} width={120} height={40} className="h-8 w-auto object-contain" />
          ) : (
            <div className="text-2xl font-black text-[var(--text-primary)] tracking-tighter uppercase">{store?.name || "Easy D2C"}</div>
          )}
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
            <Lock className="w-3.5 h-3.5 text-[var(--text-primary)]" />
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
              <div className="bg-[var(--error)]/10 border border-[var(--error)]/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <AlertCircle className="h-5 w-5 text-[var(--error)] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-[var(--error)]">Payment Failed</p>
                  <p className="text-xs text-[var(--error)] mt-0.5">{paymentError}</p>
                </div>
              </div>
            )}

            {/* CONTACT */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--cta-text)] flex items-center justify-center text-xs font-bold ring-4 ring-[var(--bg-secondary)]">1</div>
                <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase tracking-widest text-xs">Customer Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Full Delivery Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className={`h-12 rounded-xl bg-[var(--bg-primary)] border-[var(--border)] focus:ring-[var(--primary)] transition-all ${attempted && !nameValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Phone Number (For Tracking)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-secondary)]">+91</span>
                    <Input
                      id="phone"
                      placeholder="00000 00000"
                      inputMode="numeric"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className={`h-12 pl-12 rounded-xl bg-[var(--bg-primary)] border-[var(--border)] focus:ring-[var(--primary)] transition-all ${attempted && !phoneValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
                    Email Address {paymentMethod === 'online' && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-12 rounded-xl bg-[var(--bg-primary)] border-[var(--border)] focus:ring-[var(--primary)] transition-all ${attempted && paymentMethod === 'online' && !emailValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                  {paymentMethod === 'online' && <p className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Required for online payment security</p>}
                </div>
              </div>

              {/* ACCOUNT CREATION TOGGLE */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl flex items-center justify-between border border-[var(--border)]/50">
                <div className="space-y-1">
                  <p className="text-sm font-black text-[var(--text-primary)]">Save my details for next time</p>
                  <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">Create an account to track orders & faster checkout</p>
                </div>
                <input
                  type="checkbox"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="w-5 h-5 rounded-md border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--cta-text)] flex items-center justify-center text-xs font-bold ring-4 ring-[var(--bg-secondary)]">2</div>
                <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase tracking-widest text-xs">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Pincode</Label>
                  <div className="relative">
                    <Input
                      id="pincode"
                      placeholder="6-digit pincode"
                      inputMode="numeric"
                      value={form.pincode}
                      onChange={(e) => setField("pincode", e.target.value)}
                      className={`h-12 rounded-xl bg-[var(--bg-primary)] border-[var(--border)] focus:ring-[var(--primary)] transition-all ${attempted && !pincodeValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {pincodeStatus === "loading" && <div className="w-4 h-4 border-2 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />}
                      {pincodeStatus === "success" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {pincodeStatus === "failed" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">Full Address Details</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder="House no, Street Name, Landmark / Colony"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className={`rounded-xl bg-[var(--bg-primary)] border-[var(--border)] focus:ring-[var(--primary)] transition-all ${attempted && !addressValid ? "border-red-500 ring-1 ring-red-500" : ""}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      className="h-12 rounded-xl bg-[var(--bg-primary)] border-[var(--border)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">State</Label>
                    <Input
                      id="state"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                      className="h-12 rounded-xl bg-[var(--bg-primary)] border-[var(--border)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="space-y-6 pt-12 border-t border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--cta-text)] flex items-center justify-center text-xs font-bold ring-4 ring-[var(--bg-secondary)]">3</div>
                <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase tracking-widest text-xs">Payment Information</h2>
              </div>

              {/* RTO RISK ALERT & INTERVENTIONS */}
              {rtoResult && rtoResult.level !== 'low' && (
                <div className={`p-5 rounded-3xl flex items-start gap-4 border shadow-sm transition-all duration-500 animate-in fade-in zoom-in-95 ${rtoResult.level === 'high' ? 'bg-[var(--error)]/10 border-[var(--error)]/20 text-[var(--error)] ring-4 ring-[var(--error)]/5' : 'bg-amber-50 border-amber-100 text-amber-900 ring-4 ring-amber-500/5'
                  }`}>
                  <div className={`mt-1 p-2 rounded-xl ${rtoResult.level === 'high' ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <AlertCircle className={`h-5 w-5 shrink-0 ${rtoResult.level === 'high' ? 'text-red-600' : 'text-amber-600'}`} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-1">Logistics Security Alert</p>
                    <p className="text-sm font-black tracking-tight">{rtoResult.summary}</p>
                    <p className="text-[11px] mt-1.5 font-medium leading-relaxed opacity-80 italic">
                      {rtoResult.recommendation}
                    </p>

                    {rtoResult.action_type === 'prepaid_only' && (
                      <div className="mt-4 p-3 bg-[var(--bg-primary)]/50 border border-[var(--border)] rounded-2xl text-[10px] font-bold uppercase tracking-tight">
                        COD is restricted for this area. Please pay online to secure your delivery.
                      </div>
                    )}
                    {rtoResult.action_type === 'partial_prepaid' && (
                      <div className="mt-4 p-3 bg-[var(--bg-primary)]/50 border border-[var(--border)] rounded-2xl text-[10px] font-bold uppercase tracking-tight">
                        <p className="text-[var(--text-secondary)] italic">
                          Selected for its reliability and speed in your region.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                {/* Online Payment Option */}
                <div
                  className={`group p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${paymentMethod === 'online'
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--cta-text)] shadow-xl'
                    : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--primary)]/50 text-[var(--text-primary)]'
                    }`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[var(--cta-text)]' : 'border-[var(--border)]'
                        }`}>
                        {paymentMethod === 'online' && <div className="w-3 h-3 rounded-full bg-[var(--cta-text)]" />}
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase tracking-wider">Pay Online (Secure)</p>
                        <p className={`text-[10px] font-bold mt-1 ${paymentMethod === 'online' ? 'opacity-70' : 'text-[var(--text-secondary)]'
                          }`}>UPI, Cards, Net Banking & Wallets</p>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'online' && (
                    <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 -rotate-12 translate-x-8 -translate-y-8 pointer-events-none" />
                  )}
                </div>

                {/* Partial COD Option (Intervention B or Global Settings) */}
                {(isPartialForced || rtoResult?.action_type === 'partial_prepaid') && (
                  <div
                    className={`p-6 rounded-2xl border transition-all relative cursor-pointer ${paymentMethod === 'partial_cod'
                      ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--cta-text-colour)] shadow-xl'
                      : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--primary)]'
                      }`}
                    onClick={() => setPaymentMethod('partial_cod')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'partial_cod' ? 'border-[var(--cta-text-colour)]' : 'border-[var(--border)]'
                          }`}>
                          {paymentMethod === 'partial_cod' && <div className="w-3 h-3 rounded-full bg-[var(--cta-text-colour)]" />}
                        </div>
                        <div>
                          <h4 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-xs">Security Deposit + COD</h4>
                          <p className="text-[10px] text-[var(--text-secondary)] font-bold">Pay ₹{partialAmount} now, ₹{total - partialAmount} on delivery</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-[var(--primary)]/20 text-[var(--primary)] px-2 py-1 rounded-full uppercase">{isPartialForced ? "Required" : "Recommended"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* COD Option - HIDDEN if Partial is forced */}
                {!isPartialForced && (
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`relative w-full text-left p-6 rounded-[2.5rem] border-2 transition-all group overflow-hidden ${paymentMethod === 'cod' ? 'border-[var(--primary)] bg-[var(--bg-secondary)] shadow-xl' : 'border-[var(--border)] bg-[var(--bg-primary)] opacity-60 grayscale hover:opacity-100'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${paymentMethod === 'cod' ? 'bg-[var(--primary)] text-[var(--cta-text)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                      {paymentMethod === 'cod' && (
                        <div className="h-6 w-6 rounded-full bg-[var(--primary)] text-[var(--cta-text)] flex items-center justify-center">
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-black text-[var(--text-primary)] uppercase tracking-widest text-xs">Cash on Delivery</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] font-bold">Pay when your order arrives</p>

                      <div className="mt-4 p-3 bg-[var(--bg-primary)]/50 border border-[var(--border)] rounded-2xl text-[10px] font-bold uppercase tracking-tight">
                        <p className="text-[var(--text-secondary)] italic">
                          Selected for its reliability and speed in your region.
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-[var(--bg-primary)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-sm sticky top-32 space-y-8">
              <div className="flex items-center justify-between border-b border-[var(--bg-secondary)] pb-6 lg:hidden" onClick={() => setShowSummary(!showSummary)}>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[var(--text-primary)]" />
                  <span className="font-black text-[var(--text-primary)] truncate">Order Summary</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-[var(--text-primary)] text-lg">₹{finalTotal().toLocaleString()}</span>
                  {showSummary ? <ChevronUp className="h-5 w-5 text-[var(--text-primary)]" /> : <ChevronDown className="h-5 w-5 text-[var(--text-primary)]" />}
                </div>
              </div>

              <div className={`${showSummary ? 'block' : 'hidden'} lg:block space-y-6`}>
                <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                  {cart.map((item, i) => (
                    <div key={`${item.product_id}-${i}`} className="flex justify-between items-center gap-4">
                      <div className="flex gap-4 flex-1 items-center">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                          <Image src={item.image || "/placeholder.png"} alt={item.title} fill className="object-cover" />
                          <div className="absolute top-0 right-0 w-6 h-6 bg-[var(--primary)] border-2 border-[var(--bg-primary)] rounded-full flex items-center justify-center text-[10px] font-black text-[var(--cta-text)] -translate-x-1 translate-y-1">
                            {item.qty}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-[var(--text-primary)] truncate">{item.title}</p>
                          <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">In Stock</p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-[var(--text-primary)]">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* CROSS-SELL SECTION */}
                {crossSellProducts.length > 0 && (
                  <div className="pt-6 border-t border-neutral-50">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-4">People also bought</p>
                    <div className="space-y-3">
                      {crossSellProducts.map((p) => {
                        const inCart = cart.some(item => item.product_id === p.id);
                        if (inCart) return null;

                        return (
                          <div key={p.id} className="flex items-center gap-4 bg-[var(--bg-secondary)] p-3 rounded-2xl border border-[var(--border)] group transition-all hover:opacity-80">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]">
                              <Image src={p.images?.[0] || "/placeholder.png"} alt={p.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-neutral-900 truncate">{p.title}</p>
                              <p className="text-[10px] font-bold text-blue-600">₹{p.price.toLocaleString()}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 rounded-full p-0 hover:bg-[var(--primary)] hover:text-[var(--cta-text)] text-[var(--text-primary)]"
                              onClick={() => {
                                const newItem: CartItem = {
                                  product_id: p.id,
                                  title: p.title,
                                  price: p.price,
                                  qty: 1,
                                  image: p.images?.[0] || "",
                                  prepaid_discount: p.bundle_settings?.prepaid_discount_value || 0
                                };
                                const updated = [...cart, newItem];
                                setCart(updated);
                                localStorage.setItem('easy_cart', JSON.stringify(updated));
                                checkCODAvailability(updated);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* DISCOUNT INPUT */}
                <div className="pt-6 border-t border-[var(--border)]">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount Code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      className="h-12 rounded-xl bg-[var(--bg-secondary)] border-[var(--border)] focus:ring-[var(--primary)] uppercase font-bold text-xs text-[var(--text-primary)]"
                    />
                    <Button
                      variant="outline"
                      onClick={applyDiscount}
                      disabled={applyingDiscount || !discountCode}
                      className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-[var(--cta-text)]"
                    >
                      {applyingDiscount ? "..." : "Apply"}
                    </Button>
                  </div>
                  {discountMessage && (
                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${discountMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                      {discountMessage.text}
                    </p>
                  )}
                </div>

                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-[var(--text-primary)]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {bundleDiscount > 0 && (
                    <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest">
                      <span>Bundle Savings</span>
                      <span>-₹{bundleDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  {discount && (
                    <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest">
                      <span>Promo: {discount.code}</span>
                      <span>-₹{promoSavings.toLocaleString()}</span>
                    </div>
                  )}
                  {paymentMethod === 'online' && prepaidSavings > 0 && (
                    <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest">
                      <span>Prepaid Discount</span>
                      <span>-₹{prepaidSavings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-bold text-neutral-500 uppercase tracking-widest">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-[var(--border)] pt-6">
                  <div>
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Total Amount</p>
                    <p className="text-4xl font-black text-[var(--text-primary)] tracking-tighter">
                      ₹{finalTotal().toLocaleString()}
                    </p>
                  </div>
                  <Lock className="w-5 h-5 text-[var(--border)] mb-2" />
                </div>

                <Button
                  size="lg"
                  className="w-full h-16 bg-[var(--primary)] text-[var(--cta-text)] rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[var(--primary)] opacity-90 hover:opacity-100 shadow-xl transition-all group mt-4 border-none"
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
                      <span>{paymentMethod === 'cod' ? "Confirm Order" : (paymentMethod === 'partial_cod' ? `Pay ₹${partialAmount.toLocaleString()} to Confirm` : "Complete Payment")}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                <p className="text-[9px] font-bold text-neutral-400 text-center uppercase tracking-widest">
                  Secure checkout • Powered by Easy D2C
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP SUPPORT */}
      <a
        href="https://wa.me/911234567890?text=I'm%20at%20checkout%20and%20need%20help!"
        target="_blank"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Order Help
        </span>
      </a>

      {/* OTP MODAL */}
      {
        showOtpModal && (
          <div className="fixed inset-0 bg-[var(--text-primary)]/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="bg-[var(--bg-primary)] max-w-sm w-full p-10 rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-200 border border-[var(--border)]">
              <button onClick={() => setShowOtpModal(false)} className="absolute top-6 right-6 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X className="h-6 w-6" /></button>
              <div className="text-center space-y-6">
                <div className="bg-[var(--bg-secondary)] w-20 h-20 rounded-[2rem] border border-[var(--border)] flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="h-8 w-8 text-[var(--text-primary)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Verify Device</h2>
                  <p className="text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mt-2">Entering code sent to <span className="text-[var(--text-primary)]">{form.phone}</span></p>
                </div>
                <div className="pt-4">
                  <Input
                    type="text"
                    placeholder="• • • •"
                    className="text-center text-3xl tracking-[0.5em] font-black h-16 rounded-2xl bg-[var(--bg-secondary)] border-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                    maxLength={4}
                    value={otpValue}
                    onChange={(e) => { setOtpValue(e.target.value.replace(/\D/g, '')); setOtpError(""); }}
                  />
                  {otpError && <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest mt-3">{otpError}</p>}
                </div>

                <Button
                  className="w-full h-14 bg-[var(--primary)] text-[var(--cta-text)] rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl border-none"
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
                        setOtpError("Invalid code.");
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
              </div>
            </div>
          </div>
        )
      }
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