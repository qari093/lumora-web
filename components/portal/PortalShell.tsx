import React from "react";

export type PortalShellProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  accent?: string; // CSS color
  children?: React.ReactNode;
};

export default function PortalShell(props: PortalShellProps) {
  const { title, subtitle, icon, accent, children } = props;

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 16px 40px",
        background:
          "radial-gradient(1200px 600px at 15% 10%, rgba(56,189,248,0.10), transparent 60%)," +
          "radial-gradient(900px 480px at 85% 20%, rgba(168,85,247,0.10), transparent 60%)," +
          "linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(3,7,18,1) 100%)",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <header
        style={{
          maxWidth: 980,
          margin: "0 auto 18px",
          borderRadius: 16,
          padding: "14px 14px",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {icon ? (
            <div
              aria-hidden="true"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <span style={{ fontSize: 20, lineHeight: "20px" }}>{icon}</span>
            </div>
          ) : null}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 18,
                  letterSpacing: 0.2,
                  fontWeight: 700,
                }}
              >
                {title}
              </h1>

              {accent ? (
                <span
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: accent,
                    boxShadow: `0 0 18px ${accent}`,
                    display: "inline-block",
                  }}
                />
              ) : null}
            </div>

            {subtitle ? (
              <p style={{ margin: "6px 0 0", opacity: 0.78, fontSize: 13, lineHeight: "18px" }}>
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <section style={{ maxWidth: 980, margin: "0 auto" }}>{children}</section>
    </main>
  );
}
