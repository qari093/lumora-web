import Link from "next/link";
import { getProduct } from "@/src/core/zendoro/api/store";

export default function ZendoroProductDetail({ productId }: { productId: string }) {
  const product = getProduct(productId);

  if (!product) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Product not found</h1>
        <Link href="/zendoro">Back to marketplace</Link>
      </main>
    );
  }

  return (
    <main aria-label="Zendoro product detail" style={{ padding: 24 }}>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>
        {(product.priceCents / 100).toFixed(2)} {product.currency}
      </p>
      <p>Seller: {product.sellerId}</p>
      <p>Available: {product.inventory}</p>
      <form action="/api/cart/items" method="post">
        <input type="hidden" name="productId" value={product.id} />
      </form>
      <Link href="/zendoro/cart">Go to cart</Link>
    </main>
  );
}
