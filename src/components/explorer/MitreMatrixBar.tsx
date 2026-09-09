"use client";

import React from "react";
import { Shield, Building2, Globe2, FileText, Cpu, AlertTriangle, Scale, Layers } from "lucide-react";
import { EntityCategory } from "@/lib/types";

interface MitreMatrixBarProps {
  selectedCategory: EntityCategory | null;
  onSelectCategory: (category: EntityCategory | null) => void;
  nodeCounts: Record<EntityCategory, number>;
  onInspectDiscrepancies?: () => void;
}

export function MitreMatrixBar({
  selectedCategory,
  onSelectCategory,
  nodeCounts,
  onInspectDiscrepancies,
}: MitreMatrixBarProps) {
  const tactics = [
    {
      id: "financing",
      category: "ministry" as EntityCategory,
      title: "Financing Arms",
      subtitle: "Multilateral MDBs",
      icon: Building2,
      count: nodeCounts.ministry ? 4 : 4,
      color: "border-purple-300 bg-purple-50 text-purple-900",
      accent: "#7c3aed",
    },
    {
      id: "sovereign",
      category: "country" as EntityCategory,
      title: "Sovereign States",
      subtitle: "Borrowing Nations",
      icon: Globe2,
      count: nodeCounts.country || 0,
      color: "border-cyan-300 bg-cyan-50 text-cyan-900",
      accent: "#0891b2",
    },
    {
      id: "operations",
      category: "project" as EntityCategory,
      title: "Appraisal PADs",
      subtitle: "Capital Operations",
      icon: FileText,
      count: nodeCounts.project || 0,
      color: "border-sky-300 bg-sky-50 text-sky-900",
      accent: "#0284c7",
    },
    {
      id: "ministries",
      category: "ministry" as EntityCategory,
      title: "Line Ministries",
      subtitle: "Executing Agencies",
      icon: Layers,
      count: Math.max(0, (nodeCounts.ministry || 0) - 4),
      color: "border-indigo-300 bg-indigo-50 text-indigo-900",
      accent: "#6366f1",
    },
    {
      id: "technology",
      category: "tech" as EntityCategory,
      title: "Infra & Assets",
      subtitle: "Hardware / Digital",
      icon: Cpu,
      count: nodeCounts.tech || 0,
      color: "border-emerald-300 bg-emerald-50 text-emerald-900",
      accent: "#059669",
    },
    {
      id: "governance",
      category: "policy" as EntityCategory,
      title: "ESF Governance",
      subtitle: "Risk Standards",
      icon: Shield,
      count: nodeCounts.policy || 0,
      color: "border-amber-300 bg-amber-50 text-amber-900",
      accent: "#d97706",
    },
    {
      id: "discrepancies",
      category: "discrepancy" as EntityCategory,
      title: "ICR Audit Flags",
      subtitle: "Variance Finding",
      icon: AlertTriangle,
      count: nodeCounts.discrepancy || 0,
      color: "border-red-300 bg-red-50 text-red-900",
      accent: "#dc2626",
    },
  ];

  return (
    <div className="border-b border-wbg-border bg-slate-50/90 px-4 py-2 sm:px-6 shadow-xs backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Eyebrow Label */}
        <div className="hidden lg:flex items-center gap-2 border-r border-slate-200 pr-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-wbg-navy text-white shadow-2xs">
            <Layers className="h-3.5 w-3.5 text-sky-400" />
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider uppercase text-wbg-navy">
              Operational Pillars
            </span>
            <span className="block text-[9px] font-medium text-wbg-slate-500 leading-none">
              Taxonomy Filter
            </span>
          </div>
        </div>

        {/* Tactical Stage Columns */}
        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tactics.map((tac) => {
            const isSelected = selectedCategory === tac.category;
            const Icon = tac.icon;

            return (
              <button
                key={tac.id}
                onClick={() => {
                  if (tac.category === "discrepancy" && onInspectDiscrepancies) {
                    onInspectDiscrepancies();
                  }
                  onSelectCategory(isSelected ? null : tac.category);
                }}
                className={`group flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                  isSelected
                    ? "border-wbg-navy bg-white shadow-xs ring-1 ring-wbg-navy"
                    : "border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white shadow-2xs"
                  style={{ backgroundColor: tac.accent }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-wbg-navy line-clamp-1 leading-tight">
                      {tac.title}
                    </span>
                    <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-bold text-wbg-slate-600 tracking-tight">
                      {tac.count}
                    </span>
                  </div>
                  <span className="block text-[9px] font-medium text-wbg-slate-400 line-clamp-1 leading-none">
                    {tac.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Clear Filter / All Entities Pill */}
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="shrink-0 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-semibold text-wbg-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Show All Stages
          </button>
        )}
      </div>
    </div>
  );
}
