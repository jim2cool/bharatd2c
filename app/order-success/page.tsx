import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-12 md:py-24">
      <section className="container max-w-lg px-4 mx-auto text-center">
        <div className="mb-8 animate-in zoom-in duration-500">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-10 w-10 text-green-600" strokeWidth={3} />
          </div>

          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-3">
            Order Confirmed
          </h1>

          <p className="text-muted-foreground text-lg">
            Thank you for your order. We've received it successfully.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 p-8 text-left space-y-4 mb-8">
          <h3 className="font-medium text-foreground text-base">
            What happens next?
          </h3>

          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex gap-3 items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-bold">1</span>
              Our team will verify your order
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-bold">2</span>
              You'll receive a confirmation call for Cash on Delivery
            </li>
            <li className="flex gap-3 items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-bold">3</span>
              Dispatch details will be shared once shipped
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Need help or want to make a change?
          </p>

          <Button asChild size="lg" className="w-full gap-2 rounded-none h-12 uppercase tracking-wide font-bold">
            <a href="https://wa.me/91XXXXXXXXXX">
              <MessageCircle className="h-4 w-4" />
              Contact Support
            </a>
          </Button>

          <div className="pt-2">
            <Link
              href="/products"
              className="text-sm font-medium text-foreground hover:underline underline-offset-4 flex items-center justify-center gap-1 group"
            >
              Continue Shopping
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
