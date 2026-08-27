import { NextResponse } from "next/server";
import { prisma } from "@/app/_server/prisma";
import {
  requireUserSession,
  userPrivateNoStoreHeaders
} from "@/src/lib/auth/requireUserSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, {
    status,
    headers: userPrivateNoStoreHeaders(),
  });
}

async function worldIdForAuthenticatedUser(
  userId: string,
  email: string,
): Promise<string> {
  let user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { email },
    });
  }

  if (!user) {
    throw new Error("authenticated user not found");
  }

  let world = await prisma.userWorld.findFirst({
    where: { userId: user.id },
  });

  if (!world) {
    world = await prisma.userWorld.create({
      data: {
        userId: user.id,
        name: "Founders Space",
        theme: "aurora",
        mood: "inspired",
      },
    });
  }

  return world.id;
}

function emailMatchesSession(
  supplied: unknown,
  authenticatedEmail: string,
): boolean {
  if (typeof supplied !== "string" || !supplied.trim()) {
    return true;
  }

  return supplied.trim().toLowerCase() === authenticatedEmail.toLowerCase();
}

export async function POST(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();

    if (!emailMatchesSession(body?.email, auth.identity.email)) {
      return json(403, {
        ok: false,
        error: "forbidden_identity_scope",
      });
    }

    const worldId = await worldIdForAuthenticatedUser(
      auth.identity.userId,
      auth.identity.email,
    );

    let journal = await prisma.shadowJournal.findFirst({
      where: { worldId },
    });

    if (!journal) {
      journal = await prisma.shadowJournal.create({
        data: { worldId },
      });
    }

    const entry = await prisma.shadowEntry.create({
      data: {
        journalId: journal.id,
        text: String(body?.text || "").slice(0, 2000),
        emotion: body?.emotion ? String(body.emotion) : null,
        privacy: body?.privacy ? String(body.privacy) : "private",
      },
      select: {
        id: true,
        text: true,
        emotion: true,
        privacy: true,
        createdAt: true,
      },
    });

    return json(200, {
      ok: true,
      entry,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "shadow_create_failed",
    });
  }
}

export async function GET(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const url = new URL(req.url);

    if (!emailMatchesSession(url.searchParams.get("email"), auth.identity.email)) {
      return json(403, {
        ok: false,
        error: "forbidden_identity_scope",
      });
    }

    const takeParam = Number(url.searchParams.get("take") || "10");
    const take = Math.max(
      1,
      Math.min(20, Number.isFinite(takeParam) ? takeParam : 10),
    );

    const cursorId = url.searchParams.get("cursor") || null;

    const worldId = await worldIdForAuthenticatedUser(
      auth.identity.userId,
      auth.identity.email,
    );

    const journal = await prisma.shadowJournal.findFirst({
      where: { worldId },
    });

    if (!journal) {
      return json(200, {
        ok: true,
        worldId,
        count: 0,
        entries: [],
      });
    }

    let cursorCreatedAt: Date | null = null;

    if (cursorId) {
      const cursorEntry = await prisma.shadowEntry.findFirst({
        where: {
          id: cursorId,
          journalId: journal.id,
        },
        select: {
          createdAt: true,
        },
      });

      if (cursorEntry) {
        cursorCreatedAt = cursorEntry.createdAt;
      }
    }

    const where: any = {
      journalId: journal.id,
    };

    if (cursorCreatedAt) {
      where.createdAt = {
        lt: cursorCreatedAt,
      };
    }

    const entries = await prisma.shadowEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        text: true,
        emotion: true,
        privacy: true,
        createdAt: true,
      },
    });

    return json(200, {
      ok: true,
      worldId,
      count: entries.length,
      entries,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "shadow_read_failed",
    });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id.trim() : "";

    if (!emailMatchesSession(body?.email, auth.identity.email)) {
      return json(403, {
        ok: false,
        error: "forbidden_identity_scope",
      });
    }

    if (!id) {
      return json(400, {
        ok: false,
        error: "id required",
      });
    }

    const worldId = await worldIdForAuthenticatedUser(
      auth.identity.userId,
      auth.identity.email,
    );

    const journal = await prisma.shadowJournal.findFirst({
      where: { worldId },
    });

    if (!journal) {
      return json(200, {
        ok: true,
        deleted: 0,
      });
    }

    const result = await prisma.shadowEntry.deleteMany({
      where: {
        id,
        journalId: journal.id,
      },
    });

    return json(200, {
      ok: true,
      deleted: result.count,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "shadow_delete_failed",
    });
  }
}
