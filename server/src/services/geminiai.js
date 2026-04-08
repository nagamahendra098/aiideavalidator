import dotenv from "dotenv";
dotenv.config();

const SYSTEM_PROMPT = `You are a sharp, experienced startup analyst. When given a startup idea, you produce an honest, grounded validation report. Be direct, specific, and realistic — not hype-driven.

Always respond with ONLY valid JSON, no markdown, no extra text. Use this exact structure:
{
  "problemSummary": "2-3 sentences describing the core problem being solved",
  "customerPersona": "2-3 sentences describing the primary target customer",
  "marketOverview": "2-3 sentences on market size, trends, and opportunity",
  "competitors": ["Competitor 1", "Competitor 2", "Competitor 3", "Competitor 4"],
  "techStack": ["Technology 1", "Technology 2", "Technology 3", "Technology 4", "Technology 5"],
  "riskLevel": "Medium",
  "profitabilityScore": 65,
  "fullAnalysis": "4-6 sentences with your overall honest take on this idea"
}`;

export async function analyzeIdea(title, description) {
  const prompt = `${SYSTEM_PROMPT}\n\nStartup Idea Title: ${title}\n\nDescription: ${description}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`${res.status} ${JSON.stringify(data)}`);
  }

  if (
    !data.candidates ||
    !data.candidates[0] ||
    !data.candidates[0].content ||
    !data.candidates[0].content.parts ||
    !data.candidates[0].content.parts[0]
  ) {
    throw new Error("Invalid response structure from Gemini");
  }

  const raw = data.candidates[0].content.parts[0].text.trim();

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in Gemini response");

  const parsed = JSON.parse(match[0]);
  return parsed;
}