import React from "react";
const GLYPHS = [{"id":"glyph-approve","label":"/approve","cls":"g-approve"},{"id":"glyph-veto","label":"/veto","cls":"g-veto"},{"id":"glyph-laugh","label":"/laugh","cls":"g-laugh"},{"id":"glyph-acknowledge","label":"/acknowledge","cls":"g-ack"},{"id":"glyph-question","label":"/question","cls":"g-q"},{"id":"glyph-alert","label":"/alert","cls":"g-alert"},{"id":"glyph-celebrate","label":"/celebrate","cls":"g-celebrate"},{"id":"glyph-pause","label":"/pause","cls":"g-pause"},{"id":"glyph-buffering","label":"/buffering","cls":"g-buffering"},{"id":"glyph-overwhelm","label":"/overwhelm","cls":"g-overwhelm"},{"id":"glyph-echo","label":"/echo","cls":"g-echo"},{"id":"glyph-connection","label":"/connection","cls":"g-connection"},{"id":"glyph-shift","label":"/shift","cls":"g-shift"},{"id":"glyph-grounded","label":"/grounded","cls":"g-grounded"},{"id":"glyph-decompress","label":"/decompress","cls":"g-decompress"},{"id":"glyph-resonance","label":"/resonance","cls":"g-resonance"},{"id":"glyph-sonder","label":"/sonder","cls":"g-sonder"},{"id":"glyph-chronosync","label":"/chronosync","cls":"g-chronosync"},{"id":"glyph-karma-field","label":"/karma_field","cls":"g-karma"},{"id":"glyph-lumen","label":"/lumen","cls":"g-lumen"},{"id":"glyph-data-phantom","label":"/data_phantom","cls":"g-phantom"},{"id":"glyph-quantum-state","label":"/quantum_state","cls":"g-quantum"},{"id":"glyph-neural-bloom","label":"/neural_bloom","cls":"g-neural"},{"id":"glyph-symbiotic","label":"/symbiotic","cls":"g-symbiotic"},{"id":"glyph-cheer","label":"/cheer","cls":"g-cheer"},{"id":"glyph-idea","label":"/idea","cls":"g-idea"},{"id":"glyph-flame","label":"/flame","cls":"g-flame"},{"id":"glyph-star","label":"/star","cls":"g-star"},{"id":"glyph-bolt","label":"/bolt","cls":"g-bolt"},{"id":"glyph-cloud","label":"/cloud","cls":"g-cloud"},{"id":"glyph-rain","label":"/rain","cls":"g-rain"},{"id":"glyph-sun","label":"/sun","cls":"g-sun"},{"id":"glyph-moon","label":"/moon","cls":"g-moon"},{"id":"glyph-target","label":"/target","cls":"g-target"},{"id":"glyph-check","label":"/check","cls":"g-check"},{"id":"glyph-cross","label":"/cross","cls":"g-cross"},{"id":"glyph-plus","label":"/plus","cls":"g-plus"},{"id":"glyph-minus","label":"/minus","cls":"g-minus"},{"id":"glyph-play","label":"/play","cls":"g-play"},{"id":"glyph-stop","label":"/stop","cls":"g-stop"},{"id":"glyph-record","label":"/record","cls":"g-record"},{"id":"glyph-mic","label":"/mic","cls":"g-mic"},{"id":"glyph-camera","label":"/camera","cls":"g-camera"},{"id":"glyph-link","label":"/link","cls":"g-link"},{"id":"glyph-lock","label":"/lock","cls":"g-lock"},{"id":"glyph-unlock","label":"/unlock","cls":"g-unlock"},{"id":"glyph-search","label":"/search","cls":"g-search"},{"id":"glyph-home","label":"/home","cls":"g-home"},{"id":"glyph-user","label":"/user","cls":"g-user"},{"id":"glyph-settings","label":"/settings","cls":"g-settings"}];
function Card({id,label,cls}:{id:string;label:string;cls?:string}){
  return (
    <div style={{display:"grid",placeItems:"center",gap:8,padding:10}}>
      <svg className={`icon glyph ${cls??""}`} viewBox="0 0 64 64" aria-hidden="true">
        <use href={`/sprite.svg#${id}`} />
      </svg>
      <div style={{fontSize:12,opacity:.85,fontWeight:600}}>{label}</div>
    </div>
  );
}
export default function Page(){
  return (
    <main style={{display:"grid",placeItems:"center",minHeight:"100dvh",padding:"28px"}}>
      <div style={{
        width:"min(1080px,96vw)",
        background:"rgba(255,255,255,.06)",
        borderRadius:24,
        backdropFilter:"blur(18px) saturate(160%)",
        WebkitBackdropFilter:"blur(18px) saturate(160%)",
        border:"1px solid rgba(255,255,255,.16)",
        padding:20,
        boxShadow:"0 14px 36px rgba(0,0,0,.18)"
      }}>
        <h1 style={{textAlign:"center",margin:"0 0 10px"}}>Lumora — Foundation Glyphs</h1>
        <p style={{textAlign:"center",opacity:.7,margin:"0 0 14px"}}>Holographic-ready SVG glyphs (50 total)</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:6,justifyItems:"center"}}>
          {GLYPHS.map(g => <Card key={g.id} id={g.id} label={g.label} cls={g.cls} />)}
        </div>
      </div>
    </main>
  );
}