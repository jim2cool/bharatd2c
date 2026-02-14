import Header from "@/app/theme/easy-base/layout/Header";
import Footer from "@/app/theme/easy-base/layout/Footer";
import AnnouncementBar from "@/app/theme/easy-base/layout/AnnouncementBar";
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

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative z-50">
        <AnnouncementBar />
      </div>

      {/* Store Header */}
      <Header store={store} />

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
