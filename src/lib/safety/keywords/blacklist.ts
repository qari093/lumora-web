import fs from "node:fs";
import path from "node:path";

export type BlacklistMatchResult = {
  text: string;
  matched: boolean;
  score: number;
  matches: Array<{
    category: string;
    keyword: string;
  }>;
};

type BlacklistConfig = {
  version: string;
  categories: Record<string, string[]>;
};

const CONFIG_PATH = path.join(process.cwd(), "config", "safety", "explicit-keyword-blacklist.json");

function loadConfig(): BlacklistConfig {
  const raw = fs.readFileSync(CONFIG_PATH, "utf8");
  return JSON.parse(raw) as BlacklistConfig;
}

export function scanExplicitKeywords(input: string): BlacklistMatchResult {
  const config = loadConfig();
  const text = String(input || "").toLowerCase();
  const matches: Array<{ category: string; keyword: string }> = [];

  for (const [category, keywords] of Object.entries(config.categories || {})) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matches.push({ category, keyword });
      }
    }
  }

  const score = Math.min(100, matches.length * 20);

  return {
    text: input,
    matched: matches.length > 0,
    score,
    matches,
  };
}
