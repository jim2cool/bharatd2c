import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono, Anton, Dancing_Script } from "next/font/google";
import "./globals.css";
import "@/app/theme/easy-base/theme.config";
import ThemeProvider from "@/components/ThemeProvider";
import { getActiveStore } from "@/lib/getActiveStore";

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


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeConfig = await getActiveStore();

  return (
    <html lang="en-IN">
      <body
        className={`${outfit.variable} ${plusJakarta.variable} ${playfair.variable} ${jetbrains.variable} ${anton.variable} ${dancing.variable} antialiased bg-background text-foreground bg-noise`}
      >
        <ThemeProvider storeConfig={storeConfig as any}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
