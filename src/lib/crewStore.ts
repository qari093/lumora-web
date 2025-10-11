import { getOrSetUid } from "@/lib/uid";

export type Crew = { id:string; name:string; energy:number; members:Set<string>; updatedAt:number };
const crews = new Map<string, Crew>();
const userCrew = new Map<string, string>(); // uid -> crewId

function now(){ return Date.now(); }

export function ensureDemoCrew(){
  let c = crews.get("demo");
  if(!c){
    c = { id:"demo", name:"Demo Crew", energy:0, members:new Set(), updatedAt: now() };
    crews.set(c.id, c);
  }
  return c;
}

export function createCrew(name:string){
  const id = "c_" + Math.random().toString(36).slice(2,10);
  const c: Crew = { id, name: name || "Crew", energy:0, members:new Set(), updatedAt: now() };
  crews.set(id, c);
  return c;
}

export function joinCrew(uid?:string, crewId?:string){
  const id = uid || getOrSetUid();
  const cid = crewId || "demo";
  const c = crews.get(cid) || (cid==="demo" ? ensureDemoCrew() : null);
  if(!c) throw new Error("crew_not_found");
  leaveCrew(id);
  c.members.add(id);
  userCrew.set(id, c.id);
  return c;
}

export function leaveCrew(uid?:string){
  const id = uid || getOrSetUid();
  const cur = userCrew.get(id);
  if(cur){
    const c = crews.get(cur);
    if(c){ c.members.delete(id); }
    userCrew.delete(id);
  }
}

export function crewOf(uid?:string){
  const id = uid || getOrSetUid();
  const cid = userCrew.get(id);
  if(!cid) return null;
  const c = crews.get(cid) || null;
  return c ? { id:c.id, name:c.name, energy:c.energy, members:c.members.size, updatedAt:c.updatedAt } : null;
}

export function addEnergyToCrewOf(uid?:string, amount:number = 0){
  if(amount <= 0) return crewOf(uid);
  const id = uid || getOrSetUid();
  const cid = userCrew.get(id);
  if(!cid) return crewOf(id);
  const c = crews.get(cid);
  if(!c) return null;
  c.energy += amount;
  c.updatedAt = now();
  return { id:c.id, name:c.name, energy:c.energy, members:c.members.size, updatedAt:c.updatedAt };
}
