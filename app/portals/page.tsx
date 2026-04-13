import { getPortalCards } from "@/lib/portal/getPortalCards";

export default function PortalsRegistryPage() {
  const cards = getPortalCards();

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Registry</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>All Active Portals</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Canonical portal registry for launch activation.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {cards.map((card) => (
            <article
              key={card.key}
              data-registry-portal-key={card.key}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 22 }}>{card.title}</h2>
              <p style={{ opacity: 0.8, marginBottom: 12 }}>{card.subtitle}</p>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Path: {card.path}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>Status: {card.status}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
