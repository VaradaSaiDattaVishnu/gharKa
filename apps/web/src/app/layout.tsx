import type { Metadata, Viewport } from "next";
import { Nunito, Inter, Caveat } from "next/font/google";
import { Providers } from "./providers";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GharKa -- Your neighbor's kitchen, one tap away",
  description:
    "Discover homemade food made by cooks in your gated community. Browse, connect, and enjoy authentic home-cooked meals from your neighbors.",
  keywords: [
    "homemade food",
    "community food",
    "neighborhood cooking",
    "gated community",
    "home cooked meals",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#E8913A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
