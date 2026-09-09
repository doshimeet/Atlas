"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Globe2, Activity, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

interface GlobalHeaderProps {
  onOpenSearch?: () => void;
}

export function GlobalHeader({ onOpenSearch }: GlobalHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Atlas Knowledge", href: "/explorer" },
    { label: "About Us & Methodology", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-wbg-border bg-white/90 backdrop-blur-md">
      {/* Top Institutional Member Strip */}
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-1.5 text-xs text-wbg-slate-600 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-medium tracking-tight">
            <span className="font-semibold text-wbg-navy">THE WORLD BANK GROUP</span>
            <span className="text-slate-300">|</span>
            <span className="hidden items-center gap-1.5 text-[11px] text-wbg-slate-500 sm:inline-flex">
              <span className="hover:text-wbg-navy transition-colors">IBRD</span>
              <span>•</span>
              <span className="hover:text-wbg-navy transition-colors">IDA</span>
              <span>•</span>
              <span className="hover:text-wbg-navy transition-colors">IFC</span>
              <span>•</span>
              <span className="hover:text-wbg-navy transition-colors">MIGA</span>
              <span>•</span>
              <span className="hover:text-wbg-navy transition-colors">ICSID</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600"></span>
              </span>
              <span className="hidden xs:inline">WDS API STREAM:</span>
              <span className="font-semibold">LIVE</span>
            </div>
            <span className="text-slate-200">|</span>
            <div className="flex items-center gap-1 text-[11px] text-wbg-slate-500">
              <ShieldCheck className="h-3 w-3 text-wbg-sapphire" />
              <span>PROV-O v2.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Global Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        {/* Brand Emblem & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wbg-navy text-white shadow-xs transition-transform group-hover:scale-105">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
            >
              {/* World Bank Institutional Dual Arcs / Globe */}
              <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              <path
                d="M16 3C23.1797 3 29 8.8203 29 16C29 23.1797 23.1797 29 16 29"
                stroke="#0071bc"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="16" cy="16" r="3" fill="#0071bc" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-wbg-navy">Atlas Knowledge</span>
              <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-wbg-sapphire uppercase tracking-wider">
                Platform
              </span>
            </div>
            <p className="text-[11px] font-medium text-wbg-slate-500 leading-none">
              World Bank Group Institutional Operational Graph
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-slate-100 text-wbg-navy font-semibold"
                    : "text-wbg-slate-600 hover:bg-slate-50 hover:text-wbg-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-wbg-border bg-slate-50 px-3 py-1.5 text-xs text-wbg-slate-500 hover:border-slate-300 hover:bg-white hover:text-wbg-navy transition-all shadow-xs"
            title="Search Operations (Press ⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-wbg-slate-400" />
            <span className="hidden sm:inline">Search Dossiers...</span>
            <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <Link
            href="/explorer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-wbg-navy px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#001730] active:scale-[0.98] group"
          >
            <span>Launch Atlas Knowledge</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-2.5 w-2.5 text-white" />
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-wbg-border text-wbg-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-wbg-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? "bg-slate-100 text-wbg-navy font-semibold"
                      : "text-wbg-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/explorer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-wbg-navy py-2.5 text-xs font-semibold text-white"
            >
              Launch Atlas Knowledge
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
