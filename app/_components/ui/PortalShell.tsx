import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  icon?: string;
  accent?: string;
  children: React.ReactNode;
};

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.06)",
        fontWeight: 900,
        textDecoration: "none",
        color: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </a>
  );
}

export function PortalShell({ title, subtitle, icon, accent, children }: Props) {
  const a = accent ?? "#60a5fa";
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 14,
        background:
          "radial-gradient(1200px 600px at 20% 0%, rgba(96,165,250,0.18), transparent 60%), radial-gradient(1000px 600px at 80% 20%, rgba(52,211,153,0.14), transparent 60%), #0b1020",
        color: "white",
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          display: "grid",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "space-between",
            padding: 12,
            borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            border: `1px solid rgba(255,255,255,0.12)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(135deg, ${a}, rgba(255,255,255,0.08))`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.45)`,
                fontSize: 18,
                fontWeight: 900,
              }}
              aria-hidden="true"
            >
              {icon ?? "⬡"}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 950, letterSpacing: 0.2 }}>{title}</div>
              {subtitle ? <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>{subtitle}</div> : null}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
            <NavLink href="/" label="🏠 Home" />
            <NavLink href="/fyp" label="📡 FYP" />
            <NavLink href="/videos" label="🎥 Videos" />
            <NavLink href="/gmar" label="🕹 GMAR" />
            <NavLink href="/nexa" label="🧠 NEXA" />
            <NavLink href="/movies/portal" label="🎬 Movies" />
            <NavLink href="/celebrations" label="✨ Celebrations" />
            <NavLink href="/share" label="🔗 Share" />
            <NavLink href="/live" label="🔴 Live" />
          </div>
        </div>

        <div
          style={{
            padding: 12,
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
