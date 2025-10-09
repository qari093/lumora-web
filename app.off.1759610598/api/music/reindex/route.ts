import { NextResponse } from "next/server";
import { readManifest, writeManifest, mergeDedupe, scanLocalAudio } from "../../../../lib/library";
export async function POST(){
  const m = await readManifest();
  const local = await scanLocalAudio();
  m.catalog = mergeDedupe(m.catalog, local);
  await writeManifest(m);
  return NextResponse.json({added: local.length, total:m.catalog.length, ok:true});
}
