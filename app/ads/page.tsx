"use client";
import React from "react";
import CampaignTable from "@/components/ads/CampaignTable";

export default function AdsIndexPage(){
  return (
    <main style={{ padding:20, maxWidth:1100, margin:"0 auto" }}>
      <h1 style={{ margin:0, fontSize:24 }}>�� Ad Campaigns</h1>
      <p style={{ opacity:.7, marginTop:6 }}>Create, filter, edit, and archive campaigns.</p>
      <CampaignTable />
    </main>
  );
}
