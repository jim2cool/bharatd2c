"use client";

import { ShoppingCart, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";

type Props = {
  productId: string;
  title: string;
  price: number;
  mrp?: number;
  codAvailable?: boolean;
  prepaidEnabled?: boolean;
  prepaidDiscountPercent?: number;
  urgencyText?: string;
  isMobile?: boolean;
};

export default function ConversionBlock({
  productId,
  title,
  price,
  mrp,
  codAvailable,
  prepaidEnabled,
  prepaidDiscountPercent,
  urgencyText,
  isMobile = false,
}: Props) {
  const savings = mrp ? mrp - price : 0;
  const percentOff =
    mrp && savings > 0 ? Math.round((savings / mrp) * 100) : 0;

  const prepaidPrice =
    prepaidEnabled && prepaidDiscountPercent
      ? Math.round(price * (1 - prepaidDiscountPercent / 100))
      : null;

  function handleAddToCart() {
    addToCart({
      product_id: productId,
      title,
      price,
      qty: 1,
    });
  }

  function handleCOD() {
    handleAddToCart();
    window.location.href = "/checkout?mode=cod";
  }

  function handlePrepaid() {
    handleAddToCart();
    window.location.href = "/checkout?mode=prepaid";
  }

  return (
    <section className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)] space-y-6">
      {/* PRICING HIERARCHY */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-[var(--primary)] tracking-tighter">₹{price}</span>
          {mrp && (
            <div className="flex flex-col">
              <span className="text-sm line-through text-[var(--text-secondary)] font-normal leading-none">₹{mrp}</span>
              <span className="text-[10px] font-semibold text-green-600 uppercase tracking-widest mt-1">
                Save ₹{savings} ({percentOff}%)
              </span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Inclusive of all local taxes &amp; shipping</p>
      </div>

      {/* URGENCY & TRUST BANNERS */}
      <div className="flex flex-col gap-2">
        {urgencyText && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--urgency-bg)] text-[var(--urgency-text)] rounded-[var(--radius-button)] text-[10px] font-semibold uppercase tracking-wider border border-[var(--border)]">
            <Zap size={10} className="animate-pulse" /> {urgencyText}
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--badge-bg)] text-[var(--badge-text)] rounded-[var(--radius-button)] text-[10px] font-semibold uppercase tracking-wider border border-[var(--border)]">
          <ShieldCheck size={10} /> 100% Secure Transaction
        </div>
      </div>

      {/* PRIMARY ACTIONS */}
      <div className="space-y-4 pt-2">
        {!isMobile ? (
          /* DESKTOP STACK */
          <div className="space-y-3">
            {prepaidEnabled && prepaidPrice && (
              <Button
                className="w-full h-14 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-button)] font-semibold text-xs uppercase tracking-[0.2em] shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-hover)] hover:scale-[1.01] transition-all"
                onClick={handlePrepaid}
              >
                Pay Online &amp; Save ₹{price - prepaidPrice}
              </Button>
            )}

            {codAvailable && (
              <Button
                variant="outline"
                className="w-full h-14 border-[var(--border)] text-[var(--text-primary)] rounded-[var(--radius-button)] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[var(--bg-secondary)] hover:border-[var(--primary)] transition-all"
                onClick={handleCOD}
              >
                Order via Cash on Delivery
              </Button>
            )}

            <button
              className="w-full py-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
              onClick={handleAddToCart}
            >
              / Add to Bag
            </button>
          </div>
        ) : (
          /* MOBILE GRID */
          <div className="space-y-3">
            <div className="flex gap-3">
              {prepaidEnabled && prepaidPrice && (
                <Button
                  className="flex-[2] h-14 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-[var(--radius-button)] font-semibold text-xs uppercase tracking-wider shadow-[var(--shadow-cta)]"
                  onClick={handlePrepaid}
                >
                  Pay Now
                </Button>
              )}

              {codAvailable && (
                <Button
                  variant="outline"
                  className="flex-1 h-14 border-[var(--border)] text-[var(--text-primary)] rounded-[var(--radius-button)] font-semibold text-[10px] uppercase tracking-wider hover:bg-[var(--bg-secondary)]"
                  onClick={handleCOD}
                >
                  COD
                </Button>
              )}

              <Button
                variant="secondary"
                className="h-14 w-14 rounded-[var(--radius-button)] bg-[var(--bg-secondary)] flex items-center justify-center"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} className="text-[var(--text-secondary)]" />
              </Button>
            </div>

            {prepaidEnabled && prepaidPrice && (
              <p className="text-[10px] font-semibold text-green-600 text-center uppercase tracking-widest bg-green-50 py-2 rounded-[var(--radius-button)] flex items-center justify-center gap-2">
                <Sparkles size={10} className="fill-green-600" /> Unlock ₹{price - prepaidPrice} Reward on Prepaid
              </p>
            )}
          </div>
        )}
      </div>

      {/* SMALL FOOTER TRUST */}
      <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between opacity-40 transition-all">
        <div className="text-[8px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Easy D2C Trusted</div>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-[var(--border)] rounded-[var(--radius-button)]" />
          <div className="w-4 h-4 bg-[var(--border)] rounded-[var(--radius-button)]" />
          <div className="w-4 h-4 bg-[var(--border)] rounded-[var(--radius-button)]" />
        </div>
      </div>
    </section>
  );
}
