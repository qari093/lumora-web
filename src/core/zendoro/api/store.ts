export type ZendoroProduct = {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  inventory: number;
};

export type ZendoroCartItem = {
  productId: string;
  quantity: number;
  unitPriceCents: number;
};

export type ZendoroCart = {
  id: string;
  userId: string;
  items: ZendoroCartItem[];
  subtotalCents: number;
  currency: string;
};

export type ZendoroOrder = {
  id: string;
  userId: string;
  sellerId: string;
  status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "FULFILLED" | "CANCELLED";
  totalCents: number;
  currency: string;
  items: ZendoroCartItem[];
};

export type ZendoroReview = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  verifiedPurchase: boolean;
};

const products = new Map<string, ZendoroProduct>();
const carts = new Map<string, ZendoroCart>();
const orders = new Map<string, ZendoroOrder>();
const reviews = new Map<string, ZendoroReview>();

const defaultProduct: ZendoroProduct = {
  id: "zendoro-demo-product",
  sellerId: "zendoro-demo-seller",
  title: "Zendoro Demo Product",
  description: "Operational demo product for Zendoro commerce runtime.",
  priceCents: 1999,
  currency: "EUR",
  inventory: 25,
};

products.set(defaultProduct.id, defaultProduct);

export function listProducts(): ZendoroProduct[] {
  return Array.from(products.values());
}

export function getProduct(productId: string): ZendoroProduct | null {
  return products.get(productId) ?? null;
}

export function upsertProduct(product: ZendoroProduct): ZendoroProduct {
  products.set(product.id, product);
  return product;
}

export function getOrCreateCart(userId = "anonymous"): ZendoroCart {
  const existing = carts.get(userId);
  if (existing) return existing;

  const cart: ZendoroCart = {
    id: `cart_${userId}`,
    userId,
    items: [],
    subtotalCents: 0,
    currency: "EUR",
  };

  carts.set(userId, cart);
  return cart;
}

export function addCartItem(userId: string, productId: string, quantity: number): ZendoroCart {
  const product = getProduct(productId);
  if (!product) throw new Error("Product not found");

  const safeQuantity = Math.max(1, Math.floor(quantity || 1));
  const cart = getOrCreateCart(userId);
  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += safeQuantity;
  } else {
    cart.items.push({
      productId,
      quantity: safeQuantity,
      unitPriceCents: product.priceCents,
    });
  }

  cart.subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0
  );

  carts.set(userId, cart);
  return cart;
}

export function clearCart(userId: string): ZendoroCart {
  const cart = getOrCreateCart(userId);
  cart.items = [];
  cart.subtotalCents = 0;
  carts.set(userId, cart);
  return cart;
}

export function createCheckout(userId: string): ZendoroOrder {
  const cart = getOrCreateCart(userId);
  if (cart.items.length === 0) throw new Error("Cart is empty");

  const firstProduct = getProduct(cart.items[0]?.productId ?? "");
  const order: ZendoroOrder = {
    id: `order_${Date.now()}`,
    userId,
    sellerId: firstProduct?.sellerId ?? "zendoro-demo-seller",
    status: "PENDING_PAYMENT",
    totalCents: cart.subtotalCents,
    currency: cart.currency,
    items: [...cart.items],
  };

  orders.set(order.id, order);
  return order;
}

export function listOrders(userId?: string): ZendoroOrder[] {
  const all = Array.from(orders.values());
  return userId ? all.filter((order) => order.userId === userId) : all;
}

export function getOrder(orderId: string): ZendoroOrder | null {
  return orders.get(orderId) ?? null;
}

export function markOrderPaid(orderId: string): ZendoroOrder {
  const order = getOrder(orderId);
  if (!order) throw new Error("Order not found");
  order.status = "PAID";
  orders.set(order.id, order);
  return order;
}

export function createReview(input: Omit<ZendoroReview, "id" | "verifiedPurchase">): ZendoroReview {
  const review: ZendoroReview = {
    ...input,
    id: `review_${Date.now()}`,
    rating: Math.max(1, Math.min(5, Math.floor(input.rating))),
    verifiedPurchase: listOrders(input.userId).some((order) =>
      order.items.some((item) => item.productId === input.productId)
    ),
  };

  reviews.set(review.id, review);
  return review;
}

export function listReviews(productId?: string): ZendoroReview[] {
  const all = Array.from(reviews.values());
  return productId ? all.filter((review) => review.productId === productId) : all;
}

export function getSellerSummary(sellerId = "zendoro-demo-seller") {
  return {
    sellerId,
    products: listProducts().filter((product) => product.sellerId === sellerId),
    orders: listOrders().filter((order) => order.sellerId === sellerId),
  };
}

export function getAdminZendoroSummary() {
  return {
    products: products.size,
    carts: carts.size,
    orders: orders.size,
    reviews: reviews.size,
    operational: true,
  };
}
