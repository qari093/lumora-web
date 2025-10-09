export function safeStr(v:any){return String(v??"").slice(0,120);}
export function clamp(n:number,min:number,max:number){return Math.max(min,Math.min(max,n));}
export function pick<T>(arr:T[],k:number,seed:number){const a=arr.slice();const o:T[]=[];let r=seed;for(let i=0;i<k&&a.length;i++){r=(r*9301+49297)%233280;const j=Math.floor((r/233280)*a.length);o.push(a[j]);a.splice(j,1);}return o;}
export function seedFrom(s:string){let h=0;for(let i=0;i<s.length;i++){h=Math.imul(31,h)+s.charCodeAt(i)|0;}return (h>>>0)/4294967296;}
