"use client";

import React, { useState, useMemo } from "react";
import {
  GitFork,
  Move,
  Maximize2,
  Sun,
  Moon,
  Crosshair,
  Route,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Layers,
  Tag,
  Building2,
  Search,
  X,
  ChevronRight,
  Filter,
  Eye,
  CheckCircle2,
} from "lucide-react";
import {
  PathTraversalType,
  GraphLayoutAlgorithm,
  NodePresentationMode,
  GraphNode,
  GraphEdge,
} from "@/lib/types";

interface InvestigationToolbarProps {
  traversalType: PathTraversalType;
  onTraversalChange: (type: PathTraversalType) => void;
  layoutAlgorithm: GraphLayoutAlgorithm;
  onLayoutChange: (layout: GraphLayoutAlgorithm) => void;
  presentationMode?: NodePresentationMode;
  onTogglePresentationMode?: () => void;
  isDraggable: boolean;
  onToggleDraggable: () => void;
  edgeInterpolation: "curved" | "linear";
  onToggleEdgeInterpolation: () => void;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
  nodes: GraphNode[];
  edges?: GraphEdge[];
  allNodes?: GraphNode[];
  allEdges?: GraphEdge[];
  activeTrace?: { source: string; target: string } | null;
  onClearTrace?: () => void;
  onTracePath: (sourceId: string, targetId: string) => void;
  onResetCamera: () => void;
  onFitGraph: () => void;
  selectedNodeId: string | null;
  // Unified HUD Additions
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  selectedPractice?: string | null;
  onSelectPractice?: (practice: string | null) => void;
  focusedNode?: GraphNode | null;
  onExitFocus?: () => void;
  totalNodesCount?: number;
  totalEdgesCount?: number;
}

