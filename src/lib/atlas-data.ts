// Plain-language data for the Living Atlas home page.
// No "node", "edge", "triple", or "ontology" language ever reaches the UI —
// only dots (things), threads (connections), and stories (things connected).

export type DotColor = "blue" | "green" | "grey" | "navy"

export const DOT_HEX: Record<DotColor, string> = {
  blue: "#1f5fd1",
  green: "#1f9d57",
  grey: "#8b97ac",
  navy: "#24344f",
}

export type AnchorDot = {
  id: string
  label: string
  tip: string
  color: DotColor
  // home position in normalized 0..1 space
  x: number
  y: number
  r: number
}

// Named, real things from the graph. These are the dots that reward hovering.
export const ANCHORS: AnchorDot[] = [
  {
    id: "kenya-credit",
    label: "Kenya credit · $350M",
    tip: "In May 2023, the World Bank approved $350M for digital infrastructure in Kenya.",
    color: "blue",
    x: 0.24,
    y: 0.36,
    r: 9,
  },
  {
    id: "jobs",
    label: "Jobs & people",
    tip: "The jobs and people created downstream of each operation.",
    color: "blue",
    x: 0.7,
    y: 0.58,
    r: 8,
  },
  {
    id: "ministry",
    label: "Ministry of ICT",
    tip: "Kenya's executing agency for the digital integration operation.",
    color: "grey",
    x: 0.45,
    y: 0.24,
    r: 7,
  },
  {
    id: "ganga",
    label: "Ganga basin",
    tip: "A river basin in India tied to water-quality data and sanitation projects.",
    color: "green",
    x: 0.6,
    y: 0.8,
    r: 8,
  },
  {
    id: "water",
    label: "Water quality data",
    tip: "Indicators measuring river health across the basin over time.",
    color: "green",
    x: 0.82,
    y: 0.7,
    r: 7,
  },
  {
    id: "docs",
    label: "Source documents",
    tip: "Thousands of appraisal documents — every fact traces back to one.",
    color: "grey",
    x: 0.16,
    y: 0.68,
    r: 7,
  },
  {
    id: "countries",
    label: "190 countries",
    tip: "Every sovereign member state, connected into one map.",
    color: "navy",
    x: 0.86,
    y: 0.3,
    r: 7,
  },
  {
    id: "sanitation",
    label: "Sanitation projects",
    tip: "Projects improving sanitation along the river basin.",
    color: "green",
    x: 0.4,
    y: 0.72,
    r: 6,
  },
]

// Continuous operational narration sequence across labeled anchor nodes.
export const NARRATION_THREADS = [
  {
    from: "kenya-credit",
    to: "ministry",
    caption: "A $350M credit flows directly to the executing Ministry of ICT in Kenya.",
  },
  {
    from: "ministry",
    to: "jobs",
    caption: "Fiber rollout under the Ministry creates thousands of local digital economy jobs.",
  },
  {
    from: "jobs",
    to: "countries",
    caption: "Livelihood programs expand across 190 sovereign member countries.",
  },
  {
    from: "countries",
    to: "docs",
    caption: "Every sovereign operation anchors in cryptographic Project Appraisal Documents.",
  },
  {
    from: "docs",
    to: "ganga",
    caption: "Appraisal records link historical ecological data to the Ganga river basin.",
  },
  {
    from: "ganga",
    to: "sanitation",
    caption: "Basin restoration initiatives finance municipal water treatment plants.",
  },
  {
    from: "sanitation",
    to: "water",
    caption: "Treatment plants directly register verified water quality sensor telemetry.",
  },
  {
    from: "water",
    to: "kenya-credit",
    caption: "Multi-sector lessons circulate back through the global operational memory.",
  },
]

export const NARRATION = NARRATION_THREADS[0]

export type MiniNode = { id: string; label: string; color: DotColor; x: number; y: number }
export type MiniEdge = [string, string]

export type Story = {
  id: string
  question: string
  caption: string
  nodes: MiniNode[]
  edges: MiniEdge[]
}

