import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "The Complete Guide - Instant Digital Download",
  description:
    "A practical, step-by-step digital guide. Instant PDF download, read on any device.",
  openGraph: {
    title: "The Complete Guide - Instant Digital Download",
    description:
      "A practical, step-by-step digital guide. Instant PDF download, read on any device.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="bg-cream text-ink min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
