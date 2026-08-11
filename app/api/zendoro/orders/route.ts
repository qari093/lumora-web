import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/src/core/auth/authOptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "20");

  if (!Number.isInteger(parsed)) {
    return 20;
  }

  return Math.min(Math.max(parsed, 1), 100);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const buyerId = session?.user?.id?.trim() ?? "";

  if (!buyerId) {
    return NextResponse.json(
      {
        ok: false,
        route: "/api/zendoro/orders",
        error: "authentication_required"
      },
      {
        status: 401,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get("limit"));
    const cursor = searchParams.get("cursor")?.trim() || undefined;

    const orders = await prisma.zendoroOrder.findMany({
      where: {
        buyerId
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" }
      ],
      take: limit + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1
          }
        : {}),
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                title: true,
                seller: {
                  select: {
                    id: true,
                    slug: true,
                    displayName: true
                  }
                }
              }
            }
          }
        },
        payments: {
          orderBy: {
            createdAt: "desc"
          },
          select: {
            id: true,
            provider: true,
            providerPaymentId: true,
            status: true,
            amountCents: true,
            currency: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    const hasMore = orders.length > limit;
    const page = hasMore ? orders.slice(0, limit) : orders;

    return NextResponse.json(
      {
        ok: true,
        route: "/api/zendoro/orders",
        source: "database",
        count: page.length,
        items: page,
        pagination: {
          hasMore,
          nextCursor: hasMore ? page.at(-1)?.id ?? null : null
        }
      },
      {
        status: 200,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("ZENDORO_ORDERS_READ_FAILED", {
      buyerId,
      error
    });

    return NextResponse.json(
      {
        ok: false,
        route: "/api/zendoro/orders",
        error: "orders_read_failed"
      },
      {
        status: 500,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  }
}
