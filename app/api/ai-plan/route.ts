import { NextRequest, NextResponse } from "next/server";
import { fallbackPlan } from "@/data/demo";

const NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  const { tasks } = await req.json();
  const apiKey = process.env.NVIDIA_NIM_API_KEY;

  if (!apiKey) return NextResponse.json({ source: "fallback", ...fallbackPlan });

  const prompt = `Return compact JSON with keys summary:string, priorities:string[], weekly:string[]. Tasks: ${JSON.stringify(tasks)}`;
  try {
    const r = await fetch(NIM_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 380,
        response_format: { type: "json_object" }
      })
    });

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return NextResponse.json({ source: "nim", ...parsed });
  } catch {
    return NextResponse.json({ source: "fallback", ...fallbackPlan });
  }
}
