import { NextResponse } from "next/server";
import { normalizeLang } from "../../../../lib/i18n/index";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lang = normalizeLang(url.searchParams.get("lang"));
    const ns   = (url.searchParams.getAll("ns") || ["common"]).filter(Boolean);
    // Dynamically import each namespace and merge
    const out: Record<string, any> = {};
    for (const n of ns) {
      try {
        const mod = await import(`../../../../locales/${lang}/${n}.json`);
        Object.assign(out, mod.default || mod);
      } catch {
        const mod = await import(`../../../../locales/en/${n}.json`);
        Object.assign(out, mod.default || mod);
      }
    }
    return NextResponse.json({ ok:true, lang, strings: out });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
