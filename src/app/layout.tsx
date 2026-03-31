import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "IndioCart - Shop from India, Get Delivered Worldwide",
  description: "Parcel forwarding service for NRIs. Buy anything in India and get it shipped to your doorstep anywhere in the world.",
  keywords: "parcel forwarding, shop from India, NRI shopping, international shipping, India to worldwide",
  authors: [{ name: "IndioCart" }],
  openGraph: {
    title: "IndioCart - Shop from India, Get Delivered Worldwide",
    description: "Parcel forwarding service for NRIs. Buy anything in India and get it shipped to your doorstep anywhere in the world.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}