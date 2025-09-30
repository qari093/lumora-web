import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
export async function GET(){
  const p = path.join(process.cwd(),"data/categories.json");
  const j = JSON.parse(await fs.readFile(p,"utf8"));
  return NextResponse.json(j);
}
