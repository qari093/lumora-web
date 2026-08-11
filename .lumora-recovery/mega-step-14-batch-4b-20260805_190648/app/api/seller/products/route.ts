import { listProducts, upsertProduct } from "@/src/core/zendoro/api/store";
import { failJson, okJson, readJson } from "@/src/core/zendoro/api/http";

export async function GET() {
  return okJson(listProducts());
}

export async function POST(request: Request) {
  const body = await readJson<{
    id?: string;
    sellerId?: string;
    title?: string;
    description?: string;
    priceCents?: number;
    currency?: string;
    inventory?: number;
  }>(request);

  if (!body.title) return failJson("title is required", 422);

  return okJson(
    upsertProduct({
      id: body.id ?? `product_${Date.now()}`,
      sellerId: body.sellerId ?? "zendoro-demo-seller",
      title: body.title,
      description: body.description ?? "",
      priceCents: Math.max(0, Number(body.priceCents ?? 0)),
      currency: body.currency ?? "EUR",
      inventory: Math.max(0, Number(body.inventory ?? 0)),
    }),
    201
  );
}
