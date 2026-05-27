export function applySourceFatigue(items:any[]){
  let lastSource = "";
  let streak = 0;

  return items.map(x=>{
    if(x.source === lastSource){
      streak++;
    } else {
      streak = 0;
      lastSource = x.source;
    }

    const penalty = 1 / (1 + streak * 0.3);

    return {
      ...x,
      final_score: (x.final_score || 1) * penalty
    };
  });
}
