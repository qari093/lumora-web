"use client";
import React from "react";
import { GLASS, shell, Card, btn } from "@/app/ui/_lux/theme";
import Sparkline from "@/app/ui/_lux/Sparkline";
import { haptic } from "@/app/ui/_lux/motion";

const mock = {
  views: [120,180,160,220,240,300,280,360,410,395,420,480],
  watch: [12,14,13,16,17,19,18,21,24,23,25,28],
  rpm:   [1.2,1.4,1.3,1.5,1.7,1.8,1.7,1.9,2.1,2.0,2.2,2.3],
  earn:  [8,10,9,11,12,14,13,16,18,17,19,22],
};

function Tile({label,value,unit}:{label:string;value:string;unit?:string}) {
  return (
    <div className="hover-lift" style={{...GLASS, padding:16, display:"flex", flexDirection:"column", gap:6}}>
      <div style={{opacity:.8, fontSize:13}}>{label}</div>
      <div style={{fontSize:24, fontWeight:900}}>{value}{unit||""}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const refresh = () => { haptic(10); /* future: refetch */ };

  return (
    <div style={shell}>
      <Card title="Overview" right={<button onClick={refresh} style={btn(true)}>Refresh</button>}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12}}>
          <Tile label="Views (7d)" value="48.2k" />
          <Tile label="Watch Time" value="28.4" unit="h" />
          <Tile label="Avg RPM" value=".30" />
          <Tile label="Earnings (7d)" value="21" />
        </div>
      </Card>

      <Card title="Views Trend (30d)">
        <Sparkline data={mock.views} width={600} height={72} />
      </Card>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:12}}>
        <Card title="Watch Time">
          <Sparkline data={mock.watch} width={300} height={60} stroke="rgba(56,189,248,.95)" />
        </Card>
        <Card title="RPM">
          <Sparkline data={mock.rpm} width={300} height={60} stroke="rgba(168,85,247,.95)" />
        </Card>
        <Card title="Earnings">
          <Sparkline data={mock.earn} width={300} height={60} stroke="rgba(251,191,36,.95)" />
        </Card>
      </div>

      <div style={{marginTop:12, display:"flex", gap:10, flexWrap:"wrap"}}>
        <a href="/creator/upload" style={btn()}>Go to Upload</a>
        <a href="/creator/studio" style={btn()}>Open Studio</a>
        <a href="/creator/rewards" style={btn(true)}>Rewards</a>
      </div>
    </div>
  );
}
