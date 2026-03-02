import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const monstaFectro = localFont({
  src: [
    {
      path: "../../public/fonts/monsta-fectro.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/monsta-fectro-italic.otf",
      weight: "400",
      style: "italic",
    }
  ],
  variable: "--font-monsta-fectro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ummie's Essence | Luxury Perfumes & Cosmetics",
  description: "Premium selection of perfumes and cosmetics in Kenya.",
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
          className={`${fredoka.variable} ${monstaFectro.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
