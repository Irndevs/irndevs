/* IRN Devs — service worker leve (cache estático) */
const CACHE = 'irn-v20260916';
const ASSETS = [
  '/',
  '/index.html',
  '/cursos.html',
  '/assets/css/site-nav.css',
  '/assets/css/motion.css',
  '/assets/css/pages/index.css',
  '/assets/css/pages/cursos.css',
  '/assets/css/pages/curso-python.css',
  '/assets/js/site-nav.js',
  '/assets/js/chat-bot.js',
  '/assets/js/curso-progress.js',
  '/assets/img/favicon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
