export function applyLengthNormalization(items:any[]){
  return items.map(x=>{
    const len = (x.title || "").length;

    if(len > 120){
      return {...x, final_score: (x.final_score||1) * 0.9};
    }

    if(len >= 20 && len <= 80){
      return {...x, final_score: (x.final_score||1) * 1.1};
    }

    return x;
  });
}
