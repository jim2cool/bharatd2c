import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, ArrowRight } from "lucide-react";

import { getActiveStoreId } from "@/lib/getActiveStore";
import { getProducts } from "@/lib/products";
import ProductCard from "@/components/ui/product-card";

export default async function OrderSuccess() {
  const storeId = await getActiveStoreId();
  const recommendations = storeId ? await getProducts(storeId) : [];
  const displayRecs = recommendations.slice(0, 4);

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] py-12 md:py-24">
      <section className="container max-w-4xl px-4 mx-auto">
        <div className="max-w-lg mx-auto text-center mb-16">
          <div className="mb-8 animate-in zoom-in duration-500">
            <div className="mx-auto mb-6 h-20 w-20 rounded-[2rem] bg-[var(--primary)] text-[var(--cta-text)] flex items-center justify-center shadow-lg">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)] mb-3 uppercase italic">
              Order Confirmed
            </h1>

            <p className="text-[var(--text-secondary)] text-lg font-medium">
              Thank you for your trust. We've received your order and started processing it.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-left space-y-6 mb-8 shadow-sm">
            <h3 className="font-black text-[var(--text-primary)] text-xs uppercase tracking-widest border-b border-[var(--border)] pb-4">
              What happens next?
            </h3>

            <ul className="space-y-4 text-sm text-[var(--text-secondary)] font-bold">
              <li className="flex gap-4 items-center">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--cta-text)] text-[10px] font-black">1</span>
                Our team will verify your order details
              </li>
              <li className="flex gap-4 items-center">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--cta-text)] text-[10px] font-black">2</span>
                You'll receive a confirmation call shortly
              </li>
              <li className="flex gap-4 items-center">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--cta-text)] text-[10px] font-black">3</span>
                Tracking details will be sent via SMS
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button asChild size="lg" className="w-full h-14 bg-[var(--primary)] text-[var(--cta-text)] rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl border-none">
              <a href="https://wa.me/91XXXXXXXXXX">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Support
              </a>
            </Button>

            <div className="pt-4">
              <Link
                href="/collections"
                className="text-[10px] font-black text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-widest flex items-center justify-center gap-2 group transition-colors"
              >
                Continue Shopping
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {displayRecs.length > 0 && (
          <div className="mt-20 pt-20 border-t border-[var(--border)]">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase tracking-widest text-xs mb-2">You might also like</h2>
              <p className="text-[var(--text-secondary)] text-sm font-medium italic">Our community favorites</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayRecs.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
