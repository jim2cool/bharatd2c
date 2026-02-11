import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/app/theme/bharat-base/theme.config";
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

export const metadata: Metadata = {
  title: "Your Brand Name",
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
        className="antialiased bg-white text-gray-900"
      >
        <ThemeProvider themeConfig={themeConfig}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
