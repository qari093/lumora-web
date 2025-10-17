"use client";
import React from "react";
import CampaignForm from "@/components/ads/CampaignForm";

export default function NewAdPage() {
  return (
    <main style={{ padding: 20, maxWidth: 920, margin: "0 auto" }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>🛠️ Create Ad Campaign</h1>
        <p style={{ opacity: 0.7, marginTop: 6 }}>
          Fill the basics, budgets, geo-radius (Hybrid Radius Engine), and schedule. We will add assets upload & advanced targeting next.
        </p>
      </div>
      <CampaignForm />
    </main>
  );
}
