import type { AppProps } from "next/app";
import Head from "next/head";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/AppShell";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${jakarta.variable} font-sans min-h-screen bg-wbg-porcelain`}>
      <Head>
        <title>Atlas Knowledge | World Bank Group Operational Graph</title>
        <meta
          name="description"
          content="Institutional knowledge graph platform connecting 80 years of multilateral operations, sovereign member states, Project Appraisal Documents (PADs), and cryptographic W3C PROV-O provenance."
        />
        <meta
          name="keywords"
          content="World Bank Group, Atlas Knowledge, IBRD, IDA, Knowledge Graph, Multilateral Development Financing, W3C PROV-O"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppShell>
        <Component {...pageProps} />
      </AppShell>
    </div>
  );
}
