import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export const dynamic = "force-dynamic";

export default function ZendoroShopPage() {
  return (
    <LumoraPortalPage
      title="Zendoro"
      eyebrow="Commerce and checkout portal"
      description="Browse beta products, test cart behavior, verify checkout readiness, inspect seller flow, and validate wallet/Zencoin commerce paths before external testers arrive."
      actions={[
        { label: "Products API", href: "/api/zendoro/products" },
        { label: "Cart API", href: "/api/zendoro/cart" },
        { label: "Checkout API", href: "/api/zendoro/checkout" },
        { label: "Wallet Summary", href: "/api/wallet/summary" }
      ]}
      signals={[
        { label: "Mode", value: "Commerce Beta" },
        { label: "Checkout", value: "Validated" },
        { label: "Wallet", value: "Zencoin Linked" }
      ]}
      modules={[
        "Product Discovery",
        "Cart Flow",
        "Checkout Flow",
        "Order History",
        "Seller Panel",
        "Reviews",
        "Wallet Bridge",
        "Payment Safety"
      ]}
    />
  );
}
