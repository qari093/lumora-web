import Link from "next/link";
import { getOrCreateCart } from "@/src/core/zendoro/api/store";

export default function ZendoroCartView() {
  const cart = getOrCreateCart("anonymous");

  return (
    <main aria-label="Zendoro cart" style={{ padding: 24 }}>
      <h1>Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.items.map((item) => (
            <li key={item.productId}>
              {item.productId} × {item.quantity} — {(item.unitPriceCents / 100).toFixed(2)} {cart.currency}
            </li>
          ))}
        </ul>
      )}
      <p>Subtotal: {(cart.subtotalCents / 100).toFixed(2)} {cart.currency}</p>
      <Link href="/zendoro/checkout">Continue to checkout</Link>
    </main>
  );
}
