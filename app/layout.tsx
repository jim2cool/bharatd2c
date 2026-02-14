import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import "@/app/theme/easy-base/theme.config";
import ThemeProvider from "@/components/ThemeProvider";
import { supabaseAdmin } from "@/lib/supabase-admin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Easy D2C Platform",
  description: "Thoughtfully crafted products for everyday India.",
};

import { getActiveStoreId } from "@/lib/getActiveStore";
import { notFound } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Demo Store ID - In production this would come from domain/subdomain
  // const STORE_ID = "b3589f69-28a2-4831-b20c-06512f483ce4";
  const storeId = await getActiveStoreId();

  // If no storeId, we are on the Platform Landing Page
  // Do not 404, just don't fetch store theme
  let themeConfig = null;

  if (storeId) {
    const { data } = await supabaseAdmin
      .from("stores")
      .select("theme_config")
      .eq("id", storeId)
      .single();
    themeConfig = data?.theme_config;
  }

  return (
    <html lang="en-IN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-white text-gray-900`}
      >
        <ThemeProvider themeConfig={themeConfig}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
