/* IRN Devs — service worker leve (cache estático) */
const CACHE = 'irn-v20260917a';
const OFFLINE_URL = '/offline.html';
const ASSETS = [
  '/',
  '/index.html',
  '/cursos.html',
  '/blog.html',
  '/ia.html',
  '/offline.html',
  '/manifest.json',
  '/assets/css/site-nav.css',
  '/assets/css/motion.css',
  '/assets/css/pages/index.css',
  '/assets/css/pages/cursos.css',
  '/assets/css/pages/blog.css',
  '/assets/css/pages/ia.css',
  '/assets/css/pages/curso-python.css',
  '/assets/css/pages/404.css',
  '/assets/js/site-nav.js',
  '/assets/js/chat-bot.js',
  '/assets/js/curso-progress.js',
  '/assets/img/favicon.svg',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png',
  '/assets/img/icon-maskable-512.png',
  '/assets/img/apple-touch-icon.png'
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
  const isNavigation =
    e.request.mode === 'navigate' ||
    (e.request.headers.get('accept') || '').includes('text/html');
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
        .catch(() => cached || (isNavigation ? caches.match(OFFLINE_URL) : undefined));
      return cached || fetched;
    })
  );
});
