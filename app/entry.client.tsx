import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}

if ("serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  async function loadSW(){
    console.log("loaded");
    
    return navigator.serviceWorker
      .register("/entry.worker.js")
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: "SYNC_REMIX_MANIFEST",
            manifest: window.__remixManifest,
          });
        } else {
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            navigator.serviceWorker.controller?.postMessage({
              type: "SYNC_REMIX_MANIFEST",
              manifest: window.__remixManifest,
            });
          });
        }
      })
      .catch((error) => {
        console.error("Service worker registration failed", error);
      });
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    loadSW();
  } else {
    window.addEventListener("load", loadSW);
  }
}