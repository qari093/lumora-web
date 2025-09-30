export function validateScore(score:number, durationSec:number){
  if(score < 0) return {ok:false, reason:"negative"};
  if(score > 1000000) return {ok:false, reason:"too_high"};
  if(durationSec < 5 && score > 1000) return {ok:false, reason:"too_fast"};
  return {ok:true};
}
