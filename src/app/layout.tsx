import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSitePreferences } from "@/lib/admin/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const preferences = await getSitePreferences();

  return {
    title: {
      default: `${preferences.siteName} | ${preferences.storeTagline}`,
      template: `%s | ${preferences.siteName}`,
    },
    description:
      preferences.heroSubtitle ||
      "A premium e-commerce foundation for phones, laptops, desktops, cameras, accessories, and high-end technology products.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
