exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return { statusCode: 500, headers: {"Content-Type":"application/json"}, body: JSON.stringify({ error: "API key not configured" }) };
  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) }; }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: body.max_tokens || 9000, system: body.system || "", messages: body.messages })
    });
    const data = await res.json();
    return { statusCode: res.ok ? 200 : res.status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, headers: {"Content-Type":"application/json"}, body: JSON.stringify({ error: e.message }) };
  }
};
