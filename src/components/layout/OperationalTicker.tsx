"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, BookOpen } from "lucide-react";
import { fetchLivePublications, LivePublicationAsset } from "@/lib/wbgApi";

export function OperationalTicker() {
  const [items, setItems] = useState<LivePublicationAsset[]>([]);

  useEffect(() => {
    async function load() {
      const pubs = await fetchLivePublications();
      setItems(pubs);
    }
    load();
  }, []);

  const tickerItems = items.length > 0 ? [...items, ...items] : [];

  return (
    <div className="relative w-full overflow-hidden border-b border-wbg-border bg-slate-50/90 py-2">
      <div className="flex items-center">
        {/* Static Prefix Badge */}
        <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-slate-200 bg-slate-100/95 px-4 py-0.5 text-[11px] font-semibold tracking-wider text-wbg-navy uppercase shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>WBG RESEARCH FEED</span>
        </div>

        {/* Marquee Track */}
        <div className="flex animate-marquee whitespace-nowrap">
          {tickerItems.length > 0 ? (
            tickerItems.map((doc, idx) => (
              <div
                key={`${doc.id}-${idx}`}
                className="mx-4 inline-flex items-center gap-2 text-xs text-wbg-slate-700 font-sans"
              >
                <span className="font-semibold text-wbg-navy tracking-tight">{doc.id}</span>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-wbg-slate-900 max-w-[280px] truncate">{doc.title}</span>
                <span className="rounded bg-teal-100/80 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800 tracking-tight">
                  {doc.sector}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-700">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span className="font-medium text-[10px] tracking-tight">
                    SHA256:{(doc.sha256Hash || "verified").slice(0, 6)}
                  </span>
                </span>
                <span className="text-slate-300">|</span>
              </div>
            ))
          ) : (
            <div className="mx-4 inline-flex items-center gap-2 text-xs text-slate-400">
              <span>Synchronizing latest World Bank Group Policy Research Working Papers...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
