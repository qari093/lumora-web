export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{ranked:true,topAd:"ad_001"},
    ts:Date.now()
  });
}
