"use client";

import Link from "next/link";
import { createHomeBeaconPortalArc } from "@/src/core/home-beacon";

export default function HomeBeaconPortalArc({ open }: { open: boolean }) {
  const portals = createHomeBeaconPortalArc();

  return (
    <nav
      aria-label="Lumora portal arc"
      data-testid="home-beacon-portal-arc"
      data-open={open ? "true" : "false"}
      className="pointer-events-none fixed bottom-10 left-1/2 z-[79] h-0 w-0 -translate-x-1/2"
    >
      {portals.map((portal) => (
        <Link
          key={portal.id}
          href={portal.href}
          aria-label={`Open ${portal.label}`}
          data-home-beacon-portal={portal.id}
          className="pointer-events-auto absolute flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/55 text-[10px] font-semibold text-white shadow-[0_0_22px_rgba(125,249,255,0.18)] backdrop-blur-xl"
          style={{
            opacity: open ? 1 : 0,
            transform: `translate(${portal.x}px, ${portal.y}px) scale(${open ? 1 : 0.72})`,
            transition: "opacity 180ms ease-out, transform 220ms ease-out",
          }}
        >
          {portal.label.slice(0, 3)}
        </Link>
      ))}
    </nav>
  );
}
