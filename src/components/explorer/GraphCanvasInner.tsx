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
import {
  GraphNode,
  GraphEdge,
  PathTraversalType,
  GraphLayoutAlgorithm,
  NodePresentationMode,
  BracketAnnotation,
} from "@/lib/types";
import { getNodeIcon, getCategoryDot } from "@/lib/investigationIcons";
import { findShortestPath } from "@/lib/graphBuilder";

export interface GraphCanvasInnerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  traversalType: PathTraversalType;
  layoutAlgorithm: GraphLayoutAlgorithm;
  presentationMode?: NodePresentationMode;
  isDraggable: boolean;
  edgeInterpolation: "curved" | "linear";
  themeMode: "light" | "dark";
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode?: (nodeId: string | null) => void;
  graphRef: React.RefObject<GraphCanvasRef | null>;
  pathTraceTarget?: { source: string; target: string } | null;
  isInspectorCollapsed?: boolean;
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
    inactiveOpacity: 0.25,
    label: {
      color: "#0f172a",
      activeColor: "#0284c7",
    },
  },
  ring: {
    fill: "#38bdf8",
    activeFill: "#0284c7",
  },
  edge: {
    fill: "#cbd5e1",
    activeFill: "#0d9488",
    opacity: 0.75,
    selectedOpacity: 1,
    inactiveOpacity: 0.12,
    label: {
      color: "#0f766e",
      activeColor: "#0f172a",
      fontSize: 8,
    },
  },
  arrow: {
    fill: "#94a3b8",
    activeFill: "#0d9488",
  },
  lasso: {
    background: "rgba(13, 148, 136, 0.1)",
    border: "#0d9488",
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
      color: "#f1f5f9",
      activeColor: "#38bdf8",
    },
  },
  ring: {
    fill: "#0d9488",
    activeFill: "#38bdf8",
  },
  edge: {
    fill: "#1e293b",
    activeFill: "#2dd4bf",
    opacity: 0.7,
    selectedOpacity: 1,
    inactiveOpacity: 0.1,
    label: {
      color: "#2dd4bf",
      activeColor: "#38bdf8",
      fontSize: 8,
    },
  },
  arrow: {
    fill: "#334155",
    activeFill: "#2dd4bf",
  },
  lasso: {
    background: "rgba(45, 212, 191, 0.15)",
    border: "#2dd4bf",
  },
};

