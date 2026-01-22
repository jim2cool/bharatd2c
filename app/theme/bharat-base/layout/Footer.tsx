import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container py-12">
        <div className="
          grid gap-10
          md:grid-cols-4
        ">
          {/* Brand */}
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              YourBrand
            </h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Thoughtfully designed products,
              built for everyday Indian routines.
            </p>
          </div>

          {/* Quick Links */}
          <FooterCol title="Quick Links">
            <Link href="/">Home</Link>
            <Link href="/products">Shop</Link>
            <Link href="/cart">Cart</Link>
          </FooterCol>

          {/* Support */}
          <FooterCol title="Support">
            <Link href="/contact">Contact Us</Link>
            <Link href="/shipping">Shipping Policy</Link>
            <Link href="/returns">Returns & Refunds</Link>
          </FooterCol>

          {/* Legal */}
          <FooterCol title="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <span className="text-xs text-gray-500">
              Cash on Delivery available
            </span>
          </FooterCol>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="
          container py-4
          flex flex-col gap-2
          md:flex-row md:items-center md:justify-between
        ">
          <p className="text-xs text-gray-500">
            © 2026 YourBrand. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-gray-900">
        {title}
      </h4>
      <div className="flex flex-col gap-1 text-sm text-gray-600">
        {children}
      </div>
    </div>
  );
}
