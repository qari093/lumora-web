"use client";
import React,{useEffect,useState} from "react";
import { supaPublic } from "../../../lib/supabase";

type PL = { id:string; name:string; created_at:string; visibility?: "public"|"private"; meta?: any };

export default function Account(){
  const supa = supaPublic();
  const [email,setEmail]=useState<string>("");
  const [uid,setUid]=useState<string>("");
  const [pls,setPls]=useState<PL[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ (async()=>{
    const s = await supa.auth.getSession();
    const user = s.data.session?.user;
    if(!user){ window.location.href="/pulse/login"; return; }
    setEmail(user.email||"");
    setUid(user.id);

    const { data, error } = await supa
      .from("playlists")
      .select("id,name,created_at,visibility,meta")
      .order("created_at",{ ascending:false });
    if(!error && data) setPls(data as any);
    setLoading(false);
  })(); },[]);

  async function toggleVisibility(id:string, current:"public"|"private"|"undefined"){
    const next = current==="public" ? "private" : "public";
    const { error } = await supa.from("playlists").update({ visibility: next }).eq("id", id);
    if(!error){ setPls(ps=>ps.map(p=>p.id===id?{...p,visibility:next as any}:p)); }
  }

  async function logout(){
    await supa.auth.signOut();
    window.location.href="/pulse";
  }

  return (
    <section>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>Account</h1>
      <div style={{background:"#18181b",border:"1px solid #27272a",borderRadius:10,padding:12,marginBottom:16}}>
        <div><b>User:</b> {email||"unknown"}</div>
        <div style={{opacity:.8,fontSize:13}}>UID: {uid}</div>
        <div style={{marginTop:10}}><button onClick={logout} style={btn}>Log out</button></div>
      </div>

      <h2 style={{fontWeight:700,marginBottom:8}}>My Playlists</h2>
      {loading ? <div>Loading…</div> :
      !pls.length ? <div style={{opacity:.75}}>No playlists yet.</div> :
      <div style={{display:"grid",gap:10}}>
        {pls.map(p=>(
          <div key={p.id} style={{background:"#18181b",border:"1px solid #27272a",borderRadius:10,padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
              <div>
                <div style={{fontWeight:700}}>{p.name}</div>
                <div style={{opacity:.75,fontSize:12}}>Created: {new Date(p.created_at).toLocaleString()}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:12,opacity:.8}}>Visibility:</span>
                <button onClick={()=>toggleVisibility(p.id, (p.visibility as any)||"private")}
                        style={p.visibility==="public"?btnGreen:btnGray}>
                  {p.visibility==="public"?"Public":"Private"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </section>
  );
}
const btn:React.CSSProperties={background:"#ef4444",color:"#fff",padding:"8px 12px",borderRadius:8};
const btnGreen:React.CSSProperties={background:"#16a34a",color:"#fff",padding:"6px 10px",borderRadius:6};
const btnGray:React.CSSProperties={background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:6};
