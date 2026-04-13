import fs from "node:fs";
import path from "node:path";

export type InternalSponsoredItem = {
  id: string;
  kind: "sponsored";
  title: string;
  text: string;
  target: { type: "portal" | "external"; value: string };
  portal: string;
  score?: number;
};

export function getInternalSponsoredPool(): InternalSponsoredItem[] {
  try {
    const file = path.join(process.cwd(), "data", "ads", "internal-sponsored.json");
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as InternalSponsoredItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
