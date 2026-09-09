"use client";

import React, { useState, useEffect } from "react";
import { Database, Cpu, Network, FileCheck, ArrowRight, ShieldCheck } from "lucide-react";

export function AnimatedProvenanceBeam() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: "step_wds",
      title: "1. WDS API Ingestion",
      subtitle: "Live Stream",
      icon: Database,
      color: "text-sky-600 bg-sky-50 border-sky-200",
      pill: "search.worldbank.org",
      description:
        "Ingests official Project Appraisal Documents (PADs), Implementation Completion Reports (ICRs), and board resolutions via the World Bank Documents & Reports v2 API.",
    },
    {
      id: "step_nlp",
      title: "2. Semantica NLP Triplet Extraction",
      subtitle: "Deterministic Parsing",
      icon: Cpu,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      pill: "Entity Disambiguation",
      description:
        "Extracts structured triples (Subject ➔ Predicate ➔ Object) linking financing facilities, sovereign jurisdictions, executing ministries, and technical specifications.",
    },
    {
      id: "step_graph",
      title: "3. Knowledge Graph Assembly",
      subtitle: "Network Synthesis",
      icon: Network,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      pill: "Reagraph 2D Engine",
      description:
        "Projects nodes and quadratic bezier curved edges onto the porcelain Light Atlas canvas with repulsion physics and 1-click dependency path illumination.",
    },
    {
      id: "step_audit",
      title: "4. Cryptographic Provenance",
      subtitle: "W3C PROV-O Standard",
      icon: FileCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      pill: "SHA-256 Digest",
      description:
        "Binds every entity and relation directly to an immutable SHA-256 digest with live linkouts to verified PDF archives on documents.worldbank.org.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="py-16 border-b border-wbg-border bg-porcelain-grid">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-wbg-navy shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>END-TO-END PIPELINE ARCHITECTURE</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-wbg-navy sm:text-4xl">
            The Animated Provenance Pipeline
          </h2>
          <p className="mt-2 text-sm text-wbg-slate-600 leading-relaxed">
            How raw multilateral document archives transform into cryptographic, queryable institutional intelligence.
          </p>
        </div>

        {/* Pipeline Step Cards Connected with Animated Beams */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer double-bezel transition-all ${
                  isSelected ? "ring-2 ring-wbg-sapphire shadow-lifted" : "opacity-85 hover:opacity-100"
                }`}
              >
                <div className="double-bezel-inner flex h-full flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${step.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-tight">
                        {step.pill}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-wbg-navy">{step.title}</h3>
                    <p className="text-[11px] font-medium text-wbg-sapphire">{step.subtitle}</p>

                    <p className="mt-2 text-xs leading-relaxed text-wbg-slate-600">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-slate-400 font-semibold tracking-tight">
                    <span>STAGE 0{idx + 1}</span>
                    {idx < 3 && (
                      <span className="flex items-center gap-0.5 text-wbg-sapphire font-semibold">
                        <span>PIPE</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    )}
                    {idx === 3 && (
                      <span className="flex items-center gap-0.5 text-emerald-600 font-semibold">
                        <ShieldCheck className="h-3 w-3" />
                        <span>VERIFIED</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Active Stage Explainer Callout */}
        <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Architecture Focus: Stage 0{activeStep + 1}
              </span>
              <h4 className="text-base font-bold text-wbg-navy mt-0.5">
                {steps[activeStep].title}
              </h4>
              <p className="text-xs text-wbg-slate-600 mt-1 max-w-3xl leading-relaxed">
                {steps[activeStep].description}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Lineage Preserved</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
