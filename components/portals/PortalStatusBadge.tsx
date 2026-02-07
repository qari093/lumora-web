import { PortalStatus, statusLabel } from "@/lib/portals/status";

export default function PortalStatusBadge({ status }: { status: PortalStatus }) {
  const color =
    status === "active"
      ? "bg-green-600/15 text-green-400"
      : status === "seed"
      ? "bg-blue-600/15 text-blue-400"
      : "bg-zinc-600/15 text-zinc-400";

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>
      {statusLabel(status)}
    </span>
  );
}
