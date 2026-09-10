"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GlobalHeader } from "./GlobalHeader";
import { GlobalFooter } from "./GlobalFooter";
import { CommandPalette } from "./CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = router.pathname;
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isExplorer = pathname === "/explorer";

  return (
    <div className={`flex ${isExplorer ? "h-screen overflow-hidden" : "min-h-screen"} flex-col bg-wbg-porcelain text-wbg-slate-900 font-sans selection:bg-sky-100 selection:text-wbg-navy`}>
      <GlobalHeader onOpenSearch={() => setSearchOpen(true)} />
      <main className="flex-1 w-full overflow-hidden flex flex-col">{children}</main>
      {!isExplorer && <GlobalFooter />}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
