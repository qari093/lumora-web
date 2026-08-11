import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(amountCents / 100);
}

export default async function ZendoroProductsPage() {
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
    orderBy: {
      createdAt: "desc"
    },
    include: {
      inventory: true,
      seller: {
        select: {
          displayName: true
        }
      }
    },
    take: 48
  });

  return (
    <main
      aria-label="Zendoro product catalog"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #090d15, #111927)",
        color: "#f8fafc",
        padding: "32px 20px"
      }}
    >
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <header style={{ marginBottom: 28 }}>
          <Link href="/zendoro">← Zendoro</Link>
          <h1>Marketplace</h1>
          <p>Products from approved Zendoro sellers.</p>
        </header>

        {products.length === 0 ? (
          <section
            style={{
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 18,
              padding: 24
            }}
          >
            <h2>No products available</h2>
            <p>The catalog will update when approved inventory is published.</p>
          </section>
        ) : (
          <section
            aria-label="Available products"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 18
            }}
          >
            {products.map((product) => {
              const availableQuantity = Math.max(
                (product.inventory?.stock ?? 0) -
                  (product.inventory?.reserved ?? 0),
                0
              );

              return (
                <article
                  key={product.id}
                  style={{
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 20,
                    padding: 22,
                    background: "rgba(255,255,255,.035)"
                  }}
                >
                  <p style={{ opacity: 0.7 }}>
                    {product.seller.displayName}
                  </p>
                  <h2>{product.title}</h2>
                  <p>{product.description}</p>
                  <strong>
                    {formatMoney(product.priceCents, product.currency)}
                  </strong>
                  <p>{availableQuantity} available</p>
                  <Link href={`/zendoro/product/${product.id}`}>
                    View product
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </section>
    </main>
  );
}
