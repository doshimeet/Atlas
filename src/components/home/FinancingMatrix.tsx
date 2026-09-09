"use client";

import React, { useState } from "react";
import { Building2, Layers, DollarSign, Shield, ArrowRight } from "lucide-react";
import { formatCurrencyM } from "@/lib/utils";

export function FinancingMatrix() {
  const [activeOrg, setActiveOrg] = useState<"IBRD" | "IDA" | "IFC" | "MIGA">("IBRD");

  const orgs = [
    {
      id: "IBRD" as const,
      name: "IBRD",
      fullName: "International Bank for Reconstruction and Development",
      established: 1944,
      targetGroup: "Middle-Income & Creditworthy Developing Nations",
      commitmentB: 285.4,
      concessionality: "Benchmark SOFR + Market Spread",
      tenor: "15 to 35 Years",
      color: "border-sky-500 text-sky-600 bg-sky-50",
      description:
        "Provides development loans, guarantees, and risk management products to middle-income governments to build infrastructure, institutional capacity, and human capital.",
      sampleProjects: ["Indonesia Electrification ($600M)", "India Solar Parks ($500M)", "Brazil Landscapes ($115M)"],
    },
    {
      id: "IDA" as const,
      name: "IDA",
      fullName: "International Development Association",
      established: 1960,
      targetGroup: "World's 75 Poorest & Vulnerable Nations",
      commitmentB: 120.2,
      concessionality: "Zero or Ultra-Low Interest Credits & Grants",
      tenor: "30 to 40 Years (5-10 Yr Grace)",
      color: "border-purple-500 text-purple-600 bg-purple-50",
      description:
        "The world's largest source of concessional financial assistance. Funds basic education, clean water, climate resilience, and primary healthcare in low-income sovereigns.",
      sampleProjects: ["Nigeria Power Sector ($750M)", "Eastern Africa Digital ($350M)", "Vietnam Agriculture ($280M)"],
    },
    {
      id: "IFC" as const,
      name: "IFC",
      fullName: "International Finance Corporation",
      established: 1956,
      targetGroup: "Private Sector & Commercial Enterprises",
      commitmentB: 43.7,
      concessionality: "Commercial Equity, Quasi-Equity & Syndicated Loans",
      tenor: "7 to 15 Years",
      color: "border-emerald-500 text-emerald-600 bg-emerald-50",
      description:
        "Mobilizes private capital into emerging markets without sovereign government guarantees, financing private clean energy, telecoms, and green supply chains.",
      sampleProjects: ["Morocco Green Hydrogen Private Tranche ($150M)", "Cross-Border Data Centers ($85M)"],
    },
    {
      id: "MIGA" as const,
      name: "MIGA",
      fullName: "Multilateral Investment Guarantee Agency",
      established: 1988,
      targetGroup: "Cross-Border Private Foreign Investors & Lenders",
      commitmentB: 18.5,
      concessionality: "Political Risk Insurance & Credit Enhancement",
      tenor: "Up to 20 Years",
      color: "border-amber-500 text-amber-600 bg-amber-50",
      description:
        "Protects foreign direct investments against non-commercial risks: currency inconvertibility, expropriation, breach of sovereign contract, and war/civil disturbance.",
      sampleProjects: ["Sub-Saharan Geothermal Guarantees ($120M)", "Port Infrastructure Risk Shield ($65M)"],
    },
  ];

  const current = orgs.find((o) => o.id === activeOrg)!;

  return (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-wbg-navy">
              Multilateral Financing Instrument Matrix
            </h3>
            <p className="text-[11px] text-wbg-slate-500">
              Institutional Capital Facilities &amp; Concessional Structures
            </p>
          </div>

          {/* Org Selector Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            {orgs.map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveOrg(o.id)}
                className={`rounded-md px-3 py-1 transition-all ${
                  activeOrg === o.id
                    ? "bg-white text-wbg-navy shadow-xs"
                    : "text-wbg-slate-500 hover:text-wbg-navy"
                }`}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Org Detailed Specs */}
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-wbg-navy">{current.fullName}</span>
              <p className="text-[11px] text-wbg-slate-500">
                Established {current.established} • Mandate: {current.targetGroup}
              </p>
            </div>
            <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
              <span className="text-2xl font-bold tracking-tight text-wbg-navy">
                ${current.commitmentB}B
              </span>
              <span className="text-[10px] uppercase font-semibold text-wbg-slate-500">
                Active Volume
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-wbg-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            {current.description}
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Concessional Pricing Terms
              </span>
              <p className="mt-0.5 font-semibold text-wbg-navy">{current.concessionality}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                Maturity &amp; Grace Period
              </span>
              <p className="mt-0.5 font-semibold text-wbg-navy">{current.tenor}</p>
            </div>
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Sample Operations In Graph
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {current.sampleProjects.map((p, i) => (
                <span
                  key={i}
                  className="rounded bg-sky-50 px-2 py-0.5 font-medium text-wbg-sapphire text-[11px]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-wbg-slate-500">
        <span>Bretton Woods Multilateral Architecture</span>
        <a
          href="/explorer"
          className="flex items-center gap-1 font-semibold text-wbg-sapphire hover:text-wbg-navy"
        >
          <span>Filter by {current.name} in Graph</span>
          <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
