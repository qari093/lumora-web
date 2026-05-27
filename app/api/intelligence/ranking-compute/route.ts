export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      service:"ranking-compute",
      mode:"live",
      inputs:["trust","attention","velocity","priority"],
      enabled:true
    },
    ts:Date.now()
  });
}
