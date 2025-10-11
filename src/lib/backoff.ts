export async function tryFetch(input: RequestInfo | URL, init: RequestInit, attempts=3){
  let delay = 200;
  for(let i=0;i<attempts;i++){
    try{
      const r = await fetch(input, init);
      if(r.ok) return r;
      if(r.status===429) { await new Promise(r=>setTimeout(r, delay)); delay*=2; continue; }
      return r;
    }catch{
      await new Promise(r=>setTimeout(r, delay));
      delay*=2;
    }
  }
  // final try
  return fetch(input, init);
}
