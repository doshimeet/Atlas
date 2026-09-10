import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL =
  process.env.SEMANTICA_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/graph`, {
      headers: { Accept: "application/json" },
    });

    if (!backendRes.ok) {
      throw new Error(`Separate backend returned status ${backendRes.status}`);
    }

    const data = await backendRes.json();
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error connecting to separate Atlas Knowledge backend:", error);
    return res.status(502).json({
      error: "Failed to fetch from separate backend service",
      backendUrl: BACKEND_URL,
      details: String(error),
    });
  }
}
