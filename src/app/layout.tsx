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
  title: "Why Pushing Harder Is Making It Worse — And What to Do Instead",
  description:
    "The in-the-moment guide for chronic constipation sufferers. Instant PDF download, read on any device.",
  openGraph: {
    title: "Why Pushing Harder Is Making It Worse — And What to Do Instead",
    description:
      "The in-the-moment guide for chronic constipation sufferers. Instant PDF download, read on any device.",
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
