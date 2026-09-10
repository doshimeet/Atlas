"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Search, Globe2, Activity, Menu, X, ArrowRight, ShieldCheck, Bell } from "lucide-react";

interface GlobalHeaderProps {
  onOpenSearch?: () => void;
}

export function GlobalHeader({ onOpenSearch }: GlobalHeaderProps) {
  const router = useRouter();
  const pathname = router.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explorer" },
    { label: "Ask", href: "#ask" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* Top Institutional Member Strip */}
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-1 text-[11px] text-slate-600 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 font-medium tracking-tight">
            <span className="font-semibold text-slate-900">THE WORLD BANK GROUP</span>
            <span className="text-slate-300">|</span>
            <span className="hidden items-center gap-1.5 text-[10px] text-slate-500 sm:inline-flex">
              <span className="hover:text-slate-900 transition-colors">IBRD</span>
              <span>•</span>
              <span className="hover:text-slate-900 transition-colors">IDA</span>
              <span>•</span>
              <span className="hover:text-slate-900 transition-colors">IFC</span>
              <span>•</span>
              <span className="hover:text-slate-900 transition-colors">MIGA</span>
              <span>•</span>
              <span className="hover:text-slate-900 transition-colors">ICSID</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
              </span>
              <span className="font-semibold">LIVE</span>
            </div>
            <span className="text-slate-200">|</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <ShieldCheck className="h-3 w-3 text-sky-600" />
              <span>PROV-O v2.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Global Navigation */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
        {/* Brand Emblem & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs transition-transform group-hover:scale-105">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">Knowledge Atlas</span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 leading-none">
                Explore. Understand. Create Impact.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => {
              const isActive = link.href === "/explorer" ? pathname === "/explorer" : pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors relative ${
                    isActive
                      ? "text-sky-700 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-sky-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search, Notifications & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-900 transition-all shadow-2xs"
            title="Search Operations (Press ⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline text-slate-400">Search entities, documents, concepts...</span>
            <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 pl-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white shadow-xs">
              MD
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-700">Meet Doshi</span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
