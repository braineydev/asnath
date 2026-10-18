import type { Metadata } from "next";
import { GFS_Didot } from "next/font/google";
import { Suspense } from "react";
import CartNotice from "../components/CartNotice";
import CartWidget from "../components/CartWidget";
import Footer from "../components/Footer";
import GoogleAnalytics from "../components/GoogleAnalytics";
import Navbar from "../components/Navbar";
import ScrollProgressButton from "../components/ScrollProgressButton";
import WhatsAppHelp from "../components/WhatsAppHelp";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { SearchProvider } from "../context/SearchContext";
import "./globals.css";

const aseniDidot = GFS_Didot({
  variable: "--font-aseni-didot",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "ASENI | Accessories",
    template: "%s | ASENI | Accessories",
  },
  description: "Accessories and jewellery, chosen with care.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "ASENI | Accessories",
    title: "ASENI | Accessories",
    description: "Accessories and jewellery, chosen with care.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASENI | Accessories",
    description: "Accessories and jewellery, chosen with care.",
  },
  icons: {
    icon: [{ url: "/logo.svg?v=aseni-wordmark", type: "image/svg+xml" }],
    shortcut: "/logo.svg?v=aseni-wordmark",
    apple: "/logo.png?v=aseni-wordmark",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${aseniDidot.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#faf6ef]">
        <Suspense fallback={null}>
          <GoogleAnalytics
            measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
          />
        </Suspense>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              <Navbar />
              <CartNotice />
              <CartWidget />
              <WhatsAppHelp />
              {children}
              <Footer />
              <ScrollProgressButton />
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
