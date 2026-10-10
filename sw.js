/* Ödeme Defteri - çevrimdışı çalışma dosyası
   Güncelleme yaptığınızda CACHE değerindeki sürüm numarasını artırın (v1 -> v2 -> v3).
   Bu, telefonda eski önbelleğin yenilenmesini sağlar. */
const CACHE = "odeme-defteri-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* Tailwind gibi dış CDN dosyaları: önce önbellek, yoksa ağ */
  if (url.hostname === "cdn.jsdelivr.net") {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => Response.error()))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  /* Kendi dosyalarımız: önce ağ (güncellemeler hemen gelsin), internet yoksa önbellek */
  event.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match("./index.html")))
  );
});
