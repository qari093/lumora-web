export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{rotation:"balanced",nextAd:"ad_002"},
    ts:Date.now()
  });
}
