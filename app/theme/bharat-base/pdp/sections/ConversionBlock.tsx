"use client";

import { ShoppingCart } from "lucide-react";
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
    <section className="bg-white border border-neutral-100 rounded-[2rem] p-8 shadow-sm space-y-6">
      {/* PRICING HIERARCHY */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black text-neutral-900 tracking-tighter">₹{price}</span>
          {mrp && (
            <div className="flex flex-col">
              <span className="text-sm line-through text-neutral-400 font-medium leading-none">₹{mrp}</span>
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">
                Save ₹{savings} ({percentOff}%)
              </span>
            </div>
          )}
        </div>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Inclusive of all local taxes & shipping</p>
      </div>

      {/* URGENCY & TRUST BANNERS */}
      <div className="flex flex-col gap-2">
        {urgencyText && (
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-orange-100">
            <span className="animate-pulse">⚡</span> {urgencyText}
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-50 text-neutral-500 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-neutral-100">
          🛡️ 100% Secure Transaction
        </div>
      </div>

      {/* PRIMARY ACTIONS */}
      <div className="space-y-4 pt-2">
        {!isMobile ? (
          /* DESKTOP STACK */
          <div className="space-y-3">
            {prepaidEnabled && prepaidPrice && (
              <Button
                className="w-full h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-black/20 hover:scale-[1.01] transition-all group"
                onClick={handlePrepaid}
              >
                Pay Online & Save ₹{price - prepaidPrice}
              </Button>
            )}

            {codAvailable && (
              <Button
                variant="outline"
                className="w-full h-14 border-neutral-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-50 hover:border-black transition-all"
                onClick={handleCOD}
              >
                Order via Cash on Delivery
              </Button>
            )}

            <button
              className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-black transition-colors"
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
                  className="flex-[2] h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl"
                  onClick={handlePrepaid}
                >
                  Pay Now
                </Button>
              )}

              {codAvailable && (
                <Button
                  variant="outline"
                  className="flex-1 h-14 border-neutral-200 rounded-2xl font-black text-[10px] uppercase tracking-wider"
                  onClick={handleCOD}
                >
                  COD
                </Button>
              )}

              <Button
                variant="secondary"
                className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} className="text-neutral-500" />
              </Button>
            </div>

            {prepaidEnabled && prepaidPrice && (
              <p className="text-[10px] font-black text-green-600 text-center uppercase tracking-widest bg-green-50 py-2 rounded-lg">
                ✨ Unlock ₹{price - prepaidPrice} Reward on Prepaid
              </p>
            )}
          </div>
        )}
      </div>

      {/* SMALL FOOTER TRUST */}
      <div className="pt-4 border-t border-neutral-50 flex items-center justify-between opacity-40 grayscale group-hover:grayscale-0 transition-all">
        <div className="text-[8px] font-black uppercase tracking-widest">Bharat Trusted</div>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-neutral-200 rounded-sm" />
          <div className="w-4 h-4 bg-neutral-200 rounded-sm" />
          <div className="w-4 h-4 bg-neutral-200 rounded-sm" />
        </div>
      </div>
    </section>
  );
}
