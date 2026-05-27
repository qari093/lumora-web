import { NextResponse } from "next/server";

export async function readJson<T extends Record<string, unknown>>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}

export function okJson<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function failJson(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}
