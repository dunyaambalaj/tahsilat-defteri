/* Ödeme Defteri – çevrimdışı önbellek
   Strateji: önce İNTERNETTEN en güncel dosya alınır (güncellemeler hemen görünür),
   internet yoksa önbellekteki kopya kullanılır (çevrimdışı çalışır).
   Firebase ve diğer dış adreslere dokunmaz. */
const CACHE = "odeme-defteri-v11";
const FILES = ["./", "index.html", "firebase-config.js", "manifest.json", "icon.svg"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all(FILES.map(f => c.add(new Request(f, { cache: "reload" })).catch(() => {})))
    )
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; /* Firebase, Google, CDN: tarayıcı kendisi halleder */
  e.respondWith(
    fetch(new Request(req.url, { cache: "no-cache", credentials: "same-origin" }))
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html")))
  );
});
