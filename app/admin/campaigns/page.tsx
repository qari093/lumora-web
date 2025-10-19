import Link from "next/link";
import { prisma } from "@/lib/prisma";

const money = (c:number)=> "€"+(c/100).toFixed(2);
export default async function AdminCampaigns(){
  const rows = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" }});
  return (
    <div style={{maxWidth:1000, margin:"24px auto", padding:"0 16px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{fontSize:26, fontWeight:700}}>Campaigns</h1>
      <p style={{color:"#666"}}>CRUD also available via APIs: <code>/api/campaigns</code>, <code>/api/creatives</code>.</p>
      <table style={{width:"100%", borderCollapse:"collapse", marginTop:12}}>
        <thead><tr><th style={th}>Name</th><th style={th}>Daily Budget</th><th style={th}>Radius (mi)</th><th style={th}>Status</th><th style={th}>Serve Test</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td style={td}>{r.name}</td>
              <td style={td}>{money(r.dailyBudgetCents)}</td>
              <td style={td}>{r.targetingRadiusMiles}</td>
              <td style={td}><span style={{padding:"2px 8px", border:"1px solid #eee", borderRadius:12}}>{r.status}</span></td>
              <td style={td}><Link href={`/api/ads/serve?campaignId=${r.id}`} prefetch={false}>serve</Link></td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={5} style={{...td, padding:"12px"}}>No campaigns yet. POST /api/campaigns to create one.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
const th: React.CSSProperties = { textAlign:"left", padding:"8px 6px", borderBottom:"1px solid #eee", fontSize:13, color:"#666" };
const td: React.CSSProperties = { padding:"8px 6px", borderBottom:"1px dashed #eee", fontSize:14 };
