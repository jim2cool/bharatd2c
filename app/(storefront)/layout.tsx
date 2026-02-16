import Header from "@/app/theme/easy-base/layout/Header";
import Footer from "@/app/theme/easy-base/layout/Footer";
import AnnouncementBar from "@/app/theme/easy-base/layout/AnnouncementBar";
import MarketingScripts from "@/components/marketing/MarketingScripts";
import { getActiveStore } from "@/lib/getActiveStore";

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

  const themeColors = store.theme_config?.colors || {
    primary: "#111111",
    accent: "#E26A00"
  };

  const corners = store.theme_config?.corners || {
    button: '6px',
    card: '8px',
    image: '8px'
  };

  return (
    <>
      {/* Global Theme Variables */}
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --color-primary: ${themeColors.primary};
          --color-accent: ${themeColors.accent};
          --radius-button: ${corners.button};
          --radius-card: ${corners.card};
          --radius-image: ${corners.image};
        }
      `}} />

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
    </>
  );
}
