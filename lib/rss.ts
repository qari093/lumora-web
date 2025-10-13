export type RssItem = { title: string; link: string; pubDate?: string; source?: string; description?: string };

function clean(s?: string) {
  return (s || "")
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseSimpleRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const b of blocks) {
    const title = clean((b.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
    const link  =
      clean((b.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1]) ||
      (b.match(/<link[^>]*?\bhref="([^"]+)"/i) || [])[1] ||
      "";
    const pubDate     = clean((b.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1]);
    const source      = clean((b.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1]);
    const description = clean((b.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1]);
    if (title || link) items.push({ title, link, pubDate, source, description });
  }
  return items;
}
"RSS"
echo "STEP 1 done ✅"

# STEP 2: Create /api/news endpoint ✅
mkdir -p app/api/news
cat > app/api/news/route.ts <<NEWS
import { NextResponse } from "next/server";
import { pickLocale } from "../../../lib/locale";
import { parseSimpleRss } from "../../../lib/rss";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function rssUrl(lang: string, country?: string, topic?: string) {
  const base = (lang || "en").split("-")[0];
  const cc   = (country || "US").toUpperCase();
  const ceid = ;
  const params = new URLSearchParams({ hl: base, gl: cc, ceid });
  if (topic && topic !== "top") {
    return "https://news.google.com/rss/search?q=" + encodeURIComponent(topic) + "&" + params.toString();
  }
  return "https://news.google.com/rss?" + params.toString();
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = (searchParams.get("topic") || "top").trim();
    const locale = pickLocale(req);
    const country = locale.region || "US";
    const url = rssUrl(locale.lang, country, topic);

    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error("news fetch failed");
    const xml = await r.text();
    const items = parseSimpleRss(xml).slice(0, 20);

    return NextResponse.json(
      { ok:true, topic, locale, items, count: items.length },
      { headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=1800" } }
    );
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
"NEWS"
echo "STEP 2 done ✅"

# STEP 3: Restart Next on 3010 and verify ✅
pkill -f "next dev" >/dev/null 2>&1 || true
rm -rf .next
export PORT=3010
nohup npx next dev > /tmp/next-dev.out 2>&1 &
echo  > /tmp/next-dev.pid
for i in {1..40}; do grep -q "Ready" /tmp/next-dev.out && break || sleep 1; done
echo "NEXT ready ✅ (PID 95743)"

echo "🌍 Test /api/news (top):"
curl -sS "http://127.0.0.1:3010/api/news" | head -c 400; echo
echo "📰 Test /api/news?topic=technology:"
curl -sS "http://127.0.0.1:3010/api/news?topic=technology" | head -c 400; echo
