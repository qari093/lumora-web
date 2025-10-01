"use client";
import React from "react";

export default function HeaderLogo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0" }}>
      <img src="/lumora-logo.svg" alt="Lumora" width={140} height={40} style={{ height:40, width:"auto" }} />
      <span style={{ opacity:.85, fontWeight:600, fontSize:18 }}>Hero Lab</span>
    </div>
  );
}
