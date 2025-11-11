// components/lumaspace/DashboardLayout.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: "/lumaspace/reflection", label: "Reflection" },
    { href: "/lumaspace/shadow", label: "Shadow" },
    { href: "/lumaspace/journal", label: "Journal" },
    { href: "/lumaspace/airdrop", label: "Airdrop" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4 max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold">LumaSpace</h2>
          <ul className="flex gap-4 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="flex-1">{children}</div>
    </main>
  );
}
