export const CATEGORY_MAP = [
  { key: "events", terms: ["festival","concert","wedding","party","celebration"] },
  { key: "sports", terms: ["football","basketball","tennis","boxing","gym","running","skate","surf"] },
  { key: "urban", terms: ["city","street","traffic","cars","night","subway"] },
  { key: "people", terms: ["people","kids","crowd","family","reaction","arguing","laughing"] },
  { key: "nature", terms: ["mountain","ocean","forest","waterfall","beach","sunset"] }
];

export function detectCategory(query = "") {
  const q = query.toLowerCase();
  for (const c of CATEGORY_MAP) {
    if (c.terms.some(t => q.includes(t))) return c.key;
  }
  return "other";
}

export function attachCategory(clips) {
  return clips.map(c => ({
    ...c,
    category: c.category || detectCategory(c.query)
  }));
}

export function enforceCategorySpread(clips, minCategories = 3) {
  const set = new Set(clips.map(c => c.category));
  return set.size >= minCategories;
}

export function balanceCategories(clips, maxPerCategory = 10) {
  const counts = new Map();
  const out = [];

  for (const clip of clips) {
    const cat = clip.category || "other";
    const next = (counts.get(cat) || 0) + 1;

    if (next <= maxPerCategory) {
      counts.set(cat, next);
      out.push(clip);
    }
  }

  return out;
}

export function applyCategoryBalance(clips) {
  const withCat = attachCategory(clips);
  const balanced = balanceCategories(withCat);
  return enforceCategorySpread(balanced) ? balanced : withCat;
}
