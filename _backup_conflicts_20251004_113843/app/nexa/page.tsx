'use client';

/**
 * NEXA — Unified Buddy (Lumen) + Music Studio + Live Sports TV (Ad-ready, HLS)
 * Location: app/nexa/page.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Hls from 'hls.js';

/* ──────────────────────────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────────────────────────── */
type UUID = string;
type Phase = 'RESET'|'BUILD'|'PERFORM'|'SUSTAIN';
type Goal = 'FAT_LOSS'|'LONGEVITY'|'PERFORMANCE'|'RECOMP'|'GENERAL_WELLNESS';
type LoopStyle = 'SEASONAL'|'MOMENTUM'|'MICRO_CYCLES'|'STEADY';

type Biometrics = { weightKg?: number };
type CheckIn = {
  dateISO: string; adherencePct: number; energy: 1|2|3|4|5; mood: 1|2|3|4|5; cravings: 1|2|3|4|5; hunger: 1|2|3|4|5;
  trainingDay?: boolean; biometrics?: Biometrics; notes?: string;
};

type MacroTarget = { kcal: number; proteinG: number; carbsG: number; fatG: number; fiberG?: number };
type MealTemplate = { title: string; desc?: string; };

type DayPlan = {
  planId: PlanId; brandName: string; phase: Phase; macros: MacroTarget; meals: MealTemplate[];
  intro?: string; outro?: string; notes?: string[]; adherenceHint?: string;
};

type Constraints = { mealsPerDay: 2|3|4; windowStart?: string; windowEnd?: string };
type Profile = {
  userId: UUID; goal: Goal; loopStyle: LoopStyle; kcalBaseline: number;
  currentPlan: PlanId; brandName: string; supportsIF?: boolean;
  currentPhase: Phase; phaseDay: number; constraints: Constraints; history: CheckIn[];
};
type EngineState = { profile: Profile; version: string; lastComputedISO?: string };

/* ──────────────────────────────────────────────────────────────────
 * Plans (10) — Branded
 * ────────────────────────────────────────────────────────────────── */
type PlanId =
  | 'MEDITERRANEAN' | 'DASH' | 'MIND' | 'LOW_GI' | 'HP_CYCLING'
  | 'IF_16_8' | 'FLEXITARIAN' | 'KETOFLEX' | 'ANTI_INFLAMMATORY' | 'ZONE_PERFORMANCE';

const Brand: Record<PlanId, { brandName: string; supportsIF?: boolean; meals: string[] }> = {
  MEDITERRANEAN:      { brandName: 'Aegean Vitalis', meals: ['Olive herb salmon bowl','Chickpea Greek salad','Yogurt + berries'] },
  DASH:               { brandName: 'PulseGuard DASH+', meals: ['Turkey & avocado wrap','Quinoa+veg+yogurt','Oats+banana+chia'] },
  MIND:               { brandName: 'NeuroLeaf MIND', meals: ['Leafy salad + beans','Blueberries + yogurt + walnuts','Sardines on WG toast'] },
  LOW_GI:             { brandName: 'GlycoFlow Low-GI', meals: ['Steel-cut oats + seeds','Bean chili + quinoa','Tofu stir-fry + broccoli'] },
  HP_CYCLING:         { brandName: 'ProCycle 2.0 (High-Protein)', meals: ['Chicken/quorn + rice + veg','Protein parfait + berries','Egg/legume scramble'] },
  IF_16_8:            { brandName: 'Window16 Harmony', supportsIF: true, meals: ['Window opener: protein+fruit','Main: protein+grain+veg','Evening: yogurt/nuts'] },
  FLEXITARIAN:        { brandName: 'GreenFlex Atlas', meals: ['Black-bean burrito bowl','Tofu buddha bowl + tahini','WG pasta + lentil ragu'] },
  KETOFLEX:           { brandName: 'LipoFlex Cyclic', meals: ['Olive-oil chicken + avocado','Tofu pesto zoodles','Eggs + spinach + feta'] },
  ANTI_INFLAMMATORY:  { brandName: 'InflamEase Spectrum', meals: ['Salmon + turmeric quinoa','Berry bowl + yogurt + flax','Chickpea curry + veg'] },
  ZONE_PERFORMANCE:   { brandName: 'TempoZone Pro', meals: ['Pre: yogurt + honey + banana','Post: chicken + rice + veg','Fish+potatoes+salad'] },
};

/* ──────────────────────────────────────────────────────────────────
 * Diet Engine (compact)
 * ────────────────────────────────────────────────────────────────── */
