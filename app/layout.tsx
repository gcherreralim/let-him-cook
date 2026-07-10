import type { Metadata, Viewport } from "next";
import { Gochi_Hand, Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const hand = Gochi_Hand({ weight: "400", subsets: ["latin"], variable: "--font-hand", display: "swap" });
const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap", axes: ["opsz"] });
const body = Nunito({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Gabby's Cookbook",
  description: "Recipes — written by hand or pulled from anywhere.",
};

export const viewport: Viewport = {
  themeColor: "#F4E8D4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hand.variable} ${serif.variable} ${body.variable}`}>
      <body className="font-body">{children}</body>
    </html>
  );
}
