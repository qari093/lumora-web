import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUserSession,
  userPrivateNoStoreHeaders,
} from "@/src/lib/auth/requireUserSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(
  data: unknown,
  status = 200,
) {
  return NextResponse.json(data, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

export async function POST() {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const ownerId = auth.identity.userId;

    const accountId = process.env.CF_ACCOUNT_ID;
    const token = process.env.CF_API_TOKEN;

    if (!accountId || !token) {
      return json(
        { ok: false, error: "stream_provider_not_configured" },
        503,
      );
    }

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxDurationSeconds: 600,
          creator: ownerId,
        }),
      },
    );

    const cf = await res.json().catch(() => null);

    if (!res.ok || !cf?.success) {
      return json(
        { ok: false, error: "stream_provider_request_failed" },
        502,
      );
    }

    const uid =
      typeof cf?.result?.uid === "string"
        ? cf.result.uid.trim()
        : "";

    const uploadURL =
      typeof cf?.result?.uploadURL === "string"
        ? cf.result.uploadURL
        : "";

    if (!uid || !uploadURL) {
      return json(
        { ok: false, error: "stream_provider_response_incomplete" },
        502,
      );
    }

    await prisma.streamVideo.upsert({
      where: { uid },
      create: {
        uid,
        ownerId,
        readyToStream: false,
        status: "uploaded",
        playbackId: uid,
        meta: {
          ownershipSource: "authenticated_upload_token",
        },
      },
      update: {
        ownerId,
      },
    });

    return json({
      ok: true,
      uid,
      ownerId,
      uploadURL,
      requestId: crypto.randomUUID(),
    });
  } catch {
    return json(
      { ok: false, error: "stream_upload_token_failed" },
      500,
    );
  }
}
