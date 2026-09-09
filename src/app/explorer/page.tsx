"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { GraphCanvasRef } from "reagraph";
import { GraphData, GraphNode, FilterState, PathTraversalType, GraphLayoutAlgorithm, EntityCategory } from "@/lib/types";
import { buildKnowledgeGraph, findShortestPath, computeTracedPathData } from "@/lib/graphBuilder";
import { VERIFIED_PROJECT_DOSSIERS } from "@/lib/wbgApi";
import { MitreMatrixBar } from "@/components/explorer/MitreMatrixBar";
import { FacetedFilters } from "@/components/explorer/FacetedFilters";
import { InvestigationToolbar } from "@/components/explorer/InvestigationToolbar";
import { GraphCanvasClient } from "@/components/explorer/GraphCanvasClient";
import { EntityInspector } from "@/components/explorer/EntityInspector";
import { ShieldCheck, Activity, Database, AlertTriangle, Layers, Maximize2 } from "lucide-react";

export default function ExplorerPage() {
  const graphRef = useRef<GraphCanvasRef | null>(null);

  // Raw Graph Data
  const [rawGraphData, setRawGraphData] = useState<GraphData>(() => buildKnowledgeGraph(VERIFIED_PROJECT_DOSSIERS));
  const [isLoading, setIsLoading] = useState(true);

  // Investigation & Traversal Controls
  const [traversalType, setTraversalType] = useState<PathTraversalType>("out");
  const [layoutAlgorithm, setLayoutAlgorithm] = useState<GraphLayoutAlgorithm>("forceDirected2d");
  const [isDraggable, setIsDraggable] = useState(true);
  const [edgeInterpolation, setEdgeInterpolation] = useState<"curved" | "linear">("curved");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Selection & Dossier State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [pathTraceTarget, setPathTraceTarget] = useState<{ source: string; target: string } | null>(null);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);

  // Mitre Tactical Stage Filter (null = all stages)
  const [selectedTacticCategory, setSelectedTacticCategory] = useState<EntityCategory | null>(null);

  // Faceted Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedSector: "",
    selectedRegion: "",
    selectedCategories: ["project", "country", "ministry", "tech", "policy", "discrepancy"],
    minCommitmentM: 0,
    verifiedOnly: false,
  });

  // Fetch live API data on mount
  useEffect(() => {
    async function loadGraph() {
      try {
        const res = await fetch("/api/graph");
        if (res.ok) {
          const data = await res.json();
          if (data && data.nodes && data.nodes.length > 0) {
            setRawGraphData(data);
          }
        }
      } catch (e) {
        console.warn("Using fallback local knowledge graph data:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadGraph();
  }, []);

  // Quick lookup map for nodes
  const nodesMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const n of rawGraphData.nodes) {
      map.set(n.id, n);
    }
    return map;
  }, [rawGraphData.nodes]);

  // Counts per entity category
  const nodeCounts = useMemo(() => {
    const counts: Record<EntityCategory, number> = {
      project: 0,
      country: 0,
      ministry: 0,
      tech: 0,
      policy: 0,
      discrepancy: 0,
    };
    for (const n of rawGraphData.nodes) {
      if (counts[n.category] !== undefined) {
        counts[n.category]++;
      }
    }
    return counts;
  }, [rawGraphData.nodes]);

  // Filtered nodes and edges based on filters + MITRE tactic bar
  const { filteredNodes, filteredEdges } = useMemo(() => {
    let nodes = [...rawGraphData.nodes];

    // 1. Filter by MITRE tactic category if active
    if (selectedTacticCategory) {
      nodes = nodes.filter((n) => n.category === selectedTacticCategory);
    } else {
      // Filter by standard faceted categories
      if (filters.selectedCategories.length < 6) {
        nodes = nodes.filter((n) => filters.selectedCategories.includes(n.category));
      }
    }

    // 2. Filter by search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      nodes = nodes.filter(
        (n) =>
          n.label.toLowerCase().includes(q) ||
          n.id.toLowerCase().includes(q) ||
          (n.region && n.region.toLowerCase().includes(q)) ||
          (n.sector && n.sector.toLowerCase().includes(q))
      );
    }

    // 3. Filter by sector
    if (filters.selectedSector) {
      nodes = nodes.filter((n) => n.sector === filters.selectedSector || n.category === "country" || n.category === "ministry");
    }

    // 4. Filter by region
    if (filters.selectedRegion) {
      nodes = nodes.filter((n) => n.region === filters.selectedRegion || n.organization);
    }

    // Always guarantee that if a node is selected, it is present in filteredNodes so Reagraph never crashes
    if (selectedNodeId && nodesMap.has(selectedNodeId)) {
      const selected = nodesMap.get(selectedNodeId)!;
      if (!nodes.some((n) => n.id === selectedNodeId)) {
        nodes.push(selected);
      }
    }

    // 5. Always guarantee that if a path trace is active, ALL nodes along the path are present in the canvas!
    if (pathTraceTarget?.source && pathTraceTarget?.target) {
      const path = findShortestPath(rawGraphData.edges, pathTraceTarget.source, pathTraceTarget.target);
      if (path) {
        for (const nid of path.nodeIds) {
          if (!nodes.some((n) => n.id === nid) && nodesMap.has(nid)) {
            nodes.push(nodesMap.get(nid)!);
          }
        }
      }
    }

    const activeNodeIds = new Set(nodes.map((n) => n.id));

    // Filter edges to only include ones connecting active nodes
    let edges = rawGraphData.edges.filter(
      (e) => activeNodeIds.has(e.source) && activeNodeIds.has(e.target)
    );

    // 6. Guarantee that path edges are also included in the canvas
    if (pathTraceTarget?.source && pathTraceTarget?.target) {
      const path = findShortestPath(rawGraphData.edges, pathTraceTarget.source, pathTraceTarget.target);
      if (path) {
        const pathEdgeSet = new Set(path.edgeIds);
        const missingPathEdges = rawGraphData.edges.filter(
          (e) => pathEdgeSet.has(e.id) && !edges.some((ex) => ex.id === e.id)
        );
        edges = [...edges, ...missingPathEdges];
      }
    }

    return { filteredNodes: nodes, filteredEdges: edges };
  }, [rawGraphData, filters, selectedTacticCategory, selectedNodeId, nodesMap, pathTraceTarget]);

  // Compute rich lineage trace data for the inspector panel
  const tracedPathData = useMemo(() => {
    if (!pathTraceTarget?.source || !pathTraceTarget?.target) return null;
    return computeTracedPathData(
      rawGraphData.edges,
      nodesMap,
      pathTraceTarget.source,
      pathTraceTarget.target
    );
  }, [pathTraceTarget, rawGraphData.edges, nodesMap]);

  const selectedNode = selectedNodeId ? nodesMap.get(selectedNodeId) || null : null;

  // Safe Node Selection: handles cross-category jumps smoothly
  const handleSelectNode = (nodeId: string | null) => {
    if (nodeId) {
      const target = nodesMap.get(nodeId);
      if (target && selectedTacticCategory && target.category !== selectedTacticCategory) {
        // Automatically relax category filter so the selected connected entity and its links are visible
        setSelectedTacticCategory(null);
      }
      setIsInspectorCollapsed(false);
    }
    setSelectedNodeId(nodeId);
  };

  // Handlers
  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      selectedSector: "",
      selectedRegion: "",
      selectedCategories: ["project", "country", "ministry", "tech", "policy", "discrepancy"],
      minCommitmentM: 0,
      verifiedOnly: false,
    });
    setSelectedTacticCategory(null);
  };

  const handleTracePath = (sourceId: string, targetId: string) => {
    setPathTraceTarget({ source: sourceId, target: targetId });
    setSelectedNodeId(null);
    setIsInspectorCollapsed(false);
  };

  const handleClearTrace = () => {
    setPathTraceTarget(null);
  };

  const handleSetTraceEndpoint = (nodeId: string, role: "source" | "target") => {
    if (role === "source") {
      setPathTraceTarget((prev) => ({ source: nodeId, target: prev?.target || "" }));
    } else {
      setPathTraceTarget((prev) => ({ source: prev?.source || "", target: nodeId }));
    }
    setIsInspectorCollapsed(false);
  };

  const handleFitGraph = () => {
    try {
      if (graphRef.current?.fitNodesInView) {
        graphRef.current.fitNodesInView();
      }
    } catch {
      // Safe fallback
    }
  };

  const handleResetCamera = () => {
    try {
      if (graphRef.current?.centerGraph) {
        graphRef.current.centerGraph();
      }
    } catch {
      // Safe fallback
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-104px)] w-full overflow-hidden ${themeMode === "dark" ? "bg-[#090d16]" : "bg-wbg-porcelain"}`}>
      {/* 1. Top MITRE Tactical Matrix Bar */}
      <MitreMatrixBar
        selectedCategory={selectedTacticCategory}
        onSelectCategory={setSelectedTacticCategory}
        nodeCounts={nodeCounts}
        onInspectDiscrepancies={() => {
          setSelectedTacticCategory("discrepancy");
        }}
      />

      {/* 2. Faceted Search & Dimension Filters */}
      <FacetedFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalNodes={rawGraphData.nodes.length}
        filteredNodesCount={filteredNodes.length}
        totalEdges={filteredEdges.length}
      />

      {/* 3. Cyber Investigation & MITRE Tools Toolbar */}
      <InvestigationToolbar
        traversalType={traversalType}
        onTraversalChange={setTraversalType}
        layoutAlgorithm={layoutAlgorithm}
        onLayoutChange={setLayoutAlgorithm}
        isDraggable={isDraggable}
        onToggleDraggable={() => setIsDraggable(!isDraggable)}
        edgeInterpolation={edgeInterpolation}
        onToggleEdgeInterpolation={() =>
          setEdgeInterpolation(edgeInterpolation === "curved" ? "linear" : "curved")
        }
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
        nodes={filteredNodes}
        edges={filteredEdges}
        allNodes={rawGraphData.nodes}
        allEdges={rawGraphData.edges}
        activeTrace={pathTraceTarget}
        onClearTrace={handleClearTrace}
        onTracePath={handleTracePath}
        onResetCamera={handleResetCamera}
        onFitGraph={handleFitGraph}
        selectedNodeId={selectedNodeId}
      />

      {/* 4. Main WebGL Knowledge Graph Workspace (Full-Bleed Canvas with Elevated In-Graph Floating Card) */}
      <div className="relative flex-1 w-full h-full min-h-[500px] overflow-hidden bg-slate-50/50">
        {/* Master: Full-Bleed Interactive Knowledge Graph Canvas */}
        <div className="absolute inset-0 z-0">
          <GraphCanvasClient
            nodes={filteredNodes}
            edges={filteredEdges}
            traversalType={traversalType}
            layoutAlgorithm={layoutAlgorithm}
            isDraggable={isDraggable}
            edgeInterpolation={edgeInterpolation}
            themeMode={themeMode}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            onHoverNode={setHoveredNodeId}
            graphRef={graphRef}
            pathTraceTarget={pathTraceTarget}
          />
        </div>

        {/* Floating Bottom HUD Status Bar */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-1.5 text-xs text-wbg-navy shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
            </span>
            <span className="font-semibold text-wbg-navy">World Bank Operational Graph</span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-medium text-wbg-slate-500">
              {filteredNodes.length} Entities • {filteredEdges.length} Links
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-semibold text-wbg-sapphire uppercase tracking-tight">
              Flow: {traversalType === "out" ? "Impact & Delivery" : traversalType === "in" ? "Funding Origin" : traversalType === "direct" ? "Immediate Contacts" : "Complete Ecosystem"}
            </span>
          </div>

          {pathTraceTarget?.source && pathTraceTarget?.target && (
            <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50/95 px-3 py-1.5 text-xs text-amber-900 font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>Traced:</span>
              <span className="text-[10px] font-bold text-amber-950 tracking-tight">
                {tracedPathData
                  ? `${tracedPathData.source.label.slice(0, 16)} ➔ ${tracedPathData.target.label.slice(0, 16)} (${tracedPathData.hops.length - 1} hops)`
                  : `${pathTraceTarget.source.slice(0, 12)} ➔ ${pathTraceTarget.target.slice(0, 12)}`}
              </span>
              <button
                onClick={handleClearTrace}
                className="ml-1 text-amber-700 hover:text-rose-700 text-[10px] font-bold"
                title="Clear Trace"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Elevated Floating Inspection & Portfolio Card inside the graph window */}
        <div
          className={`pointer-events-auto absolute top-4 right-4 z-20 flex flex-col transition-all duration-300 ${
            isInspectorCollapsed
              ? "bottom-auto w-auto"
              : "bottom-4 w-[380px] lg:w-[410px] xl:w-[440px] max-w-[calc(100vw-2rem)]"
          }`}
        >
          {isInspectorCollapsed ? (
            <button
              onClick={() => setIsInspectorCollapsed(false)}
              className="group flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-2.5 text-xs font-bold text-wbg-navy shadow-xl backdrop-blur-md hover:bg-slate-50 hover:shadow-2xl transition-all"
              title="Expand Intelligence Panel"
            >
              <span
                className={`flex h-2 w-2 rounded-full ${
                  tracedPathData ? "bg-amber-500 animate-ping" : "bg-wbg-sapphire animate-pulse"
                }`}
              ></span>
              <span>
                {selectedNode
                  ? selectedNode.label.slice(0, 24) + "..."
                  : tracedPathData
                  ? `Lineage Trace (${tracedPathData.hops.length - 1} Hops)`
                  : "Portfolio Overview"}
              </span>
              <Maximize2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-wbg-sapphire transition-colors" />
            </button>
          ) : (
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-slate-900/15 backdrop-blur-xl">
              {/* Category Glow Accent Line on Top */}
              <div
                className={`h-1.5 w-full shrink-0 ${
                  tracedPathData && !selectedNode
                    ? "bg-amber-500 shadow-sm"
                    : selectedNode?.category === "project"
                    ? "bg-sky-500"
                    : selectedNode?.category === "country"
                    ? "bg-cyan-600"
                    : selectedNode?.category === "ministry"
                    ? "bg-purple-600"
                    : selectedNode?.category === "tech"
                    ? "bg-emerald-600"
                    : selectedNode?.category === "discrepancy"
                    ? "bg-rose-600"
                    : "bg-wbg-sapphire"
                }`}
              />

              <EntityInspector
                node={selectedNode}
                edges={rawGraphData.edges}
                nodesMap={nodesMap}
                tracedPath={tracedPathData}
                onClearTrace={handleClearTrace}
                onClose={() => handleSelectNode(null)}
                onSelectNode={handleSelectNode}
                onSetTraceEndpoint={handleSetTraceEndpoint}
                onCollapse={() => setIsInspectorCollapsed(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
