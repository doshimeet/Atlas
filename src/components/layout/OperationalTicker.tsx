"use client";

import React from "react";
import { ShieldCheck, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { VERIFIED_PROJECT_DOSSIERS } from "@/lib/wbgApi";
import { formatCurrencyM } from "@/lib/utils";

export function OperationalTicker() {
  const tickerItems = [
    ...VERIFIED_PROJECT_DOSSIERS,
    ...VERIFIED_PROJECT_DOSSIERS, // doubled for seamless marquee loop
  ];

  return (
    <div className="relative w-full overflow-hidden border-b border-wbg-border bg-slate-50/90 py-2">
      <div className="flex items-center">
        {/* Static Prefix Badge */}
        <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-slate-200 bg-slate-100/95 px-4 py-0.5 text-[11px] font-semibold tracking-wider text-wbg-navy uppercase shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-wbg-sapphire"></span>
          <span>LIVE OPERATIONS FEED</span>
        </div>

        {/* Marquee Track */}
        <div className="flex animate-marquee whitespace-nowrap">
          {tickerItems.map((doc, idx) => (
            <div
              key={`${doc.id}-${idx}`}
              className="mx-4 inline-flex items-center gap-2 text-xs text-wbg-slate-700 font-sans"
            >
              <span className="font-semibold text-wbg-navy tracking-tight">{doc.id}</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-wbg-slate-900">{doc.country}</span>
              <span className="rounded bg-sky-100/80 px-1.5 py-0.5 text-[10px] font-semibold text-wbg-sapphire tracking-tight">
                {doc.instrument} {formatCurrencyM(doc.commitmentUSD / 1000000)}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span className="font-medium text-[10px] tracking-tight">SHA256:{doc.sha256Hash.slice(0, 6)}</span>
              </span>
              <span className="text-slate-300">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
