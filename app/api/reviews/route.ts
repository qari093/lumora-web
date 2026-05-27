import { createReview, listReviews } from "@/src/core/zendoro/api/store";
import { failJson, okJson, readJson } from "@/src/core/zendoro/api/http";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return okJson(listReviews(url.searchParams.get("productId") ?? undefined));
}

export async function POST(request: Request) {
  const body = await readJson<{ productId?: string; userId?: string; rating?: number; comment?: string }>(request);
  if (!body.productId) return failJson("productId is required", 422);
  if (!body.userId) return failJson("userId is required", 422);
  if (!body.rating) return failJson("rating is required", 422);

  return okJson(
    createReview({
      productId: body.productId,
      userId: body.userId,
      rating: body.rating,
      comment: body.comment,
    }),
    201
  );
}
