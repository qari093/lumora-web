"use client";
import React,{useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

function useSW(){
  useEffect(()=>{
    if(!('serviceWorker'in navigator)) return;
    (async()=>{
      try{
        const reg=await navigator.serviceWorker.register('/sw.js',{scope:'/'});
        // @ts-ignore
        if(reg?.periodicSync) try{ await reg.periodicSync.register('prefetch-videos',{minInterval:12*60*60*1000}); }catch{}
        // @ts-ignore
        if(reg?.sync) try{ await reg.sync.register('prefetch-videos'); }catch{}
        const ping=()=>navigator.serviceWorker.controller?.postMessage({type:'PREFETCH_VIDEOS'});
        navigator.serviceWorker.controller ? ping() : navigator.serviceWorker.addEventListener('controllerchange', ping);
      }catch{}
    })();
  },[]);
}
function useOnline(){
  const [on,setOn]=useState(typeof navigator!=='undefined'?navigator.onLine:true);
  useEffect(()=>{
    const up=()=>setOn(true),down=()=>setOn(false);
    window.addEventListener('online',up); window.addEventListener('offline',down);
    return ()=>{ window.removeEventListener('online',up); window.removeEventListener('offline',down); };
  },[]);
  return on;
}
const jget=<T,>(k:string,fb:T):T=>{try{return JSON.parse(localStorage.getItem(k)??"null")??fb}catch{return fb}};
const jset=<T,>(k:string,v:T)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

type Ach={id:string;title:string;desc:string;earnedAt?:number};
type Settings={sfx:boolean;difficulty:"easy"|"normal"|"hard";haptics:boolean;leftHanded:boolean};
type Inventory={coins:number;items:{id:string;qty:number}[]};
const LS={best:(id:string)=>`gmar.best.${id}`,coins:"gmar.coins",ach:"gmar.ach",inv:"gmar.inv",set:"gmar.set"} as const;

const loadBest=(id:string)=>jget<number>(LS.best(id),0);
const saveBest=(id:string,v:number)=>jset(LS.best(id),v);
const loadCoins=()=>jget<number>(LS.coins,0);
const setCoins=(v:number)=>jset(LS.coins,v);
const addCoins=(n:number)=>{const c=Math.max(0,loadCoins()+n);setCoins(c);return c};
const spendCoins=(n:number)=>{const c=loadCoins(); if(c<n) return null; setCoins(c-n); return c-n};
const loadAch=():Ach[]=>jget<Ach[]>(LS.ach,[]);
const earnAch=(a:Ach)=>{const cur=loadAch(); if(cur.some(x=>x.id===a.id)) return false; cur.push({...a,earnedAt:Date.now()}); jset(LS.ach,cur); return true};
const loadInv=():Inventory=>jget<Inventory>(LS.inv,{coins:loadCoins(),items:[]});
const saveInv=(i:Inventory)=>{jset(LS.inv,i); setCoins(i.coins)};
const addItem=(id:string,qty=1)=>{const inv=loadInv(); const f=inv.items.find(x=>x.id===id); if(f) f.qty+=qty; else inv.items.push({id,qty}); saveInv(inv); return inv};
const loadSettings=():Settings=>jget<Settings>(LS.set,{sfx:true,difficulty:"normal",haptics:true,leftHanded:false});
const saveSettings=(s:Settings)=>jset(LS.set,s);

type GameDef={id:string;title:string;engine:string};
const GAMES:GameDef[]=[
  {id:"runner",title:"Neon Runner",engine:"runner"},
  {id:"flappy",title:"Hyper Flappy",engine:"flappy"},
  {id:"shooter",title:"Astro Shooter",engine:"shooter"},
  {id:"builder",title:"Block Builder",engine:"builder"},
  {id:"tower",title:"Tower Sentinel",engine:"tower"},
  {id:"rogue",title:"Rogue Core",engine:"rogue"},
  {id:"brawler",title:"Street Brawler",engine:"brawler"},
  {id:"craft",title:"Sky Craft",engine:"craft"},
  {id:"tactics",title:"Tactics Grid",engine:"tactics"},
  {id:"survival",title:"Arid Survival",engine:"survival"},
  {id:"moba",title:"Micro MOBA",engine:"moba"},
  {id:"racing",title:"Turbo Racing",engine:"racing"},
  {id:"platformer",title:"Pixel Platformer",engine:"platformer"},
  {id:"puzzle",title:"Quantum Puzzle",engine:"puzzle"},
  {id:"rhythm",title:"Beat Rhythm",engine:"rhythm"}
];

const Btn=(p:React.ButtonHTMLAttributes<HTMLButtonElement>)=>
  <button {...p} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #222",background:"#0f172a",color:"#e5e7eb",cursor:"pointer",fontSize:14,opacity:p.disabled?0.6:1}}/>;
const Card=({title,children}:{title:string;children:React.ReactNode})=>
  <div style={{border:"1px solid #1f2937",borderRadius:12,padding:12,background:"#0b1220"}}>
    <div style={{fontWeight:700,marginBottom:8}}>{title}</div>{children}
  </div>;

function OfflineAds(){
  const [ads,setAds]=useState<{id:string;title:string;cta:string;url:string}[]>([]);
  useEffect(()=>{
    let m=true;
    fetch('/offline-ads.json').then(r=>r.json()).then(d=>{ if(m) setAds(Array.isArray(d)?d:[]); }).catch(()=>{});
    return ()=>{ m=false };
  },[]);
  if(!ads.length) return null;
  return (
    <Card title="Sponsored (Offline)">
      <div style={{display:'grid',gap:8}}>
        {ads.map(a=>(
          <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
            <div><div style={{fontWeight:600}}>{a.title}</div><div style={{opacity:.7,fontSize:12}}>{a.url}</div></div>
            <Btn onClick={()=>alert(`Open offline: ${a.url}`)}>{a.cta}</Btn>
          </div>
        ))}
      </div>
    </Card>
  );
}

function VideoCard({src}:{src:string}){
  return (
    <div style={{border:"1px solid #1f2937",borderRadius:12,overflow:"hidden"}}>
      <video controls preload="metadata" style={{width:"100%",background:"#000"}}>
        <source src={src} type={src.endsWith('.webm')?'video/webm':'video/mp4'}/>
      </video>
      <div style={{padding:8,opacity:.7,fontSize:12}}>{src}</div>
    </div>
  );
}
function VideoShelf(){
  const [list,setList]=useState<string[]>([]);
  useEffect(()=>{
    let m=true;
    fetch('/video-seed.json').then(r=>r.json()).then(d=>{
      const arr=Array.isArray(d)?d:(d?.urls||[]);
      if(m) setList(arr);
      navigator.serviceWorker?.controller?.postMessage({type:'CACHE_URLS',payload:arr});
    }).catch(()=>{});
    return ()=>{ m=false };
  },[]);
  return (
    <Card title="Videos (Offline-ready)">
      {list.length
        ? <div style={{display:'grid',gap:10}}>{list.map(u=><VideoCard key={u} src={u}/>)}</div>
        : <div style={{opacity:.7}}>No videos yet.</div>
      }
    </Card>
  );
}

type EP={paused?:boolean;onScore:(n:number)=>void;onCoin?:(n:number)=>void;settings:Settings;inventory:Inventory};
const mk=(name:string)=>(p:EP)=>{
  const {paused,onScore,onCoin,settings}=p;
  const [sc,setSc]=useState(0);
  const r=useRef<number|null>(null);
  useEffect(()=>{
    if(paused){ if(r.current) cancelAnimationFrame(r.current); r.current=null; return; }
    const step=()=>{ setSc(v=>{ const inc=settings.difficulty==='easy'?1:settings.difficulty==='normal'?2:3; const nx=v+inc; onScore(nx); if(nx%50===0) onCoin?.(1); return nx; }); r.current=requestAnimationFrame(step); };
    r.current=requestAnimationFrame(step);
    return ()=>{ if(r.current) cancelAnimationFrame(r.current); r.current=null; };
  },[paused,settings.difficulty,onScore,onCoin]);
  return <div style={{border:'1px dashed #334155',padding:12,borderRadius:12,textAlign:'center'}}><div style={{fontWeight:700,marginBottom:6}}>{name}</div><div>Simulated score increasing…</div></div>;
};

const Engines={
  runner:mk("Runner Engine"),flappy:mk("Flappy Engine"),shooter:mk("Shooter Engine"),
  builder:mk("Builder Engine"),tower:mk("Tower Defense Engine"),rogue:mk("Rogue Engine"),
  brawler:mk("Brawler Engine"),craft:mk("Craft Engine"),tactics:mk("Tactics Engine"),
  survival:mk("Survival Engine"),moba:mk("MOBA Engine"),racing:mk("Racing Engine"),
  platformer:mk("Platformer Engine"),puzzle:mk("Puzzle Engine"),rhythm:mk("Rhythm Engine")
} as const;
function EngineSwitch({kind,...rest}:{kind:string}&EP){const E=(Engines as any)[kind]||Engines.runner;return <E {...rest}/>}

function HUD({title,score,best,coins,paused,toggle,reset,openShop}:{title:string;score:number;best:number;coins:number;paused:boolean;toggle:()=>void;reset:()=>void;openShop:()=>void;}){
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr auto auto auto auto',gap:8,alignItems:'center',marginBottom:10}}>
      <div style={{fontWeight:800,fontSize:18}}>{title}</div>
      <div>Score: <b>{score}</b></div><div>Best: <b>{best}</b></div><div>Coins: <b>{coins}</b></div>
      <Btn onClick={toggle}>{paused?'Resume':'Pause'}</Btn><Btn onClick={reset}>Reset</Btn><Btn onClick={openShop}>Shop</Btn>
    </div>
  );
}
function Touch({left,onUp,onDown,onLeft,onRight,onAction}:{left:boolean;onUp:()=>void;onDown:()=>void;onLeft:()=>void;onRight:()=>void;onAction:()=>void;}){
  const b:any={padding:12,border:'1px solid #1f2937',background:'#0b1220',color:'#e5e7eb',borderRadius:10,minWidth:64,textAlign:'center',userSelect:'none'};
  return (
    <div style={{display:'flex',gap:10,justifyContent:'space-between',marginTop:10}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,order:left?2:1}}>
        <div/><div style={b} onClick={onUp}>↑</div><div/>
        <div style={b} onClick={onLeft}>←</div><div style={b} onClick={onDown}>↓</div><div style={b} onClick={onRight}>→</div>
      </div>
      <div style={{order:left?1:2,display:'grid',alignContent:'center'}}><div style={{...b,minWidth:100}} onClick={onAction}>ACTION</div></div>
    </div>
  );
}
function Shop({close,buy,coins}:{close:()=>void;buy:(id:string,c:number)=>void;coins:number;}){
  const items=[{id:'boost_small',t:'Small Boost',c:10,d:'+10 starting score'},{id:'boost_big',t:'Big Boost',c:25,d:'+30 starting score'},{id:'skin_neon',t:'Neon Skin',c:40,d:'Cosmetic glow'},{id:'revive',t:'One Revive',c:50,d:'Second chance once'}];
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',display:'grid',placeItems:'center',zIndex:50}}>
      <div style={{width:'min(680px,92vw)',maxHeight:'80vh',overflow:'auto',border:'1px solid #1f2937',background:'#0b1220',color:'#e5e7eb',borderRadius:12,padding:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><b>Shop (Offline)</b><Btn onClick={close}>Close</Btn></div>
        <div style={{marginTop:6}}>Coins: <b>{coins}</b></div>
        <div style={{display:'grid',gap:8,marginTop:10}}>
          {items.map(it=>
            <Card key={it.id} title={`${it.t} — ${it.c} coins`}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                <div>{it.d}</div>
                <Btn onClick={()=>buy(it.id,it.c)} disabled={coins<it.c}>Buy</Btn>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
function SettingsPanel({val,onChange}:{val:Settings;onChange:(s:Settings)=>void}){
  return (
    <Card title="Settings">
      <div style={{display:'grid',gap:8}}>
        <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={val.sfx} onChange={e=>onChange({...val,sfx:e.target.checked})}/> Enable SFX</label>
        <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={val.haptics} onChange={e=>onChange({...val,haptics:e.target.checked})}/> Haptics</label>
        <label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={val.leftHanded} onChange={e=>onChange({...val,leftHanded:e.target.checked})}/> Left-handed</label>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span>Difficulty:</span>
          <select value={val.difficulty} onChange={e=>onChange({...val,difficulty:e.target.value as Settings["difficulty"]})} style={{background:'#0b1220',color:'#e5e7eb',border:'1px solid #1f2937',borderRadius:8,padding:'6px 8px'}}>
            <option value="easy">easy</option><option value="normal">normal</option><option value="hard">hard</option>
          </select>
        </div>
      </div>
    </Card>
  );
}

export default function Page(){
  useSW();
  const online=useOnline();
  const {id}=useParams<{id:string}>();
  const game=useMemo(()=>GAMES.find(g=>g.id===id)||GAMES[0],[id]);

  const [score,setScore]=useState(0);
  const [best,setBest]=useState(0);
  const [coins,setCoinsState]=useState(0);
  const [paused,setPaused]=useState(false);
  const [ach,setAch]=useState<Ach[]>([]);
  const [shop,setShop]=useState(false);
  const [settings,setSettings]=useState<Settings>(loadSettings());
  const [inv,setInv]=useState<Inventory>(loadInv());

  useEffect(()=>{
    setBest(loadBest(game.id));
    setCoinsState(loadCoins());
    setAch(loadAch());
    setInv(loadInv());
    setSettings(loadSettings());
    setScore(0);
    setPaused(false);
  },[game.id]);

  useEffect(()=>{
    if(score>=200 && earnAch({id:`${game.id}_200`,title:'Score 200!',desc:'Reached 200 points'})) setAch(loadAch());
    if(score>=500 && earnAch({id:`${game.id}_500`,title:'Score 500!',desc:'Reached 500 points'})) setAch(loadAch());
    if(score>=1000 && earnAch({id:`${game.id}_1000`,title:'Score 1000!',desc:'Reached 1000 points'})) setAch(loadAch());
  },[score,game.id]);

  const onScore=(s:number)=>{ setScore(s); if(s>best){ setBest(s); saveBest(game.id,s); } };
  const onCoin =(n:number)=>{ const c=addCoins(n); setCoinsState(c); const invNow=loadInv(); if(c>=50 && earnAch({id:'rich_50',title:'Coin Collector',desc:'Collected 50 coins'})) setAch(loadAch()); setInv({...invNow,coins:c}); };
  const buy=(iid:string,c:number)=>{ const r=spendCoins(c); if(r===null){ alert('Not enough coins.'); return; } const nx=addItem(iid,1); setCoinsState(r); setInv(nx); alert(`Purchased ${iid}.`); };
  const saveSet=(s:Settings)=>{ setSettings(s); saveSettings(s); };

  if(!online){
    return (
      <div style={{padding:16,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
          <span style={{fontWeight:800}}>Offline Mode</span><span style={{opacity:.7,fontSize:12}}>Online features hidden</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:14}}>
          <div>
            <Card title="Mini Game">
              <EngineSwitch kind={game.engine} paused={paused} onScore={onScore} onCoin={onCoin} settings={settings} inventory={inv}/>
              <div style={{marginTop:8}}>
                <Touch left={settings.leftHanded}
                  onUp={()=>onScore(Math.max(0,score+1))}
                  onDown={()=>onScore(Math.max(0,score-1))}
                  onLeft={()=>onScore(Math.max(0,score+2))}
                  onRight={()=>onScore(Math.max(0,score+3))}
                  onAction={()=>onCoin(1)}
                />
              </div>
            </Card>
            <div style={{marginTop:10}}><VideoShelf/></div>
          </div>
          <div style={{display:"grid",gap:10}}>
            <HUD title={game.title} score={score} best={best} coins={coins} paused={paused}
                 toggle={()=>setPaused(p=>!p)} reset={()=>setScore(0)} openShop={()=>setShop(true)} />
            <SettingsPanel val={settings} onChange={saveSet}/>
            <OfflineAds/>
            <Card title="Achievements">
              {ach.length===0
                ? <div style={{opacity:.7}}>No achievements yet.</div>
                : <div style={{display:'grid',gap:6}}>
                    {ach.sort((a,b)=>(b.earnedAt||0)-(a.earnedAt||0)).map(a=>(
                      <div key={a.id} style={{display:'flex',justifyContent:'space-between',gap:8}}>
                        <div><div style={{fontWeight:600}}>{a.title}</div><div style={{fontSize:12,opacity:.7}}>{a.desc}</div></div>
                        <div style={{fontSize:12,opacity:.6}}>{a.earnedAt?new Date(a.earnedAt).toLocaleString():''}</div>
                      </div>
                    ))}
                  </div>}
            </Card>
            <Card title="Select Game (Offline)">
              <div style={{display:"grid",gap:6}}>
                {GAMES.map(g=>(
                  <div key={g.id} style={{padding:"8px 10px",border:"1px solid #1f2937",borderRadius:8,background:g.id===game.id?"#0f172a":"#0b1220",color:"#e5e7eb"}}>
                    {g.title} <span style={{opacity:.6,fontSize:12}}>({g.engine})</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        {shop && <Shop close={()=>setShop(false)} buy={buy} coins={coins}/>}
      </div>
    );
  }

  return (
    <div style={{padding:16,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
        <Link href="/gmar" style={{color:"#93c5fd",textDecoration:"underline"}}>← Back</Link>
        <div style={{opacity:.6,fontSize:12}}>GMAR Unified Play</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:14}}>
        <div>
          <EngineSwitch kind={game.engine} paused={false} onScore={onScore} onCoin={onCoin} settings={settings} inventory={inv}/>
          <Touch left={settings.leftHanded}
            onUp={()=>onScore(Math.max(0,score+1))}
            onDown={()=>onScore(Math.max(0,score-1))}
            onLeft={()=>onScore(Math.max(0,score+2))}
            onRight={()=>onScore(Math.max(0,score+3))}
            onAction={()=>onCoin(1)}
          />
          <div style={{marginTop:10}}><VideoShelf/></div>
        </div>

        <div style={{display:"grid",gap:10}}>
          <HUD title={game.title} score={score} best={best} coins={coins} paused={false}
               toggle={()=>{}} reset={()=>setScore(0)} openShop={()=>setShop(true)} />
          <SettingsPanel val={settings} onChange={saveSet}/>
          <OfflineAds/>
          <Card title="Achievements">
            {ach.length===0
              ? <div style={{opacity:.7}}>No achievements yet. Keep playing!</div>
              : <div style={{display:'grid',gap:6}}>
                  {ach.sort((a,b)=>(b.earnedAt||0)-(a.earnedAt||0)).map(a=>(
                    <div key={a.id} style={{display:'flex',justifyContent:'space-between',gap:8}}>
                      <div><div style={{fontWeight:600}}>{a.title}</div><div style={{fontSize:12,opacity:.7}}>{a.desc}</div></div>
                      <div style={{fontSize:12,opacity:.6}}>{a.earnedAt?new Date(a.earnedAt).toLocaleString():''}</div>
                    </div>
                  ))}
                </div>}
          </Card>
          <Card title="Select Game">
            <div style={{display:"grid",gap:6}}>
              {GAMES.map(g=>(
                <Link key={g.id} href={`/gmar/play/${g.id}`} style={{padding:"8px 10px",border:"1px solid #1f2937",borderRadius:8,background:g.id===game.id?"#0f172a":"#0b1220",color:"#e5e7eb"}}>
                  {g.title} <span style={{opacity:.6,fontSize:12}}>({g.engine})</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {shop && <Shop close={()=>setShop(false)} buy={buy} coins={coins}/>}
    </div>
  );
}
