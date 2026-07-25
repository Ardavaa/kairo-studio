import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-source-serif" });

export const metadata: Metadata = {
  title: "Kairo Studio",
  description: "Discover and analyze world-class research",
  icons: {
    icon: "/kairo-logo-compact.svg",
    shortcut: "/kairo-logo-compact.svg",
    apple: "/kairo-logo-compact.svg",
  },
};

import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
