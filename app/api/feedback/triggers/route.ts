export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{thresholds:{drop:0.2,boost:0.15},actions:["re-rank","refresh","fallback"],enabled:true},
    ts:Date.now()
  });
}
