"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SYSTEM_LINKS = [
  { href: "/control-center", label: "Control", key: "control-center" },
  { href: "/operator", label: "Operator", key: "operator" },
  { href: "/mission-control", label: "Mission", key: "mission-control" },
  { href: "/system", label: "System", key: "system" },
  { href: "/creator/dashboard", label: "Dashboard", key: "dashboard" },
  { href: "/launch", label: "Launch", key: "launch" },
  { href: "/status", label: "Status", key: "status" },
  { href: "/progress", label: "Progress", key: "progress" }
];

const PORTAL_LINKS = [
  { href: "/fyp", label: "For You", key: "fyp" },
  { href: "/gmar", label: "GMAR", key: "gmar" },
  { href: "/nexa", label: "NEXA", key: "nexa" },
  { href: "/cineverse", label: "CineVerse", key: "cineverse" },
  { href: "/live", label: "Live", key: "live" },
  { href: "/wallet", label: "Wallet", key: "wallet" },
  { href: "/profile", label: "Profile", key: "profile" }
];

export default function GlobalPortalNav() {
  const pathname = usePathname();

  if (pathname === "/fyp" || pathname?.startsWith("/fyp/")) {
    return null;
  }

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
        zIndex: 20
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <Link href="/" style={{ textDecoration: "none", fontWeight: 800 }}>
          Lumora
        </Link>

        {SYSTEM_LINKS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            data-global-nav-system-key={item.key}
            style={{
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.10)"
            }}
          >
            {item.label}
          </Link>
        ))}

        {PORTAL_LINKS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            data-global-nav-key={item.key}
            style={{
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.10)"
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
