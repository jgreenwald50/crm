// Network-first so updates always arrive; cache is only a fallback for the app shell when offline.
const C = "crm-shell-v2", FILES = ["./", "index.html", "config.js", "manifest.webmanifest", "icon.svg", "banner.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(clients.claim()));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // never touch Graph/login traffic
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
