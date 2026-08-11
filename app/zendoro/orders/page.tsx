import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/src/core/auth/authOptions";

export const dynamic = "force-dynamic";

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(amountCents / 100);
}

export default async function ZendoroOrdersPage() {
  const session = await getServerSession(authOptions);
  const buyerId = session?.user?.id?.trim() ?? "";

  if (!buyerId) {
    redirect("/login?callbackUrl=/zendoro/orders");
  }

  const orders = await prisma.zendoroOrder.findMany({
    where: {
      buyerId
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true
            }
          }
        }
      },
      payments: {
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    take: 50
  });

  return (
    <main
      aria-label="Zendoro order history"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #090d15, #111927)",
        color: "#f8fafc",
        padding: "32px 20px"
      }}
    >
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link href="/zendoro">← Zendoro</Link>
        <h1>Your orders</h1>

        {orders.length === 0 ? (
          <section
            style={{
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 18,
              padding: 24
            }}
          >
            <h2>No orders yet</h2>
            <Link href="/zendoro/products">Browse products</Link>
          </section>
        ) : (
          <section style={{ display: "grid", gap: 16 }}>
            {orders.map((order) => (
              <article
                key={order.id}
                style={{
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 20,
                  padding: 22,
                  background: "rgba(255,255,255,.035)"
                }}
              >
                <header>
                  <strong>Order {order.id}</strong>
                  <p>
                    {order.status} ·{" "}
                    {formatMoney(order.totalCents, order.currency)}
                  </p>
                  <p>{order.createdAt.toLocaleString()}</p>
                </header>

                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      <Link href={`/zendoro/product/${item.product.id}`}>
                        {item.product.title}
                      </Link>{" "}
                      × {item.quantity}
                    </li>
                  ))}
                </ul>

                <p>
                  Payment: {order.payments[0]?.status ?? "NOT_STARTED"}
                </p>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}
