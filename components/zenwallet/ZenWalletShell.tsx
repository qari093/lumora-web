import React from "react";
import { buildZenWalletDashboardModel } from "@/src/core/zenwallet/ux/dashboardModel";

export default function ZenWalletShell() {
  const model = buildZenWalletDashboardModel();

  return (
    <main aria-label="ZenWallet" data-system="zenwallet-flawless-global">
      <h1>{model.title}</h1>
      <section aria-label="Balance">
        <strong>2,450 ZC</strong>
        <span>Refund Credit 120 ZC 🔒</span>
      </section>
      <nav aria-label="Wallet actions">
        {model.actions.map((action) => (
          <button key={action} type="button">{action}</button>
        ))}
      </nav>
      <p>{model.statusCopy.verified}</p>
    </main>
  );
}
