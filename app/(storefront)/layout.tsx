import Header from "@/app/theme/bharat-base/layout/Header";
import Footer from "@/app/theme/bharat-base/layout/Footer";
import AnnouncementBar from "@/app/theme/bharat-base/layout/AnnouncementBar";
import { getActiveStoreId } from "@/lib/getActiveStore";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeId = await getActiveStoreId();

  // If Landing Page (no store), render children without Store layout
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