const clamp = (v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const maint = (w:number, act:'LOW'|'MOD'|'HIGH'='MOD')=>Math.round(22*w*(act==='HIGH'?1.7:act==='LOW'?1.4:1.55));

type Preset = Partial<MacroTarget>; // g/kg for protein/carbs/fat; fiber absolute
const Presets: Record<PlanId, Record<Phase, Preset>> = {
  MEDITERRANEAN:{RESET:{proteinG:1.6,carbsG:2.0,fatG:1.0,fiberG:30},BUILD:{proteinG:1.8,carbsG:2.5,fatG:1.0,fiberG:30},PERFORM:{proteinG:1.8,carbsG:3.0,fatG:1.0,fiberG:30},SUSTAIN:{proteinG:1.6,carbsG:2.5,fatG:1.0,fiberG:30}},
  DASH:{RESET:{proteinG:1.6,carbsG:2.3,fatG:0.8,fiberG:30},BUILD:{proteinG:1.8,carbsG:2.6,fatG:0.9,fiberG:30},PERFORM:{proteinG:1.8,carbsG:3.0,fatG:0.9,fiberG:30},SUSTAIN:{proteinG:1.6,carbsG:2.5,fatG:0.9,fiberG:30}},
  MIND:{RESET:{proteinG:1.6,carbsG:2.2,fatG:0.9,fiberG:30},BUILD:{proteinG:1.7,carbsG:2.5,fatG:0.9,fiberG:30},PERFORM:{proteinG:1.8,carbsG:2.8,fatG:1.0,fiberG:30},SUSTAIN:{proteinG:1.6,carbsG:2.4,fatG:0.9,fiberG:30}},
  LOW_GI:{RESET:{proteinG:1.8,carbsG:1.8,fatG:0.9,fiberG:35},BUILD:{proteinG:1.8,carbsG:2.2,fatG:0.9,fiberG:35},PERFORM:{proteinG:1.8,carbsG:2.6,fatG:0.9,fiberG:35},SUSTAIN:{proteinG:1.6,carbsG:2.2,fatG:0.9,fiberG:35}},
  HP_CYCLING:{RESET:{proteinG:2.0,carbsG:1.6,fatG:1.0},BUILD:{proteinG:2.0,carbsG:2.0,fatG:1.0},PERFORM:{proteinG:2.0,carbsG:2.4,fatG:1.0},SUSTAIN:{proteinG:1.8,carbsG:2.0,fatG:1.0}},
  IF_16_8:{RESET:{proteinG:1.8,carbsG:2.0,fatG:1.0,fiberG:30},BUILD:{proteinG:1.8,carbsG:2.4,fatG:1.0,fiberG:30},PERFORM:{proteinG:1.8,carbsG:2.8,fatG:1.0,fiberG:30},SUSTAIN:{proteinG:1.6,carbsG:2.2,fatG:1.0,fiberG:30}},
  FLEXITARIAN:{RESET:{proteinG:1.6,carbsG:2.3,fatG:0.9,fiberG:35},BUILD:{proteinG:1.7,carbsG:2.6,fatG:0.9,fiberG:35},PERFORM:{proteinG:1.8,carbsG:2.9,fatG:0.9,fiberG:35},SUSTAIN:{proteinG:1.6,carbsG:2.4,fatG:0.9,fiberG:35}},
  KETOFLEX:{RESET:{proteinG:1.8,carbsG:0.8,fatG:1.6,fiberG:25},BUILD:{proteinG:1.8,carbsG:1.2,fatG:1.4,fiberG:25},PERFORM:{proteinG:1.8,carbsG:1.6,fatG:1.2,fiberG:25},SUSTAIN:{proteinG:1.6,carbsG:1.2,fatG:1.4,fiberG:25}},
  ANTI_INFLAMMATORY:{RESET:{proteinG:1.7,carbsG:2.2,fatG:1.0,fiberG:35},BUILD:{proteinG:1.8,carbsG:2.5,fatG:1.0,fiberG:35},PERFORM:{proteinG:1.8,carbsG:2.8,fatG:1.0,fiberG:35},SUSTAIN:{proteinG:1.6,carbsG:2.4,fatG:1.0,fiberG:35}},
  ZONE_PERFORMANCE:{RESET:{proteinG:1.8,carbsG:2.2,fatG:0.9,fiberG:30},BUILD:{proteinG:1.9,carbsG:2.6,fatG:0.9,fiberG:30},PERFORM:{proteinG:2.0,carbsG:3.2,fatG:0.9,fiberG:30},SUSTAIN:{proteinG:1.8,carbsG:2.4,fatG:0.9,fiberG:30}},
};

function recLens(style:LoopStyle):Record<Phase,number>{
  switch(style){
    case 'SEASONAL': return {RESET:7,BUILD:14,PERFORM:21,SUSTAIN:14};
    case 'MOMENTUM': return {RESET:5,BUILD:10,PERFORM:10,SUSTAIN:7};
    case 'MICRO_CYCLES': return {RESET:3,BUILD:7,PERFORM:7,SUSTAIN:4};
    default: return {RESET:7,BUILD:7,PERFORM:7,SUSTAIN:7};
  }
}
const nextPhase=(p:Phase):Phase=>p==='RESET'?'BUILD':p==='BUILD'?'PERFORM':p==='PERFORM'?'SUSTAIN':'RESET';

function shouldAdvance(p:Profile){
  const len = recLens(p.loopStyle)[p.currentPhase];
  const last3 = p.history.slice(-3);
  const adh = last3.length? last3.reduce((s,h)=>s+h.adherencePct,0)/last3.length : 70;
  if (p.phaseDay>=len && adh>=70) return true;
  if ((p.currentPhase==='RESET'||p.currentPhase==='BUILD') && p.phaseDay>=Math.floor(len*0.6) && adh>=85) return true;
  if (p.currentPhase==='PERFORM' && p.phaseDay>=len && adh>=75) return true;
  return false;
}

function targetKcal(p:Profile, c?:CheckIn){
  const w = c?.biometrics?.weightKg ?? p.history.slice(-1)[0]?.biometrics?.weightKg ?? 75;
  const base = maint(w,'MOD'); const ph=p.currentPhase, g=p.goal; let pct=0;
  if (g==='FAT_LOSS'){ pct = ph==='RESET'?-0.10:ph==='BUILD'?-0.15:ph==='PERFORM'?-0.05:-0.10; }
  else if (g==='PERFORMANCE'){ pct = ph==='PERFORM'?+0.05: ph==='RESET'?-0.05:0; }
  else if (g==='RECOMP'){ pct = ph==='PERFORM'?0:-0.07; }
  else { pct = ph==='RESET'?-0.05:0; }
  return clamp(Math.round(base*(1+pct)),1200,4000);
}
function realize(kg:Partial<MacroTarget>, weightKg:number, kcal:number):MacroTarget{
  const p = Math.round((kg.proteinG ?? 1.6) * weightKg);
  const c = Math.round((kg.carbsG ?? 2.2) * weightKg);
  const f = Math.round((kg.fatG ?? 1.0) * weightKg);
  const kcalPF = p*4 + f*9;
  const cAdj = Math.round(Math.max(0, (kcal - kcalPF)) / 4);
  const fiberG = kg.fiberG ? Math.round(kg.fiberG) : undefined;
  return { kcal, proteinG:p, carbsG: cAdj || c, fatG:f, fiberG };
}
function adherenceHint(ci?:CheckIn){
  if (!ci) return 'Aim for 70–85% adherence. Progress beats perfection.';
  if (ci.adherencePct>=85) return '🔥 Elite adherence — keep it sustainable.';
  if (ci.adherencePct>=70) return '✅ Solid consistency — tiny 1% improvements add up.';
  return '🧩 Try prepping one anchor meal to boost adherence.';
}

class NexaDietEngine {
  private st: EngineState;
  constructor(state: EngineState){ this.st = state; }
  static initNew(opts: { userId:UUID; goal?:Goal; loopStyle?:LoopStyle; startPlan:PlanId; mealsPerDay?:2|3|4; startWeightKg?:number; windowStart?:string; windowEnd?:string; }) {
    const b = Brand[opts.startPlan];
    const profile: Profile = {
      userId: opts.userId, goal: opts.goal ?? 'GENERAL_WELLNESS', loopStyle: opts.loopStyle ?? 'MICRO_CYCLES',
      kcalBaseline: maint(opts.startWeightKg ?? 75,'MOD'),
      currentPlan: opts.startPlan, brandName: b.brandName, supportsIF: b.supportsIF,
      currentPhase: 'RESET', phaseDay: 1,
      constraints: { mealsPerDay: opts.mealsPerDay ?? 3, windowStart: opts.windowStart, windowEnd: opts.windowEnd },
      history: []
    };
    return new NexaDietEngine({ profile, version:'1.5.0' });
  }
  getState(){ return this.st; }

  tick(checkIn?:CheckIn): DayPlan {
    const p = this.st.profile;
    if (checkIn) p.history.push(checkIn);
    if (shouldAdvance(p)){ p.currentPhase = nextPhase(p.currentPhase); p.phaseDay = 1; } else { p.phaseDay += 1; }
    const gramsKg = (Presets as any)[p.currentPlan][p.currentPhase] as Partial<MacroTarget>;
    const kcal = targetKcal(p, checkIn);
    const weight = checkIn?.biometrics?.weightKg ?? p.history.slice(-1)[0]?.biometrics?.weightKg ?? Math.round(p.kcalBaseline/22);
    const macros = realize(gramsKg, weight, kcal);
    const meals: MealTemplate[] = Brand[p.currentPlan].meals.slice(0, p.constraints.mealsPerDay).map(title=>({ title }));
    const intro = `👋 Welcome back to NEXA. ${p.currentPhase==='RESET'?'🌱':p.currentPhase==='BUILD'?'🧱':p.currentPhase==='PERFORM'?'⚡':'🌿'} ${p.brandName} — ${p.currentPhase} · Day ${p.phaseDay}\nDaily adaptive nutrition, guided by your data.`;
    const outro = `✅ Wrap-up: ${adherenceHint(checkIn)}\n— Tiny wins, compounding daily.`;
    return { planId: p.currentPlan, brandName: p.brandName, phase: p.currentPhase, macros, meals, intro, outro, notes:[`Phase day ${p.phaseDay}`] };
  }
}

/* ──────────────────────────────────────────────────────────────────
 * Unified Buddy (exercise + projections)
 * ────────────────────────────────────────────────────────────────── */
type ExerciseBlock = { title:string; whenISO:string; durationMin:number; intensity?:string; details?:string[] };
type ExercisePlanDay = { archetype:string; blocks:ExerciseBlock[]; autoRegNotes?:string[] };
const todayISO = ()=>new Date().toISOString().slice(0,10);

function buildExercise(brand:string, dateISO:string, sleepMin?:number, steps?:number): ExercisePlanDay {
  const lowSleep = (sleepMin ?? 9999) < 390;
  const lowSteps = (steps ?? 0) < 6000;
  const at = (t:string)=>`${dateISO}T${t}:00`;
  const plan: Record<string, ExercisePlanDay> = {
    'Aegean Vitalis': { archetype:'Coastal Balance PRO', blocks:[
      { title: lowSleep?'Zone-2 Walk (gentle)':'Zone-2 Walk', whenISO: at('08:30'), durationMin: lowSleep?30:40, intensity:'Z2' },
      { title: lowSleep?'Full-Body (2×8)':'Full-Body (3×8)', whenISO: at('17:30'), durationMin: 40, intensity:'RPE7-8' },
    ], autoRegNotes: lowSleep?['Low sleep: −1 set, keep Z2']:[] },
    'PulseGuard DASH+': { archetype:'PulseGuard Enduro', blocks:[
      { title:'Brisk Walk', whenISO: at('09:00'), durationMin: 35, intensity:'Z1-Z2' },
      { title: lowSleep?'Mobility (short)':'Mobility Flow', whenISO: at('19:00'), durationMin: lowSleep?10:20, intensity:'Easy' },
    ], autoRegNotes: lowSleep?['HRV low: mobility short']:[] },
    'NeuroLeaf MIND': { archetype:'NeuroFit Dual-Task ELITE', blocks:[
      { title:'Balance + Coordination', whenISO: at('11:00'), durationMin:25, intensity:'Skill' },
      { title: lowSleep?'Strength (2×10)':'Strength (3×10)', whenISO: at('18:30'), durationMin:35, intensity:'RPE7' },
    ], autoRegNotes: lowSleep?['Swap plyo → tempo carries']:[] },
    'GlycoFlow Low-GI': { archetype:'GlycoControl Engine', blocks:[
      { title:'Post-meal Walk', whenISO: at('13:30'), durationMin:12, intensity:'Tempo' },
      { title: lowSleep?'Circuit (2×10)':'Circuit (3×10)', whenISO: at('18:00'), durationMin:30, intensity:'RPE7-8' },
    ], autoRegNotes: lowSleep?['Cut one circuit']:[] },
    'ProCycle 2.0 (High-Protein)': { archetype:'ProCycle Hypertrophy v2', blocks:[
      { title: lowSleep?'Upper (2×8)':'Upper (3–4×6–12)', whenISO: at('17:30'), durationMin:45, intensity:'RPE8' },
      ...(lowSleep?[]:[{ title:'Intervals (optional)', whenISO: at('19:00'), durationMin:12, intensity:'Z4' }]),
    ], autoRegNotes: lowSleep?['Removed HIIT, keep strength']:[] },
    'Window16 Harmony': { archetype:'WindowForge Minimalist', blocks:[
      { title:'EMOM Strength Complex', whenISO: at('12:30'), durationMin: lowSleep?28:35, intensity:'RPE8', details:['Train in feeding window'] },
    ], autoRegNotes:['Train inside window bonus'] },
    'GreenFlex Atlas': { archetype:'GreenFlex 80/20 Engine', blocks:[
      { title:'Z2 Cardio', whenISO: at('08:00'), durationMin: lowSleep?35:45, intensity:'Z2' },
      { title: lowSteps?'Full-Body (light)':'Full-Body Strength', whenISO: at('18:30'), durationMin:35, intensity:'RPE7-8' },
    ], autoRegNotes: lowSteps?['Low steps → lighter strength']:[] },
    'LipoFlex Cyclic': { archetype:'LipoFlex Power-Sprint', blocks:[
      { title:'Heavy Full-Body (5×5 → mod)', whenISO: at('17:00'), durationMin:45, intensity:'RPE8', details:[lowSleep?'Keep 4×5':'Push main @RPE8'] },
    ], autoRegNotes: lowSleep?['Remove sprints; add 35m Z2 tomorrow']:[] },
    'InflamEase Spectrum': { archetype:'InflamEase Restore', blocks:[
      { title:'Mobility + Band Circuit', whenISO: at('18:00'), durationMin: lowSleep?20:30, intensity:'RPE6-7' },
      { title:'Low-Impact Cardio', whenISO: at('10:00'), durationMin:30, intensity:'Z1-Z2' },
    ], autoRegNotes: lowSleep?['Keep impact low']:[] },
    'TempoZone Pro': { archetype:'TempoZone Periodized PRO', blocks:[
      { title:'Z2 Base', whenISO: at('07:30'), durationMin:40, intensity:'Z2' },
      { title: lowSleep?'Technique Day':'Tempo Z3', whenISO: at('18:30'), durationMin: lowSleep?25:30, intensity: lowSleep?'Drills':'Z3' },
    ], autoRegNotes: lowSleep?['Swap Z4/Z3 → technique']:[] },
  };
  return plan[brand] ?? { archetype:'Default Day', blocks:[{ title:'Zone-2 Walk', whenISO:at('08:00'), durationMin:30, intensity:'Z2' }] };
}

type CompanionTip = { text:string; emoji?:string; priority?:1|2|3 };
type OrbitDay = {
  dateISO:string; sleep?:{durationMin:number;deepMin?:number}; steps?:number; diet:DayPlan; exercise:ExercisePlanDay; tips:CompanionTip[];
};

function mockSleep(){ const durationMin = Math.round(330 + Math.random()*120); const deepMin = Math.round(durationMin*(0.15+Math.random()*0.1)); return { durationMin, deepMin }; }
function mockSteps(){ return Math.round(3000 + Math.random()*8000); }

function futureMirror(weightKg:number, kcal:number, strengthPerWeek:number, cardioMin:number){
  const maintenance = Math.round(22*weightKg*1.55);
  const deficit = maintenance - kcal;
  const baseWeekly = clamp(deficit/7700, -1.2, 1.0);
  const cardioBias = Math.min(0.1, (cardioMin/150)*0.05);
  const typical4 = baseWeekly*4 + cardioBias;
  const best4 = typical4 + 0.4;
  const poorSleep4 = typical4 - 0.6;
  return { bestCaseKg:+best4.toFixed(2), typicalKg:+typical4.toFixed(2), poorSleepKg:+poorSleep4.toFixed(2), disclaimer:'Estimates only. Not medical advice.' };
}

/* ──────────────────────────────────────────────────────────────────
 * 🎵 Music Studio
 * ────────────────────────────────────────────────────────────────── */
type Track = { id:string; title:string; artist:string; url:string; energy?:'calm'|'focus'|'hype' };
const LIBRARY: Track[] = [
  { id:'t1', title:'Ocean Focus', artist:'NEXA', url:'/audio/focus1.mp3', energy:'focus' },
  { id:'t2', title:'Deep Flow', artist:'NEXA', url:'/audio/focus2.mp3', energy:'focus' },
  { id:'t3', title:'Sunrise Calm', artist:'NEXA', url:'/audio/calm1.mp3',  energy:'calm'  },
  { id:'t4', title:'Harbor Sprint', artist:'NEXA', url:'/audio/hype1.mp3', energy:'hype'  },
  { id:'t5', title:'TempoZone',     artist:'NEXA', url:'/audio/hype2.mp3', energy:'hype'  },
];
const PLAYLISTS: Record<string,string[]> = {
  'Focus (NeuroLeaf)': ['t1','t2'],
  'Calm Sleep': ['t3'],
  'Workout Hype (TempoZone)': ['t4','t5'],
};

function useAudioPlayer(initialId?:string){
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const [trackId,setTrackId] = useState<string|undefined>(initialId);
  const [isPlaying,setPlaying] = useState(false);
  const track = LIBRARY.find(t=>t.id===trackId) || undefined;
  function play(id?:string){ if (id) setTrackId(id); setTimeout(()=>{ audioRef.current?.play().catch(()=>{}); setPlaying(true); }, 0); }
  function pause(){ audioRef.current?.pause(); setPlaying(false); }
  function toggle(){ isPlaying?pause():play(); }
  return { audioRef, track, trackId, setTrackId, isPlaying, play, pause, toggle };
}

/* ──────────────────────────────────────────────────────────────────
 * 🏟️ Live Sports TV (HLS) + Ads
 * ────────────────────────────────────────────────────────────────── */
type Channel = { key:string; name:string; sport:'Football'|'Cricket'|'Basketball'|'Tennis'; streamUrl:string; };
const CHANNELS: Channel[] = [
  { key:'fb1', name:'Football+ HD',   sport:'Football',   streamUrl:'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
  { key:'bb1', name:'Basketball HD',  sport:'Basketball', streamUrl:'https://test-streams.mux.dev/tears-of-steel/playlist.m3u8' },
  { key:'tn1', name:'Tennis Live',    sport:'Tennis',     streamUrl:'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' },
];

type AdUnit = { id:string; title:string; cta?:string; url?:string; slot:'top'|'bottom'|'overlay' };
const ADS: AdUnit[] = [
  { id:'ad1', title:'Zendoro Protein Week', cta:'Shop Now',  url:'#', slot:'top' },
  { id:'ad2', title:'Blackout Curtains',    cta:'View',      url:'#', slot:'bottom' },
  { id:'ad3', title:'NEXA Elite — Upgrade', cta:'Upgrade',   url:'#', slot:'overlay' },
];

/* ──────────────────────────────────────────────────────────────────
 * UI
 * ────────────────────────────────────────────────────────────────── */
const planOptions: { id:PlanId; label:string }[] = Object.keys(Brand).map(k=>({ id: k as PlanId, label: Brand[k as PlanId].brandName }));

export default function NexaUnifiedPage(){
  const [plan, setPlan] = useState<PlanId>('MEDITERRANEAN');
  const [mealsPerDay, setMealsPerDay] = useState<2|3|4>(3);
  const [goal, setGoal] = useState<Goal>('GENERAL_WELLNESS');
  const [ifStart, setIfStart] = useState('12:00');
  const [ifEnd, setIfEnd] = useState('20:00');
  const [engine, setEngine] = useState<NexaDietEngine|null>(null);
  const [today, setToday] = useState<OrbitDay|null>(null);
  const [chat, setChat] = useState<{from:'You'|'Lumen'; text:string}[]>([
    { from:'Lumen', text:'Hey, I’m Lumen — your buddy. Want music, sports TV, meals, or training?' }
  ]);
  const brand = Brand[plan];

  function start(){
    const eng = NexaDietEngine.initNew({
      userId:'user-local', startPlan:plan, mealsPerDay, startWeightKg: 75,
      goal, loopStyle:'MICRO_CYCLES',
      windowStart: brand.supportsIF ? ifStart : undefined,
      windowEnd: brand.supportsIF ? ifEnd : undefined
    });
    setEngine(eng);
    tick(eng);
  }

  function tick(eng = engine!){
    const dISO = todayISO();
    const sleep = mockSleep();
    const steps = mockSteps();
    const checkIn: CheckIn = { dateISO: dISO, adherencePct: 80, energy: sleep.durationMin<390?2:4, mood:4, cravings:2, hunger:3, trainingDay: true, biometrics:{ weightKg: 75 } };
    const diet = eng.tick(checkIn);
    const ex = buildExercise(diet.brandName, dISO, sleep.durationMin, steps);
    const tips: CompanionTip[] = [];
    if (eng.getState().profile.supportsIF && eng.getState().profile.constraints.windowStart && eng.getState().profile.constraints.windowEnd) tips.push({ text:`Feeding window ${eng.getState().profile.constraints.windowStart}–${eng.getState().profile.constraints.windowEnd}`, emoji:'⏰', priority:2 });
    if (steps < 8000) tips.push({ text:`You're at ${steps} steps — 10-min brisk walk after dinner hits your floor.`, emoji:'🚶', priority:2 });
    if (sleep.durationMin < 390) tips.push({ text:`Sleep ${Math.round(sleep.durationMin/60)}h — dim screens 60 min pre-bed, cool room helps.`, emoji:'🌙', priority:1 });
    setToday({ dateISO:dISO, sleep, steps, diet, exercise: ex, tips });
  }

  function onSend(text: string){
    const lower = text.toLowerCase();
    let reply = "Tiny wins today = compounding change.";
    if (lower.includes('music')) reply = "Opening Music Studio — pick Focus, Calm, or Hype.";
    if (lower.includes('tv')||lower.includes('sports')) reply = "Switching to Sports TV — ads help keep the stream free.";
    setChat(c=>[...c, {from:'You', text}, {from:'Lumen', text:reply}]);
  }

  const projection = useMemo(()=> {
    if (!today || !engine) return null;
    const kcal = today.diet.macros.kcal;
    const weight = engine.getState().profile.history.slice(-1)[0]?.biometrics?.weightKg ?? 75;
    const strength = today.exercise.blocks.filter(b=>/Full-Body|Upper|Strength|EMOM|Circuit|Heavy/.test(b.title)).length;
    const cardio = today.exercise.blocks.filter(b=>/Z2|Walk|Tempo|Intervals/.test(b.title)).reduce((s,b)=>s+b.durationMin,0);
    return futureMirror(weight, kcal, strength, cardio);
  }, [today, engine]);

  /* Music Studio */
  const { audioRef, track, trackId, setTrackId, isPlaying, toggle } = useAudioPlayer('t1');
  const [activePlaylist, setActivePlaylist] = useState<string>('Focus (NeuroLeaf)');
  const currentList = (PLAYLISTS[activePlaylist] || []).map(id => LIBRARY.find(t=>t.id===id)!).filter(Boolean);
  function nextTrack(){
    const arr = currentList.length? currentList : LIBRARY;
    const idx = arr.findIndex(t=>t.id===trackId);
    const nxt = arr[(idx+1) % arr.length];
    setTrackId(nxt.id); setTimeout(()=> audioRef.current?.play().catch(()=>{}), 0);
  }

  /* Sports TV (HLS) */
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [channelKey, setChannelKey] = useState<string>(CHANNELS[0].key);
  const channel = CHANNELS.find(c=>c.key===channelKey)!;

  useEffect(()=>{
    const video = videoRef.current;
    if (!video || !channel?.streamUrl) return;
    // If native HLS (Safari / iOS), set src directly
    if (video.canPlayType('application/vnd.apple.mpegURL')) {
      video.src = channel.streamUrl;
      video.play().catch(()=>{});
      return;
    }
    // Else use hls.js
    if (Hls.isSupported()){
      const hls = new Hls({ maxBufferLength: 30 });
      hls.loadSource(channel.streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, ()=> video.play().catch(()=>{}));
      return () => { hls.destroy(); };
    }
  }, [channelKey]);

  /* Ads */
  const [adTop,setAdTop] = useState<AdUnit|null>(ADS.find(a=>a.slot==='top')||null);
  const [adBottom,setAdBottom] = useState<AdUnit|null>(ADS.find(a=>a.slot==='bottom')||null);
  const [adOverlay,setAdOverlay] = useState<AdUnit|null>(ADS.find(a=>a.slot==='overlay')||null);
  const [showOverlay,setShowOverlay] = useState<boolean>(true);

  useEffect(()=>{
    const rot = setInterval(()=>{
      const tops = ADS.filter(a=>a.slot==='top'); setAdTop(tops[Math.floor(Math.random()*tops.length)]);
      const bots = ADS.filter(a=>a.slot==='bottom'); setAdBottom(bots[Math.floor(Math.random()*bots.length)]);
    }, 30000);
    return ()=>clearInterval(rot);
  },[]);

  useEffect(()=>{
    setShowOverlay(true);
    const t = setTimeout(()=>setShowOverlay(false), 6000);
    return ()=>clearTimeout(t);
  }, [channelKey]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">NEXA • Lumen + Music + Sports TV</h1>
      <p className="opacity-80 text-sm mt-1">Diet • Training • Music • Live Sports (ad-supported) — single file.</p>

      {!engine && (
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60">
            <h3 className="font-medium mb-2">Choose Plan</h3>
            <div className="grid gap-2">
              <label className="text-sm">Archetype</label>
              <select className="bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm"
                      value={plan} onChange={e=>setPlan(e.target.value as PlanId)}>
                {planOptions.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
              <label className="text-sm mt-3">Meals per day</label>
              <select className="bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm"
                      value={mealsPerDay} onChange={e=>setMealsPerDay(parseInt(e.target.value) as 2|3|4)}>
                {[2,3,4].map(n=><option key={n} value={n}>{n}</option>)}
              </select>
              <label className="text-sm mt-3">Goal</label>
              <select className="bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm"
                      value={goal} onChange={e=>setGoal(e.target.value as Goal)}>
                {['FAT_LOSS','LONGEVITY','PERFORMANCE','RECOMP','GENERAL_WELLNESS'].map(g=><option key={g} value={g}>{g}</option>)}
              </select>

              {brand.supportsIF && (
                <div className="mt-3">
                  <div className="text-sm mb-1">IF Window</div>
                  <div className="flex items-center gap-2">
                    <input className="bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm w-28" value={ifStart} onChange={e=>setIfStart(e.target.value)} />
                    <span>to</span>
                    <input className="bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm w-28" value={ifEnd} onChange={e=>setIfEnd(e.target.value)} />
                  </div>
                </div>
              )}

              <button onClick={start} className="mt-4 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
                Agree & Start Lumen
              </button>
              <p className="text-xs opacity-70 mt-2">
                Local demo with mocked sleep/steps. No health-data ads. Streams are demo HLS.
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60">
            <h3 className="font-medium mb-2">Today’s Preview ({brand.brandName})</h3>
            <p className="text-sm opacity-80">Hero meals: {Brand[plan].meals.join(' • ')}</p>
            <p className="text-sm opacity-80 mt-2">Exercise vibe auto-adjusts with sleep/steps.</p>
          </div>
        </section>
      )}

      {engine && today && (
        <>
        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60">
            <h3 className="font-medium mb-2">Meals • {today.diet.brandName} • {today.diet.phase}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded bg-zinc-800/60 p-3"><div className="opacity-70">Kcal</div><div className="text-lg font-semibold">{today.diet.macros.kcal}</div></div>
              <div className="rounded bg-zinc-800/60 p-3"><div className="opacity-70">Protein</div><div className="text-lg font-semibold">{today.diet.macros.proteinG} g</div></div>
              <div className="rounded bg-zinc-800/60 p-3"><div className="opacity-70">Carbs</div><div className="text-lg font-semibold">{today.diet.macros.carbsG} g</div></div>
              <div className="rounded bg-zinc-800/60 p-3"><div className="opacity-70">Fat</div><div className="text-lg font-semibold">{today.diet.macros.fatG} g</div></div>
            </div>
            <ul className="list-disc pl-6 text-sm mt-3">
              {today.diet.meals.map((m,i)=>(<li key={i}>{m.title}</li>))}
            </ul>
            {today.diet.intro && <p className="opacity-80 text-sm mt-3">{today.diet.intro}</p>}
          </div>

          <div className="rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60">
            <h3 className="font-medium mb-2">Training • {today.exercise.archetype}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="rounded bg-zinc-800/60 p-3"><div className="opacity-70">Sleep</div><div>{Math.round((today.sleep?.durationMin ?? 0)/60)}h {today.sleep?.deepMin ? `• Deep ${Math.round((today.sleep?.deepMin ?? 0)/60)}h` : ''}</div></div>
              <div className="rounded bg-zinc-800/60 p-3"><div className="opacity-70">Steps</div><div>{today.steps}</div></div>
            </div>
            <ul className="list-disc pl-6 text-sm">
              {today.exercise.blocks.map((b,i)=>(
                <li key={i}><span className="font-medium">{b.title}</span> — {new Date(b.whenISO).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}, {b.durationMin} min {b.intensity?`• ${b.intensity}`:''}</li>
              ))}
            </ul>
            {today.exercise.autoRegNotes?.length ? <p className="opacity-80 text-sm mt-2">Autoreg: {today.exercise.autoRegNotes.join(' | ')}</p> : null}
            <div className="mt-3">
              <button onClick={()=>tick()} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Generate Next Day</button>
            </div>
          </div>

          <div className="rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60 flex flex-col">
            <h3 className="font-medium mb-2">Lumen • Buddy Chat</h3>
            <div className="flex-1 rounded bg-zinc-950 ring-1 ring-zinc-800 p-3 overflow-auto h-60">
              {chat.map((l,i)=>(
                <div key={i} className={`text-sm mb-2 ${l.from==='You'?'text-right':''}`}>
                  <span className="inline-block px-3 py-2 rounded bg-zinc-800/70">{l.text}</span>
                </div>
              ))}
            </div>
            <ChatInput onSend={onSend} />
            <div className="mt-4 text-sm">
              <h4 className="font-medium mb-1">Future Mirror (4 weeks)</h4>
              {projection ? (
                <div className="rounded bg-zinc-800/60 p-3">
                  <div>Best case: <b>{projection.bestCaseKg} kg</b></div>
                  <div>Typical: <b>{projection.typicalKg} kg</b></div>
                  <div>If sleep suffers: <b>{projection.poorSleepKg} kg</b></div>
                  <p className="text-xs opacity-70 mt-2">{projection.disclaimer}</p>
                </div>
              ) : <p className="opacity-80">Start Lumen to see your projected change range.</p>}
            </div>
            <div className="mt-4 text-sm">
              <h4 className="font-medium mb-1">Zendoro Concierge</h4>
              <ZendoroQuick />
            </div>
          </div>
        </section>

        {/* Music + Sports TV */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* MUSIC STUDIO */}
          <div className="rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60">
            <h3 className="font-medium mb-2">🎵 NEXA Music Studio</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Playlist</label>
                <select value={activePlaylist} onChange={e=>setActivePlaylist(e.target.value)}
                        className="w-full bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm">
                  {Object.keys(PLAYLISTS).map(name=> <option key={name} value={name}>{name}</option>)}
                </select>
                <ul className="mt-3 text-sm space-y-2">
                  {(currentList.length?currentList:LIBRARY).map(t=>(
                    <li key={t.id} className={`p-2 rounded ${t.id===trackId?'bg-indigo-600/30 ring-1 ring-indigo-500':'bg-zinc-800/60'}`}>
                      <div className="flex items-center justify-between">
                        <div><b>{t.title}</b> <span className="opacity-70">• {t.artist}</span></div>
                        <button onClick={()=>{ setTrackId(t.id); setTimeout(()=>audioRef.current?.play().catch(()=>{}),0); }}
                                className="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white">Play</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="rounded bg-zinc-800/60 p-3 text-sm">
                  <div className="mb-2">Now Playing</div>
                  <div className="text-lg font-semibold">{track?.title ?? '—'}</div>
                  <div className="opacity-80">{track?.artist ?? ''}</div>
                  <audio ref={audioRef} src={track?.url} controls className="w-full mt-3" onEnded={nextTrack}/>
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=>toggle()} className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
                      {/* @ts-ignore */}
                      {audioRef.current && !audioRef.current.paused ? 'Pause' : 'Play'}
                    </button>
                    <button onClick={nextTrack} className="px-3 py-1.5 rounded bg-zinc-700 hover:bg-zinc-600 text-white text-sm">Next</button>
                  </div>
                </div>
                <div className="rounded bg-zinc-800/60 p-3 mt-3 text-sm">
                  <div className="mb-2">EQ (UI-only)</div>
                  <div className="grid grid-cols-5 gap-2">
                    {[60,250,1000,4000,12000].map((hz,i)=>(
                      <div key={i} className="flex flex-col items-center">
                        <input type="range" min="-12" max="12" defaultValue="0" className="w-full" />
                        <span className="text-xs opacity-70">{hz>=1000?`${hz/1000}k`:`${hz}`}Hz</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SPORTS TV (HLS + Ads) */}
          <div className="rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60 relative overflow-hidden">
            <h3 className="font-medium mb-2">🏟️ NEXA Live Sports TV (Ad-supported)</h3>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm">Channel</label>
              <select value={channelKey} onChange={e=>setChannelKey(e.target.value)}
                      className="bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm">
                {CHANNELS.map(c=> <option key={c.key} value={c.key}>{c.name}</option>)}
              </select>
            </div>

            {adTop && (
              <a href={adTop.url || '#'} className="block mb-2 rounded bg-zinc-800/60 ring-1 ring-zinc-700 p-2 text-sm hover:bg-zinc-700/60">
                <div className="flex items-center justify-between">
                  <div><b>{adTop.title}</b></div>
                  <span className="text-xs opacity-80">{adTop.cta ?? 'Learn more'}</span>
                </div>
              </a>
            )}

            <div className="relative rounded-2xl overflow-hidden ring-1 ring-zinc-800 bg-black">
              <video ref={videoRef} controls playsInline className="w-full h-[280px] bg-black" />
              {adOverlay && showOverlay && (
                <a href={adOverlay.url || '#'}
                   className="absolute inset-0 bg-black/70 flex items-center justify-center text-center px-6"
                   onClick={()=>setShowOverlay(false)}>
                  <div className="bg-zinc-900/90 ring-1 ring-zinc-700 p-4 rounded-xl text-white">
                    <div className="text-sm opacity-80 mb-1">Sponsored</div>
                    <div className="text-lg font-semibold">{adOverlay.title}</div>
                    <div className="mt-2 text-xs opacity-80">Tap to continue · Ad closes automatically</div>
                  </div>
                </a>
              )}
            </div>

            {adBottom && (
              <a href={adBottom.url || '#'} className="block mt-2 rounded bg-zinc-800/60 ring-1 ring-zinc-700 p-2 text-sm hover:bg-zinc-700/60">
                <div className="flex items-center justify-between">
                  <div><b>{adBottom.title}</b></div>
                  <span className="text-xs opacity-80">{adBottom.cta ?? 'Open'}</span>
                </div>
              </a>
            )}

            <p className="text-xs opacity-70 mt-2">Demo HLS streams. For production, integrate IMA VAST/VMAP.</p>
          </div>
        </section>
        </>
      )}

      {today && (
        <section className="mt-6 rounded-2xl p-4 ring-1 ring-zinc-800 bg-zinc-900/60">
          <h3 className="font-medium mb-2">Tips</h3>
          <ul className="list-disc pl-6 text-sm">
            {today.tips.map((t,i)=>(<li key={i}>{t.emoji ?? '💡'} {t.text}</li>))}
          </ul>
          {today.diet.outro && <p className="opacity-80 text-sm mt-3">{today.diet.outro}</p>}
        </section>
      )}
    </main>
  );
}

/* Chat input */
function ChatInput({ onSend }:{ onSend:(t:string)=>void }){
  const [msg,setMsg] = useState('');
  return (
    <div className="mt-2 flex gap-2">
      <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && msg.trim()){ onSend(msg.trim()); setMsg(''); } }}
             placeholder="Tell me anything — I’m your workout buddy."
             className="flex-1 bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm" />
      <button onClick={()=>{ if(!msg.trim()) return; onSend(msg.trim()); setMsg(''); }}
              className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Send</button>
    </div>
  );
}

/* Zendoro mock */
function ZendoroQuick(){
  const [q,setQ]=useState('');
  const [items,setItems]=useState<{title:string;price:string}[]>([]);
  function search(){
    const base = [
      { title:'Salmon fillet (fresh)', price:'$9.90' },
      { title:'Greek yogurt 10% 500g', price:'$3.80' },
      { title:'Blackout curtains', price:'$29.00' },
      { title:'Foam roller (firm)', price:'$22.00' },
      { title:'Adjustable dumbbells', price:'$129.00' },
    ];
    const res = base.filter(b=>b.title.toLowerCase().includes(q.toLowerCase()));
    setItems(res.length?res:base.slice(0,3));
  }
  return (
    <div className="rounded bg-zinc-800/60 p-3">
      <div className="flex gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="What do you need? e.g., salmon, yogurt, curtains"
               className="flex-1 bg-zinc-950 ring-1 ring-zinc-800 rounded px-3 py-2 text-sm" />
        <button onClick={search} className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Search</button>
      </div>
      <div className="mt-3 grid gap-2">
        {items.map((it,i)=>(
          <div key={i} className="rounded bg-zinc-900/60 p-3 text-sm flex items-center justify-between">
            <span>{it.title}</span><span className="opacity-80">{it.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
