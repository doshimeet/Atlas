"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Database, GitCommit, FileText, Binary } from "lucide-react";

export function MethodologyMatrix() {
  const pillars = [
    {
      title: "1. Entity Resolution & Harmonization",
      icon: GitCommit,
      specs: [
        "Resolves sovereign government ministries and executing agencies across 190 nations.",
        "Normalizes multilingual institutional titles (e.g. Ministère des Finances, Secretaría de Hacienda).",
        "Disambiguates co-financed operations across IBRD, IDA, IFC, and bilateral trust funds.",
      ],
    },
    {
      title: "2. Operational Triplet Ontology",
      icon: Database,
      specs: [
        "FINANCES: Formal lending instrument commitment to designated operational code.",
        "OPERATES_IN: Sovereign territory and sub-national geographic jurisdiction.",
        "IMPLEMENTED_BY: Designated line ministry or specialized autonomous project unit.",
        "DEPLOYED_IN: Physical technology specification (BESS, IXP fiber, SCADA grid).",
      ],
    },
    {
      title: "3. Cryptographic W3C PROV-O Standard",
      icon: ShieldCheck,
      specs: [
        "Every knowledge triplet carries a deterministic SHA-256 fingerprint of the source document.",
        "Records prov:Entity (PAD PDF), prov:Activity (Executive Board Session), prov:Agent (WBG Board).",
        "Provides direct PDF download linkouts to documents.worldbank.org with page/section citations.",
      ],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-wbg-navy">
            <Binary className="h-3.5 w-3.5 text-wbg-sapphire" />
            <span>TECHNICAL SPECIFICATION</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-wbg-navy sm:text-4xl">
            Methodology &amp; Verification Architecture
          </h2>
          <p className="mt-2 text-sm text-wbg-slate-600 leading-relaxed">
            Atlas Knowledge bridges unstructured official multilateral documents and mathematically rigorous graph structures using three architectural pillars.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="double-bezel">
                <div className="double-bezel-inner h-full p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-wbg-navy">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-wbg-navy">{pillar.title}</h3>
                  <ul className="mt-4 space-y-2.5 text-xs text-wbg-slate-600">
                    {pillar.specs.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span className="leading-relaxed">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
