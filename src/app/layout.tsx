import type { Metadata } from "next";
import { Geist, Pirata_One, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import AgeGate from "@/components/AgeGate";
import "./globals.css";

// Beside Horizon (DaFont) — ojo: licencia de uso personal; para uso
// comercial hay que comprarla en masyafistudio.com
const besideHorizon = localFont({
  src: "../../public/fonts/Beside Horizon.otf",
  variable: "--font-beside",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const pirata = Pirata_One({
  variable: "--font-pirata",
  weight: "400",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitPrince — Exclusive content",
  description:
    "FitPrince exclusive content: new photos and videos every day, no bots, secure payment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${pirata.variable} ${cormorant.variable} ${besideHorizon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AgeGate />
        {children}
      </body>
    </html>
  );
}
