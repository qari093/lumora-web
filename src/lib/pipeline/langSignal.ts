export function applyLangSignal(items:any[], lang:string="en"){
  return (items || []).map((x:any) => ({
    ...x,
    lang_score: x.lang === lang ? 1 : 0
  }));
}
