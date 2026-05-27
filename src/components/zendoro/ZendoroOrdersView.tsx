import Link from "next/link";
import { listOrders } from "@/src/core/zendoro/api/store";

export default function ZendoroOrdersView() {
  const orders = listOrders("anonymous");

  return (
    <main aria-label="Zendoro orders" style={{ padding: 24 }}>
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.id} — {order.status} — {(order.totalCents / 100).toFixed(2)} {order.currency}
            </li>
          ))}
        </ul>
      )}
      <Link href="/zendoro">Back to marketplace</Link>
    </main>
  );
}
