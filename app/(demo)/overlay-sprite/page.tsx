import IconBtn from "./IconBtn";

export const metadata = { title: "Overlay Sprite Demo" };

export default function Page(){
  const items = [
    { id:"ico-nexa",     label:"NEXA",        route:"/nexa",        className:"nexa" },
    { id:"ico-gmar",     label:"Gmar",        route:"/gmar",        className:"gmar" },
    { id:"ico-zenshop",  label:"ZenShop",     route:"/shop",        className:"zenshop" },
    { id:"ico-wallet",   label:"Wallet",      route:"/wallet",      className:"wallet" },
    { id:"ico-lumalink", label:"LumaLink",    route:"/luma",        className:"lumalink" },
    { id:"ico-live",     label:"Live",        route:"/live",        className:"live" },
    { id:"ico-ads",      label:"Ads Manager", route:"/vendor",      className:"ads-manager" },
    { id:"ico-lumen",    label:"Lumen AI",    route:"/lumen",       className:"lumen-ai" },
    { id:"ico-profile",  label:"Profile",     route:"/profile",     className:"profile" },
    { id:"ico-settings", label:"Settings",    route:"/settings",    className:"settings" },
    { id:"ico-music",    label:"Music",       route:"/music",       className:"music-player" },
    { id:"ico-trending", label:"Trending",    route:"/trending",    className:"trending" },
  ];
  return (
    <main style={{display:"grid",placeItems:"center",minHeight:"100dvh",padding:"32px"}}>
      <div style={{
        width:"min(920px, 92vw)", background:"rgba(255,255,255,.6)",
        backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
        borderRadius:"24px", padding:"28px", boxShadow:"0 12px 32px rgba(0,0,0,.08)"
      }}>
        <h1 style={{textAlign:"center", fontWeight:800, margin:"0 0 12px"}}>Lumora Universe — Sprite</h1>
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(120px,1fr))",
          gap:"14px", justifyItems:"center", alignItems:"center"
        }}>
          {items.map(it=>(
            <div key={it.id} style={{display:"grid",placeItems:"center",padding:"8px"}}>
              <IconBtn id={it.id} label={it.label} route={it.route} className={it.className}/>
              <div style={{fontSize:12,opacity:.7,marginTop:6}}>{it.label}</div>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center",opacity:.55,marginTop:12}}>Hover or focus to see micro-interactions • Uses /sprite.svg</p>
      </div>
    </main>
  );
}
