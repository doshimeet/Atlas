import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EntityCategory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyM(amountM?: number): string {
  if (amountM === undefined || amountM === null) return "$0M";
  if (amountM >= 1000) {
    return `$${(amountM / 1000).toFixed(1)}B`;
  }
  return `$${amountM.toFixed(0)}M`;
}

export function formatCurrencyExact(amountUSD?: number): string {
  if (!amountUSD) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amountUSD);
}

export function getCategoryBadge(category: EntityCategory): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  colorHex: string;
} {
  switch (category) {
    case "project":
      return {
        label: "Operation / Project",
        bgClass: "bg-sky-50",
        textClass: "text-sky-700",
        borderClass: "border-sky-200",
        colorHex: "#0284c7",
      };
    case "country":
      return {
        label: "Sovereign State",
        bgClass: "bg-cyan-50",
        textClass: "text-cyan-700",
        borderClass: "border-cyan-200",
        colorHex: "#0891b2",
      };
    case "ministry":
      return {
        label: "Ministry / Bank",
        bgClass: "bg-purple-50",
        textClass: "text-purple-700",
        borderClass: "border-purple-200",
        colorHex: "#7c3aed",
      };
    case "tech":
      return {
        label: "Technology / Infra",
        bgClass: "bg-emerald-50",
        textClass: "text-emerald-700",
        borderClass: "border-emerald-200",
        colorHex: "#059669",
      };
    case "policy":
      return {
        label: "Policy / Framework",
        bgClass: "bg-amber-50",
        textClass: "text-amber-800",
        borderClass: "border-amber-200",
        colorHex: "#d97706",
      };
    case "discrepancy":
      return {
        label: "ICR Discrepancy",
        bgClass: "bg-red-50",
        textClass: "text-red-800",
        borderClass: "border-red-200",
        colorHex: "#dc2626",
      };
    default:
      return {
        label: "General Entity",
        bgClass: "bg-slate-50",
        textClass: "text-slate-700",
        borderClass: "border-slate-200",
        colorHex: "#64748b",
      };
  }
}

export function truncateHash(hash: string, start = 8, end = 6): string {
  if (!hash || hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}
