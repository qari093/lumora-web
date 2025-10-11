"use client";
import React from "react";

export function useTeamAura(){
  const [team, setTeam] = React.useState<{energy:number;updatedAt:number}|null>(null);
  React.useEffect(()=>{
    const es = new EventSource("/api/energy/team/stream");
    es.onmessage = (ev)=>{
      try{ const j = JSON.parse(ev.data); if(j?.pool) setTeam(j.pool); }catch{}
    };
    return ()=>es.close();
  }, []);
  return team;
}
