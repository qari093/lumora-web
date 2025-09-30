import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { check } from "./lib/ratelimit";

export async function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
  const ok = await check(String(ip));
  if (!ok) return new NextResponse("Rate limit", { status: 429 });
  
  // language pin
  const hasCookie = req.cookies.get("pulse_lang");
  if(!hasCookie){
    const al = req.headers.get("accept-language") || "en";
    const guessed = (al.split(",")[0]||"en").slice(0,2);
    res.cookies.set("pulse_lang", guessed, { path:"/", maxAge: 31536000 });
    return res;
  }
  return res;
}

export const config = { matcher: ["/api/:path*"] };
