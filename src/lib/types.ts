export type EntityCategory =
  | "project"
  | "country"
  | "ministry"
  | "tech"
  | "policy"
  | "discrepancy"
  | "asset"
  | "institution"
  | "geography"
  | "pillar"
  | "covenant";

export type RelationType =
  | "FINANCES"
  | "OPERATES_IN"
  | "DEPLOYED_IN"
  | "IMPLEMENTED_BY"
  | "GOVERNED_BY"
  | "FLAGGED_IN"
  | "HOSTS_OPERATION"
  | "ENFORCES"
  | "COMMITS_CAPITAL"
  | "APPOINTS_EXECUTING_AGENCY"
  | "MANDATED_TO_DEPLOY"
  | string;

export type PathTraversalType = "out" | "in" | "all" | "direct";

export type GraphLayoutAlgorithm =
  | "treeLr2d"
  | "hierarchicalTd"
  | "forceDirected2d"
  | "circular2d"
  | "radialOut2d";

export type NodePresentationMode = "pill_minimalist" | "rich_institutional_icons";

export interface BracketAnnotation {
  id: string;
  label: string;
  subLabel?: string;
  color: string;
  nodeIds: string[];
  topNodeId?: string;
  bottomNodeId?: string;
}

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
  organization?: "IBRD" | "IDA" | "IFC" | "MIGA" | "ICSID" | string;
  icon?: string;
  fill?: string;
  cluster?: string;
  provenance: W3CProvenance;
  metadata?: {
    approvalDate?: string;
    closingDate?: string;
    leadAgency?: string;
    description?: string;
    officialUrl?: string;
    pdfDownloadUrl?: string;
    tags?: string[];
    [key: string]: any;
  };
  data?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: RelationType;
  weight?: number;
  financingAmountM?: number;
  provenanceRef?: string;
  fill?: string;
  size?: number;
  isPrimaryBackbone?: boolean;
  evidenceQuote?: string;
  pageNumber?: number;
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
  generatedAt?: string;
  totalEntities?: number;
  totalRelationships?: number;
  totalCommitmentBillionUSD?: number;
}

export interface WbgDocument {
  id: string; // e.g. "P173840"
  docId: string; // e.g. "PAD4829"
  projectTitle: string;
  country: string;
  region: string;
  sector: string;
  instrument: "IBRD" | "IDA" | "IFC" | "MIGA" | string;
  commitmentUSD: number;
  approvalDate: string;
  closingDate: string;
  status: "Active" | "Pipeline" | "Closed" | string;
  sha256Hash: string;
  pdfUrl: string;
  appraisalRating?: {
    environmentalRisk: "Moderate" | "Substantial" | "High" | "Low" | string;
    implementationProgress: "Satisfactory" | "Moderately Satisfactory" | "Highly Satisfactory" | string;
    disbursedPercentage: number;
  };
  metricsDiff?: {
    appraisalTargetBeneficiaries: number;
    completionActualBeneficiaries: number;
    variancePercentage: number;
    icrAuditStatus: "RECONCILED" | "FLAGGED_DISCREPANCY" | "UNDER_REVIEW" | string;
  };
}

export interface SemanticTripletItem {
  id: string;
  subject: string;
  predicate: string;
  object: string;
  citation: string;
  verbatimQuote: string;
  pageNumber: number;
  covenantCode?: string;
  confidenceScore: number;
  provActivity: string;
  hash?: string;
}

export interface DocumentChunkItem {
  id: string;
  sectionTitle: string;
  pageNumber: number;
  chunkType: string;
  content: string;
}

export interface DocumentInsightData {
  asset: {
    id: string;
    title: string;
    docType: string;
    country: string;
    region: string;
    sector: string;
    commitmentUSD: number;
    pdfUrl: string;
    sha256Hash: string;
  };
  chunks: DocumentChunkItem[];
  triplets: SemanticTripletItem[];
  totalSections: number;
  totalTriplets: number;
}

export interface TelemetrySnapshot {
  totalInvestmentsUSD: number;
  activeOperationsCount: number;
  memberCountriesActive: number;
  averageDisbursementRatio: number;
  provVerifiedRatio: number;
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
