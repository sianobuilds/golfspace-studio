import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "GolfSpace Studio | AI Golf Space Planning",
  description:
    "Plan your golf simulator space with interactive equipment placement and AI-powered visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0c1715] text-white antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
