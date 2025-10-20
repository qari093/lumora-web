import { NextResponse, type NextRequest } from "next/server";
import { normalizeLang } from "./lib/i18n";

export function middleware(req: NextRequest) {
  // If lang cookie absent, set based on accept-language, else passthrough
  const has = req.cookies.get("lang")?.value;
  if (!has) {
    const al = req.headers.get("accept-language") || "en";
    const lang = normalizeLang(al.split(",")[0]||"en");
    const res = NextResponse.next();
    res.headers.append("set-cookie", `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`);
    return res;
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/|favicon.ico).*)"]
}
