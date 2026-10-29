const CACHE_NAME = 'field-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
];

// Install Event - കാഷെ ചെയ്യുന്നു
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - പഴയ കാഷെ നീക്കം ചെയ്യുന്നു
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - നെറ്റ്‌വർക്ക് ഉണ്ടെങ്കിൽ ഷീറ്റിൽ നിന്ന് എടുക്കും, ഇല്ലെങ്കിൽ കാഷെയിൽ നിന്ന് നൽകും
self.addEventListener('fetch', (e) => {
  // Google Apps Script API കാഷെ ചെയ്യാതെ നേരിട്ട് നെറ്റ്‌വർക്കിലേക്ക് വിടുന്നു
  if (e.request.url.includes('script.google.com')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
