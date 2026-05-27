export function amplifyNegative(score:number){
  if(score < 0) return score * 1.5;
  return score;
}
