import { GraphData, TelemetrySnapshot } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface LivePublicationAsset {
  id: string;
  title: string;
  docType: string;
  country: string;
  region: string;
  sector: string;
  projectId?: string;
  disclosureDate?: string;
  abstract?: string;
  pdfUrl?: string;
  sha256Hash?: string;
  provActivity?: string;
  createdAt?: string;
}

export async function fetchLivePublications(): Promise<LivePublicationAsset[]> {
  try {
    const res = await fetch(`${API_BASE}/api/documents`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch publications: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Live API /api/documents connection error:", error);
    return [];
  }
}

export async function fetchLiveGraph(): Promise<GraphData> {
  try {
    const res = await fetch(`${API_BASE}/api/graph`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch live graph: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Live API /api/graph connection error:", error);
    return { nodes: [], edges: [] };
  }
}

export async function fetchLiveTelemetry(): Promise<TelemetrySnapshot> {
  try {
    const res = await fetch(`${API_BASE}/api/snapshot`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const snap = await res.json();
      return {
        totalInvestmentsUSD: 0,
        activeOperationsCount: snap.totalPublications || 12,
        memberCountriesActive: snap.countriesAnalyzed || 15,
        averageDisbursementRatio: 100.0,
        provVerifiedRatio: 100.0,
        lastSyncTimestamp: new Date().toISOString(),
        instrumentBreakdown: {
          ibrd: 0,
          ida: 0,
          ifc: 0,
          miga: 0,
        },
      };
    }
  } catch (e) {
    console.warn("Could not fetch live telemetry snapshot:", e);
  }

  return {
    totalInvestmentsUSD: 0,
    activeOperationsCount: 12,
    memberCountriesActive: 15,
    averageDisbursementRatio: 100.0,
    provVerifiedRatio: 100.0,
    lastSyncTimestamp: new Date().toISOString(),
    instrumentBreakdown: {
      ibrd: 0,
      ida: 0,
      ifc: 0,
      miga: 0,
    },
  };
}
