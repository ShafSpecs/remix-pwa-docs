/// <reference lib="WebWorker" />

import { EnhancedCache, logger } from "@remix-pwa/sw";

const GLOBAL_CACHE = new EnhancedCache('global-cache', {
  version: 'v2',
  strategy: 'CacheFirst',
  strategyOptions: {
    maxAgeSeconds: 3_600 * 24,
    maxEntries: 16
  },
});

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('install', event => {
  logger.log('Installing service worker...')

  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

export const getLoadContext = (event: FetchEvent) => {
  return {
    cache: GLOBAL_CACHE,
    logger,
  }
}
