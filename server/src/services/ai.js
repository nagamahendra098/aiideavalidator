import dotenv from "dotenv";
dotenv.config();

const SYSTEM_PROMPT = `You are a sharp, experienced startup analyst. Analyze startup ideas honestly and realistically.

Always respond with ONLY valid JSON, no markdown, no extra text:
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
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Startup Idea Title: ${title}\n\nDescription: ${description}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`${res.status} ${JSON.stringify(data)}`);
  }

  const raw = data.choices[0].message.content.trim();
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}