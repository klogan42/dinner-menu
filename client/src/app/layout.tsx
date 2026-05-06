import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/nav-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dinner Table - Family Dinner Planner",
  description: "Plan your family dinners for the week",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Dinner Table",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#f59e0b" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} antialiased`}
      >
        <Providers>
          <NavBar />
<main className="max-w-7xl mx-auto px-3 sm:px-4 pt-18 sm:pt-20 pb-4 sm:pb-6 overflow-x-hidden">{children}</main>
          <footer className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 pt-4 mt-4 border-t border-amber-300 flex justify-center gap-3 text-sm font-display text-amber-700">
            <a href="/tips" className="hover:text-amber-700 transition-colors">Tips</a>
            <a href="/terms" className="hover:text-amber-700 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-amber-700 transition-colors">Privacy</a>
            <a href="/support" className="hover:text-amber-700 transition-colors">Support</a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
