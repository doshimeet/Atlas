export type EntityCategory =
  | "project"
  | "country"
  | "ministry"
  | "tech"
  | "policy"
  | "discrepancy";

export type RelationType =
  | "FINANCES"
  | "OPERATES_IN"
  | "DEPLOYED_IN"
  | "IMPLEMENTED_BY"
  | "GOVERNED_BY"
  | "FLAGGED_IN";

export type PathTraversalType = "out" | "in" | "all" | "direct";

export type GraphLayoutAlgorithm =
  | "forceDirected2d"
  | "hierarchicalTd"
  | "circular2d"
  | "radialOut2d"
  | "treeLr2d";

export interface MitreTacticColumn {
  id: string;
  name: string;
  category: EntityCategory;
  description: string;
  count: number;
}

export interface W3CProvenance {
  wasGeneratedBy: string; // e.g. "World Bank Board of Executive Directors"
  wasDerivedFrom: string; // PAD Document ID / URL
  documentSha256: string; // SHA-256 cryptographic digest
  provActivity: string; // e.g. "Appraisal Review #PAD-2024-88"
  timestamp: string; // ISO string
  confidenceScore: number; // 0.0 - 1.0 NLP confidence
  verifiedStatus: "CRYPTOGRAPHICALLY_VERIFIED" | "PENDING_AUDIT" | "HISTORICAL_RECORD";
}

export interface GraphNode {
  id: string;
  label: string;
  category: EntityCategory;
  subType?: string;
  region?: string;
  sector?: string;
  financingAmountM?: number; // In Millions USD
  organization?: "IBRD" | "IDA" | "IFC" | "MIGA" | "ICSID";
  provenance: W3CProvenance;
  metadata: {
    approvalDate?: string;
    closingDate?: string;
    leadAgency?: string;
    description?: string;
    officialUrl?: string;
    pdfDownloadUrl?: string;
    tags?: string[];
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: RelationType;
  weight?: number;
  financingAmountM?: number;
  provenanceRef?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters?: {
    id: string;
    label: string;
    color: string;
    nodeCount: number;
  }[];
  generatedAt: string;
  totalEntities: number;
  totalRelationships: number;
  totalCommitmentBillionUSD: number;
}

export interface WbgDocument {
  id: string; // e.g. "P173840"
  docId: string; // e.g. "PAD4829"
  projectTitle: string;
  country: string;
  region: string;
  sector: string;
  instrument: "IBRD" | "IDA" | "IFC" | "MIGA";
  commitmentUSD: number;
  approvalDate: string;
  closingDate: string;
  status: "Active" | "Pipeline" | "Closed";
  sha256Hash: string;
  pdfUrl: string;
  appraisalRating: {
    environmentalRisk: "Moderate" | "Substantial" | "High" | "Low";
    implementationProgress: "Satisfactory" | "Moderately Satisfactory" | "Highly Satisfactory";
    disbursedPercentage: number;
  };
  metricsDiff?: {
    appraisalTargetBeneficiaries: number;
    completionActualBeneficiaries: number;
    variancePercentage: number;
    icrAuditStatus: "RECONCILED" | "FLAGGED_DISCREPANCY" | "UNDER_REVIEW";
  };
}

export interface TelemetrySnapshot {
  totalInvestmentsUSD: number; // e.g. $428.5 Billion
  activeOperationsCount: number; // e.g. 1,842
  memberCountriesActive: number; // e.g. 144
  averageDisbursementRatio: number; // e.g. 78.4%
  provVerifiedRatio: number; // 99.8%
  lastSyncTimestamp: string;
  instrumentBreakdown: {
    ibrd: number;
    ida: number;
    ifc: number;
    miga: number;
  };
}

export interface FilterState {
  searchQuery: string;
  selectedSector: string;
  selectedRegion: string;
  selectedCategories: EntityCategory[];
  minCommitmentM: number;
  verifiedOnly: boolean;
}

export interface TracedPathHop {
  node: GraphNode;
  edge?: GraphEdge;
}

export interface TracedPathData {
  source: GraphNode;
  target: GraphNode;
  hops: TracedPathHop[];
  totalFinancingM: number;
}
