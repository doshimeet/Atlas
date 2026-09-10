"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  FileText,
  Building2,
  Check,
  Copy,
  ArrowRight,
  Crosshair,
  GitCommit,
  Sparkles,
  ChevronRight,
  Minus,
  BookOpen,
  FileSpreadsheet,
  Download,
  Loader2,
  Eye,
} from "lucide-react";
import { GraphNode, GraphEdge, TracedPathData, DocumentInsightData } from "@/lib/types";
import { formatCurrencyM, getCategoryBadge } from "@/lib/utils";

interface EntityInspectorProps {
  node: GraphNode | null;
  edges: GraphEdge[];
  nodesMap: Map<string, GraphNode>;
  tracedPath?: TracedPathData | null;
  onClearTrace?: () => void;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
  onSetTraceEndpoint?: (nodeId: string, role: "source" | "target") => void;
  onCollapse?: () => void;
  onFocusSubTree?: (nodeId: string) => void;
  onOpenDossier?: (node: GraphNode) => void;
}

export function EntityInspector({
  node,
  edges,
  nodesMap,
  tracedPath,
  onClearTrace,
  onClose,
  onSelectNode,
  onSetTraceEndpoint,
  onCollapse,
  onFocusSubTree,
  onOpenDossier,
}: EntityInspectorProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "doc_intel" | "report">("overview");

  // Document Intelligence state
  const [insightData, setInsightData] = useState<DocumentInsightData | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Executive Report state
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Fetch document insights when a node is selected and doc_intel tab is activated
  useEffect(() => {
    if (!node) {
      setInsightData(null);
      setReportMarkdown(null);
      return;
    }

    const currentNode = node;
    async function fetchInsights() {
      setIsLoadingInsights(true);
      try {
        const cleanId = currentNode.id.replace("PROJ_", "").replace("ASSET_", "");
        const res = await fetch(`http://localhost:8000/api/documents/${cleanId}/insights`);
        if (res.ok) {
          const data = await res.json();
          setInsightData(data);
        } else {
          setInsightData(null);
        }
      } catch (err) {
        setInsightData(null);
      } finally {
        setIsLoadingInsights(false);
      }
    }

    fetchInsights();
  }, [node]);

  const handleGenerateReport = async () => {
    if (!node) return;
    setIsGeneratingReport(true);
    try {
      const cleanId = node.id.replace("PROJ_", "").replace("ASSET_", "");
      const res = await fetch("http://localhost:8000/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focus_id: cleanId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReportMarkdown(data.markdown);
      }
    } catch (e) {
      console.error("Report generation failed:", e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleCopyReport = () => {
    if (reportMarkdown) {
      navigator.clipboard.writeText(reportMarkdown);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    }
  };

  // Derive live project list dynamically from nodesMap
  const liveProjects = Array.from(nodesMap.values()).filter((n) => n.category === "project" || n.category === "asset");
  const totalCommitmentM = liveProjects.reduce((acc, p) => acc + (p.financingAmountM || 0), 0);
  const totalCommitmentFormatted = totalCommitmentM >= 1000
    ? `$${(totalCommitmentM / 1000).toFixed(2)}B`
    : `$${totalCommitmentM.toFixed(0)}M`;
  const flaggedCount = Array.from(nodesMap.values()).filter((n) => n.category === "discrepancy").length;

  // 1. Dependency Trace active
  if (!node && tracedPath) {
    const hopCount = Math.max(0, tracedPath.hops.length - 1);
    return (
      <div className="h-full w-full flex flex-col overflow-y-auto bg-white/95 p-5 text-slate-900">
        <div className="border-b border-slate-100 pb-3.5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Institutional Lineage Trace
              </span>
            </div>
            <h3 className="mt-1 text-sm font-bold text-slate-900 leading-snug">
              {tracedPath.source.label.slice(0, 24)} ➔ {tracedPath.target.label.slice(0, 24)}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
              {hopCount === 1 ? "Direct 1-Hop Institutional Link" : `${hopCount}-Hop Multi-Lateral Dependency Chain`}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {onClearTrace && (
              <button
                onClick={onClearTrace}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 transition-colors"
                title="Clear active trace"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Minimize panel"
              >
                <Minus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-amber-800">
              Chain Distance
            </span>
            <div className="mt-0.5 text-lg font-bold text-amber-950">
              {hopCount} {hopCount === 1 ? "Hop" : "Hops"}
            </div>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-sky-700">
              Traced Capital
            </span>
            <div className="mt-0.5 text-lg font-bold text-slate-900">
              ${tracedPath.totalFinancingM.toFixed(1)}M
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onSelectNode(tracedPath.source.id)}
            className="text-xs text-teal-600 font-semibold hover:underline"
          >
            Inspect Origin
          </button>
          {onClearTrace && (
            <button
              onClick={onClearTrace}
              className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
            >
              Exit Trace
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. No node selected: Portfolio Overview
  if (!node) {
    return (
      <div className="h-full w-full flex flex-col overflow-y-auto bg-white/95 p-5 text-slate-900">
        <div className="border-b border-slate-100 pb-3.5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-teal-600"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Institutional Intelligence
              </span>
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-900">
              Portfolio Mind-Map Overview
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
              Select any branch or node to inspect financing arrangements, legal covenants, and W3C PROV-O audit trails.
            </p>
          </div>

          {onCollapse && (
            <button
              onClick={onCollapse}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Minimize panel"
            >
              <Minus className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-teal-700">
              Total Commitments
            </span>
            <div className="mt-0.5 text-lg font-bold text-slate-900">{totalCommitmentFormatted}</div>
            <span className="text-[10px] text-slate-500">{liveProjects.length} Operations Indexed</span>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-sky-700">
              Global Practices
            </span>
            <div className="mt-0.5 text-lg font-bold text-slate-900">4 Practices</div>
            <span className="text-[10px] text-slate-500">Climate • Digital • Macro • Capital</span>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-emerald-700">
              Serving Latency
            </span>
            <div className="mt-0.5 text-lg font-bold text-emerald-800">&lt;3ms</div>
            <span className="text-[10px] text-emerald-600">Indexed Relational DB</span>
          </div>

          <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-purple-700">
              W3C PROV-O
            </span>
            <div className="mt-0.5 text-lg font-bold text-purple-800">100% Cryptographic</div>
            <span className="text-[10px] text-purple-600">SHA-256 Verified</span>
          </div>
        </div>

        <div className="mt-4 flex-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Flagship Operations ({liveProjects.length})
            </span>
            <span className="text-[10px] text-slate-400">Click to Inspect Dossier</span>
          </div>

          <div className="mt-2 space-y-2">
            {liveProjects.map((proj) => {
              const cleanId = proj.id.replace("PROJ_", "").replace("ASSET_", "");
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectNode(proj.id)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 p-2.5 hover:border-teal-500 hover:bg-teal-50/40 transition-all"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800">
                        {cleanId}
                      </span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate">
                        {proj.label.replace(`${cleanId}: `, "")}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. Node IS selected: Multi-Tab Intelligence Dossier
  const badge = getCategoryBadge(node.category);
  const handleCopyHash = () => {
    if (node.provenance.documentSha256) {
      navigator.clipboard.writeText(node.provenance.documentSha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 1500);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 p-5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: badge.colorHex }}></span>
              <span>{badge.label}</span>
            </span>
            <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">
              {node.label}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs font-semibold text-slate-400 tracking-tight">{node.id}</span>
              {onFocusSubTree && (
                <button
                  onClick={() => onFocusSubTree(node.id)}
                  className="flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800 hover:bg-teal-100 transition-colors shadow-2xs"
                  title="Focus solely on this entity and its connected sub-tree"
                >
                  <Eye className="h-3 w-3 text-teal-600" />
                  <span>Focus Sub-Tree</span>
                </button>
              )}
              {onOpenDossier && (node.category === "asset" || node.category === "project" || node.id.startsWith("PUB_")) && (
                <button
                  onClick={() => onOpenDossier(node)}
                  className="flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800 hover:bg-sky-100 transition-colors shadow-2xs"
                  title="Open isolated document reader with structural citations and official PDF"
                >
                  <BookOpen className="h-3 w-3 text-sky-600" />
                  <span>Dedicated Dossier</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onCollapse && (
              <button
                onClick={onCollapse}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Minimize panel"
              >
                <Minus className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              title="Return to Portfolio Overview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 flex items-center gap-2 border-b border-slate-100 pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-1.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "overview"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Overview &amp; Lineage
          </button>
          <button
            onClick={() => setActiveTab("doc_intel")}
            className={`pb-1.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "doc_intel"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Document Intelligence</span>
            {insightData && (
              <span className="rounded-full bg-teal-100 px-1.5 py-0.2 text-[9px] text-teal-800 font-bold">
                {insightData.totalSections}p
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("report");
              if (!reportMarkdown) handleGenerateReport();
            }}
            className={`pb-1.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "report"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Briefing Report</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <>
            {onSetTraceEndpoint && (
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <button
                  onClick={() => onSetTraceEndpoint(node.id, "source")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-white hover:border-teal-500 hover:text-teal-700 transition-all"
                >
                  <Crosshair className="h-3 w-3 text-teal-600" />
                  <span>Set Path Origin</span>
                </button>
                <button
                  onClick={() => onSetTraceEndpoint(node.id, "target")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-white hover:border-teal-500 hover:text-teal-700 transition-all"
                >
                  <GitCommit className="h-3 w-3 text-sky-600" />
                  <span>Set Path Target</span>
                </button>
              </div>
            )}

            {node.financingAmountM && (
              <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">
                  Approved Financing Commitment
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrencyM(node.financingAmountM)}
                  </span>
                  <span className="rounded bg-white px-2 py-0.5 font-bold text-slate-800 border border-teal-200">
                    Multilateral Facility
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  W3C PROV-O Lineage
                </span>
                <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  {node.provenance.verifiedStatus}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-[11px] text-slate-700">
                <div>
                  <span className="text-slate-400">Activity:</span>{" "}
                  <span className="font-semibold text-slate-900">{node.provenance.provActivity}</span>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-white p-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-medium">SHA-256 Digest</span>
                    <button
                      onClick={handleCopyHash}
                      className="flex items-center gap-1 text-emerald-700 font-semibold"
                    >
                      {copiedHash ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="mt-1 break-all text-[10px] font-mono text-slate-900">
                    {node.provenance.documentSha256}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: DOCUMENT INTELLIGENCE (SECTIONS & COVENANTS) */}
        {activeTab === "doc_intel" && (
          <div className="space-y-4">
            {isLoadingInsights ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                <span className="mt-2 text-xs">Loading pre-processed document intelligence...</span>
              </div>
            ) : insightData ? (
              <>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Official Publication</span>
                  <h4 className="mt-0.5 text-xs font-bold text-slate-900">{insightData.asset.title}</h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Type: {insightData.asset.docType}</span>
                    <a
                      href={insightData.asset.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View PDF</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {/* Extracted Semantic Triplets with Page Numbers */}
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Extracted Legal Covenants &amp; Triplets ({insightData.triplets.length})
                  </h5>
                  <div className="space-y-2">
                    {insightData.triplets.map((t) => (
                      <div key={t.id} className="rounded-xl border border-teal-200 bg-teal-50/50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-teal-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                            {t.predicate}
                          </span>
                          <span className="text-[10px] font-semibold text-teal-800">
                            Page {t.pageNumber}
                          </span>
                        </div>
                        <div className="mt-1.5 text-xs font-semibold text-slate-900">
                          {t.subject} ➔ {t.object}
                        </div>
                        <p className="mt-1 text-[11px] italic text-slate-600 leading-relaxed">
                          &quot;{t.verbatimQuote}&quot;
                        </p>
                        <div className="mt-2 text-[10px] text-slate-400 font-mono">
                          Citation: {t.citation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parsed Sections */}
                <div>
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Parsed Structural Chunks ({insightData.chunks.length})
                  </h5>
                  <div className="space-y-2">
                    {insightData.chunks.slice(0, 5).map((c) => (
                      <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700">{c.sectionTitle}</span>
                          <span>Page {c.pageNumber}</span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                          {c.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                <p>No document intelligence pre-indexed for this node yet.</p>
                <button
                  onClick={async () => {
                    const cleanId = node.id.replace("PROJ_", "").replace("ASSET_", "");
                    await fetch(`http://localhost:8000/api/ingest/trigger/${cleanId}`, { method: "POST" });
                    alert(`Queued background ingestion for ${cleanId}`);
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Queue Background Ingestion</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EXECUTIVE BRIEFING REPORT */}
        {activeTab === "report" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold uppercase text-slate-500">Synthesized Executive Brief</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                >
                  {isGeneratingReport ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-amber-500" />}
                  <span>Regenerate</span>
                </button>
                {reportMarkdown && (
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-teal-700"
                  >
                    {copiedReport ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedReport ? "Copied" : "Copy Markdown"}</span>
                  </button>
                )}
              </div>
            </div>

            {isGeneratingReport ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                <span className="mt-2 text-xs">Synthesizing institutional briefing report...</span>
              </div>
            ) : reportMarkdown ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-800">
                {reportMarkdown}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p>Click below to synthesize an executive briefing document.</p>
                <button
                  onClick={handleGenerateReport}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Generate Briefing Report</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
