export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{packs:["safe-trailers","timeless","editorial"],enabled:true},
    ts:Date.now()
  });
}
