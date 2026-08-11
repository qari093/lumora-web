import { NextResponse } from 'next/server';

import { createReview, listReviews } from '@/src/core/zendoro/api/store';
import { requireUserSession, userPrivateNoStoreHeaders } from '@/src/lib/auth/requireUserSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CreateReviewBody = {
  productId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId')?.trim() || undefined;

  return NextResponse.json(
    {
      ok: true,
      route: '/api/reviews',
      data: listReviews(productId),
    },
    {
      status: 200,
      headers: {
        'cache-control': 'public, max-age=30, stale-while-revalidate=60',
      },
    },
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireUserSession();

  if (!auth.ok) {
    return auth.response;
  }

  let body: CreateReviewBody;

  try {
    body = (await request.json()) as CreateReviewBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'invalid_json',
      },
      {
        status: 400,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  }

  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';

  const rating = typeof body.rating === 'number' ? body.rating : Number.NaN;

  const comment = typeof body.comment === 'string' ? body.comment.trim() : undefined;

  if (!productId) {
    return NextResponse.json(
      {
        ok: false,
        error: 'product_id_required',
      },
      {
        status: 422,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      {
        ok: false,
        error: 'rating_must_be_between_1_and_5',
      },
      {
        status: 422,
        headers: userPrivateNoStoreHeaders(),
      },
    );
  }

  const review = createReview({
    productId,
    userId: auth.identity.userId,
    rating,
    comment,
  });

  return NextResponse.json(
    {
      ok: true,
      route: '/api/reviews',
      data: review,
    },
    {
      status: 201,
      headers: userPrivateNoStoreHeaders(),
    },
  );
}
