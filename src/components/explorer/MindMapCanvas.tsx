"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { GraphNode, GraphEdge } from "@/lib/types";
import {
  BookOpen,
  Users,
  Lightbulb,
  FileText,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Globe,
  Layers,
  ChevronRight,
  Building2,
  Award,
  Minus,
  Plus,
  Hand,
  Grid,
  Leaf,
  BarChart2,
  Heart,
  Gem,
  MapPin,
} from "lucide-react";
import { CanvasLegend } from "./CanvasLegend";

interface MindMapCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onOpenDossier?: (node: GraphNode) => void;
  onFocusSubTree?: (nodeId: string) => void;
  themeMode?: "light" | "dark";
  presentationMode?: "pill_minimalist" | "rich_institutional_icons";
  orientation?: "horizontal" | "vertical";
  activeTrace?: { source: string; target: string } | null;
  depth?: number;
}

interface TreeNode {
  id: string;
  treeKey: string;
  data: GraphNode;
  level: number;
  practiceGroup?: string;
  children: TreeNode[];
  parent?: TreeNode;
  edgeLabel?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  subtreeHeight: number;
}

interface BracketGroup {
  practiceId: string;
  practiceLabel: string;
  color: string;
  minY: number;
  maxY: number;
  x: number;
}

const DOMAIN_THEMES: Record<string, { bg: string; text: string; border: string; curve: string; badge: string }> = {
  THEME_CLIMATE: {
    bg: "bg-teal-600 hover:bg-teal-700",
    text: "text-white",
    border: "border-teal-500",
    curve: "#0d9488",
    badge: "bg-teal-50 text-teal-800 border-teal-200",
  },
  THEME_DIGITAL: {
    bg: "bg-blue-600 hover:bg-blue-700",
    text: "text-white",
    border: "border-blue-500",
    curve: "#2563eb",
    badge: "bg-blue-50 text-blue-800 border-blue-200",
  },
  THEME_MACRO: {
    bg: "bg-indigo-600 hover:bg-indigo-700",
    text: "text-white",
    border: "border-indigo-500",
    curve: "#4f46e5",
    badge: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  THEME_HUMAN: {
    bg: "bg-purple-600 hover:bg-purple-700",
    text: "text-white",
    border: "border-purple-500",
    curve: "#7c3aed",
    badge: "bg-purple-50 text-purple-800 border-purple-200",
  },
};

export function MindMapCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onOpenDossier,
  onFocusSubTree,
  themeMode = "light",
  presentationMode = "pill_minimalist",
  orientation = "horizontal",
  activeTrace,
  depth = 4,
}: MindMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 50, y: 30 });
  const [zoom, setZoom] = useState(0.72);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTreeKey, setSelectedTreeKey] = useState<string | null>(null);
  const [hoveredTreeKey, setHoveredTreeKey] = useState<string | null>(null);

  // Map nodes for lookup
  const nodesMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Outbound edges map
  const outboundMap = useMemo(() => {
    const map = new Map<string, { target: string; label: string }[]>();
    for (const edge of edges) {
      if (!map.has(edge.source)) map.set(edge.source, []);
      map.get(edge.source)!.push({ target: edge.target, label: edge.label });
    }
    return map;
  }, [edges]);

  // Deterministic Mind-Map Tree Layout Calculation
  const { treeRoot, allTreeNodes, connections, brackets, canvasDimensions } = useMemo(() => {
    if (nodes.length === 0) {
      return { treeRoot: null, allTreeNodes: [], connections: [], brackets: [], canvasDimensions: { width: 1000, height: 600 } };
    }

    // Find Root (Repository or first node)
    const rootNode = nodes.find((n) => n.id === "FAC_WBG_KNOWLEDGE") || nodes[0];
    if (!rootNode) {
      return { treeRoot: null, allTreeNodes: [], connections: [], brackets: [], canvasDimensions: { width: 1000, height: 600 } };
    }

    // Build hierarchical tree structure
    const visitedAncestors = new Set<string>([rootNode.id]);

    function buildBranch(
      nodeId: string,
      level: number,
      practiceGroup?: string,
      parent?: TreeNode
    ): TreeNode {
      const nodeData = nodesMap.get(nodeId)!;
      const currentPractice = level === 1 ? nodeId : practiceGroup;
      const childEdges = outboundMap.get(nodeId) || [];
      const children: TreeNode[] = [];
      const treeKey = parent ? `${nodeId}__${parent.id}` : nodeId;

      const currentNode: TreeNode = {
        id: nodeId,
        treeKey,
        data: nodeData,
        level,
        practiceGroup: currentPractice,
        children: [],
        parent,
        x: 0,
        y: 0,
        width: level === 0 ? 200 : level === 1 ? 190 : level === 2 ? 260 : 240,
        height: level === 0 ? 44 : level === 1 ? 42 : level === 2 ? 64 : 34,
        subtreeHeight: 0,
      };

      // Only expand children if within current depth limit
      if (level < depth) {
        for (const e of childEdges) {
          // Prevent cycles in ancestor chain, but allow leaf nodes (authors & findings) to belong to multiple papers!
          const isLeaf = e.target.startsWith("AUTH_") || e.target.startsWith("FINDING_");
          if ((isLeaf || !visitedAncestors.has(e.target)) && nodesMap.has(e.target)) {
            if (!isLeaf) visitedAncestors.add(e.target);
            const childBranch = buildBranch(e.target, level + 1, currentPractice, currentNode);
            childBranch.edgeLabel = e.label;
            children.push(childBranch);
            if (!isLeaf) visitedAncestors.delete(e.target);
          }
        }
      }

      currentNode.children = children;
      return currentNode;
    }

    const root = buildBranch(rootNode.id, 0);

    // Compute subtree vertical heights (bottom-up) with compact leaf spacing
    const LEAF_V_SPACING = 38;
    function computeSubtreeHeight(node: TreeNode): number {
      if (node.children.length === 0) {
        node.subtreeHeight = LEAF_V_SPACING;
        return node.subtreeHeight;
      }
      let sum = 0;
      for (const child of node.children) {
        sum += computeSubtreeHeight(child);
      }
      node.subtreeHeight = Math.max(sum, node.height + 20);
      return node.subtreeHeight;
    }
    computeSubtreeHeight(root);

    // Compute exact X, Y coordinates (top-down)
    const allNodesList: TreeNode[] = [];
    const connectionsList: {
      id: string;
      source: TreeNode;
      target: TreeNode;
      curvePath: string;
      label?: string;
      color: string;
    }[] = [];

    // Generous horizontal column spacing providing 180px+ horizontal runway for smooth S-curves
    const COL_X_OFFSETS = [40, 520, 940, 1400];

    function assignPositions(node: TreeNode, x: number, startY: number) {
      node.x = x;
      allNodesList.push(node);

      if (node.children.length === 0) {
        node.y = startY + node.subtreeHeight / 2;
        return;
      }

      let currentChildY = startY;
      const childYPositions: number[] = [];

      for (const child of node.children) {
        const nextX = COL_X_OFFSETS[child.level] || x + 320;
        assignPositions(child, nextX, currentChildY);
        childYPositions.push(child.y);
        currentChildY += child.subtreeHeight;
      }

      // Center parent vertically on its children
      node.y = (childYPositions[0] + childYPositions[childYPositions.length - 1]) / 2;

      // Create S-curve connections using finalized node.y and child.y coordinates
      for (const child of node.children) {
        const domainColor = child.practiceGroup && DOMAIN_THEMES[child.practiceGroup]
          ? DOMAIN_THEMES[child.practiceGroup].curve
          : "#0d9488";

        const sx = node.x + node.width;
        const sy = node.y;
        const tx = child.x;
        const ty = child.y;
        const mx = (sx + tx) / 2;

        const path = `M ${sx} ${sy} C ${mx} ${sy}, ${mx} ${ty}, ${tx} ${ty}`;

        connectionsList.push({
          id: `${node.treeKey}->${child.treeKey}`,
          source: node,
          target: child,
          curvePath: path,
          label: child.edgeLabel,
          color: domainColor,
        });
      }
    }

    assignPositions(root, COL_X_OFFSETS[0], 40);

    // Right-Hand Category Brackets (Reference Diagram Style)
    // Strictly restrict brackets to the full institutional overview to prevent "Francis Addeah Darko Options"
    const bracketGroups: BracketGroup[] = [];
    const rightmostX = 1720;
    const isFullOverview = root.id === "FAC_WBG_KNOWLEDGE";

    if (isFullOverview) {
      for (const domainNode of root.children) {
        if (!domainNode.id.startsWith("THEME_") && domainNode.data.category !== "institution") continue;

        const descendants: TreeNode[] = [];
        function gatherDescendants(curr: TreeNode) {
          if (curr.children.length === 0) {
            descendants.push(curr);
          } else {
            for (const c of curr.children) gatherDescendants(c);
          }
        }
        gatherDescendants(domainNode);

        if (descendants.length > 0) {
          const yCoords = descendants.map((d) => d.y);
          const minY = Math.min(...yCoords) - 16;
          const maxY = Math.max(...yCoords) + 16;
          const theme = DOMAIN_THEMES[domainNode.id] || { curve: "#0d9488" };

          bracketGroups.push({
            practiceId: domainNode.id,
            practiceLabel: domainNode.data.label
              .replace(" & Green Transition", "")
              .replace(" & Infrastructure", "")
              .trim(),
            color: theme.curve,
            minY,
            maxY,
            x: rightmostX,
          });
        }
      }
    }

    const maxX = rightmostX + 320;
    const maxY = Math.max(...allNodesList.map((n) => n.y)) + 120;

    return {
      treeRoot: root,
      allTreeNodes: allNodesList,
      connections: connectionsList,
      brackets: bracketGroups,
      canvasDimensions: { width: maxX, height: maxY },
    };
  }, [nodes, nodesMap, outboundMap, depth]);

  // Compute active lineage upstream tree keys directly following parent pointers
  const activeTreeKey = hoveredTreeKey || selectedTreeKey;
  const upstreamTreeKeys = useMemo(() => {
    const set = new Set<string>();
    let targetNode: TreeNode | undefined;

    if (activeTreeKey) {
      targetNode = allTreeNodes.find((n) => n.treeKey === activeTreeKey);
    } else if (selectedNodeId) {
      targetNode = allTreeNodes.find((n) => n.id === selectedNodeId);
    }

    let curr = targetNode;
    while (curr) {
      set.add(curr.treeKey);
      curr = curr.parent;
    }
    return set;
  }, [activeTreeKey, selectedNodeId, allTreeNodes]);

  // Auto-center camera vertically on the Root node whenever node count or root changes
  useEffect(() => {
    if (containerRef.current && treeRoot) {
      const { clientWidth, clientHeight } = containerRef.current;
      if (clientWidth > 0 && clientHeight > 0) {
        const targetZoom = Math.min(Math.max((clientWidth - 120) / 2100, 0.58), 0.80);
        const targetY = (clientHeight / 2) - (treeRoot.y * targetZoom);
        setZoom(targetZoom);
        setPan({ x: 50, y: targetY });
      }
    }
  }, [treeRoot?.id, allTreeNodes.length]);

  // Mouse pan & zoom handlers
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.35), 2.2));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only pan when clicking canvas background
    if ((e.target as HTMLElement).closest("[data-node-pill]")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setPan({ x: 60, y: 140 });
    setZoom(0.85);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-full overflow-hidden bg-slate-50/60 select-none cursor-grab active:cursor-grabbing"
      style={{
        backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }}
    >
      {/* Top-Left Floating Canvas Legend */}
      <CanvasLegend />

      {/* 1. Interactive Infinite Vector SVG Canvas */}
      <div
        className="absolute origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: `${canvasDimensions.width}px`,
          height: `${canvasDimensions.height}px`,
        }}
      >
        {/* SVG Connectors & Brackets Layer */}
        <svg
          className="absolute inset-0 pointer-events-none overflow-visible"
          width={canvasDimensions.width}
          height={canvasDimensions.height}
        >
          <defs>
            <linearGradient id="curveGradientTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.95" />
            </linearGradient>
            <filter id="activeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* S-Curves */}
          {connections.map((conn) => {
            const isPathActive =
              upstreamTreeKeys.has(conn.source.treeKey) && upstreamTreeKeys.has(conn.target.treeKey);
            const isTraceActive =
              activeTrace &&
              (conn.source.id === activeTrace.source || conn.target.id === activeTrace.target);

            return (
              <g key={conn.id} className="transition-all duration-200">
                {/* Background thicker glow when active */}
                {(isPathActive || isTraceActive) && (
                  <path
                    d={conn.curvePath}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="5"
                    strokeLinecap="round"
                    opacity="0.75"
                    filter="url(#activeGlow)"
                  />
                )}

                {/* Primary S-Curve Connector */}
                <path
                  d={conn.curvePath}
                  fill="none"
                  stroke={isPathActive ? "#f59e0b" : conn.color}
                  strokeWidth={isPathActive ? 2.8 : 2}
                  strokeLinecap="round"
                  opacity={isPathActive ? 1 : 0.85}
                  className="transition-colors duration-200"
                />

                {/* Branch Label Sitting Along Curve (Mind-Map Style) */}
                {conn.label && (
                  <text
                    x={(conn.source.x + conn.source.width + conn.target.x) / 2}
                    y={(conn.source.y + conn.target.y) / 2 - 6}
                    textAnchor="middle"
                    fill={isPathActive ? "#b45309" : "#64748b"}
                    fontSize="10"
                    fontWeight="600"
                    className="font-mono tracking-tight select-none pointer-events-none bg-white"
                  >
                    {conn.label === "LEADS_PRACTICE"
                      ? "Leads Practice"
                      : conn.label === "PUBLISHES"
                      ? "Publishes"
                      : conn.label === "AUTHORED_BY"
                      ? "Author"
                      : conn.label === "CONCLUDES"
                      ? "Empirical Finding"
                      : conn.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Right-Hand Category Brackets (Reference Diagram Style) */}
          {brackets.map((bracket) => {
            const bx = bracket.x;
            const topY = bracket.minY;
            const botY = bracket.maxY;
            const midY = (topY + botY) / 2;
            const bracketRadius = 12;

            // Classic curly bracket path `}`
            const pathD = `
              M ${bx} ${topY}
              Q ${bx + bracketRadius} ${topY}, ${bx + bracketRadius} ${topY + bracketRadius}
              L ${bx + bracketRadius} ${midY - bracketRadius}
              Q ${bx + bracketRadius} ${midY}, ${bx + bracketRadius * 2} ${midY}
              Q ${bx + bracketRadius} ${midY}, ${bx + bracketRadius} ${midY + bracketRadius}
              L ${bx + bracketRadius} ${botY - bracketRadius}
              Q ${bx + bracketRadius} ${botY}, ${bx} ${botY}
            `;

            return (
              <g key={bracket.practiceId} className="transition-all duration-300">
                <path
                  d={pathD}
                  fill="none"
                  stroke={bracket.color}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <text
                  x={bx + bracketRadius * 2 + 14}
                  y={midY + 4}
                  fill={bracket.color}
                  fontSize="12"
                  fontWeight="700"
                  className="tracking-tight select-none"
                >
                  {bracket.practiceLabel} Practice
                </text>
              </g>
            );
          })}
        </svg>

        {/* DOM Enclosed Node Pills Layer */}
        {allTreeNodes.map((node) => {
          const isSelected = selectedTreeKey ? selectedTreeKey === node.treeKey : selectedNodeId === node.id;
          const isUpstream = upstreamTreeKeys.has(node.treeKey);
          const isHovered = hoveredTreeKey === node.treeKey;

          // Level 0: Root Navy Pill `[ 🌐 World Bank Group ]` (Exact Mockup Match)
          if (node.level === 0) {
            return (
              <div
                key={node.treeKey}
                data-node-pill="true"
                onClick={() => {
                  setSelectedTreeKey(node.treeKey);
                  onSelectNode(node.id);
                }}
                onMouseEnter={() => setHoveredTreeKey(node.treeKey)}
                onMouseLeave={() => setHoveredTreeKey(null)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y - node.height / 2}px`,
                  width: `${node.width}px`,
                }}
                className={`absolute z-10 flex items-center justify-center gap-2 rounded-2xl border bg-[#0b2447] px-4 py-2.5 shadow-lg backdrop-blur-md transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "ring-4 ring-sky-400 scale-105"
                    : "hover:scale-102 hover:shadow-xl"
                }`}
              >
                <Globe className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-bold text-white tracking-wide">
                  World Bank Group
                </span>
              </div>
            );
          }

          // Level 1: Domain Pill `[ Serverless ]`-Style (Solid Rounded Accent)
          if (node.level === 1) {
            const theme = DOMAIN_THEMES[node.id] || {
              bg: "bg-teal-600 hover:bg-teal-700",
              text: "text-white",
              border: "border-teal-500",
            };

            return (
              <div
                key={node.treeKey}
                data-node-pill="true"
                onClick={() => {
                  setSelectedTreeKey(node.treeKey);
                  onSelectNode(node.id);
                }}
                onMouseEnter={() => setHoveredTreeKey(node.treeKey)}
                onMouseLeave={() => setHoveredTreeKey(null)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y - node.height / 2}px`,
                  width: `${node.width}px`,
                }}
                className={`absolute z-10 flex items-center gap-2.5 rounded-xl border px-4 py-2.5 shadow-md transition-all duration-200 cursor-pointer ${
                  theme.bg
                } ${theme.text} ${theme.border} ${
                  isSelected
                    ? "ring-4 ring-amber-400 shadow-xl scale-105"
                    : isUpstream
                    ? "ring-2 ring-teal-300 shadow-lg scale-102"
                    : "hover:scale-104 hover:shadow-lg"
                }`}
              >
                <Layers className="h-4 w-4 shrink-0 opacity-90" />
                <div className="flex flex-col min-w-0">
                  {presentationMode === "rich_institutional_icons" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                      Global Practice Domain
                    </span>
                  )}
                  <span className="text-xs font-bold tracking-tight truncate leading-tight">
                    {node.data.label}
                  </span>
                </div>
              </div>
            );
          }

          // Level 2: Publication Rounded Cards
          if (node.level === 2) {
            const theme = node.practiceGroup && DOMAIN_THEMES[node.practiceGroup]
              ? DOMAIN_THEMES[node.practiceGroup]
              : { curve: "#0d9488" };

            return (
              <div
                key={node.treeKey}
                data-node-pill="true"
                onClick={() => {
                  setSelectedTreeKey(node.treeKey);
                  onSelectNode(node.id);
                }}
                onMouseEnter={() => setHoveredTreeKey(node.treeKey)}
                onMouseLeave={() => setHoveredTreeKey(null)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y - node.height / 2}px`,
                  width: `${node.width}px`,
                }}
                className={`group absolute z-10 flex flex-col rounded-xl border bg-white p-2.5 shadow-xs transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-amber-500 shadow-lg ring-3 ring-amber-400/30 scale-102"
                    : isUpstream
                    ? "border-teal-500 shadow-md ring-2 ring-teal-400/20"
                    : "border-slate-200/90 hover:border-teal-500 hover:shadow-md hover:scale-102"
                }`}
              >
                {/* Header Row: Category Badge & Paper Code */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    {presentationMode === "rich_institutional_icons" ? (
                      <BookOpen className="h-3 w-3 text-teal-600 shrink-0" />
                    ) : (
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: theme.curve }}
                      />
                    )}
                    <span className="text-[9px] font-mono font-bold text-slate-400 tracking-tight">
                      {node.id.replace("PUB_", "WDS·")}
                    </span>
                  </div>
                  {onOpenDossier && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDossier(node.data);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-teal-600 hover:text-teal-800 flex items-center gap-0.5 transition-opacity"
                      title="Open Dedicated Dossier"
                    >
                      Dossier <ChevronRight className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>

                {/* Title */}
                <span className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                  {node.data.label}
                </span>

                {presentationMode === "rich_institutional_icons" && (
                  <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-teal-700 bg-teal-50/80 px-1.5 py-0.5 rounded-md w-fit">
                    <Award className="h-2.5 w-2.5 text-teal-600" />
                    <span>Peer-Reviewed WDS Paper</span>
                  </div>
                )}
              </div>
            );
          }

          // Level 3: Leaf Items (Authors & Empirical Findings)
          const isAuthor = node.id.startsWith("AUTH_");
          return (
            <div
              key={node.treeKey}
              data-node-pill="true"
              onClick={() => {
                setSelectedTreeKey(node.treeKey);
                onSelectNode(node.id);
              }}
              onMouseEnter={() => setHoveredTreeKey(node.treeKey)}
              onMouseLeave={() => setHoveredTreeKey(null)}
              style={{
                left: `${node.x}px`,
                top: `${node.y - node.height / 2}px`,
                maxWidth: `${node.width}px`,
              }}
              className={`absolute z-10 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all duration-150 cursor-pointer ${
                isAuthor
                  ? "bg-purple-50/90 border-purple-200/80 text-purple-900 hover:bg-purple-100"
                  : "bg-amber-50/90 border-amber-200/80 text-amber-950 hover:bg-amber-100"
              } ${
                isSelected
                  ? "ring-2 ring-amber-500 shadow-md font-bold"
                  : isUpstream
                  ? "shadow-sm font-semibold ring-1 ring-slate-400"
                  : ""
              }`}
            >
              {isAuthor ? (
                <Users className="h-3 w-3 shrink-0 text-purple-600" />
              ) : (
                <Lightbulb className="h-3 w-3 shrink-0 text-amber-600" />
              )}
              <span className="truncate leading-tight">{node.data.label}</span>
              {presentationMode === "rich_institutional_icons" && (
                <span className="text-[9px] font-mono text-slate-400 shrink-0">
                  {isAuthor ? "· Author" : "· Finding"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Canvas Navigation & Zoom HUD (Mockup Style) */}
      <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex items-center gap-1 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur-md text-xs font-semibold text-slate-700">
        <button
          onClick={handleResetView}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          title="Fit / Reset View"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z * 0.85, 0.35))}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          title="Zoom Out"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="px-1.5 font-mono text-[11px] text-slate-600">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(z * 1.15, 2.2))}
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          title="Zoom In"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <div className="h-3.5 w-px bg-slate-200 mx-0.5" />
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          title="Pan tool"
        >
          <Hand className="h-3.5 w-3.5" />
        </button>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          title="Toggle Grid"
        >
          <Grid className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
