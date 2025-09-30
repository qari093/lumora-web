import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  // Safe fallback when envs are missing in Vercel preview/build
  if (!url || !key) {
    return NextResponse.json({ ok: true, tracks: [] }, { status: 200 });
  }

  try {
    // Lazy import so module doesn't load during build
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("tracks")
      .select("*")
      .eq("playlist_id", params.id)
      .limit(100);

    if (error) {
      console.error("[tracks route] supabase error:", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, tracks: data ?? [] }, { status: 200 });
  } catch (err: unknown) {
    console.error("[tracks route] unexpected error:", (err as any)?.message ?? err);
    return NextResponse.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}
