import { NextResponse } from "next/server";
import { getRemoteConfig } from "@/lib/config/getRemoteConfig";

export async function GET() {
  try {
    const config = getRemoteConfig();

    return NextResponse.json({
      ok: true,
      source: "lumora_remote_config_v1",
      config,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "config_fetch_failed" },
      { status: 500 }
    );
  }
}
