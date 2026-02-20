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
      <ThemeProvider themeConfig={store.theme_config as any}>
        {/* Marketing & Tracking Scripts */}
        <MarketingScripts storeId={store.id} />

        {/* Announcement Bar */}
        {store.theme_config?.announcementBar?.enabled && (
          <div className="relative z-50">
            <AnnouncementBar config={{
              text: store.theme_config.announcementBar.text,
              style: store.theme_config.announcementBar.style,
              background: store.theme_config.announcementBar.background,
              text_color: store.theme_config.announcementBar.text_color,
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
