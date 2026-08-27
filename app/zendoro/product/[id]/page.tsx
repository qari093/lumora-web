import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(amountCents / 100);
}

export default async function ZendoroProductPage({ params }: Props) {
  const { id } = await params;

  const product = await prisma.zendoroProduct.findFirst({
    where: {
      id,
      active: true,
      seller: {
        status: "ACTIVE"
      }
    },
    include: {
      inventory: true,
      seller: {
        select: {
          id: true,
          slug: true,
          displayName: true
        }
      },
      reviews: {
        orderBy: {
          createdAt: "desc"
        },
        take: 10
      }
    }
  });

  if (!product) {
    notFound();
  }

  const availableQuantity = Math.max(
    (product.inventory?.stock ?? 0) -
      (product.inventory?.reserved ?? 0),
    0
  );

  return (
    <main
      aria-label="Zendoro product detail"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #090d15, #111927)",
        color: "#f8fafc",
        padding: "32px 20px"
      }}
    >
      <article
        style={{
          maxWidth: 760,
          margin: "0 auto",
          border: "1px solid rgba(255,255,255,.12)",
          borderRadius: 24,
          padding: 28,
          background: "rgba(255,255,255,.035)"
        }}
      >
        <Link href="/zendoro/products">← Products</Link>
        <p style={{ opacity: 0.7 }}>{product.seller.displayName}</p>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <h2>{formatMoney(product.priceCents, product.currency)}</h2>
        <p>
          {availableQuantity > 0
            ? `${availableQuantity} available`
            : "Currently unavailable"}
        </p>

        {availableQuantity > 0 ? (
          <form action="/api/zendoro/checkout" method="post">
            <input type="hidden" name="productId" value={product.id} />
            <p>
              Secure authenticated checkout is available through the Zendoro
              checkout flow.
            </p>
            <Link href={`/zendoro/checkout?productId=${product.id}`}>
              Continue to checkout
            </Link>
          </form>
        ) : null}

        <section style={{ marginTop: 28 }}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 ? (
            <p>No verified reviews yet.</p>
          ) : (
            <ul>
              {product.reviews.map((review) => (
                <li key={review.id}>
                  {review.rating}/5
                  {review.body ? ` — ${review.body}` : ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}
