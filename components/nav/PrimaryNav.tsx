"use client";

import React from "react";
import Link from "next/link";

const PRIMARY_NAV_ITEMS = [
  { label: "FYP", href: "/fyp" },
  { label: "GMAR", href: "/gmar" },
  { label: "Videos", href: "/videos" },
  { label: "NEXA", href: "/nexa" },
  { label: "Movies", href: "/movies" },
  { label: "Live", href: "/live" },
  { label: "Share", href: "/share" },
  { label: "Celebrations", href: "/celebrations" }
] as const;

export default function PrimaryNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-t border-white/10"
    >
      <div className="flex justify-around items-center h-14">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            className="flex flex-col items-center justify-center text-xs transition text-white/60 hover:text-white"
          >
            <span aria-hidden="true">{item.label}</span>
            <span className="sr-only">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
