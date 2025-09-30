"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href:"/", label:"Home" },
  { href:"/gmar", label:"GMAR" },
  { href:"/pulse", label:"NEXA" }
];

export default function BottomNav(){
  const pathname = usePathname();
  return (
    <nav style={{
      position:"fixed", bottom:0, left:0, right:0, background:"#0b0b0f", borderTop:"1px solid #27272a",
      display:"flex", justifyContent:"space-around", padding:"10px 8px", zIndex:80
    }}>
      {tabs.map(t=>{
        const active = pathname?.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href}
            style={{ color: active ? "#a78bfa" : "#e5e7eb", textDecoration:"none", fontWeight:600 }}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
