"use client";
import React from "react";
import { GLASS, shell, Card, btn } from "@/app/ui/_lux/theme";
export default function Page() {
  return (
    <div style={shell}>
      <Card title="p.slice(1)">
        <p style={{opacity:.9}}>LUX-styled live page. Replace with your real UI.</p>
      </Card>
      <div className="hover-lift" style={{...GLASS, padding:16}}>
        <strong>Quick Tips</strong>
        <ul style={{opacity:.9, margin:"8px 0 0 16px"}}>
          <li>Keep actions within thumb reach</li>
          <li>Use staggered motion for lists</li>
          <li>Prefer glass surfaces for panels</li>
        </ul>
      </div>
      <div style={{marginTop:12}}>
        <a href="/creator/analytics" style={btn(true)}>View Analytics</a>
      </div>
    </div>
  );
}
