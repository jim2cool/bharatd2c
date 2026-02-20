import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono, Anton, Dancing_Script } from "next/font/google";
import "./globals.css";
import "@/app/theme/easy-base/theme.config";
import ThemeProvider from "@/components/ThemeProvider";
import { supabaseAdmin } from "@/lib/supabase-admin";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-heavy",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  variable: "--font-cursive",
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
        className={`${outfit.variable} ${plusJakarta.variable} ${playfair.variable} ${jetbrains.variable} ${anton.variable} ${dancing.variable} antialiased bg-background text-foreground bg-noise`}
      >
        <ThemeProvider themeConfig={themeConfig}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
