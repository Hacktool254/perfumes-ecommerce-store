import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fredoka, Playfair_Display } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ummies-essence.vercel.app"),
  title: {
    default: "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya",
    template: "%s | Ummie's Essence"
  },
  description: "Exquisite fragrances and premium cosmetics curated for the modern connoisseur. Experience the essence of luxury in Kenya with M-Pesa convenience.",
  keywords: ["perfumes Kenya", "luxury fragrances", "designer scents Nairobi", "Oud collection Kenya", "premium cosmetics", "Ummie's Essence"],
  authors: [{ name: "Ummie's Essence" }],
  creator: "Ummie's Essence",
  publisher: "Ummie's Essence",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://ummies-essence.vercel.app",
    siteName: "Ummie's Essence",
    title: "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya",
    description: "Exquisite fragrances and premium cosmetics curated for the modern connoisseur.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ummie's Essence Luxury Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya",
    description: "Exquisite fragrances and premium cosmetics curated for the modern connoisseur.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon_32x32.png', type: 'image/png' }
    ],
    shortcut: '/favicon_192x192.png',
    apple: '/favicon_180x180.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${fredoka.variable} ${playfairDisplay.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
