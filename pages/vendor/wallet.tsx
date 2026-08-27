import React from "react";

export default function VendorWalletPage() {
  return (
    <main
      data-vendor-wallet-production-state="read-only"
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>Vendor Wallet</h1>

      <p style={{ lineHeight: 1.6, opacity: 0.8 }}>
        Vendor wallet funding is temporarily unavailable during private beta.
        Test-mode balance mutations have been disabled in production.
      </p>

      <p style={{ lineHeight: 1.6, opacity: 0.7 }}>
        Existing production-safe wallet activity remains available through the
        authenticated Lumora wallet experience.
      </p>
    </main>
  );
}
