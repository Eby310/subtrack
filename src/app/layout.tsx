import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/ClerkProvider";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SubTrack - Track Your Subscriptions",
  description: "Track and manage your subscriptions, calculate spending, and get renewal reminders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-[#0a0a0f] text-[#f4f4f5]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
