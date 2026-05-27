export function extractSignals(raw: string, source: string) {
  const out: any[] = [];

  if (source === "rss" || source === "google_trends") {
    const matches = [...raw.matchAll(/<title>(.*?)<\/title>/g)];
    for (let i = 1; i < matches.length; i++) {
      const title = (matches[i][1] || "").trim();
      if (!title) continue;
      out.push({
        id: Buffer.from(`${source}:${title}:${i}`).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 24),
        source,
        title,
        url: "",
        score_hint: 1000 - i,
        ts: Date.now()
      });
    }
  }

  if (source === "reddit") {
    try {
      const json = JSON.parse(raw);
      for (const post of (json?.data?.children || []).slice(0, 25)) {
        const d = post?.data || {};
        if (!d?.title) continue;
        out.push({
          id: String(d.id || Buffer.from(d.title).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 16)),
          source,
          title: d.title,
          url: d.url || "",
          score_hint: Number(d.score || 1),
          ts: Date.now()
        });
      }
    } catch {}
  }

  return out;
}
