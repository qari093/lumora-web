import LumoraPortalPage from "@/components/portal/LumoraPortalPage";

export default function ZenwalletPage() {
  return (
    <LumoraPortalPage
      title="Zenwallet"
      eyebrow="Zencoin wallet portal"
      description="Zenwallet now has a user-facing runtime shell for balances, ledger transparency, cross-portal rewards, refunds, subscriptions, and security controls."
      actions={[
        { label: "Wallet Summary", href: "/api/wallet/summary" },
        { label: "Zencoin Balance", href: "/api/zencoin/balance" },
        { label: "Zenwallet Seal", href: "/api/zenwallet/final-seal" }
      ]}
      signals={[
        { label: "Mode", value: "Wallet" },
        { label: "Ledger", value: "Transparent" },
        { label: "Safety", value: "Refund Guard" }
      ]}
      modules={[
        "Balance",
        "Ledger",
        "Credit",
        "Debit",
        "Refunds",
        "Subscriptions",
        "Portal Rewards",
        "Security"
      ]}
    />
  );
}
