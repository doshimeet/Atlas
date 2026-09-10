"use client";

import React, { useState } from "react";
import { GraphNode } from "@/lib/types";
import {
  FileText,
  Star,
  Link2,
  Share2,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Maximize2,
  ChevronRight,
  Award,
} from "lucide-react";

interface DocumentInspectorPanelProps {
  node: GraphNode | null;
  onClose: () => void;
  onFocusNode?: (nodeId: string) => void;
  onOpenDossier?: (node: GraphNode) => void;
}

export function DocumentInspectorPanel({
  node,
  onClose,
  onFocusNode,
  onOpenDossier,
}: DocumentInspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "entities" | "relations" | "provenance">("overview");
  const [isFavorited, setIsFavorited] = useState(false);

  if (!node) {
    return (
      <aside className="hidden lg:flex h-full w-[360px] shrink-0 flex-col items-center justify-center border-l border-slate-200 bg-white/95 p-6 text-center text-slate-400 select-none">
        <FileText className="h-10 w-10 text-slate-300 stroke-[1.5]" />
        <h4 className="mt-3 text-xs font-bold text-slate-600">No Document Selected</h4>
        <p className="mt-1 text-[11px] text-slate-400 leading-relaxed max-w-[220px]">
          Select any publication, empirical finding, or entity node on the canvas to inspect detailed intelligence.
        </p>
      </aside>
    );
  }

  // Derive display values from node
  const isDoc = node.id.startsWith("PUB_") || node.category === "asset";
  const title = node.data?.fullTitle || node.metadata?.fullTitle || node.label || "Second National Ganga River Basin Project";
  const docId = node.id.replace("PUB_", "WB-DOC-").replace("FINDING_", "FIND-").replace("AUTH_", "AUTH-");
  const sector = node.sector || "Environmental Assessment";
  const abstract = node.metadata?.abstract || node.metadata?.description || "This policy research assessment evaluates the empirical indicators, institutional frameworks, and strategic governance outcomes for sustainable development.";

  const sampleKeyEntities = [
    "Ganga River Basin",
    "Water Quality",
    "Uttar Pradesh",
    "Biodiversity",
    "Environmental Impact",
    "River Restoration",
    "Sanitation Infrastructure",
  ];

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col justify-between overflow-y-auto border-l border-slate-200 bg-white/95 p-4 text-xs select-none backdrop-blur-md">
      {/* Top Header & Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-100 text-sky-700">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-tight">
              {node.category.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`rounded p-1 hover:bg-slate-100 transition-colors ${isFavorited ? "text-amber-500" : "hover:text-slate-600"}`}
              title="Save to Favorites"
            >
              <Star className="h-3.5 w-3.5 fill-current" />
            </button>
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="rounded p-1 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Copy Link"
            >
              <Link2 className="h-3.5 w-3.5" />
            </button>
            <button
              className="rounded p-1 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Share / Export"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onClose}
              className="rounded p-1 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Close Panel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Badge */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <span>🌿</span>
              <span>{sector}</span>
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            World Bank · 2025 · Document ID: {docId}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 text-[11px] font-semibold text-slate-500">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2 px-1 relative transition-colors ${activeTab === "overview" ? "text-sky-700 font-bold" : "hover:text-slate-800"}`}
          >
            Overview
            {activeTab === "overview" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab("entities")}
            className={`pb-2 px-2.5 relative transition-colors ${activeTab === "entities" ? "text-sky-700 font-bold" : "hover:text-slate-800"}`}
          >
            Entities (12)
            {activeTab === "entities" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab("relations")}
            className={`pb-2 px-2.5 relative transition-colors ${activeTab === "relations" ? "text-sky-700 font-bold" : "hover:text-slate-800"}`}
          >
            Relationships (28)
            {activeTab === "relations" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />}
          </button>
          <button
            onClick={() => setActiveTab("provenance")}
            className={`pb-2 px-2 relative transition-colors ${activeTab === "provenance" ? "text-sky-700 font-bold" : "hover:text-slate-800"}`}
          >
            Provenance
            {activeTab === "provenance" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />}
          </button>
        </div>

        {/* Tab 1: Overview Content */}
        {activeTab === "overview" && (
          <div className="space-y-4 pt-1">
            {/* Summary */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Summary
              </span>
              <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">
                {abstract}
              </p>
            </div>

            {/* Key Entities */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Key Entities
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {sampleKeyEntities.map((entity, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition-colors cursor-pointer"
                  >
                    {entity}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-sky-600 cursor-pointer">
                  +7 more
                </span>
              </div>
            </div>

            {/* Related Projects */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Related Projects
              </span>
              <div className="mt-1.5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 hover:bg-slate-100/80 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-800 group-hover:text-sky-800 transition-colors">
                      National Ganga River Basin Project
                    </h5>
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-medium">
                      <span>Project</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">Active</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Provenance Box with Confidence Meter */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Provenance
              </span>
              <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Source</span>
                  <span className="font-semibold text-slate-800">World Bank</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Document Type</span>
                  <span className="font-semibold text-slate-800">Environmental Assessment</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Created</span>
                  <span className="font-mono text-slate-800">2025-02-24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Extraction</span>
                  <span className="font-semibold text-slate-800">Knowledge Graph Pipeline</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200/80">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700">Confidence</span>
                    <span className="text-emerald-700 font-mono">92%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: "92%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Entities */}
        {activeTab === "entities" && (
          <div className="space-y-2 pt-2 text-[11px]">
            <p className="text-slate-500 text-[10px]">12 extracted entities linked in this document:</p>
            {sampleKeyEntities.map((e, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5">
                <span className="font-semibold text-slate-800">{e}</span>
                <span className="text-[10px] text-slate-400 font-mono">Entity</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Relationships */}
        {activeTab === "relations" && (
          <div className="space-y-2 pt-2 text-[11px]">
            <p className="text-slate-500 text-[10px]">28 semantic relational triples indexed:</p>
            <div className="space-y-1.5">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[10px]">
                <span className="font-mono text-sky-700 font-bold">references</span>: National Ganga River Basin Project
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[10px]">
                <span className="font-mono text-emerald-700 font-bold">located in</span>: Uttar Pradesh, India
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[10px]">
                <span className="font-mono text-amber-700 font-bold">measures</span>: Water Quality Indicators
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Provenance */}
        {activeTab === "provenance" && (
          <div className="space-y-2 pt-2 text-[11px]">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>W3C PROV-O Verified</span>
              </div>
              <p className="mt-1 font-mono text-[10px] text-slate-600 break-all">
                SHA-256: {node.provenance?.documentSha256 || "0c515208b3bf0ae3939cfae68db25c9d2e54bd0459a39d4ddaeee134da4bb574"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Dock */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onFocusNode && onFocusNode(node.id)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-sky-700 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => onOpenDossier && onOpenDossier(node)}
          className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          title="Expand View"
        >
          <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
          <span>Expand</span>
        </button>

        <a
          href={node.metadata?.pdfUrl || "https://documents.worldbank.org/"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          title="Open Official Source"
        >
          <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Open Source</span>
        </a>
      </div>
    </aside>
  );
}
