"use client";

import prisma from "@/lib/prisma";
import Link from "next/link";
/* build-safe default for channel */
let channel = "";
/* build-safe default for slug */
let slug = "";
/* build-safe default for campaignId */
let campaignId = "";
/* build-safe default: define targetUrl when prerendering */
let targetUrl = "";

const money = (c:number)=> "€"+(c/100).toFixed(2);

export default async function DistributePage() {
  const top = await prisma.shortLink.findMany({ orderBy:{ clicks:"desc" }, take: 10 });
  return (
    <div style={{maxWidth:1000, margin:"24px auto", padding:"0 16px", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1 style={{fontSize:26, fontWeight:700}}>Hybrid Distribution</h1>
      <p style={{color:"#666"}}>Create short links per channel and embed the lightweight widget on partner sites.</p>

      <h2 style={{marginTop:16}}>Embed snippet</h2>
      <pre style={{background:"#f8f8f8", padding:"12px", borderRadius:8, overflow:"auto"}}>
{`<script src="/api/dist/embed" data-owner="OWNER_A"></script>`}
      </pre>

      <h2 style={{marginTop:16}}>API helpers</h2>
      <ul style={{color:"#666"}}>
        <li><Link href="/api/dist/stats">/api/dist/stats</Link> — by-channel counts &amp; top links</li>
        <li>POST <code>/api/dist/shorten</code> — {JSON.stringify({ targetUrl, campaignId, slug }, null, 2)}</li>
        <li>Redirector: <code>/api/r/&lt;slug&gt;?ch=social</code></li>
      </ul>

      <h2 style={{marginTop:16}}>Top links</h2>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead><tr>
          <th style={th}>Slug</th><th style={th}>Target</th><th style={th}>Clicks</th><th style={th}>Share Examples</th>
        </tr></thead>
        <tbody>
          {top.map(l=>(
            <tr key={l.id}>
              <td style={td}><code>{l.slug}</code></td>
              <td style={td}><code style={{whiteSpace:"nowrap"}}>{l.targetUrl}</code></td>
              <td style={td}>{l.clicks}</td>
              <td style={td}>
                <code>/api/r/{l.slug}?ch=social</code>
                {" · "}
                <code>/api/r/{l.slug}?ch=email</code>
                {" · "}
                <code>/api/r/{l.slug}?ch=qr</code>
              </td>
            </tr>
          ))}
          {!top.length && <tr><td style={{...td, padding:"12px"}} colSpan={4}>No links yet. Use the API to create one.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { textAlign:"left", padding:"8px 6px", borderBottom:"1px solid #eee", fontSize:13, color:"#666" };
const td: React.CSSProperties = { padding:"8px 6px", borderBottom:"1px dashed #eee", fontSize:14 };
