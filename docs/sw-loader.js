window.addEventListener('load', () =>
  navigator.serviceWorker
    .register('/sw-preload-demo/sw.js', {scope: '/'}));
