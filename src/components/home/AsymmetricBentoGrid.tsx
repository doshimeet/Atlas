"use client";

import React from "react";
import { InteractiveSandbox } from "./InteractiveSandbox";
import { ConflictAuditCard } from "./ConflictAuditCard";
import { ProvenanceCard } from "./ProvenanceCard";
import { FinancingMatrix } from "./FinancingMatrix";

export function AsymmetricBentoGrid() {
  return (
    <section className="py-16 md:py-24 border-b border-wbg-border bg-wbg-porcelain">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-wbg-navy shadow-xs">
            <span className="h-2 w-2 rounded-full bg-wbg-sapphire"></span>
            <span>ASYMMETRIC OPERATIONAL BENTO</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-wbg-navy sm:text-4xl">
            Semantic Disambiguation &amp; Verification Architecture
          </h2>
          <p className="mt-2 text-sm text-wbg-slate-600 leading-relaxed">
            Real-time synthesis of unstructured appraisal documents into verified operational triplets, audit discrepancy flags, and multilateral capital flows.
          </p>
        </div>

        {/* Bento Grid: 2-Row Asymmetrical Interlocking Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Row 1, Left: Hero Bento (2/3 width = 8 cols) */}
          <div className="lg:col-span-8 double-bezel">
            <div className="double-bezel-inner p-5 sm:p-6">
              <InteractiveSandbox />
            </div>
          </div>

          {/* Row 1, Right: Conflict Audit Bento (1/3 width = 4 cols) */}
          <div className="lg:col-span-4 double-bezel">
            <div className="double-bezel-inner h-full">
              <ConflictAuditCard />
            </div>
          </div>

          {/* Row 2, Left: W3C PROV-O Bento (1/3 width = 4 cols) */}
          <div className="lg:col-span-4 double-bezel">
            <div className="double-bezel-inner h-full">
              <ProvenanceCard />
            </div>
          </div>

          {/* Row 2, Right: Financing Matrix (2/3 width = 8 cols) */}
          <div className="lg:col-span-8 double-bezel">
            <div className="double-bezel-inner h-full">
              <FinancingMatrix />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
