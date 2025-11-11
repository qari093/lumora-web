import { NextResponse } from "next/server";

type LumaSpaceMode = "demo" | "beta" | "live";

interface LumaSpaceSection {
  id: string;
  label: string;
  enabled: boolean;
  weight: number;
}

interface LumaSpaceStatePayload {
  ok: boolean;
  schemaVersion: number;
  mode: LumaSpaceMode;
  version: string;
  updatedAt: string;
  sections: LumaSpaceSection[];
}

function buildOk(body: LumaSpaceStatePayload) {
  return NextResponse.json(body, { status: 200 });
}

function buildError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET() {
  try {
    const now = new Date();
    const mode: LumaSpaceMode =
      (process.env.LUMASPACE_MODE as LumaSpaceMode | undefined) ?? "demo";

    const sections: LumaSpaceSection[] = [
      {
        id: "reflection-journal",
        label: "Reflection Journal",
        enabled: true,
        weight: 1.0,
      },
      {
        id: "shadow-journal",
        label: "Shadow Journal",
        enabled: true,
        weight: 0.95,
      },
      {
        id: "emotion-heatmap",
        label: "Emotion Heatmap",
        enabled: true,
        weight: 0.9,
      },
      {
        id: "breath-room",
        label: "Breath Room",
        enabled: true,
        weight: 0.85,
      },
    ];

    const payload: LumaSpaceStatePayload = {
      ok: true,
      schemaVersion: 1,
      mode,
      version: process.env.LUMASPACE_VERSION ?? "1.0.0",
      updatedAt: now.toISOString(),
      sections,
    };

    return buildOk(payload);
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    return buildError(`LumaSpace state error: ${msg}`, 500);
  }
}

export const dynamic = "force-dynamic";
