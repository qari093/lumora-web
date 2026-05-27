export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      replayWindow:true,
      windowsSec:[30,120,300],
      policy:"reinsert-high-interest",
      enabled:true
    },
    ts:Date.now()
  });
}
