"use client";
import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getActivePortals } from "@/lib/portals/registry";

export default function PrimaryNav() {
  const pathname = usePathname();
  const portals = getActivePortals();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-t border-white/10">
      <div className="flex justify-around items-center h-14">
        {portals.map((p) => {
          const active = pathname === p.route;
          return (
            <Link
              key={p.key}
              href={p.route}
              className={`flex flex-col items-center justify-center text-xs transition ${
                active ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <span>{p.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { PrimaryNav };


/* user-alive */
