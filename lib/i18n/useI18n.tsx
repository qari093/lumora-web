"use client";
import { useEffect, useState } from "react";

export function useI18n(namespaces: string[] = ["common"]) {
  const [strings, setStrings] = useState<Record<string,string>>({});
  const [lang, setLang] = useState<string>("en");
  useEffect(()=> {
    const params = namespaces.map(n => "ns="+encodeURIComponent(n)).join("&");
    fetch("/api/i18n/strings?"+params).then(r=>r.json()).then(j=>{
      if (j?.ok) { setStrings(j.strings||{}); setLang(j.lang||""); }
    }).catch(()=>{});
  }, [namespaces.join(",")]);
  const t = (k:string, vars?:Record<string,any>)=>{
    let s = strings[k] ?? k;
    if (vars) for (const [vk, vv] of Object.entries(vars)) s = s.replace(new RegExp(`\\{${vk}\\}`,"g"), String(vv));
    return s;
  };
  return { t, lang, strings };
}
