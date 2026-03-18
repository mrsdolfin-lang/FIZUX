// FIZUX v9.0 Service Worker
const CACHE = "fizux-v9-cache-v1";
const STATIC = [
  "./",
  "./index.html",
  "./fizux-app.js",
  "./manifest.json",
  "./icon.png",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {})));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Always network-first for API calls
  if (url.hostname.includes("anthropic") || url.hostname.includes("googleapis") ||
      url.hostname.includes("openai") || url.hostname.includes("deepseek") ||
      url.hostname.includes("openrouter") || url.hostname.includes("x.ai") ||
      url.hostname.includes("huggingface") || url.hostname.includes("pollinations") ||
      url.hostname.includes("firebase") || url.hostname.includes("gstatic")) {
    return;
  }
  // Cache-first for static assets, network fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && e.request.method === "GET") {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached || new Response("Offline", { status: 503 }));
    })
  );
});
