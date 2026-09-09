"use client";

import React from "react";
import { Landmark, Globe2, ShieldCheck, Scale, History, BookOpen } from "lucide-react";

export function InstitutionalBriefing() {
  const milestones = [
    {
      year: "1944",
      title: "Bretton Woods Conference",
      desc: "44 allied nations convene in New Hampshire to establish the International Bank for Reconstruction and Development (IBRD) to finance post-war reconstruction and global economic cooperation.",
    },
    {
      year: "1960",
      title: "Creation of the International Development Association (IDA)",
      desc: "Created to provide zero and low-interest credits and grants to the poorest developing nations, preventing debt distress while expanding essential public health, education, and infrastructure.",
    },
    {
      year: "1994",
      title: "The Inspection Panel & Operational Accountability",
      desc: "First independent accountability mechanism created in a multilateral development bank, empowering project-affected communities to request institutional compliance reviews.",
    },
    {
      year: "2018",
      title: "Environmental & Social Framework (ESF)",
      desc: "Launches 10 mandatory Environmental and Social Standards (ESS1–ESS10) governing biodiversity, labor protection, community health, and stakeholder engagement across all sovereign projects.",
    },
    {
      year: "2026",
      title: "Atlas Knowledge: World Bank Operational Graph",
      desc: "Synthesizes 80 years of historical archives and live operational pipelines into a cryptographic W3C PROV-O knowledge graph linking 190 sovereign member states with verifiable document lineage.",
    },
  ];

  return (
    <section className="py-12 border-b border-wbg-border bg-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-wbg-navy">
            <History className="h-3.5 w-3.5 text-wbg-sapphire" />
            <span>INSTITUTIONAL MEMORY (1944–2026)</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-wbg-navy sm:text-4xl">
            80 Years of Multilateral Trust &amp; Sovereign Development
          </h2>
          <p className="mt-2 text-sm text-wbg-slate-600 leading-relaxed">
            The World Bank Group represents a unique global partnership: 190 member countries working to end extreme poverty and boost shared prosperity on a livable planet. Atlas Knowledge transforms this historical corpus into an accessible, queryable institutional graph.
          </p>
        </div>

        {/* 5-Era Timeline */}
        <div className="mt-12 space-y-6">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="double-bezel"
            >
              <div className="double-bezel-inner flex flex-col sm:flex-row sm:items-start gap-4 p-5">
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl bg-wbg-navy text-sm font-bold text-white shadow-xs">
                  {m.year}
                </div>
                <div>
                  <h3 className="text-base font-bold text-wbg-navy">{m.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-wbg-slate-600">
                    {m.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
