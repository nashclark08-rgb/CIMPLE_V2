// ============================================================
// CIMPLE — AI communications drafting (Vercel serverless)
// PRD M4 / §9.2: AI produces a DRAFT only. Nothing is sent or
// decided automatically — a human (Comms Lead → Principal)
// reviews, edits, approves and dispatches every message.
//
// Requires env var ANTHROPIC_API_KEY. If absent or the call
// fails, the client falls back to the seeded template so the
// tool still works (PRD graceful-absence guardrail).
// ============================================================

const MODEL = "claude-sonnet-5";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "AI drafting not configured (no ANTHROPIC_API_KEY)." });
    return;
  }

  try {
    const { incidentType, audience, channels, seed, instruction } = req.body || {};

    const system =
      "You are assisting the Communications Lead at Trinity Anglican College (an Australian K–12 school) " +
      "to draft a critical-incident communication. Write in clear, calm, factual Australian English. " +
      "Be reassuring but never speculate on facts, causes, injuries or blame — leave a bracketed placeholder " +
      "where specific facts are needed. Keep it appropriate for the stated audience and channel length " +
      "(SMS must be short). This is a DRAFT for human review; do not add commentary, only the message body.";

    const user = [
      `Incident type: ${incidentType || "unspecified"}`,
      `Audience: ${audience || "parents & carers"}`,
      `Channel(s): ${(channels || []).join(", ") || "app / email"}`,
      instruction ? `Instruction: ${instruction}` : "",
      seed ? `\nStarting point / house style to follow:\n${seed}` : "",
      "\nDraft the message body now.",
    ]
      .filter(Boolean)
      .join("\n");

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      res.status(502).json({ error: "Upstream AI error", detail });
      return;
    }

    const data = await r.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: "Draft failed", detail: String(e) });
  }
}
