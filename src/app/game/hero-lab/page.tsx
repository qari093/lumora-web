"use client";
import React from "react";
import HeroGallery from "@/components/game/hero/HeroGallery";

export default function HeroLabPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0f10" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>
        <h1 style={{ color: "white", marginBottom: 10 }}>Lumora — Hero Lab</h1>
        <p style={{ color: "#cfcfcf", marginBottom: 20 }}>
          یہاں سے ہیرو ماڈلز سلیکٹ کریں — بعد میں 3D/Animations جوڑیں گے۔
        </p>
        <HeroGallery />
      </div>
    </div>
  );
}
