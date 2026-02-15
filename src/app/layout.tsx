import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asset Fetcher - Search & Download Free Assets",
  description: "A powerful browser app to search, browse, and download free assets from Unsplash, Pexels, Pixabay, and Poly Haven. Find images, 3D models, textures, and HDRIs.",
  keywords: ["assets", "stock photos", "3D models", "textures", "HDRI", "free images", "Unsplash", "Pexels", "Pixabay", "Poly Haven", "Next.js"],
  authors: [{ name: "Asset Fetcher" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Asset Fetcher",
    description: "Search, browse, and download free assets from multiple sources",
    url: "https://asset-fetcher.app",
    siteName: "Asset Fetcher",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asset Fetcher",
    description: "Search, browse, and download free assets from multiple sources",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
