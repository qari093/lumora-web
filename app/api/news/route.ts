import { NextResponse } from "next/server";
import { pickLocale } from "../../../lib/locale";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function extractItems(xml: string) {
  const items: any[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml))) {
    const block = m[1];

    const get = (tag: string) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
      const mm = r.exec(block);
      return mm ? mm[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim() : "";
    };

    const title = get("title");
    let link = get("link");
    const pubDate = get("pubDate");
    const source = get("source");

    // Unwrap Google News redirect links if present (?url=...)
    try {
      const u = new URL(link);
      const real = u.searchParams.get("url");
      if (real) link = real;
    } catch {/* ignore */}

    if (title && link) items.push({ title, link, pubDate, source });
  }
  return items;
}

export async function GET(req: Request) {
  try {
    const locale = pickLocale(req);
    const url = new URL(req.url);
    const topic = (url.searchParams.get("topic") || "").trim();
    const hl = locale.lang || "en";
    const gl = (locale.region || "US").toUpperCase();

    let feed = `https://news.google.com/rss?hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}`;
    if (topic) {
      const q = encodeURIComponent(topic);
      feed = `https://news.google.com/rss/search?q=${q}&hl=${encodeURIComponent(hl)}&gl=${encodeURIComponent(gl)}`;
    }

    const r = await fetch(feed, { cache: "no-store" });
    if (!r.ok) throw new Error("news fetch failed");
    const xml = await r.text();
    const items = extractItems(xml);

    return NextResponse.json(
      { ok: true, locale, topic: topic || null, count: items.length, items },
      { headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=1800" } }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
