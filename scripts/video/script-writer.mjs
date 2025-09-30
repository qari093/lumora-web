import { loadTrends } from "./trends.mjs";
export function writeScript(topic){
  const { title, niche, lang="en" } = topic;
  const base = {
    en: `Title: ${title}\nIntro: Welcome to Lumora! Today we cover ${title.toLowerCase()}.\nBody: Here are the top insights you can use right away.\nOutro: Follow Lumora for daily breakthroughs.\n`,
    de: `Titel: ${title}\nIntro: Willkommen bei Lumora! Heute geht es um ${title}.\nHauptteil: Hier sind praktische Tipps für dich.\nOutro: Folge Lumora für tägliche Impulse.\n`,
    ur: `عنوان: ${title}\nتعارف: خوش آمدید! آج ہم بات کریں گے ${title} پر۔\nمواد: یہ چند اہم نکات ہیں جو آپ فوراً استعمال کر سکتے ہیں۔\nاختتام: مزید کے لیے Lumora کے ساتھ رہیں۔\n`
  };
  return base[lang] || base.en;
}
if (import.meta.url === `file://${process.argv[1]}`){
  console.log(writeScript(loadTrends(1)[0]));
}
