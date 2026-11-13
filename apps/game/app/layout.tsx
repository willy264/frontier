import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const displayFont = localFont({
  src: [
    {
      path: "./fonts/barlow-condensed-600-latin.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/barlow-condensed-700-latin.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  display: "swap",
  preload: false,
  variable: "--font-frontier-display",
  fallback: ["Arial Narrow", "Arial", "sans-serif"]
});

const bodyFont = localFont({
  src: "./fonts/dm-sans-variable-latin.woff2",
  weight: "100 1000",
  style: "normal",
  display: "swap",
  variable: "--font-frontier-body",
  fallback: ["system-ui", "Segoe UI", "sans-serif"]
});

export const metadata: Metadata = {
  title: "FRONTIER | On-chain trading empire",
  description: "A persistent strategy and trading game on NEAR."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className={bodyFont.className}>{children}</body>
    </html>
  );
}

