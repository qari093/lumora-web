"use client";
import React from "react";
const ROLES = ["admin","moderator","creator","advertiser","user","guest"] as const;
export default function LoginPage(){
  const [redirect, setRedirect] = React.useState<string>("");
  React.useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    setRedirect(params.get("redirect") || "/");
  },[]);
  function setRole(role: string){
    document.cookie = `role=${role}; path=/; max-age=2592000; samesite=lax`;
    document.cookie = `name=${role.toUpperCase()}_USER; path=/; max-age=2592000; samesite=lax`;
    document.cookie = `uid=${Math.random().toString(36).slice(2)}; path=/; max-age=2592000; samesite=lax`;
    window.location.href = redirect || "/";
  }
  return (
    <div style={{maxWidth:540, margin:"60px auto", padding:20, fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontSize:28, marginBottom:8}}>Sign in (Dev Mock)</h1>
      <p style={{opacity:.8, marginBottom:16}}>Choose a role to continue.</p>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10}}>
        {ROLES.map(r=>(
          <button key={r} onClick={()=>setRole(r)}
            style={{padding:"10px 12px", border:"1px solid #333", borderRadius:10, cursor:"pointer"}}>
            {r}
          </button>
        ))}
      </div>
      <p style={{marginTop:16, fontSize:12, opacity:.7}}>Redirect: {redirect || "/"}</p>
    </div>
  );
}
