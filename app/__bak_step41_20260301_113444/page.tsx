export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";

const links = [
  { href: "/fyp", label: "FYP" },
  { href: "/videos", label: "Videos" },
  { href: "/gmar", label: "GMAR" },
  { href: "/nexa", label: "NEXA" },
  { href: "/movies", label: "Movies" },
  { href: "/live", label: "Live" },
  { href: "/share", label: "Share" },
  { href: "/celebrations", label: "Celebrations" },
];

export default function HomePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold" title="home">home</h1>
      <p className="opacity-80">Lumora User-Alive Mode: stable routes + non-empty portals.</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10"
          >
            <div className="font-medium">{l.label}</div>
            <div className="text-sm opacity-70">{l.href}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
