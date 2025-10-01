"use client";
import Image from "next/image";
import React from "react";

export default function HeaderLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <Image
        src="/lumora-logo.png"
        alt="Lumora Logo"
        width={140}
        height={38}
        priority
      />
      <span style={{ opacity: 0.85, fontWeight: 600, fontSize: 18 }}>Hero Lab</span>
    </div>
  );
}
