import { NextResponse } from "next/server";

const BACKEND_URL = process.env.SEMANTICA_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/snapshot`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Separate backend returned status ${res.status}`);
    }

    const telemetry = await res.json();
    return NextResponse.json(telemetry, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error connecting to separate backend for snapshot:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch snapshot from separate backend",
        backendUrl: BACKEND_URL,
        details: String(error),
      },
      { status: 502 }
    );
  }
}
