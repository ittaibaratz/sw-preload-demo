
// Activate
addEventListener('activate', e => {
  e.waitUntil(async function() {
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
    }
  }());
});

const cacheName = 'sw-demo';

// Cache
const cacheResponse = (request, response) => {
  const clone = response.clone();
  caches
    .open(cacheName)
    .then(cache => {
      if (clone.ok) {
        cache.put(request, clone);
        return clone.ok;
      }
    });
};

// Fetch
addEventListener('fetch', event => {
  event.respondWith(async function() {
    // Only handle resources that belong to this page.
    if (event.request.url.startsWith(`${self.origin}/sw-preload-demo`)) {
      // Respond from the cache if we can
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      // Else, use preloaded or fetch
      let response = await event.preloadResponse || await fetch(event.request);

      cacheResponse(event.request, response);

      return response;
    }
    // Fetch everything else.
    return fetch(event.request);
  }());
});

