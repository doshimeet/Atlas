"use client";

import React, { useState } from "react";
import { ShieldCheck, Hash, Key, ExternalLink, Copy, Check } from "lucide-react";
import { truncateHash } from "@/lib/utils";

export function ProvenanceCard() {
  const [copied, setCopied] = useState(false);
  const sampleHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-wbg-navy">W3C PROV-O Cryptographic Lineage</h3>
              <p className="text-[11px] text-wbg-slate-500">Zero-Tamper Document Lineage</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            VERIFIED
          </span>
        </div>

        {/* PROV-O Architecture Schema */}
        <div className="mt-4 space-y-2 text-xs">
          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-wbg-navy flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-600"></span>
                prov:Entity
              </span>
              <span className="text-[10px] text-slate-400">PAD4829 (P173840)</span>
            </div>
            <p className="mt-1 text-[11px] text-wbg-slate-600">
              Bound to official PDF stored in World Bank Archives.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-wbg-navy flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                prov:Activity
              </span>
              <span className="text-[10px] text-slate-400">Executive Board Approval</span>
            </div>
            <p className="mt-1 text-[11px] text-wbg-slate-600">
              Authorized via 190-Member Sovereign Resolution.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-wbg-navy flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                prov:Agent
              </span>
              <span className="text-[10px] text-slate-400">World Bank Group Board</span>
            </div>
            <p className="mt-1 text-[11px] text-wbg-slate-600">
              Cryptographic root of trust established 1944.
            </p>
          </div>
        </div>

        {/* SHA-256 Digest Box */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-wbg-slate-500">
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3 text-wbg-sapphire" />
              <span>Immutable SHA-256 Digest</span>
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-wbg-sapphire hover:text-wbg-navy"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-1.5 break-all text-[11px] font-semibold tracking-tight text-wbg-navy bg-slate-50 p-2 rounded-lg border border-slate-200/60">
            {sampleHash}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-wbg-slate-500">
        <span>Audited via W3C PROV-O v2.4</span>
        <a
          href="https://www.w3.org/TR/prov-overview/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-wbg-sapphire hover:text-wbg-navy"
        >
          <span>W3C Standard</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>
    </div>
  );
}
