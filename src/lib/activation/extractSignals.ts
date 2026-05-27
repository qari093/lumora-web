export type LiveSignal = {
  id: string;
  source: "google_trends" | "rss" | "reddit";
  title: string;
  url: string;
  score_hint: number;
  ts: number;
};

function safeId(s: string) {
  return Buffer.from(s).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 24);
}

export function extractSignals(raw: string, source: LiveSignal["source"]): LiveSignal[] {
  if (source === "rss") {
    const matches = [...raw.matchAll(/<title>(.*?)<\/title>/g)]
      .map(m => m[1])
      .filter(Boolean)
      .slice(1, 20);

    return matches.map((t, i) => ({
      id: safeId(t + i),
      source,
      title: t,
      url: "",
      score_hint: 1000 - i,
      ts: Date.now()
    }));
  }

  if (source === "reddit") {
    try {
      const json = JSON.parse(raw);
      return (json?.data?.children || []).slice(0, 20).map((c: any, i: number) => ({
        id: safeId(c.data.title + i),
        source,
        title: c.data.title,
        url: c.data.url,
        score_hint: c.data.score || (500 - i),
        ts: Date.now()
      }));
    } catch {
      return [];
    }
  }

  return [{
    id: safeId("trend"),
    source,
    title: "google_trends_snapshot",
    url: "",
    score_hint: raw.length,
    ts: Date.now()
  }];
}
