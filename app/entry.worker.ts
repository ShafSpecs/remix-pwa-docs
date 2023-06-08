/// <reference lib="WebWorker" />

import {
  CacheFirst,
  NetworkFirst,
  RemixNavigationHandler,
  isAssetRequest,
  isDocumentRequest,
  isLoaderRequest
} from "@remix-pwa/sw";

export type {};
declare let self: ServiceWorkerGlobalScope;

async function handleInstall(event: ExtendableEvent) {
  event.waitUntil(self.skipWaiting());
}

async function handleActivate(event: ExtendableEvent) {
  event.waitUntil(self.clients.claim());
}

const ASSET_CACHE = "asset-cache";
const DATA_CACHE = "data-cache";
const DOCUMENT_CACHE = "document-cache";
const STATIC_ASSETS = ["/build/", "/icons/", "/fonts/", "/images/", "/favicon.ico"];

const navigationHandler = new RemixNavigationHandler({
  dataCacheName: DATA_CACHE,
  documentCacheName: DOCUMENT_CACHE,
  plugins: []
});

const assetCacheHandler = new CacheFirst({
  cacheName: ASSET_CACHE,
  matchOptions: {
    ignoreSearch: true,
    ignoreVary: true
  }
});

const dataCacheHandler = new NetworkFirst({
  cacheName: DATA_CACHE,
  isLoader: true,
  networkTimeoutSeconds: 15
});

const documentCacheHandler = new NetworkFirst({
  cacheName: DOCUMENT_CACHE
});

const fetchHandler = async (event: FetchEvent): Promise<Response> => {
  const { request } = event;

  if (isAssetRequest(request, STATIC_ASSETS)) {
    return assetCacheHandler.handle(request);
  } else if (isLoaderRequest(request)) {
    return dataCacheHandler.handle(request);
  } else if (isDocumentRequest(request)) {
    return documentCacheHandler.handle(request);
  }

  return fetch(request.clone());
};

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(handleInstall(event));
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(handleActivate(event));
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  event.waitUntil(navigationHandler.handle(event));
});

self.addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(fetchHandler(event));
});
