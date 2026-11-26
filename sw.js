const V='sriti-v1',A=['./','index.html','style.css','app.js','config.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png','icons/logo.png','frames/ungu-potret.png','frames/ungu-landskap.png','frames/hijau-potret.png','frames/hijau-landskap.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.open(V).then(async c=>{const m=await c.match(r,{ignoreSearch:true});const n=fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}).catch(()=>m);return m||n}))});
