"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { FacetedFilters } from "./FacetedFilters";
import { EntityInspector } from "./EntityInspector";
import { GraphData, GraphNode, GraphEdge, FilterState, EntityCategory } from "@/lib/types";
import { VERIFIED_PROJECT_DOSSIERS } from "@/lib/wbgApi";
import { buildKnowledgeGraph } from "@/lib/graphBuilder";
import { Loader2 } from "lucide-react";

// Dynamic Client-Only Import of ReagraphCanvas with ssr: false
const ReagraphCanvas = dynamic(
  () => import("./ReagraphCanvas").then((mod) => mod.ReagraphCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center bg-porcelain-grid">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-xs">
          <Loader2 className="h-4 w-4 animate-spin text-wbg-sapphire" />
          <span className="text-xs font-semibold text-wbg-navy">
            Initializing WebGL 2D Planar Engine...
          </span>
        </div>
      </div>
    ),
  }
);

export function GraphCockpit() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  // Initial full graph data
  const [graphData, setGraphData] = useState<GraphData>(() =>
    buildKnowledgeGraph(VERIFIED_PROJECT_DOSSIERS)
  );

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialQuery,
    selectedSector: "",
    selectedRegion: "",
    selectedCategories: ["project", "country", "ministry", "tech", "policy"],
    minCommitmentM: 0,
    verifiedOnly: false,
  });

  // Map of all nodes for rapid lookup in Inspector
  const nodesMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    for (const n of graphData.nodes) {
      map.set(n.id, n);
    }
    return map;
  }, [graphData.nodes]);

  // Apply filters
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter((node) => {
      // Category filter
      if (!filters.selectedCategories.includes(node.category)) {
        return false;
      }

      // Region filter
      if (filters.selectedRegion && node.region !== filters.selectedRegion) {
        return false;
      }

      // Sector filter
      if (filters.selectedSector && node.sector !== filters.selectedSector) {
        return false;
      }

      // Search Query filter
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchLabel = node.label.toLowerCase().includes(q);
        const matchId = node.id.toLowerCase().includes(q);
        const matchRegion = node.region?.toLowerCase().includes(q);
        const matchSector = node.sector?.toLowerCase().includes(q);
        if (!matchLabel && !matchId && !matchRegion && !matchSector) {
          return false;
        }
      }

      return true;
    });
  }, [graphData.nodes, filters]);

  // Keep edges that connect between filtered nodes
  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return graphData.edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
  }, [graphData.edges, filteredNodes]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      selectedSector: "",
      selectedRegion: "",
      selectedCategories: ["project", "country", "ministry", "tech", "policy"],
      minCommitmentM: 0,
      verifiedOnly: false,
    });
  };

  const handleSelectNodeById = (nodeId: string) => {
    const found = nodesMap.get(nodeId);
    if (found) {
      setSelectedNode(found);
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-100px)] w-full flex-col overflow-hidden bg-wbg-porcelain">
      {/* 1. Faceted Filters Bar */}
      <FacetedFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalNodes={graphData.nodes.length}
        filteredNodesCount={filteredNodes.length}
        totalEdges={filteredEdges.length}
      />

      {/* 2. Main Canvas & Inspector Area */}
      <div className="relative flex-1 w-full flex flex-col lg:flex-row overflow-hidden">
        <div className="relative flex-1 h-full min-w-0">
          <ReagraphCanvas
            nodes={filteredNodes}
            edges={filteredEdges}
            selectedNodeId={selectedNode?.id || null}
            onSelectNode={setSelectedNode}
          />
        </div>

        {/* 3. Integrated Entity Inspector & Portfolio Pane */}
        <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0 h-full border-l border-wbg-border bg-white flex flex-col z-10">
          <EntityInspector
            node={selectedNode}
            edges={graphData.edges}
            nodesMap={nodesMap}
            onClose={() => setSelectedNode(null)}
            onSelectNode={handleSelectNodeById}
          />
        </div>
      </div>
    </div>
  );
}
