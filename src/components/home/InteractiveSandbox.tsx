"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, ArrowRight, ShieldCheck, Check, RefreshCw, Cpu, Layers, Link2 } from "lucide-react";

export function InteractiveSandbox() {
  const [extracted, setExtracted] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTriplet, setActiveTriplet] = useState<number | null>(0);

  const triplets = [
    {
      subject: "World Bank (IDA)",
      subjectCat: "ministry",
      predicate: "FINANCES",
      object: "P173840 (Regional Digital Integration)",
      objectCat: "project",
      citation: "PAD4829 Page 4 §2.1: USD 350M credit approval",
      hash: "e3b0c44298fc1c14",
    },
    {
      subject: "P173840 (Regional Digital)",
      subjectCat: "project",
      predicate: "OPERATES_IN",
      object: "Republic of Kenya",
      objectCat: "country",
      citation: "PAD4829 Page 12 §3.4: Host Sovereign Jurisdiction",
      hash: "7d2b8813a401c901",
    },
    {
      subject: "P173840 (Regional Digital)",
      subjectCat: "project",
      predicate: "IMPLEMENTED_BY",
      object: "Ministry of ICT & Digital Economy",
      objectCat: "ministry",
      citation: "PAD4829 Page 19 §4.2: Designated Executing Authority",
      hash: "9a441e48bc7251e9",
    },
    {
      subject: "Cross-Border Fiber & IXP",
      subjectCat: "tech",
      predicate: "DEPLOYED_IN",
      object: "P173840 (Regional Digital)",
      objectCat: "project",
      citation: "PAD4829 Annex 2 §1: Technical Architecture Spec",
      hash: "ca978112ca1bbdca",
    },
  ];

  const handleReExtract = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExtracted(true);
    }, 600);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-sky-100/70 px-2 py-0.5 text-[10px] font-bold text-wbg-sapphire uppercase tracking-wider">
            <span>SEMANTIC EXTRACTION SANDBOX</span>
          </div>
          <h3 className="mt-1 text-base font-bold text-wbg-navy">
            Document Appraisal Document (PAD) ➔ Operational Triplet Graph
          </h3>
        </div>

        <button
          onClick={handleReExtract}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-wbg-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-wbg-sapphire ${isProcessing ? "animate-spin" : ""}`} />
          <span>{isProcessing ? "Extracting Triples..." : "Re-Run Extraction Pipeline"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Left Side: Mock PAD Document Ingestion */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 text-xs">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-wbg-sapphire" />
              <span className="font-semibold text-wbg-navy">PAD4829_Excerpt.pdf</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 tracking-tight">DOCS.WORLDBANK.ORG</span>
          </div>

          <div className="mt-3 space-y-2 text-xs leading-relaxed text-wbg-slate-700">
            <p className="rounded bg-white p-2.5 border border-slate-200/60 shadow-xs">
              <span className="font-bold text-wbg-navy">PROJECT APPRAISAL DOCUMENT:</span> On May 18, 2023, the Executive Directors of the{" "}
              <mark className="bg-purple-100 text-purple-900 px-1 rounded font-medium">
                International Development Association (IDA)
              </mark>{" "}
              approved a credit of{" "}
              <mark className="bg-sky-100 text-sky-900 px-1 rounded font-semibold">
                SDR 254.2 million (US$ 350.0 million equivalent)
              </mark>{" "}
              to the{" "}
              <mark className="bg-cyan-100 text-cyan-900 px-1 rounded font-medium">
                Republic of Kenya
              </mark>{" "}
              for the Eastern Africa Regional Digital Integration Operation (P173840).
            </p>
            <p className="rounded bg-white p-2.5 border border-slate-200/60 shadow-xs">
              The designated Executing Agency shall be the{" "}
              <mark className="bg-purple-100 text-purple-900 px-1 rounded font-medium">
                Ministry of Information, Communications and the Digital Economy
              </mark>
              , deploying high-capacity{" "}
              <mark className="bg-emerald-100 text-emerald-900 px-1 rounded font-medium">
                cross-border terrestrial fiber optic links and carrier-neutral IXPs
              </mark>
              .
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50/80 px-2.5 py-1.5 text-[11px] text-emerald-800">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Cryptographic Digest Verified
            </span>
            <span className="text-[10px] font-semibold tracking-tight">SHA256: e3b0c442...</span>
          </div>
        </div>

        {/* Right Side: Semantic Graph Triplets */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs text-wbg-slate-500">
              <span className="font-semibold text-wbg-navy">
                Synthesized Knowledge Triplets ({triplets.length})
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">
                100% W3C PROV-O Bound
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {triplets.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTriplet(idx)}
                  className={`cursor-pointer rounded-lg border p-2.5 text-xs transition-all ${
                    activeTriplet === idx
                      ? "border-wbg-sapphire bg-sky-50/50 shadow-xs ring-1 ring-wbg-sapphire/20"
                      : "border-slate-200/80 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {/* Subject */}
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-wbg-navy text-[11px]">
                      {t.subject}
                    </span>

                    {/* Predicate Badge */}
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-wbg-sapphire">
                      <Link2 className="h-2.5 w-2.5" />
                      {t.predicate}
                    </span>

                    {/* Object */}
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-wbg-navy text-[11px]">
                      {t.object}
                    </span>
                  </div>

                  {activeTriplet === idx && (
                    <div className="mt-2 flex items-center justify-between border-t border-sky-100 pt-1.5 text-[11px] text-wbg-slate-600">
                      <span className="italic">{t.citation}</span>
                      <span className="text-[10px] font-semibold text-wbg-sapphire tracking-tight">
                        SHA:{t.hash}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
            <span className="text-wbg-slate-500 text-[11px]">
              Click any triplet to inspect W3C citation &amp; SHA-256 derivation.
            </span>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-1 font-semibold text-wbg-sapphire hover:text-wbg-navy"
            >
              <span>Explore in Atlas Knowledge</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
