self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil((async()=>{
    const c=await caches.open('gmar-core-v1');
    await c.addAll([
      '/',
      '/video-seed.json',
      '/offline-ads.json'
    ].map(u=>new Request(u,{cache:'reload'})));
  })());
});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});

const cacheFirst = async (req) => {
  const c = await caches.open('gmar-media-v1');
  const hit = await c.match(req);
  if(hit) return hit;
  try{
    const net = await fetch(req, {credentials:'omit'});
    if(net.ok){
      c.put(req, net.clone());
    }
    return net;
  }catch{
    return caches.match('/'); // fallback
  }
};

self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.pathname.startsWith('/videos/') || url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')){
    e.respondWith(cacheFirst(e.request));
  }
});

async function prefetchList(urls){
  const c = await caches.open('gmar-media-v1');
  await Promise.all(urls.map(async u=>{
    try{
      const r = await fetch(u,{credentials:'omit'});
      if(r.ok) await c.put(u,r.clone());
    }catch{}
  }));
}

self.addEventListener('message',e=>{
  const {type,payload}=e.data||{};
  if(type==='CACHE_URLS' && Array.isArray(payload)) prefetchList(payload);
  if(type==='PREFETCH_VIDEOS'){
    fetch('/video-seed.json').then(r=>r.json()).then(d=>{
      const arr=Array.isArray(d)?d:(d.urls||[]);
      prefetchList(arr);
    }).catch(()=>{});
  }
});
