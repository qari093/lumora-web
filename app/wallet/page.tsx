import WalletLiveClient from "@/components/wallet/WalletLiveClient";

export default function WalletPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Wallet</h1>
      <WalletLiveClient />
    </main>
  );
}
