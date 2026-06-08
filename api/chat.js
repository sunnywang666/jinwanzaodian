/**
 * api/chat.js — Vercel serverless proxy
 *
 * 转发聊天请求到 AIPing API，保护 API key 不暴露给前端。
 * 前端 POST { messages } → 这里转发 → AIPing → 返回 { reply }
 *
 * 环境变量（在 Vercel 项目设置中配置）：
 * - AIPING_API_KEY: AIPing API 密钥（必填）
 * - AIPING_MODEL: 模型名称（默认 deepseek-v3）
 * - AIPING_API_ENDPOINT: API 地址（默认 https://aiping.cn/api/v1/chat/completions）
 */

const AIPING_ENDPOINT = process.env.AIPING_API_ENDPOINT || "https://aiping.cn/api/v1/chat/completions";
const AIPING_MODEL = process.env.AIPING_MODEL || "deepseek-v3";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 优先用请求里带的 key（用户自带），否则用服务端环境变量（内置）
  const authHeader = req.headers.authorization;
  const userKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const apiKey = userKey || process.env.AIPING_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  const { messages, max_tokens } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body: messages must be an array" });
  }

  try {
    const upstream = await fetch(AIPING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AIPING_MODEL,
        max_tokens: max_tokens || 400,
        messages,
      }),
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: `AIPing API ${upstream.status}`,
        details: text.slice(0, 500),
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: "Invalid JSON from upstream" });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ error: "Empty response from upstream" });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to reach upstream LLM provider",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
