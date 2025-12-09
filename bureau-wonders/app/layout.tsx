import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { NAVIGATION_ITEMS, SITE_NAME } from "@/lib/constants";
import FooterWrapper from "@/components/layout/FooterWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://bureauofwonders.com'),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Luxury brand communications and PR agency specializing in jewelry, watches, fashion, and more.",
  keywords: ['luxury brand communications', 'PR agency', 'brand strategy', 'luxury marketing', 'jewelry PR', 'fashion PR'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "Luxury brand communications and PR agency specializing in jewelry, watches, fashion, and more.",
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: "Luxury brand communications and PR agency specializing in jewelry, watches, fashion, and more.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header navigation={NAVIGATION_ITEMS} />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
