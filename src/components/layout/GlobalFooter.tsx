"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Globe, FileText, AlertTriangle } from "lucide-react";

export function GlobalFooter() {
  return (
    <footer className="w-full border-t border-wbg-border bg-slate-50/80 text-wbg-slate-600">
      {/* Top Institutional Banner */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Mandate */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-wbg-navy text-white text-xs font-bold">
                W
              </div>
              <span className="text-base font-bold tracking-tight text-wbg-navy">Atlas Knowledge</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-wbg-slate-500">
              The institutional data and knowledge graph platform for the World Bank Group. Bridging 80 years of multilateral development financing, project appraisal records, and cryptographic provenance.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>W3C PROV-O Standard Compliant</span>
            </div>
          </div>

          {/* Member Institutions */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-wbg-navy uppercase">
              Member Institutions
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="https://www.worldbank.org/en/who-we-are/ibrd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wbg-navy transition-colors flex items-center gap-1"
                >
                  <span>IBRD (Middle-Income & Creditworthy)</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://ida.worldbank.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wbg-navy transition-colors flex items-center gap-1"
                >
                  <span>IDA (Poorest Countries Fund)</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ifc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wbg-navy transition-colors flex items-center gap-1"
                >
                  <span>IFC (Private Sector Financing)</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.miga.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wbg-navy transition-colors flex items-center gap-1"
                >
                  <span>MIGA (Political Risk Insurance)</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Public Sector Accountability */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-wbg-navy uppercase">
              Transparency & Integrity
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a
                  href="https://www.worldbank.org/en/access-to-information"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wbg-navy transition-colors"
                >
                  Access to Information Policy
                </a>
              </li>
              <li>
                <a
                  href="https://www.worldbank.org/en/about/unit/integrity-vice-presidency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-700 transition-colors flex items-center gap-1 text-amber-900 font-medium"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-600" />
                  <span>INT Fraud & Corruption Hotline</span>
                </a>
              </li>
              <li>
                <a
                  href="https://documents.worldbank.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wbg-navy transition-colors flex items-center gap-1"
                >
                  <span>Documents & Reports (WDS)</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.worldbank.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wbg-navy transition-colors flex items-center gap-1"
                >
                  <span>World Bank Open Data</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & Badges */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider text-wbg-navy uppercase">
              Compliance & Accessibility
            </h4>
            <div className="mt-3 space-y-2.5">
              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-wbg-navy">WCAG 2.1 AAA</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                    PASS
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-wbg-slate-500">
                  Contrast ratio 7:1+ across all institutional typography and knowledge visualizers.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-wbg-navy">Bretton Woods Memory</span>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-tight">EST. 1944</span>
                </div>
                <p className="mt-1 text-[11px] text-wbg-slate-500">
                  190 sovereign member countries actively represented in structured knowledge graphs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row text-xs text-wbg-slate-500">
          <p>
            © 2026 The World Bank Group. All Rights Reserved. International Bank for Reconstruction and Development.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-wbg-navy transition-colors">
              Methodology
            </Link>
            <span>•</span>
            <Link href="/explorer" className="hover:text-wbg-navy transition-colors">
              Knowledge Graph
            </Link>
            <span>•</span>
            <a
              href="https://www.worldbank.org/en/about/legal/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-wbg-navy transition-colors"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
