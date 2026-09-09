"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Database, Layers, Sparkles, Activity } from "lucide-react";
import { formatCurrencyM } from "@/lib/utils";

interface HeroSectionProps {
  onOpenExplorer?: () => void;
}

export function HeroSection({ onOpenExplorer }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-porcelain-grid pt-12 pb-16 md:pt-20 md:pb-24 border-b border-wbg-border">
      {/* Subtle Radial Gradient Accent */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl opacity-40">
        <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"></div>
        <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* Eyebrow Institutional Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-wbg-navy shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-wbg-sapphire"></span>
            <span className="tracking-tight">WORLD BANK GROUP • OPERATIONAL MEMORY</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-wbg-slate-600 tracking-tight">
              PROV-O
            </span>
          </div>
        </div>

        {/* 2-Line Editorial Headline */}
        <div className="mt-6 max-w-5xl">
          <h1 className="text-4xl font-bold tracking-tight text-wbg-navy sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.08]">
            Atlas Knowledge: World Bank Operational Graph
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-wbg-slate-600 font-normal leading-relaxed">
            Unifying World Bank Group operations, sovereign commitments, and Project Appraisal Documents into verified, queryable knowledge graphs.
          </p>
        </div>

        {/* Action CTAs (Double-Bezel & Button-in-Button) */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {/* Primary Action Button */}
          <Link
            href="/explorer"
            className="group inline-flex items-center gap-3 rounded-full bg-wbg-navy pl-6 pr-2.5 py-2.5 text-sm font-semibold text-white shadow-lifted transition-all hover:bg-[#001730] active:scale-[0.98]"
          >
            <span>Launch Atlas Knowledge</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4 text-white" />
            </span>
          </Link>

          {/* Secondary Action Link */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-wbg-slate-700 shadow-xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-wbg-navy active:scale-[0.98]"
          >
            <span>80-Year Bretton Woods Methodology</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </Link>
        </div>

        {/* 4-Column Live Institutional Telemetry Strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="double-bezel">
            <div className="double-bezel-inner p-4">
              <div className="flex items-center justify-between text-xs text-wbg-slate-500 font-medium">
                <span>Active Commitment Portfolio</span>
                <span className="h-2 w-2 rounded-full bg-wbg-sapphire"></span>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-wbg-navy sm:text-3xl">
                  $428.5B
                </span>
                <span className="text-xs font-semibold text-emerald-600">+4.2% YoY</span>
              </div>
              <p className="mt-1 text-[11px] text-wbg-slate-500">
                Aggregated across IBRD, IDA, and IFC facilities
              </p>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner p-4">
              <div className="flex items-center justify-between text-xs text-wbg-slate-500 font-medium">
                <span>Ingested Operations</span>
                <Database className="h-3.5 w-3.5 text-sky-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-wbg-navy sm:text-3xl">
                  1,842
                </span>
                <span className="text-xs font-semibold text-wbg-slate-500">Active PADs</span>
              </div>
              <p className="mt-1 text-[11px] text-wbg-slate-500">
                100% indexed to official WDS PDF dossiers
              </p>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner p-4">
              <div className="flex items-center justify-between text-xs text-wbg-slate-500 font-medium">
                <span>Sovereign Member States</span>
                <Layers className="h-3.5 w-3.5 text-cyan-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-wbg-navy sm:text-3xl">
                  190
                </span>
                <span className="text-xs font-semibold text-wbg-slate-500">Countries</span>
              </div>
              <p className="mt-1 text-[11px] text-wbg-slate-500">
                Global operational footprints resolved to ministries
              </p>
            </div>
          </div>

          <div className="double-bezel">
            <div className="double-bezel-inner p-4">
              <div className="flex items-center justify-between text-xs text-wbg-slate-500 font-medium">
                <span>W3C PROV-O Verifiable</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight text-emerald-700 sm:text-3xl">
                  99.8%
                </span>
                <span className="text-xs font-semibold text-emerald-600">Audit Grade</span>
              </div>
              <p className="mt-1 text-[11px] text-wbg-slate-500">
                Cryptographic SHA-256 node lineage guarantees
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
