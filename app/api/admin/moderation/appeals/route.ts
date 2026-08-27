import { NextResponse } from "next/server";
import {
  listPendingModerationAppealsForAdmin,
} from "@/src/core/moderation-production/appeal";
import {
  adminNoStoreHeaders,
  requireAdminSession,
} from "@/src/lib/auth/requireAdminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: adminNoStoreHeaders(),
  });
}

export async function GET() {
  const auth = await requireAdminSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const appeals = await listPendingModerationAppealsForAdmin();

    return json(200, {
      ok: true,
      appeals,
    });
  } catch {
    return json(500, {
      ok: false,
      error: "ADMIN_APPEAL_LIST_FAILED",
    });
  }
}
