import { NextResponse } from "next/server";
import { normalizeLang, setLangCookieHeader } from "../../../lib/i18n/index";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}));
    const lang = normalizeLang(body?.lang);
    const res = NextResponse.json({ ok:true, lang });
    const [hn, hv] = setLangCookieHeader(lang);
    res.headers.append(hn, hv);
    return res;
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
