export const VOICE = {
  en:"Samantha", de:"Anna", ur:"Zarqa", es:"Monica", fr:"Amelie",
  ar:"Majed", hi:"Lekha", it:"Alice", pt:"Luciana", tr:"Yelda"
};
export const SUPPORTED = Object.keys(VOICE);
export function pickVoice(lang){ return VOICE[lang] || VOICE.en; }
