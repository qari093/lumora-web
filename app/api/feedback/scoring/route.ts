export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{engagementScore:0.83,sentimentScore:0.71,enabled:true},
    ts:Date.now()
  });
}
