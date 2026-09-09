"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  GraphCanvas,
  GraphCanvasRef,
  Theme,
  lightTheme,
  GraphNode as RNode,
  GraphEdge as REdge,
  useSelection,
} from "reagraph";
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Layers, Eye } from "lucide-react";
import { GraphNode, GraphEdge } from "@/lib/types";

interface ReagraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
}

const lightAtlasTheme: Theme = {
  ...lightTheme,
  canvas: {
    background: "#f8fafc",
  },
  node: {
    fill: "#0284c7",
    activeFill: "#0071bc",
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.15,
    label: {
      color: "#0f172a",
      stroke: "#f8fafc",
      activeColor: "#002244",
    },
    subLabel: {
      color: "#64748b",
      stroke: "#f8fafc",
      activeColor: "#0071bc",
    },
  },
  ring: {
    fill: "#0071bc",
    activeFill: "#002244",
  },
  edge: {
    fill: "#64748b",
    activeFill: "#0284c7",
    opacity: 0.75,
    selectedOpacity: 1,
    inactiveOpacity: 0.15,
    label: {
      stroke: "#f8fafc",
      color: "#475569",
      activeColor: "#0f172a",
      fontSize: 6,
    },
  },
  arrow: {
    fill: "#64748b",
    activeFill: "#0284c7",
  },
  lasso: {
    border: "1px solid #0071bc",
    background: "rgba(0, 113, 188, 0.1)",
  },
  cluster: {
    stroke: "#e2e8f0",
    opacity: 1,
    selectedOpacity: 1,
    inactiveOpacity: 0.15,
    label: {
      stroke: "#f8fafc",
      color: "#0f172a",
    },
  },
};

export function ReagraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}: ReagraphCanvasProps) {
  const graphRef = useRef<GraphCanvasRef | null>(null);
  const [cameraMode, setCameraMode] = useState<"pan" | "orbit">("pan");

  // Format nodes for Reagraph with distinct category colors and sizes
  const reagraphNodes: RNode[] = useMemo(() => {
    return nodes.map((n) => {
      let fill = "#0284c7";
      let size = 12;

      switch (n.category) {
        case "project":
          fill = "#0284c7";
          size = 18;
          break;
        case "country":
          fill = "#0891b2";
          size = 22;
          break;
        case "ministry":
          fill = "#7c3aed";
          size = 16;
          break;
        case "tech":
          fill = "#059669";
          size = 14;
          break;
        case "policy":
          fill = "#d97706";
          size = 13;
          break;
      }

      // If this node is an institutional org
      if (n.id.startsWith("ORG_")) {
        fill = "#002244";
        size = 26;
      }

      return {
        id: n.id,
        label: n.label,
        subLabel: n.category.toUpperCase(),
        size,
        fill,
        data: n,
      };
    });
  }, [nodes]);

  // Format edges for Reagraph
  const reagraphEdges: REdge[] = useMemo(() => {
    return edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      size: 2.5,
      fill: "#64748b",
      data: e,
    }));
  }, [edges]);

  // 1-Click Interactive Path Illumination
  const { selections, actives, onNodeClick, onCanvasClick } = useSelection({
    ref: graphRef,
    nodes: reagraphNodes,
    edges: reagraphEdges,
    pathSelectionType: "out",
    pathHoverType: "out",
    focusOnSelect: true,
    selections: selectedNodeId ? [selectedNodeId] : [],
    onSelection: (selectedIds) => {
      if (selectedIds.length > 0) {
        const found = nodes.find((n) => n.id === selectedIds[0]);
        if (found) {
          onSelectNode(found);
          return;
        }
      }
      onSelectNode(null);
    },
  });

  const handleCenterGraph = () => {
    if (graphRef.current) {
      graphRef.current.centerGraph();
    }
  };

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoomOut();
    }
  };

  return (
    <div className="relative h-full w-full bg-porcelain-grid overflow-hidden">
      {/* Reagraph WebGL Canvas */}
      <div className="h-full w-full">
        <GraphCanvas
          ref={graphRef}
          nodes={reagraphNodes}
          edges={reagraphEdges}
          theme={lightAtlasTheme}
          cameraMode={cameraMode}
          layoutType="forceDirected2d"
          edgeInterpolation="curved"
          edgeArrowPosition="end"
          selections={selections}
          actives={actives}
          onNodeClick={onNodeClick}
          onCanvasClick={onCanvasClick}
          labelType="all"
          defaultNodeSize={14}
          minNodeSize={10}
          maxNodeSize={28}
        />
      </div>

      {/* Top-Right HUD Controls Pill */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-lifted backdrop-blur-md">
        {/* Camera Mode Toggle */}
        <button
          onClick={() => setCameraMode(cameraMode === "pan" ? "orbit" : "pan")}
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
            cameraMode === "pan"
              ? "bg-slate-100 text-wbg-navy"
              : "bg-sky-50 text-wbg-sapphire"
          }`}
          title="Toggle 2D Planar vs 3D Orbit Mode"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>{cameraMode === "pan" ? "2D Planar" : "3D Orbit"}</span>
        </button>

        <div className="h-4 w-px bg-slate-200"></div>

        {/* Zoom Controls */}
        <button
          onClick={handleZoomIn}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-wbg-slate-600 hover:bg-slate-100 hover:text-wbg-navy transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={handleZoomOut}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-wbg-slate-600 hover:bg-slate-100 hover:text-wbg-navy transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-200"></div>

        {/* Instant Center Graph */}
        <button
          onClick={handleCenterGraph}
          className="flex items-center gap-1 rounded-xl bg-wbg-navy px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#001730] active:scale-[0.98] transition-all shadow-xs"
          title="Recenter and Fit View"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Center Graph</span>
        </button>
      </div>

      {/* Bottom-Left Legend HUD */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/95 px-3.5 py-2 text-[11px] font-medium text-wbg-slate-700 shadow-lifted backdrop-blur-md">
        <span className="font-semibold text-wbg-navy text-[10px] uppercase tracking-wider">
          Entity Keys:
        </span>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#0891b2]"></span>
          <span>Country</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#0284c7]"></span>
          <span>Operation</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#7c3aed]"></span>
          <span>Ministry / Bank</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#059669]"></span>
          <span>Technology</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#d97706]"></span>
          <span>Policy</span>
        </div>
      </div>
    </div>
  );
}
