import { PORTALS } from "@/core/portals";
import Link from "next/link";
import { PORTAL_STATUS } from "@/lib/portals/status";
import PortalStatusBadge from "@/components/portals/PortalStatusBadge";
const _portals = PORTALS;
export default function PortalsHubPage() {
  return (
    <main className="p-6 space-y-6">
      {/* LumaSpace canonical portal label */}
      <span data-portal-key="lumaspace">LumaSpace</span>
      <h1 className="text-2xl font-semibold">Portals</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PORTALS.map(p => (
          <Link
            key={p.id}
            href={p.href}
            className="rounded-xl border p-4 hover:bg-white/5 transition"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{p.title}</div>
              <PortalStatusBadge status={PORTAL_STATUS[p.id]} />
            </div>

            <div className="text-xs opacity-60 mt-2">
              {PORTAL_STATUS[p.id] === "active" && "Fully active portal"}
              {PORTAL_STATUS[p.id] === "seed" && "Seed demo content"}
              {PORTAL_STATUS[p.id] === "shell" && "UI shell only"}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
