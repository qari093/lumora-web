import Link from "next/link";
import { getOrCreateCart } from "@/src/core/zendoro/api/store";

export default function ZendoroCheckoutView() {
  const cart = getOrCreateCart("anonymous");

  return (
    <main aria-label="Zendoro checkout" style={{ padding: 24 }}>
      <h1>Checkout</h1>
      <p>Secure checkout runtime is connected.</p>
      <p>Items: {cart.items.length}</p>
      <p>Total: {(cart.subtotalCents / 100).toFixed(2)} {cart.currency}</p>
      <Link href="/zendoro/orders">View orders</Link>
    </main>
  );
}
