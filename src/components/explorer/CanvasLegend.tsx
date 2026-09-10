"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Circle,
  Gem,
  BarChart2,
  User,
  FolderGit2,
} from "lucide-react";

export function CanvasLegend() {
  const [isOpen, setIsOpen] = useState(true);

  const entityTypes = [
    { label: "Project", icon: <FolderGit2 className="h-3 w-3 text-emerald-600" />, shape: "diamond", color: "#10b981" },
    { label: "Document", icon: <FileText className="h-3 w-3 text-sky-600" />, shape: "rect", color: "#0284c7" },
    { label: "Entity", icon: <Circle className="h-2.5 w-2.5 fill-cyan-500 text-cyan-500" />, shape: "circle", color: "#06b6d4" },
    { label: "Concept", icon: <Gem className="h-3 w-3 text-purple-600" />, shape: "diamond", color: "#8b5cf6" },
    { label: "Indicator", icon: <BarChart2 className="h-3 w-3 text-amber-600" />, shape: "bars", color: "#f59e0b" },
    { label: "People", icon: <User className="h-3 w-3 text-indigo-600" />, shape: "person", color: "#6366f1" },
  ];

  const relationTypes = [
    { label: "references", style: "border-t-2 border-slate-500" },
    { label: "related to", style: "border-t-2 border-dashed border-slate-500" },
    { label: "located in", style: "border-t-[3px] border-amber-500" },
    { label: "derived from", style: "border-t-2 border-dotted border-slate-400" },
    { label: "inferred from", style: "border-t-2 border-dashed border-teal-500" },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-20 w-52 rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-md backdrop-blur-md select-none transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-xs font-bold text-slate-800 hover:text-slate-950"
      >
        <span>Graph Legend</span>
        {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="mt-2.5 space-y-3 pt-1 border-t border-slate-100 text-[11px]">
          {/* Entity Types */}
          <div className="space-y-1.5">
            {entityTypes.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-slate-700">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Relationship Types */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            {relationTypes.map((rel) => (
              <div key={rel.label} className="flex items-center gap-2 text-[10px] text-slate-600">
                <div className="flex w-7 items-center">
                  <div className={`w-full ${rel.style}`} />
                  <span className="text-[9px] -ml-1 text-slate-400">›</span>
                </div>
                <span className="font-mono text-slate-500">{rel.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
