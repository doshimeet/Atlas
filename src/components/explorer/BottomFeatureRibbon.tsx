"use client";

import React from "react";
import {
  Search,
  Compass,
  Sparkles,
  Route,
  ShieldCheck,
  Share2,
} from "lucide-react";

export function BottomFeatureRibbon() {
  const features = [
    {
      title: "Semantic Search",
      desc: "Find entities, documents and concepts with intelligent search.",
      icon: <Search className="h-3.5 w-3.5 text-sky-600" />,
    },
    {
      title: "Visual Exploration",
      desc: "Navigate the graph with filters, depth control and semantic zoom.",
      icon: <Compass className="h-3.5 w-3.5 text-indigo-600" />,
    },
    {
      title: "Ask & Discover",
      desc: "Use natural language to get insights and explore connections.",
      icon: <Sparkles className="h-3.5 w-3.5 text-amber-500" />,
    },
    {
      title: "Pathfinding",
      desc: "Find the shortest path between any two entities.",
      icon: <Route className="h-3.5 w-3.5 text-emerald-600" />,
    },
    {
      title: "Provenance & Trust",
      desc: "See source, confidence and evidence for every relationship.",
      icon: <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />,
    },
    {
      title: "Save & Share",
      desc: "Save graph views, export data and collaborate.",
      icon: <Share2 className="h-3.5 w-3.5 text-purple-600" />,
    },
  ];

  return (
    <div className="hidden xl:flex h-14 w-full shrink-0 items-center justify-between border-t border-slate-200 bg-white/95 px-6 select-none backdrop-blur-md">
      {/* Title */}
      <div className="pr-4 border-r border-slate-200 shrink-0">
        <span className="text-xs font-bold text-slate-800 leading-tight block">
          Key Features at a Glance
        </span>
      </div>

      {/* 6 Feature Capsules */}
      <div className="flex flex-1 items-center justify-around gap-3 px-2">
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-2 max-w-[210px]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 shadow-2xs">
              {feat.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                {feat.title}
              </span>
              <span className="text-[10px] text-slate-400 truncate leading-tight">
                {feat.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
