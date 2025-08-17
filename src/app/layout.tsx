import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Imgur Upload Tool - No Registration Required",
  description: "Professional imgur upload service for instant image hosting. Upload images to Imgur without registration. Get direct links for Reddit & social media.",
  openGraph: {
    title: "Imgur Upload - Free Image Hosting Without Registration",
    description: "Upload images to Imgur instantly without creating an account. Free unlimited image hosting with direct links.",
    url: "https://imgurupload.pro",
    siteName: "ImgurUpload.pro",
    images: [
      {
        url: "https://imgurupload.pro/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Imgur Upload - Free Image Hosting"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imgur Upload - Free Image Hosting Without Registration",
    description: "Upload images to Imgur instantly without creating an account. Free unlimited image hosting with direct links.",
    images: ["https://imgurupload.pro/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://imgurupload.pro",
  },
  verification: {
    google: "your-google-verification-code",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
