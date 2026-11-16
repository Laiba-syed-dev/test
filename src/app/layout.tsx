import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import AppShell from "@/components/app-shell";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carepoint | Hospital Management",
  description: "Carepoint hospital management workspace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full"><AppShell>{children}</AppShell></body>
    </html>
  );
}