// Story cards — each is a question a human asks, answered by a mini-graph.
export const STORIES: Story[] = [
  {
    id: "follow-the-money",
    question: "Follow the money.",
    caption: "A $350M credit flows through a ministry into fiber cables — and into jobs.",
    nodes: [
      { id: "credit", label: "$350M credit", color: "blue", x: 8, y: 52 },
      { id: "ministry", label: "Ministry", color: "grey", x: 38, y: 18 },
      { id: "fiber", label: "Fiber cables", color: "green", x: 66, y: 70 },
      { id: "jobs", label: "Jobs", color: "blue", x: 93, y: 40 },
    ],
    edges: [
      ["credit", "ministry"],
      ["ministry", "fiber"],
      ["fiber", "jobs"],
    ],
  },
  {
    id: "find-the-root-cause",
    question: "Find the root cause.",
    caption: "A drought lifts crop prices, driving migration that strains a health project.",
    nodes: [
      { id: "drought", label: "Drought", color: "blue", x: 8, y: 30 },
      { id: "prices", label: "Crop prices", color: "navy", x: 38, y: 66 },
      { id: "migration", label: "Migration", color: "grey", x: 66, y: 24 },
      { id: "health", label: "Health project", color: "green", x: 93, y: 60 },
    ],
    edges: [
      ["drought", "prices"],
      ["prices", "migration"],
      ["migration", "health"],
    ],
  },
  {
    id: "one-river-many-hands",
    question: "One river, many hands.",
    caption: "The Ganga basin links water-quality data to sanitation and river restoration.",
    nodes: [
      { id: "ganga", label: "Ganga basin", color: "green", x: 8, y: 50 },
      { id: "data", label: "Water data", color: "green", x: 38, y: 18 },
      { id: "sanitation", label: "Sanitation", color: "grey", x: 66, y: 70 },
      { id: "restoration", label: "Restoration", color: "blue", x: 93, y: 42 },
    ],
    edges: [
      ["ganga", "data"],
      ["data", "sanitation"],
      ["sanitation", "restoration"],
    ],
  },
]

// Sandbox chips — curated so every pair resolves to a real sentence.
export type Chip = { id: string; label: string; color: DotColor }

export const CHIPS: Chip[] = [
  { id: "kenya", label: "A credit to Kenya", color: "blue" },
  { id: "jobs", label: "Jobs it creates", color: "blue" },
  { id: "paper", label: "The paper trail", color: "grey" },
  { id: "river", label: "A river in India", color: "green" },
]

function pairKey(a: string, b: string) {
  return [a, b].sort().join("+")
}

export const PAIR_STORIES: Record<string, string> = {
  [pairKey("kenya", "jobs")]:
    "The Kenya credit funds fiber cables that create thousands of jobs — one continuous thread.",
  [pairKey("kenya", "paper")]:
    "The Kenya credit is pinned to its appraisal document. Every dollar has a receipt.",
  [pairKey("kenya", "river")]:
    "Two very different operations — a Kenyan credit and an Indian river — are threads in the same 80-year map.",
  [pairKey("jobs", "paper")]:
    "The jobs trace back through the project record to the document that authorized the money.",
  [pairKey("jobs", "river")]:
    "River-restoration work along the Ganga creates local jobs — connected across sectors.",
  [pairKey("paper", "river")]:
    "The Ganga river work traces back to the sanitation documents that fund and describe it.",
}

export function resolvePair(a: string, b: string): string {
  return (
    PAIR_STORIES[pairKey(a, b)] ??
    "These two things are connected — and here is the proof behind the thread."
  )
}

export const EVIDENCE = [
  { value: 428.5, prefix: "$", suffix: "B", label: "active portfolio", gloss: "across IBRD, IDA & IFC" },
  { value: 190, prefix: "", suffix: "", label: "countries", gloss: "every sovereign member state" },
  { value: 80, prefix: "", suffix: "yrs", label: "of memory", gloss: "since Bretton Woods, 1944" },
  { value: 1842, prefix: "", suffix: "", label: "operations", gloss: "each traceable to its source" },
]
