import type { Metadata } from "next";
import { Fredoka, Playfair_Display, DM_Sans, DM_Serif_Display } from "next/font/google";

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

const dmSans = DM_Sans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-dm-sans",
    display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-dm-serif",
    display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ummieessence.store"),
  title: {
    default: "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya",
    template: "%s | Ummie's Essence"
  },
  description: "Exquisite fragrances and premium cosmetics curated for the modern connoisseur. Experience the essence of luxury in Kenya with M-Pesa convenience.",
  keywords: ["perfumes Kenya", "luxury fragrances", "designer scents Nairobi", "Oud collection Kenya", "premium cosmetics", "Ummie's Essence", "perfumes Nairobi", "buy perfumes Kenya", "oud perfume Kenya"],
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
    url: "https://ummieessence.store",
    siteName: "Ummie's Essence",
    title: "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya",
    description: "Exquisite fragrances and premium cosmetics curated for the modern connoisseur.",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
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

import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fredoka.variable} ${playfairDisplay.variable} ${dmSans.variable} ${dmSerifDisplay.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
      >
        <ConvexClientProvider>
          {children}
          <Toaster 
            position="top-right"
            theme="dark"
            expand={false}
            richColors
            toastOptions={{
              className: "rounded-[24px] border border-[#B07D5B33] bg-[#0a0a0b] text-white font-display italic",
              style: {
                background: "#0a0a0b",
                border: "1px solid rgba(176, 125, 91, 0.2)",
              }
            }}
          />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
