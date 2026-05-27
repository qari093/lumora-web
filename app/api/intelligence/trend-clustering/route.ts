export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      clustering:"k-mean-like",
      clusters:12,
      dimensions:["topic","velocity","source"],
      enabled:true
    },
    ts:Date.now()
  });
}
