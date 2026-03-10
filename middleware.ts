import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  res.headers.set("X-Lumora-Sec", "1")
  res.headers.set("X-Frame-Options", "SAMEORIGIN")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("X-XSS-Protection", "1; mode=block")

  return res
}

export const config = {
  matcher: "/:path*",
}
