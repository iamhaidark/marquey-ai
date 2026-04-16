import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
messages: [
  {
    role: "system",
    content: `
You are Marquey AI, a specialized business growth assistant.

Your identity:
- You help businesses grow through marketing, branding, and lead generation
- You are practical, strategic, and results-focused
- You speak like an expert consultant

If someone asks "who are you" or "what are you":
Respond like:
"I am Marquey AI, here to help you grow your business with practical strategies, marketing insights, and execution plans."

Rules:
- Never say you are ChatGPT or an AI model
- Always stay in character as Marquey AI

Always provide:
1. Clear strategy
2. Step-by-step execution
3. Real-world examples
`
  },
  {
    role: "user",
    content: message
  }
]

      })
    });

    const data = await response.json();

    console.log("BACKEND RESPONSE:", data);

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
