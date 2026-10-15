/* Service worker Novea: menyimpan file aplikasi supaya bisa dibuka tanpa internet.
   Naskah dan catatan TIDAK disimpan di sini (itu ada di IndexedDB). Naikkan nomor versi setiap file aplikasi berubah. */
const CACHE='novea-v0.3.0'; /* MAJOR.MINOR.PATCH, samakan dengan APP_VERSION di app.js */
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.json','./mark.png','./icon-192.png','./icon-512.png','./icon-maskable.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));
  self.clients.claim();
});

/* Internet dulu supaya pembaruan langsung terlihat; kalau offline, pakai salinan tersimpan. */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}
      return r;
    }).catch(()=>caches.match(e.request).then(m=>m||(e.request.mode==='navigate'?caches.match('./index.html'):undefined)))
  );
});
