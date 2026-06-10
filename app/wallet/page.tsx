import {
  getWalletActivationSummary,
  walletActivationSurfaces
} from "@/src/core/founder-activation/walletActivation";

export default function WalletPage() {
  const summary = getWalletActivationSummary();

  return (
    <main style={{
      minHeight:"100vh",
      background:"#0b0f18",
      color:"#fff",
      padding:"24px"
    }}>
      <h1>Wallet and Zen Economy are now visible founder review layers.</h1>

      <p>
        Founder gate active · Payments disabled · Zencoin bridge disabled · Tester invites blocked
      </p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
        gap:"16px",
        marginTop:"24px"
      }}>
        {walletActivationSurfaces.map(item => (
          <div
            key={item.id}
            style={{
              border:"1px solid rgba(255,255,255,.12)",
              borderRadius:"16px",
              padding:"16px"
            }}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <div style={{marginTop:"24px"}}>
        Wallet Overview · Zen Economy · Transaction Ledger · Treasury View
      </div>

      <pre style={{marginTop:"24px"}}>
        {JSON.stringify(summary,null,2)}
      </pre>
    </main>
  );
}
