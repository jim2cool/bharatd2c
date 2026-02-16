import Link from "next/link";

export default function Footer({ store }: { store?: any }) {
  const footerConfig = store?.theme_config?.footer;
  const storeName = store?.name || "Easy D2C";

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container py-12">
        <div className="
          grid gap-10
          md:grid-cols-4
        ">
          {/* Brand */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 border-b border-black inline-block mb-4">
              {storeName}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {store?.about || "Thoughtfully designed products, built for everyday Indian routines."}
            </p>
          </div>

          {/* Quick Links */}
          <FooterCol title="Quick Links">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
          </FooterCol>

          {/* Support */}
          <FooterCol title="Support">
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link>
            <Link href="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link>
          </FooterCol>

          {/* Legal */}
          <FooterCol title="Legal">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            {footerConfig?.showSocials && store?.social_links && (
              <div className="mt-4 flex gap-4">
                {/* Social links would be rendered here */}
              </div>
            )}
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
            {footerConfig?.copyrightText || `© 2026 ${storeName}. All rights reserved.`}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            Made with <span className="text-red-500">❤️</span> in India 🇮🇳
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
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
        {title}
      </h4>
      <div className="flex flex-col gap-2 text-sm text-gray-600">
        {children}
      </div>
    </div>
  );
}
