export const dynamic = 'force-static';
export default function LumenHome(){
  return (
    <main style={{fontFamily:"ui-sans-serif,system-ui",color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh",padding:16}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:20}}>Lumen — Companion</div>
        <nav style={{display:"flex",gap:10}}>
          <a href="/lumen/reminders" style={{color:"#8b5cf6"}}>Reminders</a>
          <a href="/api/lumen/ical" style={{color:"#8b5cf6"}}>iCal</a>
        </nav>
      </header>
      <section style={{background:"#18181b",border:"1px solid #27272a",borderRadius:16,padding:16}}>
        <p>Welcome to Lumen. Use <b>Reminders</b> to schedule events, and subscribe to <b>iCal</b> for system-level notifications.</p>
      </section>
    </main>
  );
}
