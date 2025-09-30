export function t(key: string, vars?: Record<string, string|number>) {
  if (!vars) return String(key);
  return Object.keys(vars).reduce((s,k)=>s.replace(new RegExp("\\\\{"+k+"\\\\}","g"), String(vars[k])), String(key));
}
