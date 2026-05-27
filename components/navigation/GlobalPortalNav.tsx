import Link from "next/link";
import { getPortalStatusManifest } from "@/lib/portal/getPortalStatusManifest";

const LABELS: Record<string, string> = {
  fyp: "For You",
  gmar: "GMAR",
  nexa: "NEXA",
  cineverse: "CineVerse",
  live: "Live",
  wallet: "Wallet",
  profile: "Profile",
};

export default function GlobalPortalNav() {
  const manifest = getPortalStatusManifest();

  return (
    <nav
      aria-label="Global portal navigation"
      style={{
        width: "100%",
        borderBottom: "1px solid rgba(255,255,255,0.10)",
        padding: "12px 20px",
        position: "sticky",
        top: 0,
        backdropFilter: "blur(10px)",
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", fontWeight: 800 }}>
          Lumora
        </Link>

        <Link href="/control-center" data-global-nav-system-key="control-center" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>Control</Link>
        <Link href="/operator" data-global-nav-system-key="operator" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>Operator</Link>

        <Link href="/mission-control" data-global-nav-system-key="mission-control" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>
          Mission
        </Link>

        <Link href="/system" data-global-nav-system-key="system" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>System</Link>
        <Link href="/creator/dashboard" data-global-nav-system-key="dashboard" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>Dashboard</Link>
        <Link href="/launch" data-global-nav-system-key="launch" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>Launch</Link>
        <Link href="/status" data-global-nav-system-key="status" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>Status</Link>
        <Link href="/progress" data-global-nav-system-key="progress" style={{ textDecoration: "none", padding: "8px 12px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)" }}>Progress</Link>

        {manifest.map((item) => (
          <Link
            key={item.key}
            href={item.path}
            data-global-nav-key={item.key}
            style={{
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {LABELS[item.key] ?? item.key}
          </Link>
        ))}
      </div>
    </nav>
  );
}
