import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import CartNotice from "../components/CartNotice";
import CartWidget from "../components/CartWidget";
import Footer from "../components/Footer";
import GoogleAnalytics from "../components/GoogleAnalytics";
import Navbar from "../components/Navbar";
import WhatsAppHelp from "../components/WhatsAppHelp";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const displaySerif = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Asnath",
    template: "%s | Asnath",
  },
  description: "Accessories and jewellery, chosen with care.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Asnath",
    title: "Asnath",
    description: "Accessories and jewellery, chosen with care.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asnath",
    description: "Accessories and jewellery, chosen with care.",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#faf6ef]">
          <Suspense fallback={null}>
            <GoogleAnalytics
              measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
            />
          </Suspense>
          <AuthProvider>
          <CartProvider>
            <div className="bg-[#1c1917] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#efe8da]">
              Accessories &amp; jewellery · Prices in Kenyan shillings
            </div>
            <Navbar />
            <CartNotice />
            <CartWidget />
            <WhatsAppHelp />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
