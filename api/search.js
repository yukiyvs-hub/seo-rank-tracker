export default async function handler(req, res) {
  // CORS設定
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { q, api_key, num, start, gl, hl } = req.query;

  if (!q || !api_key) {
    return res.status(400).json({ error: "q and api_key are required" });
  }

  try {
    const params = new URLSearchParams({
      api_key,
      engine: "google",
      q,
      num: num || 10,
      start: start || 0,
      hl: hl || "ja",
      output: "json"
    });
    if (gl) params.append("gl", gl);

    const response = await fetch("https://serpapi.com/search?" + params);
    const data = await response.json();

    if (data.error) {
      return res.status(403).json({ error: data.error });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
