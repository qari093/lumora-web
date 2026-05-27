export function applyPositionBias(items:any[]){
  return items.map((x,i)=>{
    const boost = 1 + Math.max(0,(20-i))*0.01;
    return {
      ...x,
      final_score:(x.final_score||1)*boost
    };
  });
}
