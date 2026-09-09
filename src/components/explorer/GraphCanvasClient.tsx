"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import dynamic from "next/dynamic";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import type { GraphCanvasInnerProps } from "./GraphCanvasInner";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GraphErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("GraphCanvas caught WebGL exception:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-wbg-sapphire shadow-xs">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h4 className="mt-4 text-sm font-bold text-wbg-navy">
            Graph Canvas Refreshed
          </h4>
          <p className="mt-1 max-w-sm text-xs text-wbg-slate-500 leading-relaxed">
            The 3D layout coordinates have been reset. Click below to recalibrate the operational view.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-wbg-navy px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#001730] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Recalibrate Canvas</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const GraphCanvasInner = dynamic(() => import("./GraphCanvasInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center bg-wbg-porcelain text-wbg-slate-500">
      <Loader2 className="h-8 w-8 animate-spin text-wbg-sapphire" />
      <p className="mt-3 text-xs font-semibold text-wbg-navy tracking-tight">
        Initializing WebGL Graph Canvas...
      </p>
      <span className="text-[11px] text-slate-400">
        Compiling Reagraph 3D/2D Shader Pipelines &amp; Physics Simulation
      </span>
    </div>
  ),
});

export function GraphCanvasClient(props: GraphCanvasInnerProps) {
  return (
    <GraphErrorBoundary>
      <GraphCanvasInner {...props} />
    </GraphErrorBoundary>
  );
}
