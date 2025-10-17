import React from "react";
export function videoThumb(id:string){
  const yt=/^[a-zA-Z0-9_-]{6,}$/;
  return yt.test(id)?`https://i.ytimg.com/vi/${id}/hqdefault.jpg`:`https://picsum.photos/seed/${encodeURIComponent(id)}/480/270`;
}
export function webFavicon(site:string){
  const host=(site||"").replace(/^https?:\/\//,"").split("/")[0];
  return `https://icons.duckduckgo.com/ip3/${host}.ico`;
}
export function domainOf(url:string){
  try{ return new URL(url).hostname; }catch{ return (url||"").replace(/^https?:\/\//,"").split("/")[0]; }
}
export function Img({src,alt,ratio="16/9"}:{src:string;alt:string;ratio?:string}){
  return (
    <div style={{position:"relative",width:"100%",aspectRatio:ratio,overflow:"hidden",borderRadius:8,background:"#0a0d12",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <img src={src} alt={alt} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
    </div>
  );
}
