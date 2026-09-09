import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas Knowledge | World Bank Group Operational Graph",
  description:
    "Institutional knowledge graph platform connecting 80 years of multilateral operations, sovereign member states, Project Appraisal Documents (PADs), and cryptographic W3C PROV-O provenance.",
  keywords: [
    "World Bank Group",
    "Atlas Knowledge",
    "IBRD",
    "IDA",
    "Knowledge Graph",
    "Multilateral Development Financing",
    "W3C PROV-O",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased min-h-screen bg-wbg-porcelain">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
