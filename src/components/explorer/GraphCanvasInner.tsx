"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import "@/lib/threePolyfill";
import {
  GraphCanvas,
  useSelection,
  darkTheme,
  lightTheme,
  GraphCanvasRef,
  Theme,
} from "reagraph";
import { GraphNode, GraphEdge, PathTraversalType, GraphLayoutAlgorithm } from "@/lib/types";
import { getNodeIcon } from "@/lib/investigationIcons";
import { findShortestPath } from "@/lib/graphBuilder";

export interface GraphCanvasInnerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  traversalType: PathTraversalType;
  layoutAlgorithm: GraphLayoutAlgorithm;
  isDraggable: boolean;
  edgeInterpolation: "curved" | "linear";
  themeMode: "light" | "dark";
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode?: (nodeId: string | null) => void;
  graphRef: React.RefObject<GraphCanvasRef | null>;
  pathTraceTarget?: { source: string; target: string } | null;
}

const lightAtlasTheme: Theme = {
  canvas: {
    background: "#f8fafc",
  },
  node: {
    fill: "#0284c7",
    activeFill: "#002244",
    opacity: 0.95,
    selectedOpacity: 1,
    inactiveOpacity: 0.22,
    label: {
      color: "#002244",
      activeColor: "#0071bc",
    },
  },
  ring: {
    fill: "#38bdf8",
    activeFill: "#0284c7",
  },
  edge: {
    fill: "#94a3b8",
    activeFill: "#f59e0b",
    opacity: 0.65,
    selectedOpacity: 1,
    inactiveOpacity: 0.15,
    label: {
      color: "#475569",
      activeColor: "#002244",
      fontSize: 5,
    },
  },
  arrow: {
    fill: "#64748b",
    activeFill: "#f59e0b",
  },
  lasso: {
    background: "rgba(0, 113, 188, 0.1)",
    border: "#0071bc",
  },
};

const cyberDarkTheme: Theme = {
  canvas: {
    background: "#090d16",
  },
  node: {
    fill: "#0284c7",
    activeFill: "#38bdf8",
    opacity: 0.95,
    selectedOpacity: 1,
    inactiveOpacity: 0.2,
    label: {
      color: "#e2e8f0",
      activeColor: "#38bdf8",
    },
  },
  ring: {
    fill: "#0284c7",
    activeFill: "#38bdf8",
  },
  edge: {
    fill: "#334155",
    activeFill: "#38bdf8",
    opacity: 0.6,
    selectedOpacity: 1,
    inactiveOpacity: 0.15,
    label: {
      color: "#94a3b8",
      activeColor: "#38bdf8",
      fontSize: 5,
    },
  },
  arrow: {
    fill: "#475569",
    activeFill: "#38bdf8",
  },
  lasso: {
    background: "rgba(56, 189, 248, 0.15)",
    border: "#38bdf8",
  },
};

