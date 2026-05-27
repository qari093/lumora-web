import fs from "fs";
import path from "path";
import type { VectorItem } from "./schema";

const FILE = path.join(process.cwd(), "data", "semantic_vectors.json");

export function saveVectors(items: VectorItem[]){
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2), "utf-8");
}

export function loadVectors(): VectorItem[]{
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}
