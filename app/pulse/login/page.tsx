"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import React from "react";
import { supaPublic } from "../../../lib/supabase";

export default function Login(){
  async function signIn(provider:"google"|"github"){
    const supa = supaPublic();
    await supa.auth.signInWithOAuth({
      provider,
      options: { redirectTo: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL }
    });
  }
  return (
    <div style={{padding:24}}>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>Sign in</h1>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>signIn("google")} style={btn}>Continue with Google</button>
        <button onClick={()=>signIn("github")} style={btn}>Continue with GitHub</button>
      </div>
      <p style={{opacity:.75,marginTop:12,fontSize:13}}>
        After login you will return to {process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL}
      </p>
    </div>
  );
}
const btn:React.CSSProperties={background:"#4f46e5",color:"#fff",padding:"10px 14px",borderRadius:8};
