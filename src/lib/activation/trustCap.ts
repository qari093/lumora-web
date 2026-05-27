export function applyTrustCap(items:any[]){
  return items.map(x=>{
    const trust = x.source_reliability || 1;

    const capped = Math.min(trust, 2); // hard cap

    return {
      ...x,
      final_score:(x.final_score||1) * capped
    };
  });
}
