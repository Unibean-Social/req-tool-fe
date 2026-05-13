import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { RootJsonLd } from "@/lib/seo/root-json-ld";
import { rootMetadata } from "@/lib/seo/metadata";

const openSans = Open_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-open-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = rootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${openSans.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <RootJsonLd />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
