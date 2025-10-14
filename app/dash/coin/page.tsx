import BalanceCard from "@/components/coin/BalanceCard";
import TransferForm from "@/components/coin/TransferForm";
import LedgerTable from "@/components/coin/LedgerTable";

export const dynamic = "force-dynamic";

export default function CoinDash() {
  const demoUser = "demo-user-1";
  return (
    <div style={{maxWidth:900, margin:"32px auto", padding:"0 16px", display:"grid", gap:16}}>
      <h1 style={{fontSize:24, fontWeight:700}}>ZenCoin</h1>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
        <BalanceCard userId={demoUser} />
        <TransferForm defaultFrom={demoUser} />
      </div>
      <LedgerTable userId={demoUser} limit={10} />
    </div>
  );
}
