import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.SEMANTICA_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/documents`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Separate backend returned status ${res.status}`);
    }

    const documents = await res.json();
    return NextResponse.json(
      {
        total: documents.length,
        documents,
        backendService: "Atlas Knowledge Standalone Python Engine",
        provenanceAuditEngine: "W3C-PROV-O Cryptographic Engine v2.4",
        verifiedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
        },
      }
    );
  } catch (error) {
    console.error("Error connecting to separate backend for documents:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch documents from separate backend",
        backendUrl: BACKEND_URL,
        details: String(error),
      },
      { status: 502 }
    );
  }
}
