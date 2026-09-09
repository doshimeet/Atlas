"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, Globe2, Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { VERIFIED_PROJECT_DOSSIERS } from "@/lib/wbgApi";
import { formatCurrencyM } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = VERIFIED_PROJECT_DOSSIERS.filter(
    (d) =>
      d.id.toLowerCase().includes(query.toLowerCase()) ||
      d.projectTitle.toLowerCase().includes(query.toLowerCase()) ||
      d.country.toLowerCase().includes(query.toLowerCase()) ||
      d.sector.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-20 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-wbg-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search operations, member countries, PAD IDs (e.g. P173840, Kenya, Solar)..."
            className="ml-3 w-full bg-transparent text-sm text-wbg-slate-900 placeholder:text-wbg-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-wbg-slate-500">
              No World Bank operations found matching &quot;{query}&quot;.
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Verified Project Dossiers ({filtered.length})
              </div>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    router.push(`/explorer?search=${encodeURIComponent(item.country)}`);
                  }}
                  className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-wbg-sapphire">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-wbg-navy tracking-tight">{item.id}</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-wbg-slate-600">
                          {item.country}
                        </span>
                        <span className="text-[11px] font-semibold text-wbg-sapphire">
                          {formatCurrencyM(item.commitmentUSD / 1000000)}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-[11px] text-wbg-slate-600">
                        {item.projectTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 group-hover:text-wbg-navy">
                    <span className="hidden sm:inline">Inspect Graph</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/90 px-4 py-2 text-[11px] text-wbg-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-wbg-sapphire" />
            <span>W3C PROV-O Verified Repository</span>
          </div>
          <div>
            Press <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-semibold text-[10px] shadow-2xs">ESC</kbd> to exit
          </div>
        </div>
      </div>
    </div>
  );
}
