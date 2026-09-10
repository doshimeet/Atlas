"use client";

import React from "react";
import { Maximize2 } from "lucide-react";

interface CanvasMinimapProps {
  onExpand?: () => void;
  nodes?: any[];
  confidenceThreshold?: number;
  activePractice?: string | null;
}

export function CanvasMinimap({
  onExpand,
  nodes = [],
  confidenceThreshold = 75,
  activePractice = null,
}: CanvasMinimapProps) {
  // Practice color map
  const practiceColors: Record<string, string> = {
    THEME_CLIMATE: "#10b981",
    THEME_HUMAN: "#8b5cf6",
    THEME_MACRO: "#f59e0b",
    THEME_DIGITAL: "#06b6d4",
  };

  // Base layout dots
  const defaultDots = [
    { cx: 18, cy: 45, color: "#1e293b", r: 3, id: "root" },
    // Level 1: Practice Domains
    { cx: 40, cy: 22, color: "#10b981", r: 2.5, id: "THEME_CLIMATE" },
    { cx: 40, cy: 37, color: "#8b5cf6", r: 2.5, id: "THEME_HUMAN" },
    { cx: 40, cy: 52, color: "#f59e0b", r: 2.5, id: "THEME_MACRO" },
    { cx: 40, cy: 67, color: "#06b6d4", r: 2.5, id: "THEME_DIGITAL" },
    // Level 2: Sub-topics / Papers
    { cx: 65, cy: 18, color: "#10b981", r: 2, practice: "THEME_CLIMATE" },
    { cx: 65, cy: 26, color: "#10b981", r: 2, practice: "THEME_CLIMATE" },
    { cx: 65, cy: 34, color: "#8b5cf6", r: 2, practice: "THEME_HUMAN" },
    { cx: 65, cy: 42, color: "#8b5cf6", r: 2, practice: "THEME_HUMAN" },
    { cx: 65, cy: 50, color: "#f59e0b", r: 2, practice: "THEME_MACRO" },
    { cx: 65, cy: 58, color: "#f59e0b", r: 2, practice: "THEME_MACRO" },
    { cx: 65, cy: 66, color: "#06b6d4", r: 2, practice: "THEME_DIGITAL" },
    // Level 3: Authors & Findings
    { cx: 90, cy: 14, color: "#0284c7", r: 1.8, practice: "THEME_CLIMATE" },
    { cx: 90, cy: 22, color: "#8b5cf6", r: 1.8, practice: "THEME_CLIMATE" },
    { cx: 90, cy: 30, color: "#06b6d4", r: 1.8, practice: "THEME_HUMAN" },
    { cx: 90, cy: 38, color: "#10b981", r: 1.8, practice: "THEME_HUMAN" },
    { cx: 90, cy: 48, color: "#f59e0b", r: 1.8, practice: "THEME_MACRO" },
    { cx: 90, cy: 56, color: "#6366f1", r: 1.8, practice: "THEME_MACRO" },
    { cx: 90, cy: 66, color: "#06b6d4", r: 1.8, practice: "THEME_DIGITAL" },
    { cx: 90, cy: 74, color: "#10b981", r: 1.8, practice: "THEME_DIGITAL" },
  ];

  // Dynamically filter dots if activePractice or confidence is active
  const visibleDots = defaultDots.filter((d) => {
    if (activePractice && d.practice && d.practice !== activePractice && d.id !== activePractice && d.id !== "root") {
      return false;
    }
    return true;
  });

  // Calculate viewport box based on active practice
  const viewportBox = activePractice === "THEME_CLIMATE"
    ? { x: 32, y: 10, width: 68, height: 26 }
    : activePractice === "THEME_HUMAN"
    ? { x: 32, y: 26, width: 68, height: 26 }
    : activePractice === "THEME_MACRO"
    ? { x: 32, y: 42, width: 68, height: 26 }
    : activePractice === "THEME_DIGITAL"
    ? { x: 32, y: 56, width: 68, height: 26 }
    : { x: 26, y: 12, width: 72, height: 68 };

  const nodeCount = nodes.length > 0 ? nodes.length : visibleDots.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-2 shadow-2xs backdrop-blur-md">
      <div className="flex items-center justify-between px-1 pb-1 text-[10px] font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span>Minimap</span>
          <span className="text-[9px] font-mono text-slate-400 font-normal">({nodeCount} nodes)</span>
        </span>
        <button
          onClick={onExpand}
          className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title="Expand Minimap"
        >
          <Maximize2 className="h-2.5 w-2.5" />
        </button>
      </div>

      <div className="relative h-22 w-full overflow-hidden rounded-lg border border-slate-100 bg-slate-50/70">
        <svg viewBox="0 0 110 95" className="h-full w-full transition-all duration-300">
          {/* Connection lines */}
          <path
            d="M 18 45 C 28 45, 30 22, 40 22 M 18 45 C 28 45, 30 37, 40 37 M 18 45 C 28 45, 30 52, 40 52 M 18 45 C 28 45, 30 67, 40 67"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.8"
            opacity="0.5"
          />

          {/* Dots */}
          {visibleDots.map((d, i) => (
            <circle
              key={i}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.color}
              opacity={activePractice && d.practice !== activePractice && d.id !== activePractice ? 0.2 : 0.85}
              className="transition-all duration-200"
            />
          ))}

          {/* Dynamic Active Viewport Rectangle */}
          <rect
            x={viewportBox.x}
            y={viewportBox.y}
            width={viewportBox.width}
            height={viewportBox.height}
            rx="2.5"
            fill="#0284c7"
            fillOpacity="0.08"
            stroke="#0284c7"
            strokeWidth="1.2"
            strokeDasharray="2.5 1.5"
            className="transition-all duration-300"
          />
        </svg>
      </div>
    </div>
  );
}
