import EchoAdsPreload from "@/app/_client/echo-ads-preload";
"use client";

import { useEffect, useMemo, useState } from "react";
import s from "./hybrid.module.css";

type Credits = { ok:boolean; balance:number; nextGrantAt?:number; };
type EmojiItem = { id:string; seed:string; preview:string; };
type AvatarItem = { id:string; seed:string; preview:string; };

async function jget<T=any>(url:string):Promise<T>{ const r=await fetch(url,{cache:"no-store"}); if(!r.ok) throw new Error(await r.text()); return r.json(); }
async function jpost<T=any>(url:string, body?:any):Promise<T>{ const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:body?JSON.stringify(body):undefined}); if(!r.ok) throw new Error(await r.text()); return r.json(); }

export const dynamic = "force-dynamic";

export default function Hybrid() {
  const [credits,setCredits]=useState<Credits|null>(null);
  const [busy,setBusy]=useState(false);
  const [emojis,setEmojis]=useState<EmojiItem[]>([]);
  const [avatars,setAvatars]=useState<AvatarItem[]>([]);
  const [msg,setMsg]=useState<string|null>(null);

  async function loadAll(){
    setMsg(null);
    try{
      const [c,e,a] = await Promise.all([
        jget<Credits>("/api/hybrid/credits?user=DEV"),
        jget<{ok:boolean;items:EmojiItem[]}>("/api/hybrid/emoji/list?n=10&size=96"),
        jget<{ok:boolean;items:AvatarItem[]}>("/api/hybrid/avatar/list?n=10&size=120")
      ]);
      setCredits(c); setEmojis(e.items||[]); setAvatars(a.items||[]);
    }catch(err:any){ setMsg(err?.message||"load failed"); }
  }

  useEffect(()=>{ loadAll(); },[]);

  async function claim(){
    setBusy(true); setMsg(null);
    try{ await jpost("/api/hybrid/claim"); await loadAll(); }
    catch(err:any){ setMsg(err?.message||"claim failed"); }
    finally{ setBusy(false); }
  }

  async function regenEmoji(seed:string){
    setBusy(true); setMsg(null);
    try{
      // hit gen once to refresh seed (deterministic preview also ok)
      await fetch(`/api/hybrid/emoji/gen?seed=${encodeURIComponent(seed)}&size=96`,{cache:"no-store"}).then(r=>r.text());
      await loadAll();
    }catch(err:any){ setMsg(err?.message||"emoji regen failed"); }
    finally{ setBusy(false); }
  }
  async function regenAvatar(seed:string){
    setBusy(true); setMsg(null);
    try{
      await fetch(`/api/hybrid/avatar/gen?seed=${encodeURIComponent(seed)}&size=140`,{cache:"no-store"}).then(r=>r.text());
      await loadAll();
    }catch(err:any){ setMsg(err?.message||"avatar regen failed"); }
    finally{ setBusy(false); }
  }

  const cooldown = useMemo(()=>{
    if(!credits?.nextGrantAt) return 0;
    const left = Math.max(0, credits.nextGrantAt - Date.now());
    return Math.round(left/1000);
  },[credits?.nextGrantAt, credits?.balance]);

  

  async function generateEmoji(){
    setLoading(true);
    setMessage("");
    try{
      const res=await fetch("/api/hybrid/emoji",{method:"POST"});
      const data=await res.json();
      if(data.ok){setMessage("✨ Emoji created: "+data.url);fetchCredits();}
      else setMessage("⚠️ "+(data.error||"Error"));
    }catch(e){setMessage("⚠️ "+e.message);}finally{setLoading(false);}
  }
return (<div className={s.wrap}>
      <h1 className={s.h1}>Hybrid Dashboard</h1>

      <div className={s.grid}>
        <div className={s.card}>
          <div className={s.row}>
            <button className={s.btn} onClick={loadAll} disabled={busy}>Refresh</button>
            <button className={s.btn} onClick={claim} disabled={busy || cooldown>0}>Claim credit</button>
            <a className={s.btn} href="/emoji-lab">Emoji Lab</a>
            <a className={s.btn} href="/avatar-lab">Avatar Lab</a>
            <a className={s.btn} href="/avatar-bridge">Pic→Avatar</a>
          </div>
          <div className={s.kv}>
            Balance: <b>{credits?.balance ?? "…"}</b>
            {cooldown>0 && <span> · cooldown {cooldown}s</span>}
          </div>
          {msg && <div className={s.kv} style={{color:"#f88"}}>{msg}</div>}
        </div>

        <div className={s.card}>
          <div className={s.kv}>Quick actions</div>
          <div className={s.row} style={{marginTop:8}}>
            <a className={s.link} href="/api/hybrid/credits?user=DEV" target="_blank">/api/hybrid/credits?user=DEV</a>
            <a className={s.link} href="/api/hybrid/emoji/list?n=10&size=96" target="_blank">emoji/list</a>
            <a className={s.link} href="/api/hybrid/avatar/list?n=10&size=120" target="_blank">avatar/list</a>
          </div>
        </div>
      </div>

      <div className={s.card} style={{marginTop:16}}>
        <div className={s.kv}><b>Emojis</b></div>
        <div className={s.list}>
          {emojis.map(it=>(
            <div className={s.item} key={it.id}>
              <img className={s.thumb} src={it.preview} alt={it.id}/>
              <div className={s.row}>
                <button className={s.btn} onClick={()=>regenEmoji(it.seed)} disabled={busy}>Regenerate</button>
                <a className={s.btn} download={`${it.seed}.svg`} href={`/api/hybrid/emoji/gen?seed=${encodeURIComponent(it.seed)}&size=128`}>Download</a>
              </div>
              <div className={s.note}>{it.seed}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.card} style={{marginTop:16}}>
        <div className={s.kv}><b>Avatars</b></div>
        <div className={s.list}>
          {avatars.map(it=>(
            <div className={s.item} key={it.id}>
              <img className={s.thumb} src={it.preview} alt={it.id} />
              <div className={s.row}>
                <button className={s.btn} onClick={()=>regenAvatar(it.seed)} disabled={busy}>Regenerate</button>
                <a className={s.btn} download={`${it.seed}.svg`} href={`/api/hybrid/avatar/gen?seed=${encodeURIComponent(it.seed)}&size=160`}>Download</a>
              </div>
              <div className={s.note}>{it.seed}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
