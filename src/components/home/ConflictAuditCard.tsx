"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle2, FileCheck, ArrowUpRight, Scale } from "lucide-react";
import { VERIFIED_PROJECT_DOSSIERS } from "@/lib/wbgApi";

export function ConflictAuditCard() {
  const [selectedIdx, setSelectedIdx] = useState(1); // Default to Indonesia ISLE (flagged discrepancy)
  const currentDoc = VERIFIED_PROJECT_DOSSIERS[selectedIdx];
  const diff = currentDoc.metricsDiff;

  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-wbg-navy">ICR Metric Conflict Engine</h3>
              <p className="text-[11px] text-wbg-slate-500">Appraisal PAD vs Completion ICR Audit</p>
            </div>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              diff?.icrAuditStatus === "RECONCILED"
                ? "bg-emerald-100 text-emerald-800"
                : diff?.icrAuditStatus === "FLAGGED_DISCREPANCY"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {diff?.icrAuditStatus.replace("_", " ")}
          </span>
        </div>

        {/* Project Selector Pills */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {VERIFIED_PROJECT_DOSSIERS.slice(0, 4).map((doc, idx) => (
            <button
              key={doc.id}
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                selectedIdx === idx
                  ? "bg-wbg-navy text-white"
                  : "bg-slate-100 text-wbg-slate-600 hover:bg-slate-200"
              }`}
            >
              {doc.id} ({doc.country})
            </button>
          ))}
        </div>

        {/* Selected Project Variance Analysis */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-wbg-navy">{currentDoc.country}</span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-tight">PAD Doc: {currentDoc.docId}</span>
          </div>
          <p className="mt-1 line-clamp-1 text-[11px] text-wbg-slate-600">
            {currentDoc.projectTitle}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Appraisal Target
              </span>
              <p className="font-semibold text-wbg-navy">
                {diff ? `${(diff.appraisalTargetBeneficiaries / 1000000).toFixed(1)}M Beneficiaries` : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Completion Actual
              </span>
              <p className="font-semibold text-wbg-navy">
                {diff ? `${(diff.completionActualBeneficiaries / 1000000).toFixed(1)}M Beneficiaries` : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between rounded-lg bg-white p-2 border border-slate-200/80 text-xs">
            <span className="text-wbg-slate-500 text-[11px]">Audit Variance Delta:</span>
            <span
              className={`font-bold text-xs tracking-tight ${
                diff && diff.variancePercentage >= 0 ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {diff ? `${diff.variancePercentage > 0 ? "+" : ""}${diff.variancePercentage}%` : "0%"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-wbg-slate-500">
        <span>Automated IEG/ICR Reconciliation</span>
        <a
          href={`https://projects.worldbank.org/en/projects-operations/project-detail/${currentDoc.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-semibold text-wbg-sapphire hover:text-wbg-navy"
        >
          <span>View Official Project & Documents</span>
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
