import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "24");

  if (!Number.isInteger(parsed)) {
    return 24;
  }

  return Math.min(Math.max(parsed, 1), 100);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get("limit"));
    const cursor = searchParams.get("cursor")?.trim() || undefined;

    const products = await prisma.zendoroProduct.findMany({
      where: {
        active: true,
        seller: {
          status: "ACTIVE"
        },
        inventory: {
          stock: {
            gt: 0
          }
        }
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
        inventory: true,
        seller: {
          select: {
            id: true,
            slug: true,
            displayName: true
          }
        }
      }
    });

    const hasMore = products.length > limit;
    const page = hasMore ? products.slice(0, limit) : products;

    const items = page.map((product) => {
      const stock = product.inventory?.stock ?? 0;
      const reserved = product.inventory?.reserved ?? 0;

      return {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        priceCents: product.priceCents,
        currency: product.currency.toUpperCase(),
        availableQuantity: Math.max(stock - reserved, 0),
        seller: product.seller,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });

    return NextResponse.json(
      {
        ok: true,
        route: "/api/zendoro/products",
        source: "database",
        count: items.length,
        items,
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
    console.error("ZENDORO_PRODUCTS_READ_FAILED", error);

    return NextResponse.json(
      {
        ok: false,
        route: "/api/zendoro/products",
        error: "products_read_failed"
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
