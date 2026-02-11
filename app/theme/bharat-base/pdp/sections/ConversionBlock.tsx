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
    <section className="rounded-xl border p-4 space-y-3">
      {/* PRICING */}
      <div className="space-y-1">
        {mrp && (
          <div className="flex items-center gap-2 text-sm">
            <span className="line-through text-muted-foreground">
              ₹{mrp}
            </span>
            {percentOff > 0 && (
              <span className="rounded bg-green-100 px-2 py-0.5 text-green-700 text-xs font-medium">
                {percentOff}% OFF
              </span>
            )}
          </div>
        )}

        <div className="text-xl font-semibold">₹{price}</div>

        {savings > 0 && (
          <p className="text-xs text-muted-foreground">
            You save ₹{savings} • Inclusive of all taxes
          </p>
        )}
      </div>

      {/* URGENCY */}
      {urgencyText && (
        <p className="text-xs font-medium text-orange-600">
          ⚡ {urgencyText}
        </p>
      )}

      {/* CTAs */}
      {!isMobile ? (
        /* DESKTOP */
        <div className="space-y-2 pt-2">
          {prepaidEnabled && prepaidPrice && (
            <Button className="w-full" onClick={handlePrepaid}>
              Pay Online & Save ₹{price - prepaidPrice}
            </Button>
          )}

          {codAvailable && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCOD}
            >
              Order via Cash on Delivery
            </Button>
          )}

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      ) : (
        /* MOBILE */
        <div className="space-y-1 pt-2">
          <div className="flex gap-2">
            {prepaidEnabled && prepaidPrice && (
              <Button className="flex-1 h-11" onClick={handlePrepaid}>
                Pay Online
              </Button>
            )}

            {codAvailable && (
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={handleCOD}
              >
                COD
              </Button>
            )}

            <Button
              variant="secondary"
              className="h-11 w-11 p-0"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
            </Button>
          </div>

          {prepaidEnabled && prepaidPrice && (
            <p className="text-xs text-green-700 text-center">
              Save ₹{price - prepaidPrice} by paying online
            </p>
          )}
        </div>
      )}
    </section>
  );
}
