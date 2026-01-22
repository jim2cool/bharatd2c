import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/app/theme/bharat-base/theme.config";
import Header from "@/app/theme/bharat-base/layout/Header";
import Footer from "@/app/theme/bharat-base/layout/Footer";
import AnnouncementBar from "@/app/theme/bharat-base/layout/AnnouncementBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Brand Name",
  description: "Thoughtfully crafted products for everyday India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          bg-white 
          text-gray-900
        `}
      >
        {/* ===== Announcement Bar (always top) ===== */}
        <div className="relative z-50">
          <AnnouncementBar />
        </div>

        {/* ===== Header / Navigation ===== */}
       
  <Header />


        {/* ===== Page Content ===== */}
        {/* Hero sections can be full-bleed inside pages */}
        {/* All body sections should use .container */}
        <main className="pt-[0px]">
  {children}
</main>

        {/* ===== Footer ===== */}
        <footer className="bg-white border-t border-gray-200">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
