import Link from "next/link";
import {
  getZendoroActivationSummary,
  zendoroActivationSurfaces
} from "@/src/core/founder-activation/zendoroActivation";

export default function ZendoroPage() {
  const summary = getZendoroActivationSummary();

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#0b0f18,#131c28)",
      color: "#fff",
      padding: "24px"
    }}>
      <section style={{maxWidth:1100,margin:"0 auto"}}>
        <h1>Zendoro is now a visible commerce and trust layer.</h1>

        <p>
          Founder gate active · Checkout disabled · Payouts disabled · Tester invites blocked
        </p>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
          gap:"12px",
          margin:"24px 0"
        }}>
          <div><strong>{summary.surfaceCount}</strong><br/>commerce surfaces</div>
          <div><strong>OFF</strong><br/>checkout</div>
          <div><strong>OFF</strong><br/>payouts</div>
          <div><strong>SAFE</strong><br/>founder mode</div>
        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
          gap:"16px"
        }}>
          {zendoroActivationSurfaces.map(surface => (
            <article
              key={surface.id}
              style={{
                border:"1px solid rgba(255,255,255,.12)",
                borderRadius:"20px",
                padding:"20px"
              }}
            >
              <p>{surface.type.toUpperCase()}</p>
              <h2>{surface.title}</h2>
              <p>{surface.description}</p>
              <Link href={surface.href}>Open surface</Link>
            </article>
          ))}
        </div>

        <footer style={{marginTop:"24px"}}>
          Product Discovery · Seller Operations · Trust Layer · Commerce Engine
        </footer>
      </section>
    </main>
  );
}
