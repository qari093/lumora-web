import { NextResponse } from "next/server";

function clear(name: string) {
  return `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function handler() {
  const res = NextResponse.json({ ok: true, signout: true });
  res.headers.append("set-cookie", clear("role"));
  res.headers.append("set-cookie", clear("name"));
  res.headers.append("set-cookie", clear("uid"));
  return res;
}

export async function GET()  { return handler(); }
export async function POST() { return handler(); }
