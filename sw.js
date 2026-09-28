/* 台灣華語 · offline support.
   Pages are fetched fresh when you're online (so updates show up right away)
   and served from the phone's storage when you're offline.
   When you change the list of files below, bump the version number. */
const VERSION = 'tw-v5';
const APP_FILES = [
  './', 'index.html', 'vendor/hanzi-writer.min.js',
  'manifest.webmanifest', 'icons/favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];
const FONT_CACHE = 'tw-fonts';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== VERSION && k !== FONT_CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: keep a copy so characters look right offline
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT_CACHE).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  // Pages: network first, fall back to the saved copy
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return r;
    }).catch(async () => (await caches.match(req, { ignoreSearch: true })) || caches.match('index.html')));
    return;
  }
  // Everything else: use the saved copy, refresh it in the background
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
