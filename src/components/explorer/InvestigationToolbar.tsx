"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  GitFork,
  Compass,
  Move,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Crosshair,
  Route,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";
import { PathTraversalType, GraphLayoutAlgorithm, GraphNode, GraphEdge } from "@/lib/types";

interface InvestigationToolbarProps {
  traversalType: PathTraversalType;
  onTraversalChange: (type: PathTraversalType) => void;
  layoutAlgorithm: GraphLayoutAlgorithm;
  onLayoutChange: (layout: GraphLayoutAlgorithm) => void;
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
}

export function InvestigationToolbar({
  traversalType,
  onTraversalChange,
  layoutAlgorithm,
  onLayoutChange,
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
}: InvestigationToolbarProps) {
  const poolNodes = allNodes && allNodes.length > 0 ? allNodes : nodes;
  const poolEdges = allEdges && allEdges.length > 0 ? allEdges : edges;
  const [sourceId, setSourceId] = useState<string>("");
  const [targetId, setTargetId] = useState<string>("");
  const [showPathFinder, setShowPathFinder] = useState(false);

  // Dynamically compute reachable targets from sourceId using BFS on pool of all graph elements
  const reachableTargets = useMemo(() => {
    if (!sourceId) {
      return [];
    }
    if (!poolEdges || poolEdges.length === 0) {
      return poolNodes.filter((n) => n.id !== sourceId).map((n) => ({ ...n, distance: 1, relation: "CONNECTED" }));
    }

    // Bidirectional adjacency list with relationship labels
    const adj = new Map<string, Array<{ neighbor: string; relation: string }>>();
    for (const e of poolEdges) {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)!.push({ neighbor: e.target, relation: e.label });
      adj.get(e.target)!.push({ neighbor: e.source, relation: e.label });
    }

    // BFS to find all reachable nodes and their distance
    const distances = new Map<string, number>();
    const directRelations = new Map<string, string>();
    const queue: Array<{ id: string; dist: number }> = [{ id: sourceId, dist: 0 }];
    distances.set(sourceId, 0);

    while (queue.length > 0) {
      const { id, dist } = queue.shift()!;
      const neighbors = adj.get(id) || [];
      for (const { neighbor, relation } of neighbors) {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, dist + 1);
          if (dist === 0) {
            directRelations.set(neighbor, relation);
          }
          queue.push({ id: neighbor, dist: dist + 1 });
        }
      }
    }

    // Filter nodes that are reachable (distance > 0)
    return poolNodes
      .filter((n) => distances.has(n.id) && n.id !== sourceId)
      .map((n) => ({
        ...n,
        distance: distances.get(n.id) || 1,
        relation: directRelations.get(n.id) || "LINKED_TO",
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [sourceId, poolNodes, poolEdges]);

  // If targetId is no longer reachable from sourceId, automatically reset targetId
  useEffect(() => {
    if (sourceId && targetId) {
      const isReachable = reachableTargets.some((n) => n.id === targetId);
      if (!isReachable) {
        setTargetId("");
      }
    }
  }, [sourceId, reachableTargets, targetId]);

  const handleRunTrace = () => {
    if (sourceId && targetId) {
      onTracePath(sourceId, targetId);
    }
  };

  return (
    <div className="w-full border-b border-wbg-border bg-white/95 px-4 py-2.5 sm:px-6 shadow-xs backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Left: Investigation & Path Traversal Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Path Traversal Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <span className="px-2 font-bold text-wbg-slate-600 text-[10px] uppercase tracking-wider flex items-center gap-1">
              <GitFork className="h-3 w-3 text-wbg-sapphire" />
              <span className="hidden md:inline">Flow:</span>
            </span>
            {[
              {
                type: "out" as PathTraversalType,
                label: "Impact & Delivery",
                icon: "↘",
                hint: "Trace outward: projects, recipient countries, and technologies receiving funds",
              },
              {
                type: "in" as PathTraversalType,
                label: "Funding Origin",
                icon: "↖",
                hint: "Trace inward: multilateral facilities and authorizers who originated capital",
              },
              {
                type: "direct" as PathTraversalType,
                label: "Immediate Contacts",
                icon: "⊙",
                hint: "Show only directly touching entities (1-hop without cascades)",
              },
              {
                type: "all" as PathTraversalType,
                label: "Complete Ecosystem",
                icon: "🕸",
                hint: "Show entire interconnected cluster across both directions",
              },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => onTraversalChange(item.type)}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  traversalType === item.type
                    ? "bg-wbg-navy text-white shadow-2xs"
                    : "text-wbg-slate-600 hover:text-wbg-navy hover:bg-white"
                }`}
                title={item.hint}
              >
                <span className="text-[10px] opacity-70">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Layout Algorithm Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="hidden xl:inline text-wbg-slate-400 font-medium text-[11px]">Layout:</span>
            <select
              value={layoutAlgorithm}
              onChange={(e) => onLayoutChange(e.target.value as GraphLayoutAlgorithm)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-wbg-slate-700 font-medium focus:border-wbg-sapphire focus:bg-white focus:outline-hidden"
            >
              <option value="forceDirected2d">Dynamic Force Graph</option>
              <option value="hierarchicalTd">Hierarchical (Governance Flow)</option>
              <option value="circular2d">Circular Ring</option>
              <option value="radialOut2d">Radial Institutional Hub</option>
              <option value="treeLr2d">Pipeline Flow (Left-to-Right)</option>
            </select>
          </div>

          {/* Draggable Physics Toggle */}
          <button
            onClick={onToggleDraggable}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              isDraggable
                ? "border-sky-300 bg-sky-50 text-wbg-sapphire shadow-2xs"
                : "border-slate-200 bg-slate-50 text-wbg-slate-600 hover:bg-white"
            }`}
            title="Enable or disable physical dragging of nodes"
          >
            <Move className="h-3 w-3" />
            <span className="hidden sm:inline">Draggable</span>
          </button>

          {/* Curved vs Linear Edges */}
          <button
            onClick={onToggleEdgeInterpolation}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-wbg-slate-600 hover:bg-white transition-all"
            title="Toggle Curved vs Linear edge interpolation"
          >
            <Route className="h-3 w-3 text-slate-400" />
            <span className="capitalize">{edgeInterpolation}</span>
          </button>
        </div>

        {/* Right: Path Tracer, View Actions, & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Path Tracer Button */}
          <button
            onClick={() => setShowPathFinder(!showPathFinder)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              showPathFinder
                ? "border-wbg-sapphire bg-sky-50 text-wbg-sapphire shadow-2xs"
                : "border-slate-200 bg-slate-50 text-wbg-slate-700 hover:bg-white"
            }`}
            title="Find shortest dependency chain between two entities"
          >
            <Crosshair className="h-3 w-3 text-wbg-sapphire" />
            <span className="hidden md:inline">Dependency Tracer</span>
          </button>

          {/* Camera Fit / Reset */}
          <button
            onClick={onFitGraph}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-wbg-slate-600 hover:bg-white transition-colors"
            title="Fit Graph to View"
          >
            <Maximize2 className="h-3 w-3" />
          </button>

          <button
            onClick={onResetCamera}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-wbg-slate-600 hover:bg-white transition-colors"
            title="Reset Camera Center"
          >
            <RotateCcw className="h-3 w-3" />
          </button>

          {/* Theme Toggle (Light Atlas vs Cyber Dark) */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
              themeMode === "dark"
                ? "border-slate-700 bg-slate-900 text-sky-400"
                : "border-slate-200 bg-white text-wbg-slate-700 hover:bg-slate-50"
            }`}
            title={themeMode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {themeMode === "dark" ? (
              <>
                <Moon className="h-3 w-3 text-sky-400" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="h-3 w-3 text-amber-500" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Slide-Down Evidence Path Tracer Modal/Bar with Quick Story Presets */}
      {showPathFinder && (
        <div className="mt-2.5 rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-xs transition-all animate-in fade-in duration-150 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-wbg-navy flex items-center gap-1">
                <Crosshair className="h-3.5 w-3.5 text-wbg-sapphire" />
                Institutional Dependency Tracer
              </span>
              <span className="text-[11px] text-wbg-slate-500">
                Trace the direct institutional linkage between any two entities:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="max-w-[220px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-wbg-slate-800 font-medium"
              >
                <option value="">Select Origin Entity...</option>
                {["project", "country", "ministry", "tech", "policy", "discrepancy"].map((cat) => {
                  const catNodes = poolNodes.filter((n) => n.category === cat);
                  if (catNodes.length === 0) return null;
                  return (
                    <optgroup key={cat} label={cat.toUpperCase()}>
                      {catNodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label.slice(0, 36)}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>

              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />

              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                disabled={!sourceId}
                className="max-w-[260px] rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-wbg-slate-800 disabled:opacity-50 font-medium"
              >
                <option value="">
                  {!sourceId
                    ? "Select Origin First..."
                    : reachableTargets.length === 0
                    ? "No connected targets found"
                    : `Select Target (${reachableTargets.length} connected)...`}
                </option>
                {/* 1-Hop Direct Neighbors */}
                {reachableTargets.some((n) => n.distance === 1) && (
                  <optgroup label="🌟 DIRECT RELATIONSHIPS (1 HOP)">
                    {reachableTargets
                      .filter((n) => n.distance === 1)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          [{n.category.toUpperCase()}] {n.label.slice(0, 24)} ({n.relation})
                        </option>
                      ))}
                  </optgroup>
                )}
                {/* Multi-Hop Connected Lineage */}
                {reachableTargets.some((n) => n.distance > 1) && (
                  <optgroup label="🔗 EXTENDED LINEAGE (MULTI-HOP)">
                    {reachableTargets
                      .filter((n) => n.distance > 1)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          [{n.category.toUpperCase()}] {n.label.slice(0, 24)} ({n.distance} hops)
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>

              <button
                onClick={handleRunTrace}
                disabled={!sourceId || !targetId}
                className="rounded-lg bg-wbg-navy px-3 py-1 text-xs font-semibold text-white hover:bg-[#001730] disabled:opacity-50 transition-all shadow-xs"
              >
                Trace Linkage
              </button>

              {activeTrace && onClearTrace && (
                <button
                  onClick={() => {
                    setSourceId("");
                    setTargetId("");
                    onClearTrace();
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-wbg-slate-600 hover:bg-slate-50 transition-all"
                >
                  Clear Trace
                </button>
              )}
            </div>
          </div>

          {/* Quick-Start Discovery Presets */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-sky-200/60 pt-2 text-[11px]">
            <span className="font-bold uppercase tracking-wider text-wbg-sapphire text-[10px]">
              Story Presets:
            </span>
            <button
              onClick={() => {
                const proj = poolNodes.find((n) => n.id === "PROJ_P176181" || n.label.includes("Digital"));
                const ministry = poolNodes.find((n) => n.id.includes("EASTERN_AND_SOUTHERN_AFRICA") || n.label.includes("ICT"));
                if (proj && ministry) {
                  setSourceId(proj.id);
                  setTargetId(ministry.id);
                  onTracePath(proj.id, ministry.id);
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-0.5 font-medium text-wbg-navy hover:bg-sky-100 hover:border-sky-300 transition-all"
            >
              <span>⚡</span>
              <span>Eastern Africa Digital Flow</span>
            </button>
            <button
              onClick={() => {
                const ibrd = poolNodes.find((n) => n.id === "ORG_IBRD");
                const solarProj = poolNodes.find((n) => n.id === "PROJ_P154283" || n.label.includes("Solar"));
                if (ibrd && solarProj) {
                  setSourceId(ibrd.id);
                  setTargetId(solarProj.id);
                  onTracePath(ibrd.id, solarProj.id);
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-white px-2 py-0.5 font-medium text-wbg-navy hover:bg-sky-100 hover:border-sky-300 transition-all"
            >
              <span>☀️</span>
              <span>India Clean Energy Pipeline</span>
            </button>
            <button
              onClick={() => {
                const disc = poolNodes.find((n) => n.category === "discrepancy" || n.id === "DISC_P174350");
                const proj = poolNodes.find((n) => n.id === "PROJ_P174350");
                if (disc && proj) {
                  setSourceId(disc.id);
                  setTargetId(proj.id);
                  onTracePath(disc.id, proj.id);
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-2 py-0.5 font-medium text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-all"
            >
              <span>🚨</span>
              <span>Audit Variance Lineage</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
