export type Phase = "Prime"|"Burn"|"Rebuild"|"Flow";
export type Plan = {
  id: string; title: string; short: string; phases: Phase[]; tags: string[];
};
export const PLANS: Plan[] = [
  { id:"mediterranean", title:"Mediterranean Mastery", short:"Olive oil, fish, veggies.", phases:["Prime","Burn","Rebuild","Flow"], tags:["heart","longevity"] },
  { id:"lowcarb_cyc", title:"Cyclic Low-Carb", short:"Carb cycling.", phases:["Prime","Burn","Rebuild","Flow"], tags:["fat-loss","metabolic"] },
  { id:"if_16_8", title:"Intermittent Fasting 16:8", short:"Time-restricted feeding.", phases:["Prime","Burn","Rebuild","Flow"], tags:["autophagy","compliance"] },
  { id:"dash_plus", title:"DASH+", short:"BP-friendly.", phases:["Prime","Burn","Rebuild","Flow"], tags:["bp","minerals"] },
  { id:"high_protein", title:"High-Protein Lean", short:"1.6–2.2g/kg protein.", phases:["Prime","Burn","Rebuild","Flow"], tags:["satiety","muscle"] },
  { id:"plant_power", title:"Plant Power", short:"Fiber & legumes.", phases:["Prime","Burn","Rebuild","Flow"], tags:["gut","cholesterol"] },
  { id:"ketoflex", title:"Keto-Flex", short:"Low-carb with refeeds.", phases:["Prime","Burn","Rebuild","Flow"], tags:["glycemic","fat-adapt"] },
  { id:"zone_balance", title:"Zone Balance", short:"40/30/30 macro.", phases:["Prime","Burn","Rebuild","Flow"], tags:["performance","balance"] },
  { id:"ayur_reset", title:"Ayur Reset", short:"Warm meals, spices.", phases:["Prime","Burn","Rebuild","Flow"], tags:["digestion","mindful"] },
  { id:"glucose_gentle", title:"Glucose Gentle", short:"GL + walks.", phases:["Prime","Burn","Rebuild","Flow"], tags:["pre-diabetes","energy"] },
];

export function dayPhase(phases: Phase[], dayIndex: number): Phase {
  return phases[ dayIndex % phases.length ];
}

export function todayTasks(planId: string, dayIndex: number){
  const plan = PLANS.find(p=>p.id===planId);
  const phase = dayPhase(plan?.phases ?? ["Prime","Burn","Rebuild","Flow"], dayIndex);
  const base:any = {
    Prime:   { diet:"• مکمل غذائیں + سبزیاں 5 حصے\n• 2 لیٹر پانی\n• پروٹین ہر کھانے میں", workout:"• 25 منٹ تیز چہل قدمی\n• Mobility 5 منٹ", sleep:"• 7.5–8 گھنٹے نیند", steps:"• 7,500–9,000 قدم" },
    Burn:    { diet:"• شوگر 0 • نشاستہ کم", workout:"• 18–24 منٹ HIIT", sleep:"• کیفین 2 بجے کے بعد نہیں", steps:"• 9,000–11,000 قدم" },
    Rebuild: { diet:"• پروٹین 1.8g/kg", workout:"• ریزسٹنس ٹریننگ", sleep:"• سونے/جاگنے کا ایک وقت", steps:"• 8,000–10,000 قدم" },
    Flow:    { diet:"• 40/30/30 توازن", workout:"• 45–60 منٹ Zone-2", sleep:"• 7.5–8 گھنٹے", steps:"• 8,500–10,500 قدم" }
  };
  const t = base[phase];
  return { phase, ...t };
}
