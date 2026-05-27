import { REAL_QUERIES } from "./real_queries.mjs";

if (!process.env.PEXELS_API_KEY) {
  throw new Error("PEXELS_API_KEY missing");
}

async function fetchPage(query, page) {
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10&page=${page}`;
  const res = await fetch(url, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });
  if (!res.ok) return [];
  const json = await res.json();

  return (json.videos || []).map(v => {
    const f = (v.video_files || []).find(x => x.file_type === "video/mp4");
    if (!f) return null;

    return {
      id: v.id,
      url: f.link,
      duration: v.duration,
      query
    };
  }).filter(Boolean);
}

(async () => {
  let total = 0;

  for (let page = 1; page <= 3; page++) {
    for (const q of REAL_QUERIES) {
      const clips = await fetchPage(q, page);
      console.log("FETCH", q, "page", page, "clips", clips.length);
      total += clips.length;
    }
  }

  console.log("TOTAL_FETCHED=", total);
})();
