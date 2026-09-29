// Esquire offline worker: same-origin only, no third-party requests. Build 2aaf3cbdccb1
const CACHE='esquire-2aaf3cbdccb1',FILES=["./","fonts/OFL-PressStart2P.txt","fonts/OFL-Silkscreen.txt","fonts/press-start-2p-latin.woff2","fonts/silkscreen-latin.woff2","icons/icon-192.png","icons/icon-512.png","manifest.webmanifest"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==self.location.origin)return; // never touch other sites
  if(e.request.mode==='navigate'){ // page: network first so updates arrive, cache when offline
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(k=>k.put('./',c));}return r;}).catch(()=>caches.match('./')));
    return;}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
