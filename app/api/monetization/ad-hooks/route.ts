export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      hooksPresent:true,
      servingEnabled:false,
      mode:"disabled-by-default"
    },
    ts:Date.now()
  });
}
