export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      scheduler:"active",
      cadenceMin:5,
      targets:["ranking","decay","priority"],
      enabled:true
    },
    ts:Date.now()
  });
}
