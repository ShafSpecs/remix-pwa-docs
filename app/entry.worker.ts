/// <reference lib="WebWorker" />

export type {};
declare let self: ServiceWorkerGlobalScope;

async function handleInstall(event: ExtendableEvent) {
  event.waitUntil(self.skipWaiting());
}

async function handleActivate(event: ExtendableEvent) {
  event.waitUntil(self.clients.claim());
}

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(handleInstall(event));
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(handleActivate(event));
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {

});

self.addEventListener("fetch", (event: FetchEvent) => {

});
