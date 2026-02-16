import Header from "@/app/theme/easy-base/layout/Header";
import Footer from "@/app/theme/easy-base/layout/Footer";
import AnnouncementBar from "@/app/theme/easy-base/layout/AnnouncementBar";
import MarketingScripts from "@/components/marketing/MarketingScripts";
import { getActiveStore } from "@/lib/getActiveStore";
import ThemeProvider from "@/components/ThemeProvider";

export const revalidate = 0;

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await getActiveStore();

  // If Landing Page (no store),
  if (!store) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Global Theme Variables */}
      <ThemeProvider storeConfig={store as any}>
        {/* Marketing & Tracking Scripts */}
        <MarketingScripts storeId={store.id} />

        {/* Announcement Bar */}
        {(store as any).resolved_active_components?.includes('announcement_bar') && (
          <div className="relative z-50">
            <AnnouncementBar config={{
              text: (store as any).announcement_text || "Free shipping on orders over ₹999",
              style: "static",
              background: (store as any).urgency_bg || "#111",
              text_color: (store as any).urgency_text || "#fff",
            }} />
          </div>
        )}

        {/* Store Header */}
        <Header store={store} />

        {/* Page Content */}
        <main className="pt-0">
          {children}
        </main>

        {/* Store Footer */}
        <Footer store={store} />
      </ThemeProvider>
    </>
  );
}
