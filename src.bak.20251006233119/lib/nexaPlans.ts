export type Phase = "Prime"|"Burn"|"Rebuild"|"Flow";
export type Plan = {
  id: string;
  title: string;
  short: string;
  phases: Phase[];
  dailyCap?: number; // future use for XP etc.
  tags: string[];
};

/** 10 ریسرچ-بیسڈ پروٹوکولز (ہلکی وضاحتیں) */
export const PLANS: Plan[] = [
  { id:"mediterranean", title:"Mediterranean Mastery", short:"Whole-foods, olive oil, fish.", phases:["Prime","Burn","Rebuild","Flow"], tags:["heart","longevity","anti-inflammatory"] },
  { id:"lowcarb_cyc", title:"Cyclic Low-Carb", short:"Carb cycling for insulin control.", phases:["Prime","Burn","Rebuild","Flow"], tags:["fat-loss","metabolic"] },
  { id:"if_16_8", title:"Intermittent Fasting 16:8", short:"Time-restricted feeding.", phases:["Prime","Burn","Rebuild","Flow"], tags:["autophagy","compliance"] },
  { id:"dash_plus", title:"DASH+", short:"BP-friendly + potassium focus.", phases:["Prime","Burn","Rebuild","Flow"], tags:["bp","minerals"] },
  { id:"high_protein", title:"High-Protein Lean", short:"1.6–2.2g/kg protein.", phases:["Prime","Burn","Rebuild","Flow"], tags:["satiety","muscle"] },
  { id:"plant_power", title:"Plant Power", short:"Fiber, legumes, polyphenols.", phases:["Prime","Burn","Rebuild","Flow"], tags:["gut","cholesterol"] },
  { id:"ketoflex", title:"Keto-Flex", short:"Low-carb with refeeds.", phases:["Prime","Burn","Rebuild","Flow"], tags:["glycemic","fat-adapt"] },
  { id:"zone_balance", title:"Zone Balance", short:"40/30/30 macro rhythm.", phases:["Prime","Burn","Rebuild","Flow"], tags:["performance","balance"] },
  { id:"ayur_reset", title:"Ayur Reset", short:"Warm meals, spices, circadian.", phases:["Prime","Burn","Rebuild","Flow"], tags:["digestion","mindful"] },
  { id:"glucose_gentle", title:"Glucose Gentle", short:"GL management + walks.", phases:["Prime","Burn","Rebuild","Flow"], tags:["pre-diabetes","energy"] },
];

export function dayPhase(phases: Phase[], dayIndex: number): Phase {
  return phases[ dayIndex % phases.length ];
}

/** آج کے ٹاسک جنریٹر (اردو ہِٹس + آسان عمل) */
export function todayTasks(planId: string, dayIndex: number){
  const plan = PLANS.find(p=>p.id===planId);
  const phase = dayPhase(plan?.phases ?? ["Prime","Burn","Rebuild","Flow"], dayIndex);
  // بنیادی ٹاسک ؍ 4 ستون: خوراک، ورزش، نیند، قدم/حرکت
  const base = {
    Prime: {
      diet: "• مکمل غذائیں + سبزیاں 5 حصے\n• 2 لیٹر پانی\n• پروٹین ہر کھانے میں",
      workout: "• 25 منٹ تیز چہل قدمی یا ہلکا جم\n• 5 منٹ Mobility",
      sleep: "• 7.5–8 گھنٹے نیند\n• اسکرین آف (سونے سے 60 منٹ پہلے)",
      steps: "• 7,500–9,000 قدم"
    },
    Burn: {
      diet: "• نشاستہ کم، چینی 0\n• صحت مند چکنائی + پروٹین اونچی",
      workout: "• 18–24 منٹ HIIT یا Intervals\n• کور + اسکواٹ 3×10",
      sleep: "• 8 گھنٹے ہدف\n• کیفین 2 بجے کے بعد نہیں",
      steps: "• 9,000–11,000 قدم"
    },
    Rebuild: {
      diet: "• پروٹین 1.8g/kg\n• الیکٹرولائٹس + سبزیاں",
      workout: "• ریزسٹنس ٹریننگ (Upper/Lower Split)\n• Mobility 10 منٹ",
      sleep: "• سونے/جاگنے کا ایک ہی وقت\n• بیڈ روم اندھیرا/ٹھنڈا",
      steps: "• 8,000–10,000 قدم"
    },
    Flow: {
      diet: "• متوازن پلیٹ 40/30/30\n• ذہنی سکون کے ساتھ کھانا",
      workout: "• 45–60 منٹ Zone-2 کارڈیو\n• سانس کی مشق 5 منٹ",
      sleep: "• 7.5–8 گھنٹے\n• نیند کا جائزہ/نوٹس",
      steps: "• 8,500–10,500 قدم"
    }
  } as const;
  const t = (base as any)[phase];
  return { phase, ...t };
}
