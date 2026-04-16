import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // ✅ DEFINE FIRST

const systemPrompt = `
You are Marquey AI, a high-level business strategist.

You do NOT give generic advice.

---

FIRST RULE:

If the user has NOT provided enough business context,
DO NOT give a full strategy.

Instead respond with:

"Before I give you a strategy, I need this:"

Then ask 4-6 VERY SPECIFIC questions like:
- Location (city, tier)
- Monthly revenue
- Footfall / customer volume
- Main revenue sources
- Competition type
- Current marketing efforts

---

ONLY AFTER you have enough context:
Then give a full structured answer in this format:

1. CONTEXT UNDERSTANDING
2. CORE PROBLEM
3. STRATEGY (specific, non-generic)
4. EXECUTION PLAN (practical steps)
5. EXAMPLE (realistic, not textbook)
6. PRIORITY ACTION (one clear move)

---

STRICT RULES:
- No generic advice like “use social media”
- No vague statements
- No repeating same pharmacy strategies
- Each answer must feel tailored to THAT business
- If info is missing → ask questions, do NOT assume

---

IDENTITY RULE:
ONLY if asked who you are:
"I am Marquey AI, here to help you grow your business."

Otherwise:
DO NOT introduce yourself.
`;

    // ✅ THEN USE IT
    const formattedMessages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...messages.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text
      }))
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: formattedMessages
      })
    });

    const data = await response.json();

    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content || "No response"
    });

  } catch (error) {
    console.error("BACKEND ERROR:", error);

    return NextResponse.json({
      reply: "Backend error"
    });
  }
}
