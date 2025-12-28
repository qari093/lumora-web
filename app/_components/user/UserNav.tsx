import Link from "next/link";

const A = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    style={{
      textDecoration: "none",
      color: "inherit",
      border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: 999,
      padding: "8px 12px",
      background: "white",
      fontSize: 13
    }}
  >
    {label}
  </Link>
);

export function UserNav() {
  return (
    <nav style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
      {/* Added by step: celebrations */}
      <a href="/celebrations">Celebrations</a>
      <A href="/" label="Home" />
      <A href="/fyp" label="For You" />
      <A href="/videos" label="Videos" />
      <A href="/live" label="Live" />
      <A href="/gmar" label="GMAR" />
      <A href="/nexa" label="NEXA" />
      <A href="/movies/portal" label="Movies" />
      <A href="/share" label="Share" />
    </nav>
  );
}
