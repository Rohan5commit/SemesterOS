import { NextRequest, NextResponse } from "next/server";
import { fallbackPlan } from "@/data/demo";

const NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

function safeParse(content: string) {
  try {
    const parsed = JSON.parse(content);
    if (!parsed.summary || !Array.isArray(parsed.priorities) || !Array.isArray(parsed.weekly)) {
      return fallbackPlan;
    }
    return parsed;
  } catch {
    return fallbackPlan;
  }
}

export async function POST(req: NextRequest) {
  const { tasks, availability, goals } = await req.json();
  const apiKey = process.env.NVIDIA_NIM_API_KEY;

  if (!apiKey) return NextResponse.json({ source: "fallback", ...fallbackPlan });

  const prompt = `You are SemesterOS planner. Return ONLY JSON object with keys:\nsummary:string\npriorities:string[3]\nweekly:string[5]\n\nTasks:${JSON.stringify(tasks)}\nAvailability:${JSON.stringify(availability)}\nGoals:${JSON.stringify(goals)}\nRules: concise, practical, realistic for a student.`;

  try {
    const response = await fetch(NIM_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 420,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) throw new Error("NIM request failed");
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = safeParse(content);
    return NextResponse.json({ source: "nim", ...parsed });
  } catch {
    return NextResponse.json({ source: "fallback", ...fallbackPlan });
  }
}
