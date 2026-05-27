import Link from "next/link";
import { listProducts } from "@/src/core/zendoro/api/store";

export default function ZendoroStorefront() {
  const products = listProducts();

  return (
    <main aria-label="Zendoro marketplace" style={{ padding: 24 }}>
      <h1>Zendoro Marketplace</h1>
      <p>Trusted commerce layer for Lumora.</p>

      <section aria-label="Product listings">
        {products.map((product) => (
          <article key={product.id} data-testid="zendoro-product-card">
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>
              {(product.priceCents / 100).toFixed(2)} {product.currency}
            </p>
            <p>Inventory: {product.inventory}</p>
            <Link href={`/zendoro/product/${product.id}`}>View product</Link>
          </article>
        ))}
      </section>

      <nav aria-label="Zendoro buyer navigation">
        <Link href="/zendoro/cart">Cart</Link>{" "}
        <Link href="/zendoro/checkout">Checkout</Link>{" "}
        <Link href="/zendoro/orders">Orders</Link>
      </nav>
    </main>
  );
}