export default function GraphCanvasInner({
  nodes,
  edges,
  traversalType,
  layoutAlgorithm,
  isDraggable,
  edgeInterpolation,
  themeMode,
  selectedNodeId,
  onSelectNode,
  onHoverNode,
  graphRef,
  pathTraceTarget,
}: GraphCanvasInnerProps) {
  const [customPathActives, setCustomPathActives] = useState<string[] | null>(null);

  // Format nodes and edges for Reagraph with dynamic path highlighting
  const formattedNodes = useMemo(() => {
    return nodes.map((node) => {
      const isPathNode = customPathActives?.includes(node.id);
      const baseSize =
        node.category === "project" ? 9 : node.category === "country" ? 11 : node.category === "discrepancy" ? 10 : 8;
      return {
        id: node.id,
        label: node.label,
        icon: (node as any).icon || getNodeIcon(node.category, node.subType || (node as any).organization),
        fill: isPathNode ? (themeMode === "dark" ? "#f59e0b" : "#0284c7") : (node as any).fill,
        cluster: (node as any).cluster,
        data: (node as any).data || node.metadata,
        size: isPathNode ? baseSize + 4 : baseSize,
      };
    });
  }, [nodes, customPathActives, themeMode]);

  const formattedEdges = useMemo(() => {
    return edges.map((edge) => {
      const isPathEdge = customPathActives?.includes(edge.id);
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: isPathEdge
          ? `${edge.label}${edge.financingAmountM ? ` ($${edge.financingAmountM}M)` : ""}`
          : edge.label,
        fill: isPathEdge
          ? "#f59e0b"
          : edge.label === "FLAGGED_IN"
          ? "#dc2626"
          : edge.label === "FINANCES"
          ? "#0284c7"
          : "#94a3b8",
        size: isPathEdge ? 4.0 : edge.label === "FLAGGED_IN" ? 2.5 : 1.8,
      };
    });
  }, [edges, customPathActives]);

  // Reagraph useSelection Hook
  const {
    selections,
    actives,
    onNodeClick,
    onCanvasClick,
    onNodePointerOver,
    onNodePointerOut,
    clearSelections,
    setSelections,
  } = useSelection({
    ref: graphRef,
    nodes: formattedNodes,
    edges: formattedEdges,
    pathSelectionType: traversalType,
    pathHoverType: "out",
    focusOnSelect: true,
  });

  // Handle external selection prop change (e.g. from table or dossier) safely
  useEffect(() => {
    // If path tracing is active, DO NOT clear selections or override with single node
    if (pathTraceTarget?.source && pathTraceTarget?.target) {
      return;
    }
    if (selectedNodeId) {
      const existsInCanvas = formattedNodes.some((n) => n.id === selectedNodeId);
      if (existsInCanvas) {
        if (!selections.includes(selectedNodeId)) {
          setSelections([selectedNodeId]);
        }
      } else if (selections.length > 0) {
        clearSelections();
      }
    } else if (selections.length > 0) {
      clearSelections();
    }
  }, [selectedNodeId, formattedNodes, selections, setSelections, clearSelections, pathTraceTarget]);

  // Handle path trace request safely with custom BFS pathfinder and auto camera framing
  useEffect(() => {
    if (pathTraceTarget?.source && pathTraceTarget?.target) {
      const sourceExists = nodes.some((n) => n.id === pathTraceTarget.source);
      const targetExists = nodes.some((n) => n.id === pathTraceTarget.target);
      if (sourceExists && targetExists) {
        const path = findShortestPath(edges, pathTraceTarget.source, pathTraceTarget.target);
        if (path) {
          setSelections(path.nodeIds);
          setCustomPathActives([...path.nodeIds, ...path.edgeIds]);
          // Auto-frame camera on the lineage path
          setTimeout(() => {
            try {
              if (graphRef.current?.fitNodesInView) {
                graphRef.current.fitNodesInView(path.nodeIds);
              }
            } catch {
              // Safe fallback
            }
          }, 150);
        } else {
          // Graceful fallback for disconnected nodes
          setSelections([pathTraceTarget.source, pathTraceTarget.target]);
          setCustomPathActives([pathTraceTarget.source, pathTraceTarget.target]);
        }
      }
    } else {
      setCustomPathActives(null);
    }
  }, [pathTraceTarget, nodes, edges, setSelections, graphRef]);

  // Active state masking: prioritize custom path tracer; when node is selected, use reagraph actives
  const effectiveActives = customPathActives
    ? customPathActives
    : selections.length > 0
    ? actives
    : undefined;

  const currentTheme = themeMode === "dark" ? cyberDarkTheme : lightAtlasTheme;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <GraphCanvas
        ref={graphRef as any}
        nodes={formattedNodes}
        edges={formattedEdges}
        selections={selections}
        actives={effectiveActives}
        theme={currentTheme}
        draggable={isDraggable}
        layoutType={layoutAlgorithm}
        layoutOverrides={{
          linkDistance: 190,
          nodeStrength: -850,
          clusterStrength: 0.8,
        }}
        edgeInterpolation={edgeInterpolation}
        labelType="nodes"
        edgeArrowPosition="end"
        onCanvasClick={(e) => {
          onCanvasClick?.(e);
          onSelectNode(null);
        }}
        onNodeClick={(node) => {
          onNodeClick?.(node);
          onSelectNode(node.id);
        }}
        onNodePointerOver={(node) => {
          onNodePointerOver?.(node);
          onHoverNode?.(node.id);
        }}
        onNodePointerOut={(node) => {
          onNodePointerOut?.(node);
          onHoverNode?.(null);
        }}
      />
    </div>
  );
}
