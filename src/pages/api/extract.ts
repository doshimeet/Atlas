import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL =
  process.env.SEMANTICA_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!backendRes.ok) {
      const err = await backendRes.text();
      return res.status(backendRes.status).json({ error: err });
    }

    const data = await backendRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error connecting to separate backend for extraction:", error);
    return res.status(502).json({
      error: "Failed to extract triplets from separate backend",
      details: String(error),
    });
  }
}
