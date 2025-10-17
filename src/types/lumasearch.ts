export type LumaResult =
  | { kind:"video"; id:string; title:string; by:string; t?:number }
  | { kind:"creator"; id:string; name:string; followers:number }
  | { kind:"web"; url:string; title:string; site:string };
export type LumaSearchResponse = { query:string; results:LumaResult[]; tabs:("videos"|"creators"|"web")[] };
