"use client";

import React, { useState } from "react";
import {
  FolderGit2,
  FileText,
  Circle,
  Gem,
  BarChart2,
  User,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { CanvasMinimap } from "./CanvasMinimap";

interface FilterSidebarProps {
  depth: number;
  onDepthChange: (depth: number) => void;
  selectedDomains?: string[];
  onToggleDomain?: (domain: string) => void;
  confidence?: number;
  onConfidenceChange?: (conf: number) => void;
  selectedEntityTypes?: string[];
  onToggleEntityType?: (id: string) => void;
  selectedRelationshipTypes?: string[];
  onToggleRelationshipType?: (id: string) => void;
  entityCounts?: Record<string, number>;
  domainCounts?: Record<string, number>;
  relationshipCounts?: Record<string, number>;
  activeNodes?: any[];
  onReset?: () => void;
}

export function FilterSidebar({
  depth,
  onDepthChange,
  selectedDomains = [],
  onToggleDomain,
  confidence = 75,
  onConfidenceChange,
  selectedEntityTypes = ["projects", "documents", "entities", "concepts", "indicators", "people"],
  onToggleEntityType,
  selectedRelationshipTypes = ["references", "related_to", "located_in", "associated_with", "derived_from"],
  onToggleRelationshipType,
  entityCounts = {},
  domainCounts = {},
  relationshipCounts = {},
  activeNodes = [],
  onReset,
}: FilterSidebarProps) {
  const entityTypes = [
    {
      id: "projects",
      label: "Projects",
      count: entityCounts["projects"] ?? 4,
      icon: <FolderGit2 className="h-3 w-3 text-orange-500" />,
    },
    {
      id: "documents",
      label: "Documents",
      count: entityCounts["documents"] ?? 12,
      icon: <FileText className="h-3 w-3 text-sky-600" />,
    },
    {
      id: "entities",
      label: "Entities",
      count: entityCounts["entities"] ?? 34,
      icon: <Circle className="h-2.5 w-2.5 fill-cyan-500 text-cyan-500" />,
    },
    {
      id: "concepts",
      label: "Concepts",
      count: entityCounts["concepts"] ?? 15,
      icon: <Gem className="h-3 w-3 text-purple-600" />,
    },
    {
      id: "indicators",
      label: "Indicators",
      count: entityCounts["indicators"] ?? 4,
      icon: <BarChart2 className="h-3 w-3 text-amber-500" />,
    },
    {
      id: "people",
      label: "People",
      count: entityCounts["people"] ?? 18,
      icon: <User className="h-3 w-3 text-indigo-500" />,
    },
  ];

  const domains = [
    {
      id: "THEME_CLIMATE",
      label: "Environment",
      count: domainCounts["THEME_CLIMATE"] ?? 14,
      color: "#10b981",
    },
    {
      id: "THEME_HUMAN",
      label: "Development",
      count: domainCounts["THEME_HUMAN"] ?? 12,
      color: "#8b5cf6",
    },
    {
      id: "THEME_MACRO",
      label: "Economics",
      count: domainCounts["THEME_MACRO"] ?? 13,
      color: "#f59e0b",
    },
    {
      id: "THEME_DIGITAL",
      label: "Infrastructure",
      count: domainCounts["THEME_DIGITAL"] ?? 11,
      color: "#06b6d4",
    },
  ];

  const relationshipTypes = [
    {
      id: "references",
      label: "references",
      count: relationshipCounts["references"] ?? 12,
      style: "border-slate-500",
    },
    {
      id: "related_to",
      label: "related to",
      count: relationshipCounts["related_to"] ?? 18,
      style: "border-dashed border-slate-500",
    },
    {
      id: "located_in",
      label: "located in",
      count: relationshipCounts["located_in"] ?? 15,
      style: "border-[2.5px] border-amber-500",
    },
  ];

  return (
    <aside className="flex h-full w-[270px] shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white/95 p-3.5 text-xs select-none backdrop-blur-md">
      <div className="space-y-2.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
          <span className="font-bold text-slate-900 text-xs tracking-tight uppercase">Filters</span>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-800 transition-colors"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* 1. Entity Type */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Entity Type
          </span>
          <div className="space-y-0.5 pt-0.5">
            {entityTypes.map((item) => {
              const isChecked = selectedEntityTypes.includes(item.id);
              return (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center justify-between rounded-md px-1.5 py-0.5 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleEntityType && onToggleEntityType(item.id)}
                      className="h-3 w-3 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="flex h-3 w-3 items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 font-semibold">{item.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 2. Domain */}
        <div className="space-y-1 pt-1.5 border-t border-slate-100">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Domain
          </span>
          <div className="space-y-0.5 pt-0.5">
            {domains.map((dom) => {
              const isSelected = selectedDomains.length === 0 || selectedDomains.includes(dom.id);
              return (
                <label
                  key={dom.id}
                  className="flex cursor-pointer items-center justify-between rounded-md px-1.5 py-0.5 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleDomain && onToggleDomain(dom.id)}
                      className="h-3 w-3 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: dom.color }}
                    />
                    <span className="text-[11px] font-medium">{dom.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 font-semibold">{dom.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. Relationship Type */}
        <div className="space-y-1 pt-1.5 border-t border-slate-100">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Relationship Type
          </span>
          <div className="space-y-0.5 pt-0.5">
            {relationshipTypes.map((rel) => {
              const isChecked = selectedRelationshipTypes.includes(rel.id);
              return (
                <label
                  key={rel.id}
                  className="flex cursor-pointer items-center justify-between rounded-md px-1.5 py-0.5 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleRelationshipType && onToggleRelationshipType(rel.id)}
                      className="h-3 w-3 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="flex w-4 items-center">
                      <div className={`w-full border-t ${rel.style}`} />
                      <span className="text-[7px] -ml-0.5 text-slate-400">›</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-600">{rel.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 font-semibold">{rel.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 4. Confidence & Graph Depth Sliders */}
        <div className="space-y-2 pt-1.5 border-t border-slate-100">
          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">Confidence</span>
              <span className="font-mono font-bold text-sky-700">{confidence}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={confidence}
              onChange={(e) => onConfidenceChange && onConfidenceChange(Number(e.target.value))}
              className="mt-1 h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-sky-600"
            />
            <div className="flex justify-between text-[8px] text-slate-400 mt-0.5 font-mono">
              <span>50%</span>
              <span>100% (High Certainty)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">Graph Depth (Hops)</span>
              <span className="font-mono font-bold text-sky-700">{depth}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={depth}
              onChange={(e) => onDepthChange(Number(e.target.value))}
              className="mt-1 h-1 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-sky-600"
            />
          </div>
        </div>
      </div>

      {/* 5. Bottom Minimap Widget */}
      <div className="pt-2 border-t border-slate-100">
        <CanvasMinimap nodes={activeNodes} confidenceThreshold={confidence} />
      </div>
    </aside>
  );
}