export default function GraphCanvasInner({
  nodes,
  edges,
  traversalType,
  layoutAlgorithm = "treeLr2d",
  presentationMode = "pill_minimalist",
  isDraggable,
  edgeInterpolation = "curved",
  themeMode,
  selectedNodeId,
  onSelectNode,
  onHoverNode,
  graphRef,
  pathTraceTarget,
  isInspectorCollapsed = false,
}: GraphCanvasInnerProps) {
  const [customPathActives, setCustomPathActives] = useState<string[] | null>(null);
  const [internalHoveredNodeId, setInternalHoveredNodeId] = useState<string | null>(null);

  // Parent-Path Backtracking: Find lineage back to facility root
  const upstreamPath = useMemo(() => {
    if (!selectedNodeId) return null;
    // BFS upstream to root
    const visited = new Set<string>();
    const queue = [selectedNodeId];
    const activeNodes = new Set<string>([selectedNodeId]);
    const activeEdges = new Set<string>();

    while (queue.length > 0) {
      const curr = queue.shift()!;
      visited.add(curr);

      // Find incoming edges
      for (const e of edges) {
        if (e.target === curr && !visited.has(e.source)) {
          activeNodes.add(e.source);
          activeEdges.add(e.id);
          queue.push(e.source);
        }
      }
    }
    return {
      nodeIds: Array.from(activeNodes),
      edgeIds: Array.from(activeEdges),
    };
  }, [selectedNodeId, edges]);

  // Format nodes with Pill-Box Geometry and Icon / Dot Toggle
  const formattedNodes = useMemo(() => {
    return nodes.map((node) => {
      const isPathNode = customPathActives?.includes(node.id) || upstreamPath?.nodeIds.includes(node.id);
      const isSelected = selectedNodeId === node.id;
      
      // Node sizing calibrated for crisp readability: Root (28), Themes (24), Publications (20), Authors/Findings (16-18)
      let baseSize = 16;
      if (node.id === "FAC_WBG_KNOWLEDGE") {
        baseSize = 28;
      } else if (node.id.startsWith("THEME_") || node.category === "institution") {
        baseSize = 24;
      } else if (node.category === "asset" || node.category === "project" || node.id.startsWith("PUB_")) {
        baseSize = 20;
      } else if (node.category === "geography" || node.category === "country" || node.id.startsWith("AUTH_")) {
        baseSize = 18;
      } else {
        baseSize = 16;
      }

      // Icon vs Minimalist Dot Badge
      const iconUri = presentationMode === "rich_institutional_icons"
        ? (node.icon || getNodeIcon(node.category, node.subType || (node as any).organization))
        : getCategoryDot(node.category);

      // Truncate label cleanly without cutting short words
      let labelText = node.label;
      if (labelText.length > 36) {
        labelText = labelText.substring(0, 34) + "...";
      }

      return {
        id: node.id,
        label: labelText,
        icon: iconUri,
        fill: isSelected
          ? "#f59e0b"
          : isPathNode
          ? "#0284c7"
          : node.fill || (node.category === "institution" ? "#3b82f6" : node.category === "geography" ? "#0d9488" : "#0284c7"),
        cluster: node.cluster || (node as any).cluster,
        data: (node as any).data || node.metadata,
        size: isSelected ? baseSize + 6 : isPathNode ? baseSize + 3 : baseSize,
      };
    });
  }, [nodes, customPathActives, upstreamPath, selectedNodeId, presentationMode]);

  // Format edges with Progressive Disclosure (Silent by default; illuminate on hover/select)
  const formattedEdges = useMemo(() => {
    const activeNodeIds = new Set<string>();
    if (selectedNodeId) activeNodeIds.add(selectedNodeId);
    if (internalHoveredNodeId) activeNodeIds.add(internalHoveredNodeId);
    if (upstreamPath) {
      for (const nid of upstreamPath.nodeIds) activeNodeIds.add(nid);
    }
    if (customPathActives) {
      for (const id of customPathActives) activeNodeIds.add(id);
    }

    return edges.map((edge) => {
      const isPathEdge = customPathActives?.includes(edge.id) || upstreamPath?.edgeIds.includes(edge.id);
      const isConnectedToActive = activeNodeIds.has(edge.source) || activeNodeIds.has(edge.target);
      
      // Progressive disclosure: hide label until user hovers or selects
      const showLabel = isPathEdge || isConnectedToActive;
      const displayLabel = showLabel
        ? `${edge.label}${edge.financingAmountM ? ` ($${edge.financingAmountM}M)` : ""}`
        : "";

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: displayLabel,
        fill: isPathEdge
          ? "#f59e0b"
          : edge.isPrimaryBackbone
          ? "#0d9488" // Teal mind-map S-curve (like reference diagram)
          : "#64748b",
        size: isPathEdge ? 3.8 : edge.isPrimaryBackbone ? 2.2 : 1.4,
      };
    });
  }, [edges, customPathActives, upstreamPath, selectedNodeId, internalHoveredNodeId]);

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

  // Handle external selection prop change
  useEffect(() => {
    if (pathTraceTarget?.source && pathTraceTarget?.target) return;
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

  // Handle path trace target
  useEffect(() => {
    if (pathTraceTarget?.source && pathTraceTarget?.target) {
      const sourceExists = nodes.some((n) => n.id === pathTraceTarget.source);
      const targetExists = nodes.some((n) => n.id === pathTraceTarget.target);
      if (sourceExists && targetExists) {
        const path = findShortestPath(edges, pathTraceTarget.source, pathTraceTarget.target);
        if (path) {
          setSelections(path.nodeIds);
          setCustomPathActives([...path.nodeIds, ...path.edgeIds]);
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
          setSelections([pathTraceTarget.source, pathTraceTarget.target]);
          setCustomPathActives([pathTraceTarget.source, pathTraceTarget.target]);
        }
      }
    } else {
      setCustomPathActives(null);
    }
  }, [pathTraceTarget, nodes, edges, setSelections, graphRef]);

  // Active state masking
  const effectiveActives = customPathActives
    ? customPathActives
    : upstreamPath?.nodeIds && upstreamPath.nodeIds.length > 0
    ? [...upstreamPath.nodeIds, ...upstreamPath.edgeIds]
    : selections.length > 0
    ? actives
    : undefined;

  const currentTheme = themeMode === "dark" ? cyberDarkTheme : lightAtlasTheme;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 1. Main Reagraph Canvas */}
      <GraphCanvas
        ref={graphRef as any}
        nodes={formattedNodes}
        edges={formattedEdges}
        selections={selections}
        actives={effectiveActives}
        theme={currentTheme}
        draggable={isDraggable}
        layoutType={layoutAlgorithm}
        maxDistance={3500}
        minDistance={200}
        layoutOverrides={{
          linkDistance: layoutAlgorithm === "treeLr2d" ? 85 : 120,
          nodeStrength: -180,
          clusterStrength: 0.9,
        }}
        edgeInterpolation={edgeInterpolation}
        labelType="all"
        edgeArrowPosition={layoutAlgorithm === "treeLr2d" ? "none" : "end"}
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
          setInternalHoveredNodeId(node.id);
          onHoverNode?.(node.id);
        }}
        onNodePointerOut={(node) => {
          onNodePointerOut?.(node);
          setInternalHoveredNodeId(null);
          onHoverNode?.(null);
        }}
      />
    </div>
  );
}
