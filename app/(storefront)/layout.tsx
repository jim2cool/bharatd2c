import Header from "@/app/theme/easy-base/layout/Header";
import Footer from "@/app/theme/easy-base/layout/Footer";
import AnnouncementBar from "@/app/theme/easy-base/layout/AnnouncementBar";
import { getActiveStoreId } from "@/lib/getActiveStore";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeId = await getActiveStoreId();

  // If Landing Page (no store),
  if (!storeId) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative z-50">
        <AnnouncementBar />
      </div>

      {/* Store Header */}
      <Header />

      {/* Page Content */}
      <main className="pt-0">
        {children}
      </main>

      {/* Store Footer */}
      <footer className="bg-white border-t border-gray-200">
        <Footer />
      </footer>
    </>
  );
}
