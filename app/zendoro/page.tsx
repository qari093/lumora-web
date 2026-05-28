import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function ZendoroPage() {
  return (
    <LumoraPortalPage
      title="Zendoro"
      eyebrow="Commerce and seller portal"
      description="Zendoro now has a visible marketplace shell for products, cart, checkout, sellers, reviews, trust, admin operations, and payment readiness."
      actions={[
        { label: "Products", href: "/zendoro/products" },
        { label: "Cart", href: "/zendoro/cart" },
        { label: "Seller", href: "/zendoro/seller" }
      ]}
      signals={[
        { label: "Mode", value: "Commerce" },
        { label: "Trust", value: "Seller Safety" },
        { label: "Payments", value: "Stripe Ready" }
      ]}
      modules={[
        "Storefront",
        "Product Detail",
        "Checkout",
        "Seller Dashboard",
        "Reviews",
        "Admin Ops",
        "Disputes",
        "Payouts"
      ]}
    />
  );
}
