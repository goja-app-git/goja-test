const CACHE_NAME = "goja-psy-v1";
const CORE = [
  "./",
  "./index.html",
  "./assets/style.css",
  "./manifest.json",
  "./js/app.js",
  "./js/config.js",
  "./js/questions.js",
  "./js/storage.js",
  "./js/crypto.js",
  "./js/digits_codec.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE_NAME);
    await c.addAll(CORE);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))));
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  e.respondWith((async () => {
    const cached = await caches.match(e.request);
    if (cached) return cached;
    try { return await fetch(e.request); }
    catch { return cached || new Response("", { status: 503 }); }
  })());
});