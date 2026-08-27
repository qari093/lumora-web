import Link from "next/link";
import {
  gmarActivationItems,
  getGmarActivationSummary
} from "@/src/core/founder-activation/gmarActivation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GmarPage() {
  const summary = getGmarActivationSummary();

  return (
    <main data-lumora-alive-gmar="LUMORA_PORTAL_ALIVE_GMAR" style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top,#1d2238,#080b14)",
      color: "#fff",
      padding: "24px"
    }}>
      <section style={{maxWidth:1120,margin:"0 auto"}}>
        <h1>GMAR is now a visible mission and economy layer.</h1>

        <p>
          Founder gate active · Tester invites blocked · Live rewards disabled
        </p>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
          gap:"12px",
          margin:"24px 0"
        }}>
          <div><strong>{summary.itemCount}</strong><br/>runtime surfaces</div>
          <div><strong>{summary.visiblePlayers}</strong><br/>preview players</div>
          <div><strong>OFF</strong><br/>live rewards</div>
          <div><strong>SAFE</strong><br/>founder mode</div>
        </div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
          gap:"16px"
        }}>
          {gmarActivationItems.map(item => (
            <article
              key={item.id}
              style={{
                border:"1px solid rgba(255,255,255,.12)",
                borderRadius:"20px",
                padding:"20px"
              }}
            >
              <p>{item.category.toUpperCase()}</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <p>Visible activity: {item.players}</p>
              <Link href={item.href}>Open surface</Link>
            </article>
          ))}
        </div>

        <Link href="/gmar/play">Open GMAR Play</Link>
        <footer style={{marginTop:"24px"}}>
          Mission Surface · Pulse Store · Game Runtime · Reward Engine
        </footer>
      </section>
    </main>
  );
}
