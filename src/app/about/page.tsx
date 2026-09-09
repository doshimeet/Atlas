import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, ShieldCheck } from "lucide-react";
import { InstitutionalBriefing } from "@/components/about/InstitutionalBriefing";
import { AnimatedProvenanceBeam } from "@/components/about/AnimatedProvenanceBeam";
import { MethodologyMatrix } from "@/components/about/MethodologyMatrix";

export const metadata = {
  title: "About Us & Institutional Methodology | Atlas Knowledge • World Bank Group",
  description:
    "Explore the 80-year Bretton Woods institutional memory mandate, W3C PROV-O cryptographic provenance pipeline, and multilateral development methodology.",
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Top Editorial Hero */}
      <section className="relative overflow-hidden bg-porcelain-grid pt-14 pb-16 md:pt-20 md:pb-24 border-b border-wbg-border">
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold text-wbg-navy shadow-xs">
            <BookOpen className="h-3.5 w-3.5 text-wbg-sapphire" />
            <span>MANDATE &amp; METHODOLOGY • BRETTON WOODS ARCHIVES</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-wbg-navy sm:text-5xl md:text-6xl leading-[1.1] max-w-4xl">
            Institutional Memory, Sovereign Provenance, and Cryptographic Lineage
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-wbg-slate-600 font-normal leading-relaxed">
            From the 1944 Articles of Agreement to modern Project Appraisal Documents (PADs) and Implementation Completion Reports (ICRs), Atlas Knowledge bridges eight decades of multilateral trust with verifiable semantic knowledge graphs.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/explorer"
              className="group inline-flex items-center gap-3 rounded-full bg-wbg-navy pl-6 pr-2.5 py-2.5 text-sm font-semibold text-white shadow-lifted transition-all hover:bg-[#001730] active:scale-[0.98]"
            >
              <span>Explore Atlas Knowledge</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 text-white" />
              </span>
            </Link>

            <a
              href="https://documents.worldbank.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-wbg-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <span>World Bank Documents &amp; Reports (WDS)</span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </section>

      {/* 1. Kinetic 4-Stage Animated Data-Flow Pipeline */}
      <AnimatedProvenanceBeam />

      {/* 2. 80-Year Bretton Woods Historical Briefing & Milestones */}
      <InstitutionalBriefing />

      {/* 3. Methodology Matrix (Entity Resolution, ESF Governance, ICR Audit Conflict Engine) */}
      <MethodologyMatrix />
    </div>
  );
}
