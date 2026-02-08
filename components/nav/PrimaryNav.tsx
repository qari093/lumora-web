import Link from "next/link";
import { PORTALS } from "@/lib/portals/registry";

export function PrimaryNav() {
  return (
    <nav className="flex gap-4 px-4 py-2 text-sm">
      <Link href="/portals">Portals</Link>
      {Object.values((PORTALS ?? {}))
        .filter(p => p.status === "active")
        .map(p => (
          <Link key={p.id} href={p.href}>
            {p.label}
          </Link>
        ))}
    </nav>
  );
}
