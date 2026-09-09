import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Database, BookOpen } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { AsymmetricBentoGrid } from "@/components/home/AsymmetricBentoGrid";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Hero Section with Live Telemetry */}
      <HeroSection />

      {/* 2. Asymmetric Bento Grid (Sandbox, Conflict Audit, Provenance, Financing Matrix) */}
      <AsymmetricBentoGrid />

      {/* 3. Pre-Cockpit Institutional Callout Banner */}
      <section className="py-16 bg-white border-b border-wbg-border">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-8 sm:p-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-wbg-sapphire">
                  <Compass className="h-3.5 w-3.5" />
                  <span>CYBER INVESTIGATION 2D GRAPH ENGINE</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-wbg-navy sm:text-3xl">
                  Explore Sovereign Dependency Graphs in Real-Time
                </h3>
                <p className="mt-2 text-sm text-wbg-slate-600 leading-relaxed max-w-2xl">
                  Interact with the WebGL graph canvas rendered in seamless Light Atlas porcelain. Select any sovereign nation, ministry, or operation to illuminate its complete multi-tiered financing and technical lineage.
                </p>
              </div>

              <div className="md:col-span-4 flex md:justify-end">
                <Link
                  href="/explorer"
                  className="group inline-flex items-center gap-3 rounded-full bg-wbg-navy pl-6 pr-2.5 py-3 text-sm font-semibold text-white shadow-lifted transition-all hover:bg-[#001730] active:scale-[0.98]"
                >
                  <span>Launch Atlas Knowledge</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
