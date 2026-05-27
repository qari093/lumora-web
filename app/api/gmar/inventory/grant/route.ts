import { NextResponse } from "next/server";

import {
  grantGmarInventoryItem,
  assertGmarInventory
} from "@/src/core/gmar/inventory-active/items";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (!body.state || typeof body.itemId !== "string") {
      throw new Error("GMAR state and itemId are required.");
    }

    const state = grantGmarInventoryItem({
      state: body.state,
      itemId: body.itemId,
      quantity:
        typeof body.quantity === "number"
          ? body.quantity
          : undefined,
      equipped:
        typeof body.equipped === "boolean"
          ? body.equipped
          : undefined
    });

    assertGmarInventory(state);

    return NextResponse.json({
      ok: true,
      state
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "GMAR inventory grant failed."
      },
      { status: 400 }
    );
  }
}
