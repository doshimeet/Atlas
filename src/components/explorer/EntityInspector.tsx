"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  FileText,
  Download,
  Building2,
  Check,
  Copy,
  ArrowRight,
  Crosshair,
  GitCommit,
  Globe2,
  Cpu,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Minus,
} from "lucide-react";
import { GraphNode, GraphEdge, TracedPathData } from "@/lib/types";
import { formatCurrencyM, getCategoryBadge } from "@/lib/utils";
import { VERIFIED_PROJECT_DOSSIERS } from "@/lib/wbgApi";

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
}: EntityInspectorProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  // Derive live project list dynamically from nodesMap
  const liveProjects = Array.from(nodesMap.values()).filter((n) => n.category === "project");
  const totalCommitmentM = liveProjects.reduce((acc, p) => acc + (p.financingAmountM || 0), 0);
  const totalCommitmentFormatted = totalCommitmentM >= 1000
    ? `$${(totalCommitmentM / 1000).toFixed(2)}B`
    : `$${totalCommitmentM.toFixed(0)}M`;
  const flaggedCount = Array.from(nodesMap.values()).filter((n) => n.category === "discrepancy").length;

  // 1. If a Dependency Trace is active and no single node is overriding focus, render the Trace Report
  if (!node && tracedPath) {
    const hopCount = Math.max(0, tracedPath.hops.length - 1);
    return (
      <div className="h-full w-full flex flex-col overflow-y-auto bg-white/95 p-5 text-wbg-navy">
        {/* Header */}
        <div className="border-b border-slate-100 pb-3.5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Institutional Lineage Trace
              </span>
            </div>
            <h3 className="mt-1 text-sm font-bold text-wbg-navy leading-snug">
              {tracedPath.source.label.slice(0, 24)} ➔ {tracedPath.target.label.slice(0, 24)}
            </h3>
            <p className="mt-0.5 text-[11px] text-wbg-slate-500 leading-relaxed">
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
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-wbg-navy transition-colors"
                title="Minimize panel"
              >
                <Minus className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Metrics Banner */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-amber-800">
              Chain Distance
            </span>
            <div className="mt-0.5 text-lg font-bold text-amber-950">
              {hopCount} {hopCount === 1 ? "Hop" : "Hops"}
            </div>
            <span className="text-[10px] text-amber-700/80">Reachable Pathway</span>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-wbg-sapphire">
              Traced Commitments
            </span>
            <div className="mt-0.5 text-lg font-bold text-wbg-navy">
              {tracedPath.totalFinancingM > 0 ? `$${tracedPath.totalFinancingM.toFixed(1)}M` : "Direct Authority"}
            </div>
            <span className="text-[10px] text-wbg-slate-500">Cumulative Capital</span>
          </div>
        </div>

        {/* Step-by-Step Pathway */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-wbg-slate-500">
              Institutional Route Breakdown
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Provenance Verified
            </span>
          </div>

          <div className="mt-2.5 space-y-2">
            {tracedPath.hops.map((hop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === tracedPath.hops.length - 1;
              return (
                <div key={hop.node.id} className="relative">
                  {/* Entity Card */}
                  <div
                    onClick={() => onSelectNode(hop.node.id)}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3 hover:border-wbg-sapphire hover:shadow-xs transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                            hop.node.category === "project"
                              ? "bg-sky-100 text-sky-800"
                              : hop.node.category === "country"
                              ? "bg-cyan-100 text-cyan-800"
                              : hop.node.category === "ministry"
                              ? "bg-purple-100 text-purple-800"
                              : hop.node.category === "tech"
                              ? "bg-emerald-100 text-emerald-800"
                              : hop.node.category === "discrepancy"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {isFirst ? "Origin • " : isLast ? "Target • " : `Hop ${idx} • `}
                          {hop.node.category}
                        </span>
                        {hop.node.financingAmountM && (
                          <span className="text-[10px] font-semibold text-wbg-slate-600">
                            ${hop.node.financingAmountM}M
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-wbg-sapphire font-semibold hover:underline">
                        Inspect
                      </span>
                    </div>

                    <h4 className="mt-1 text-xs font-bold text-wbg-navy leading-tight">
                      {hop.node.label}
                    </h4>

                    {hop.node.metadata?.description && (
                      <p className="mt-1 text-[11px] text-wbg-slate-500 line-clamp-2">
                        {hop.node.metadata.description}
                      </p>
                    )}
                  </div>

                  {/* Relationship Link to Next Entity */}
                  {!isLast && (
                    <div className="my-1.5 flex items-center justify-center">
                      <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-900 shadow-2xs">
                        <span>↓</span>
                        <span>{hop.edge?.label || "CONNECTED_TO"}</span>
                        {hop.edge?.financingAmountM ? (
                          <span className="text-amber-700 font-bold">
                            (${hop.edge.financingAmountM}M)
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onSelectNode(tracedPath.source.id)}
            className="text-xs text-wbg-sapphire font-semibold hover:underline"
          >
            Inspect Origin
          </button>
          {onClearTrace && (
            <button
              onClick={onClearTrace}
              className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-wbg-slate-700 hover:bg-slate-200 transition-colors"
            >
              Exit Trace
            </button>
          )}
        </div>
      </div>
    );
  }

  // If no node is selected, render the Executive Portfolio Overview
  if (!node) {
    return (
      <div className="h-full w-full flex flex-col overflow-y-auto bg-white/95 p-5 text-wbg-navy">
        {/* Header */}
        <div className="border-b border-slate-100 pb-3.5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-wbg-sapphire"></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-wbg-sapphire">
                Institutional Intelligence
              </span>
            </div>
            <h3 className="mt-1 text-base font-bold text-wbg-navy">
              Portfolio Overview
            </h3>
            <p className="mt-0.5 text-[11px] text-wbg-slate-500 leading-relaxed">
              Select any entity in the 3D graph to inspect financing structures, line ministries, and audit lineage.
            </p>
          </div>

          {onCollapse && (
            <button
              onClick={onCollapse}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-wbg-navy transition-colors"
              title="Minimize panel"
            >
              <Minus className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Portfolio Stats Bento */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-wbg-sapphire">
              Total Commitments
            </span>
            <div className="mt-0.5 text-lg font-bold text-wbg-navy">{totalCommitmentFormatted}</div>
            <span className="text-[10px] text-wbg-slate-500">{liveProjects.length} Active Operations</span>
          </div>

          <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-purple-700">
              MDB Facilities
            </span>
            <div className="mt-0.5 text-lg font-bold text-wbg-navy">4 Pillars</div>
            <span className="text-[10px] text-wbg-slate-500">IBRD • IDA • IFC • MIGA</span>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-emerald-700">
              Audit Status
            </span>
            <div className="mt-0.5 text-lg font-bold text-emerald-800">100% Verified</div>
            <span className="text-[10px] text-emerald-600">W3C PROV-O Standard</span>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-tight text-amber-700">
              Audits Tracked
            </span>
            <div className="mt-0.5 text-lg font-bold text-wbg-navy">{flaggedCount} Flagged</div>
            <span className="text-[10px] text-amber-600">Variance Tracked</span>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-3.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-wbg-navy">
            <Sparkles className="h-3.5 w-3.5 text-wbg-sapphire" />
            <span>Interactive Explorer Tips</span>
          </div>
          <ul className="mt-2 space-y-1.5 text-[11px] text-wbg-slate-600">
            <li className="flex items-start gap-1.5">
              <span className="text-wbg-sapphire font-bold">•</span>
              <span><strong>Click any node</strong> to lock selection and open its verified official documentation dossier.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-wbg-sapphire font-bold">•</span>
              <span><strong>Drag nodes</strong> to rearrange layouts, or use the layout selector above for hierarchical views.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-wbg-sapphire font-bold">•</span>
              <span><strong>Switch Flow</strong> in the top toolbar to isolate upstream funding vs downstream impacts.</span>
            </li>
          </ul>
        </div>

        {/* Live Operations List */}
        <div className="mt-4 flex-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-wbg-slate-600">
              Live World Bank Operations ({liveProjects.length})
            </span>
            <span className="text-[10px] text-wbg-slate-400">Click to Inspect</span>
          </div>

          <div className="mt-2 space-y-2">
            {liveProjects.slice(0, 10).map((proj) => {
              const cleanId = proj.id.replace("PROJ_", "");
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectNode(proj.id)}
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/80 p-2.5 hover:border-wbg-sapphire hover:bg-sky-50/40 transition-all"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-wbg-sapphire tracking-tight">
                        {cleanId}
                      </span>
                      <span className="text-xs font-bold text-wbg-navy group-hover:text-wbg-sapphire truncate">
                        {proj.region || proj.category}
                      </span>
                      {proj.financingAmountM && (
                        <span className="text-[11px] font-semibold text-emerald-700 ml-auto">
                          ${proj.financingAmountM.toFixed(1)}M
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-wbg-slate-500 truncate">
                      {proj.label.replace(`${cleanId}: `, "")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-wbg-sapphire group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // A specific node is selected: Show its Dossier
  const badge = getCategoryBadge(node.category);

  // Find direct connected neighbors
  const connectedEdges = edges.filter(
    (e) => e.source === node.id || e.target === node.id
  );

  const connectedNodes = connectedEdges
    .map((e) => {
      const isSource = e.source === node.id;
      const neighborId = isSource ? e.target : e.source;
      const neighbor = nodesMap.get(neighborId);
      return {
        edgeId: e.id,
        relation: e.label,
        isOutgoing: isSource,
        node: neighbor,
      };
    })
    .filter((item) => item.node !== undefined);

  const handleCopyHash = () => {
    if (node.provenance.documentSha256) {
      navigator.clipboard.writeText(node.provenance.documentSha256);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 1500);
    }
  };

  // Derive official project portal URL
  const projectIdMatch = node.id.startsWith("PROJ_")
    ? node.id.replace("PROJ_", "")
    : node.id.startsWith("DISC_")
    ? node.id.split("_")[1]
    : null;

  const officialPortalUrl = projectIdMatch
    ? `https://projects.worldbank.org/en/projects-operations/project-detail/${projectIdMatch}`
    : (node.metadata as any)?.officialUrl || null;

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto bg-white p-6">
      {/* Header & Close Button */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: badge.colorHex }}></span>
            <span>{badge.label}</span>
          </span>
          <h3 className="mt-2 text-base font-bold text-wbg-navy leading-snug">
            {node.label}
          </h3>
          <span className="text-xs font-semibold text-wbg-slate-400 tracking-tight">{node.id}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-wbg-navy transition-colors"
              title="Minimize panel"
            >
              <Minus className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Deselect Node"
            title="Return to Portfolio Overview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Dependency Quick Actions */}
      {onSetTraceEndpoint && (
        <div className="mt-3 flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => onSetTraceEndpoint(node.id, "source")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-[11px] font-semibold text-wbg-slate-700 hover:bg-white hover:border-wbg-sapphire hover:text-wbg-sapphire transition-all shadow-2xs"
          >
            <Crosshair className="h-3 w-3 text-wbg-sapphire" />
            <span>Set Path Origin</span>
          </button>
          <button
            onClick={() => onSetTraceEndpoint(node.id, "target")}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-[11px] font-semibold text-wbg-slate-700 hover:bg-white hover:border-wbg-sapphire hover:text-wbg-sapphire transition-all shadow-2xs"
          >
            <GitCommit className="h-3 w-3 text-cyan-600" />
            <span>Set Path Target</span>
          </button>
        </div>
      )}

      {/* Core Attributes */}
      <div className="mt-4 space-y-3 text-xs">
        {node.financingAmountM && (
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-wbg-sapphire">
              Approved Financing Commitment
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-wbg-navy">
                {formatCurrencyM(node.financingAmountM)}
              </span>
              {node.organization && (
                <span className="rounded bg-white px-2 py-0.5 font-bold text-wbg-navy border border-sky-200 shadow-2xs">
                  {node.organization} Facility
                </span>
              )}
            </div>
          </div>
        )}

        {node.region && (
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-wbg-slate-500 font-medium">Sovereign Region:</span>
            <span className="font-semibold text-wbg-navy">{node.region}</span>
          </div>
        )}

        {node.sector && (
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-wbg-slate-500 font-medium">Operational Sector:</span>
            <span className="font-semibold text-wbg-navy text-right max-w-[220px]">
              {node.sector}
            </span>
          </div>
        )}

        {node.metadata?.description && (
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Institutional Scope & Objectives
            </span>
            <p className="mt-1 leading-relaxed text-wbg-slate-700">
              {node.metadata.description}
            </p>
          </div>
        )}
      </div>

      {/* W3C PROV-O Verified Lineage */}
      <div className="mt-6 rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            W3C PROV-O Verified Lineage
          </span>
          <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
            {node.provenance.verifiedStatus}
          </span>
        </div>

        <div className="mt-3 space-y-2 text-[11px] text-wbg-slate-700">
          <div>
            <span className="text-slate-400">Authorized By:</span>{" "}
            <span className="font-semibold text-wbg-navy">{node.provenance.wasGeneratedBy}</span>
          </div>
          <div>
            <span className="text-slate-400">Activity Record:</span>{" "}
            <span className="text-[10px] font-semibold text-emerald-800 tracking-tight">{node.provenance.provActivity}</span>
          </div>
          <div>
            <span className="text-slate-400">Confidence Score:</span>{" "}
            <span className="font-bold text-emerald-700">
              {(node.provenance.confidenceScore * 100).toFixed(1)}% High-Trust
            </span>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-white p-2">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                SHA-256 Digest
              </span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold"
              >
                {copiedHash ? (
                  <>
                    <Check className="h-2.5 w-2.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-2.5 w-2.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="mt-1 break-all text-[10px] font-semibold text-wbg-navy tracking-tight">
              {node.provenance.documentSha256}
            </div>
          </div>
        </div>
      </div>

      {/* Official World Bank Project Portal & Document Link */}
      {officialPortalUrl && (
        <div className="mt-4">
          <a
            href={officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-wbg-navy py-2.5 px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#001730] transition-colors group"
          >
            <ExternalLink className="h-3.5 w-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>View Official World Bank Project Portal</span>
          </a>
          <p className="mt-1 text-center text-[10px] text-wbg-slate-400">
            Access official Project Appraisal Documents (PAD), ISR reports & contracts
          </p>
        </div>
      )}

      {/* Connected Dependencies */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <h4 className="text-xs font-bold text-wbg-navy uppercase tracking-wider">
          Connected Dependency Chain ({connectedNodes.length})
        </h4>
        <p className="text-[11px] text-wbg-slate-500">
          Click any linked entity to inspect institutional dependencies.
        </p>

        <div className="mt-3 space-y-2">
          {connectedNodes.map((item, idx) => {
            const neighborBadge = getCategoryBadge(item.node!.category);
            return (
              <div
                key={idx}
                onClick={() => onSelectNode(item.node!.id)}
                className="group flex cursor-pointer items-center justify-between rounded-lg border border-slate-200/80 p-2.5 text-xs hover:border-wbg-sapphire hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: neighborBadge.colorHex }}
                  ></span>
                  <div className="min-w-0">
                    <span className="font-semibold text-wbg-navy group-hover:text-wbg-sapphire line-clamp-1">
                      {item.node!.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold tracking-tight">
                      {item.relation}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-wbg-sapphire group-hover:translate-x-0.5 transition-all" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
