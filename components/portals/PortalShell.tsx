import React from "react";

export default function PortalShell(props: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  const { title, subtitle, children } = props;
  return (
    <main style={{ padding: 18, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: 0.2 }}>{title}</h1>
        {subtitle ? (
          <span style={{ opacity: 0.75, fontSize: 14 }}>{subtitle}</span>
        ) : null}
      </div>

      <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {[
          ["/", "Home"],
          ["/portals", "Portals"],
          ["/fyp", "FYP"],
          ["/videos", "Videos"],
          ["/gmar", "GMAR"],
          ["/nexa", "NEXA"],
          ["/movies", "Movies"],
          ["/music", "Music"],
          ["/live", "Live"],
          ["/lumaspace", "LumaSpace"],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid #1f2937",
              background: "#0b1020",
              textDecoration: "none",
            }}
          >
            {label}
          </a>
        ))}
      </div>

      <div style={{ marginTop: 18 }}>{children}</div>
    </main>
  );
}
