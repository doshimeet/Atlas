"use client";

import React from "react";
import { Filter, Search, RotateCcw, Layers, Building2, Globe2, Cpu, FileCheck } from "lucide-react";
import { EntityCategory, FilterState } from "@/lib/types";

interface FacetedFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  totalNodes: number;
  filteredNodesCount: number;
  totalEdges: number;
}

export function FacetedFilters({
  filters,
  onFilterChange,
  onReset,
  totalNodes,
  filteredNodesCount,
  totalEdges,
}: FacetedFiltersProps) {
  const sectors = [
    "All Sectors",
    "Digital Development & Cyber Infrastructure",
    "Energy Transition & Renewable Grid Integration",
    "Power Infrastructure & Utility Governance",
    "Environment, Forest Conservation & Biodiversity",
    "Renewable Energy & Battery Storage Systems",
    "Agriculture, Water Security & Climate Resilience",
    "Clean Fuel, Energy Storage & Desalination",
    "Water Sanitation & Municipal Resilience",
  ];

  const regions = [
    "All Regions",
    "Eastern and Southern Africa",
    "Western and Central Africa",
    "East Asia and Pacific",
    "Latin America and Caribbean",
    "South Asia",
    "Middle East and North Africa",
  ];

  const categoryOptions: { key: EntityCategory; label: string; color: string }[] = [
    { key: "project", label: "Operations", color: "bg-sky-500" },
    { key: "country", label: "Countries", color: "bg-cyan-500" },
    { key: "ministry", label: "Ministries", color: "bg-purple-500" },
    { key: "tech", label: "Technologies", color: "bg-emerald-500" },
    { key: "policy", label: "Policies", color: "bg-amber-500" },
  ];

  const toggleCategory = (cat: EntityCategory) => {
    const current = filters.selectedCategories;
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    onFilterChange({ ...filters, selectedCategories: next });
  };

  return (
    <div className="w-full border-b border-wbg-border bg-white px-4 py-3 sm:px-6 shadow-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Search input & Filter selects */}
        <div className="flex flex-1 flex-wrap items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-wbg-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              placeholder="Filter nodes (Kenya, Solar, IDA)..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-wbg-slate-900 placeholder:text-slate-400 focus:border-wbg-sapphire focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={filters.selectedSector}
            onChange={(e) => onFilterChange({ ...filters, selectedSector: e.target.value })}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-wbg-slate-700 focus:border-wbg-sapphire focus:bg-white focus:outline-hidden"
          >
            {sectors.map((s) => (
              <option key={s} value={s === "All Sectors" ? "" : s}>
                {s}
              </option>
            ))}
          </select>

          {/* Region Filter */}
          <select
            value={filters.selectedRegion}
            onChange={(e) => onFilterChange({ ...filters, selectedRegion: e.target.value })}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-wbg-slate-700 focus:border-wbg-sapphire focus:bg-white focus:outline-hidden"
          >
            {regions.map((r) => (
              <option key={r} value={r === "All Regions" ? "" : r}>
                {r}
              </option>
            ))}
          </select>

          {/* Category Toggle Pills */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/80 p-1">
            {categoryOptions.map((cat) => {
              const isSelected = filters.selectedCategories.includes(cat.key);
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all ${
                    isSelected
                      ? "bg-white text-wbg-navy shadow-xs"
                      : "text-slate-400 hover:text-slate-600 opacity-60"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${cat.color}`}></span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Reset Filters */}
          {(filters.searchQuery ||
            filters.selectedSector ||
            filters.selectedRegion ||
            filters.selectedCategories.length < 5) && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-medium text-wbg-slate-600 hover:bg-slate-100 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Live Entity Counter */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-wbg-slate-700 font-medium">
            <span className="font-semibold text-wbg-navy">{filteredNodesCount}</span>
            <span className="text-slate-400">/ {totalNodes} Entities</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-wbg-sapphire font-medium">
            <span className="font-semibold">{totalEdges}</span>
            <span>Relationships</span>
          </div>
        </div>
      </div>
    </div>
  );
}
