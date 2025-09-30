import fs from "fs"; import path from "path";
type Item = { slug:string, file:string, title?:string, lang?:string, niche?:string, tags?:string[], created?:number };
const CTA:Record<string,string> = {
  en:"Click to buy", de:"Zum Kauf klicken", ur:"خریدنے کے لیے کلک کریں", es:"Clic para comprar",
  fr:"Cliquer pour acheter", it:"Clicca per acquistare", pt:"Clique para comprar", tr:"Satın almak için tıkla", ar:"إضغط للشراء", hi:"खरीदने के लिए क्लिक करें"
};
export async function getServerSideProps(){
  const p = path.join(process.cwd(),"public","videos","index.json");
  let items:Item[]=[]; try{ const j=JSON.parse(fs.readFileSync(p,"utf8")); items=j.items||[]; }catch{}
  return { props:{ items } };
}
export default function Page({ items }:{ items: Item[] }){
  return (
    <div style={{ padding:24, fontFamily:"ui-sans-serif, system-ui, -apple-system" }}>
      <h1>Lumora — Auto Videos with Holographic Ads</h1>
      <div style={{ display:"grid", gap:18 }}>
        {items.map(v=>{
          const label = CTA[v.lang||"en"] || CTA.en;
          const buyHref = `/buy/${encodeURIComponent(v.slug)}`;
          return (
            <div key={v.slug} style={{ position:"relative", border:"1px solid rgba(255,255,255,.12)", borderRadius:12, padding:12, background:"linear-gradient(180deg,#0b1020,#111827)" }}>
              <div style={{ fontWeight:800, color:"#fff" }}>{v.title||v.slug} <small style={{opacity:.7}}>({v.lang||"en"} • {v.niche||"general"})</small></div>
              <video controls style={{ width:"100%", maxWidth:820, borderRadius:12, marginTop:10 }}>
                <source src={v.file} type="video/mp4" />
              </video>
              <a href={buyHref}
                 style={{
                   position:"absolute", right:20, top:56,
                   textDecoration:"none", padding:"10px 16px", borderRadius:12,
                   background:"conic-gradient(from 0deg, rgba(255,255,255,.18), rgba(255,215,0,.45), rgba(118,75,162,.45), rgba(102,126,234,.45), rgba(255,255,255,.18))",
                   backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)",
                   color:"#111", fontWeight:900, textTransform:"uppercase", letterSpacing:.6,
                   boxShadow:"0 10px 30px rgba(0,0,0,.35)",
                   border:"1px solid rgba(255,255,255,.35)",
                   animation:"holoGlow 2.4s linear infinite",
                 }}
              >
                {label}
              </a>
              <style jsx>{`
                @keyframes holoGlow {
                  0% { filter: drop-shadow(0 0 0 rgba(255,215,0,.0)); }
                  50% { filter: drop-shadow(0 0 12px rgba(255,215,0,.6)); }
                  100% { filter: drop-shadow(0 0 0 rgba(255,215,0,.0)); }
                }
              `}</style>
            </div>
          );
        })}
        {items.length===0 && <div style={{color:"#fff"}}>No videos yet. Run: <code>npm run video:news</code></div>}
      </div>
    </div>
  );
}
