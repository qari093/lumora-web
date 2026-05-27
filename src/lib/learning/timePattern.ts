export function timePatternBoost(hour:number){
  if(hour >= 18 && hour <= 23) return 1.2;
  if(hour >= 6 && hour <= 11) return 1.0;
  return 0.8;
}