export function InvestigationToolbar({
  traversalType,
  onTraversalChange,
  layoutAlgorithm,
  onLayoutChange,
  presentationMode = "pill_minimalist",
  onTogglePresentationMode,
  isDraggable,
  onToggleDraggable,
  edgeInterpolation,
  onToggleEdgeInterpolation,
  themeMode,
  onToggleTheme,
  nodes,
  edges = [],
  allNodes,
  allEdges,
  activeTrace,
  onClearTrace,
  onTracePath,
  onResetCamera,
  onFitGraph,
  selectedNodeId,
  searchQuery = "",
  onSearchChange,
  selectedPractice = null,
  onSelectPractice,
  focusedNode = null,
  onExitFocus,
  totalNodesCount = 0,
  totalEdgesCount = 0,
}: InvestigationToolbarProps) {
  const poolNodes = allNodes && allNodes.length > 0 ? allNodes : nodes;
  const poolEdges = allEdges && allEdges.length > 0 ? allEdges : edges;
  const [sourceId, setSourceId] = useState<string>("");
  const [targetId, setTargetId] = useState<string>("");
  const [showPathFinder, setShowPathFinder] = useState(false);

  const practices = [
    { id: "THEME_CLIMATE", label: "Climate Action" },
    { id: "THEME_DIGITAL", label: "Digital Economy" },
    { id: "THEME_MACRO", label: "Macro & Finance" },
    { id: "THEME_HUMAN", label: "Human Capital" },
  ];

  // Dynamically compute reachable targets from sourceId using BFS
  const reachableTargets = useMemo(() => {
    if (!sourceId) return [];
    if (!poolEdges || poolEdges.length === 0) {
      return poolNodes.filter((n) => n.id !== sourceId).map((n) => ({ ...n, distance: 1, relation: "CONNECTED" }));
    }

    const adj = new Map<string, Array<{ neighbor: string; relation: string }>>();
    for (const e of poolEdges) {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)!.push({ neighbor: e.target, relation: e.label });
      adj.get(e.target)!.push({ neighbor: e.source, relation: e.label });
    }

    const distances = new Map<string, number>();
    const directRelations = new Map<string, string>();
    const queue: Array<{ id: string; dist: number }> = [{ id: sourceId, dist: 0 }];
    distances.set(sourceId, 0);

    while (queue.length > 0) {
      const { id: currId, dist } = queue.shift()!;
      const neighbors = adj.get(currId) || [];
      for (const { neighbor, relation } of neighbors) {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, dist + 1);
          if (currId === sourceId) {
            directRelations.set(neighbor, relation);
          }
          queue.push({ id: neighbor, dist: dist + 1 });
        }
      }
    }

    return poolNodes
      .filter((n) => n.id !== sourceId && distances.has(n.id))
      .map((n) => ({
        ...n,
        distance: distances.get(n.id)!,
        relation: directRelations.get(n.id) || "INDIRECT_LINK",
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [sourceId, poolNodes, poolEdges]);

  const handleStartTrace = () => {
    if (sourceId && targetId) {
      onTracePath(sourceId, targetId);
      setShowPathFinder(false);
    }
  };

  return (
    <div className="relative z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 shadow-2xs">
      {/* Unified 48px Command HUD Bar */}
      <div className="flex h-12 items-center justify-between px-3 md:px-4 gap-2">
        {/* Left Section: Focus Breadcrumb OR Global Practice Filter */}
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          {focusedNode ? (
            <div className="flex items-center gap-2 bg-teal-50/90 border border-teal-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="flex items-center gap-1 text-teal-800 font-semibold">
                <Eye className="h-3.5 w-3.5 text-teal-600" />
                <span>Solo Focus:</span>
              </span>
              <span className="font-bold text-teal-950 max-w-[140px] sm:max-w-[220px] truncate">
                {focusedNode.label}
              </span>
              {onExitFocus && (
                <button
                  onClick={onExitFocus}
                  className="flex items-center gap-1 rounded bg-teal-200/60 hover:bg-teal-200 px-1.5 py-0.5 text-[10px] font-bold text-teal-900 transition-colors"
                  title="Exit solo focus and restore full graph"
                >
                  <X className="h-3 w-3" />
                  <span className="hidden sm:inline">Exit</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="hidden lg:flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 text-xs">
                <button
                  onClick={() => onSelectPractice && onSelectPractice(null)}
                  className={`rounded-md px-2 py-1 font-semibold transition-all ${
                    selectedPractice === null
                      ? "bg-white text-teal-800 shadow-2xs border border-teal-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Practices
                </button>
                {practices.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectPractice && onSelectPractice(selectedPractice === p.id ? null : p.id)}
                    className={`rounded-md px-2 py-1 font-semibold transition-all ${
                      selectedPractice === p.id
                        ? "bg-white text-teal-800 shadow-2xs border border-teal-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Mobile Practice Select */}
              <div className="lg:hidden flex items-center">
                <select
                  value={selectedPractice || ""}
                  onChange={(e) => onSelectPractice && onSelectPractice(e.target.value || null)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden"
                >
                  <option value="">All Practices</option>
                  {practices.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Center Section: Search Bar & Layout Switcher */}
        <div className="flex items-center gap-2 flex-1 max-w-xl justify-center">
          {onSearchChange && (
            <div className="relative w-full max-w-xs hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search graph (papers, authors, findings)..."
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/70 pl-8 pr-7 py-1 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {/* Layout Switcher (Mind-Map / Hierarchy / Network) */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5 text-xs">
            <button
              onClick={() => onLayoutChange("treeLr2d")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-all ${
                layoutAlgorithm === "treeLr2d"
                  ? "bg-white text-teal-700 shadow-2xs border border-teal-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Anubhab's Left-to-Right Horizontal Mind-Map Flow"
            >
              <span>🌿</span>
              <span className="hidden md:inline">Mind-Map</span>
            </button>

            <button
              onClick={() => onLayoutChange("hierarchicalTd")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-all ${
                layoutAlgorithm === "hierarchicalTd"
                  ? "bg-white text-sky-700 shadow-2xs border border-sky-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Top-Down Governance Hierarchy"
            >
              <span>⬘</span>
              <span className="hidden md:inline">Hierarchy</span>
            </button>

            <button
              onClick={() => onLayoutChange("forceDirected2d")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-semibold transition-all ${
                layoutAlgorithm === "forceDirected2d"
                  ? "bg-white text-purple-700 shadow-2xs border border-purple-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Free Orbiting Network Graph"
            >
              <span>🕸</span>
              <span className="hidden md:inline">Network</span>
            </button>
          </div>
        </div>

        {/* Right Section: Presentation Mode, Tracer, Fit, Live Counts */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Node Presentation Toggle */}
          {onTogglePresentationMode && (
            <button
              onClick={onTogglePresentationMode}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
                presentationMode === "pill_minimalist"
                  ? "border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100/60"
                  : "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100/60"
              }`}
              title="Toggle between Minimalist Mind-Map Badges and Institutional Icons"
            >
              <Tag className="h-3 w-3" />
              <span>{presentationMode === "pill_minimalist" ? "Pills" : "Icons"}</span>
            </button>
          )}

          {/* Lineage Tracer Button */}
          <button
            onClick={() => setShowPathFinder(!showPathFinder)}
            className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold transition-all ${
              showPathFinder
                ? "border-teal-400 bg-teal-50 text-teal-700 shadow-2xs"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
            }`}
            title="Trace institutional dependency chain"
          >
            <Crosshair className="h-3 w-3 text-teal-600" />
            <span className="hidden sm:inline">Tracer</span>
          </button>

          {/* Camera Fit / Reset */}
          <button
            onClick={onFitGraph}
            className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-600 hover:bg-white transition-colors"
            title="Fit Graph to Screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onResetCamera}
            className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-slate-600 hover:bg-white transition-colors"
            title="Reset Camera Center"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Active Live Telemetry Pill */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2 py-1 text-[11px] font-semibold text-emerald-900">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
            </span>
            <span>{totalNodesCount || nodes.length} Nodes</span>
            <span className="text-emerald-400">•</span>
            <span>{totalEdgesCount || edges.length} Edges</span>
          </div>
        </div>
      </div>

      {/* Popdown: Lineage Dependency Tracer Panel */}
      {showPathFinder && (
        <div className="absolute top-12 right-4 z-40 w-96 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-teal-600" />
              <span className="text-xs font-bold text-slate-900">Knowledge Lineage Tracer</span>
            </div>
            <button
              onClick={() => setShowPathFinder(false)}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Source Entity (Anchor)
              </label>
              <select
                value={sourceId}
                onChange={(e) => {
                  setSourceId(e.target.value);
                  setTargetId("");
                }}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:bg-white focus:outline-hidden"
              >
                <option value="">Select origin entity...</option>
                {poolNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    [{n.category.toUpperCase()}] {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Target Entity (Destination)
              </label>
              <select
                value={targetId}
                disabled={!sourceId}
                onChange={(e) => setTargetId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 disabled:opacity-50 focus:bg-white focus:outline-hidden"
              >
                <option value="">
                  {sourceId ? "Select target entity..." : "First select a source..."}
                </option>
                {reachableTargets.map((n) => (
                  <option key={n.id} value={n.id}>
                    ({n.distance} hop{n.distance > 1 ? "s" : ""}) [{n.category.toUpperCase()}] {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleStartTrace}
                disabled={!sourceId || !targetId}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                <Route className="h-3.5 w-3.5" />
                <span>Calculate Shortest Path</span>
              </button>

              {activeTrace && onClearTrace && (
                <button
                  onClick={() => {
                    setSourceId("");
                    setTargetId("");
                    onClearTrace();
                    setShowPathFinder(false);
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
