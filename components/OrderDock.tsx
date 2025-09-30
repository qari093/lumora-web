"use client";
import React, { useState } from "react";

export default function OrderDock({ ad, onClose }:{ ad:any|null; onClose:()=>void }){
  return (
    <div style={{
      position:"fixed", top:16, right:16, width:320, transform:`translateX(${ad?0:340}px)`,
      transition:"transform .25s ease-out", zIndex:60
    }}>
      <div style={{background:"#18181b", border:"1px solid #27272a", borderRadius:14, padding:12}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <div style={{fontWeight:800}}>Order</div>
          <button onClick={onClose} style={{background:"transparent", color:"#e5e7eb"}}>✕</button>
        </div>
        {!ad ? (
          <div style={{opacity:.6, fontSize:13, padding:"12px 0"}}>No product selected.</div>
        ) : (
          <div>
            <div style={{display:"flex", gap:10, marginTop:10}}>
              <img src={ad.img} alt="" style={{width:64, height:64, objectFit:"cover", borderRadius:8}}/>
              <div>
                <div style={{fontWeight:700}}>{ad.title}</div>
                <div style={{opacity:.8, fontSize:13}}>{ad.desc}</div>
                <div style={{marginTop:6, color:"#a3e635"}}>{ad.price}</div>
              </div>
            </div>
            <form onSubmit={e=>{ e.preventDefault(); alert("Demo purchase recorded."); }}>
              <label style={{display:"block", marginTop:10, fontSize:13, opacity:.9}}>Email</label>
              <input required type="email" placeholder="you@example.com"
                style={{width:"100%", background:"#0a0a0a", border:"1px solid #27272a", color:"#fff", borderRadius:8, padding:"8px 10px"}}/>
              <label style={{display:"block", marginTop:10, fontSize:13, opacity:.9}}>Address</label>
              <textarea required rows={2}
                style={{width:"100%", background:"#0a0a0a", border:"1px solid #27272a", color:"#fff", borderRadius:8, padding:"8px 10px"}}></textarea>
              <button type="submit" style={{marginTop:10, width:"100%", padding:"8px 12px", background:"#4f46e5", color:"#fff", borderRadius:8}}>
                Place order
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
