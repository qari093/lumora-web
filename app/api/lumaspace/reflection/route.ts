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

async function getWorldIdByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("user not found");
  }

  const world = await prisma.userWorld.findFirst({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!world) {
    throw new Error("world not found");
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

    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const text = typeof body?.text === "string" ? body.text.trim() : "";

    if (!title || !text) {
      return json(400, {
        ok: false,
        error: "title and text required",
      });
    }

    const worldId = await getWorldIdByEmail(auth.identity.email);

    const entry = await prisma.reflectionJournal.create({
      data: {
        worldId,
        title,
        text,
        mood: typeof body?.mood === "string" ? body.mood : null,
        tags:
          Array.isArray(body?.tags) ||
          (body?.tags && typeof body.tags === "object")
            ? (body.tags as any)
            : [],
        score: typeof body?.score === "number" ? body.score : null,
      },
      select: {
        id: true,
        title: true,
        text: true,
        mood: true,
        tags: true,
        score: true,
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
      error: error instanceof Error ? error.message : "reflection_create_failed",
    });
  }
}

export async function GET(req: Request) {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(req.url);

    if (!emailMatchesSession(searchParams.get("email"), auth.identity.email)) {
      return json(403, {
        ok: false,
        error: "forbidden_identity_scope",
      });
    }

    const takeParam = Number(searchParams.get("take") || "10");
    const take = Math.max(
      1,
      Math.min(50, Number.isFinite(takeParam) ? takeParam : 10),
    );

    const worldId = await getWorldIdByEmail(auth.identity.email);

    const entries = await prisma.reflectionJournal.findMany({
      where: { worldId },
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        title: true,
        text: true,
        mood: true,
        tags: true,
        score: true,
        createdAt: true,
      },
    });

    return json(200, {
      ok: true,
      count: entries.length,
      entries,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "reflection_read_failed",
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

    const worldId = await getWorldIdByEmail(auth.identity.email);

    const result = await prisma.reflectionJournal.deleteMany({
      where: {
        id,
        worldId,
      },
    });

    return json(200, {
      ok: true,
      deleted: result.count,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "reflection_delete_failed",
    });
  }
}
