import React from "react";
import dynamic from "next/dynamic";
const AdBanner = dynamic(() => import("./components/ads/AdBanner"), { ssr: false });

export default function AdsTest(){
  return (
    <main style={{minHeight:"100vh",background:"#0a0c10",color:"#e5e7eb",padding:16}}>
      <h1 style={{fontWeight:900}}>Ad Banner Test</h1>
      <p style={{opacity:.8}}>This page renders the latest active campaign as a banner.</p>
      <div style={{marginTop:12}}><AdBanner/></div>
    </main>
  );
}
