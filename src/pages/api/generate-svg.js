// src/pages/api/generate-svg.js
export const prerender = false;

import OpenAI from "openai";

const BASE_URL = import.meta.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
const ACCESS_TOKEN = import.meta.env.OPENROUTER_API_KEY;
const MODEL = import.meta.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST = async ({ request }) => {
  try {
    if (!ACCESS_TOKEN) return json({ success: false, error: "Missing OPENROUTER_API_KEY" }, 500);

    // Lire JSON proprement
    let messages = null, prompt = "";
    const ct = request.headers.get("content-type") || "";

    if (ct.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      messages = body?.messages || null;
      prompt = body?.prompt || "";
    } else if (ct.includes("multipart/form-data")) {
      const fd = await request.formData();
      prompt = fd.get("prompt") || "";
      const m = fd.get("messages");
      if (m) try { messages = JSON.parse(m); } catch {}
    } else {
      const txt = await request.text();
      if (txt) try {
        const body = JSON.parse(txt);
        messages = body?.messages || null;
        prompt = body?.prompt || "";
      } catch {}
    }

    if (!messages && prompt) messages = [{ role: "user", content: prompt }];
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ success: false, error: 'Empty body: provide {messages:[...]} or {prompt:"..."}' }, 400);
    }

    const client = new OpenAI({
      baseURL: BASE_URL,
      apiKey: ACCESS_TOKEN,
      defaultHeaders: {
        "HTTP-Referer": import.meta.env.PUBLIC_SITE_URL || "http://localhost:4321",
        "X-Title": "TaVue IA",
      },
    });

    const systemMessage = {
      role: "system",
      content:
        "You are an SVG code generator. Reply with a single valid <svg>...</svg> only (no markdown fences). Include ids for parts.",
    };

    const chat = await client.chat.completions.create({
      model: MODEL,
      messages: [systemMessage, ...messages],
      temperature: 0.5,
    });

    const content = chat.choices?.[0]?.message?.content || "";
    const svg = (content.match(/<svg[\s\S]*?<\/svg>/i) || [""])[0];

    return json({ success: true, svg, fullResponse: content });
  } catch (error) {
    console.error("Erreur API /api/generate-svg :", error);
    return json({ success: false, error: error.message || String(error) }, 500);
  }
};
