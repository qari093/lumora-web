import { lumoraPortals } from "@/src/core/lumora/portal-catalog/portalCatalog";

export default function PortalsPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "32px", background: "#070A12", color: "#F5F7FB" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Lumora Ecosystem Map
        </p>

        <h1 style={{ fontSize: 42, margin: "12px 0" }}>
          All Portals + Feature Details
        </h1>

        <p style={{ maxWidth: 760, lineHeight: 1.7, color: "#B8C3D6" }}>
          Canonical overview of Lumora portals, their purpose, core features, integrations,
          and monetization paths.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
            marginTop: 32
          }}
        >
          {lumoraPortals.map((portal) => (
            <article
              key={portal.id}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                background: "linear-gradient(145deg, rgba(23,31,48,0.92), rgba(9,13,24,0.92))",
                borderRadius: 22,
                padding: 22,
                boxShadow: "0 0 28px rgba(64,224,208,0.08)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 22 }}>{portal.name}</h2>
                <span style={{ color: "#40E0D0", fontSize: 12, textTransform: "uppercase" }}>
                  {portal.status}
                </span>
              </div>

              <p style={{ color: "#B8C3D6", lineHeight: 1.6 }}>{portal.purpose}</p>

              <h3 style={{ fontSize: 14, color: "#F6B44B" }}>Core Features</h3>
              <ul>
                {portal.coreFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <h3 style={{ fontSize: 14, color: "#A7C7E7" }}>Integrations</h3>
              <ul>
                {portal.integrations.map((integration) => (
                  <li key={integration}>{integration}</li>
                ))}
              </ul>

              <h3 style={{ fontSize: 14, color: "#8B5CF6" }}>Monetization</h3>
              <ul>
                {portal.monetization.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p style={{ marginTop: 18, color: "#8899AA", fontSize: 13 }}>
                Route: {portal.route}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
