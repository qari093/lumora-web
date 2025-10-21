// Minimal home for Lumora (Next.js App Router)
export const dynamic = "force-static";

export default function Home() {
  const links = [
    { href: "/fyp", label: "FYP" },
    { href: "/creator", label: "Creator Dashboard" },
    { href: "/distribute", label: "Distribute" },
    { href: "/api/health", label: "API Health" },
  ];
  return (
    <main style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"#0b0f12",color:"#e5e7eb",fontFamily:"ui-sans-serif,system-ui"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:32,marginBottom:12}}>Lumora</h1>
        <p style={{opacity:.85,marginBottom:18}}>Welcome. Choose a section:</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          {links.map(l=>(
            <a key={l.href} href={l.href}
               style={{padding:"8px 12px",border:"1px solid #333",borderRadius:10,textDecoration:"none",color:"#e5e7eb"}}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
