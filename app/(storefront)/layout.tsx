import Header from "@/app/theme/bharat-base/layout/Header";
import Footer from "@/app/theme/bharat-base/layout/Footer";
import AnnouncementBar from "@/app/theme/bharat-base/layout/AnnouncementBar";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
