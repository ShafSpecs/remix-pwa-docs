import React from "react";
import { useState, useEffect } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useMatches } from "@remix-run/react";
import { useLocalStorage } from "usehooks-ts";
import Hero from "./components/hero";
import Header from "./components/header";
import styles from "./styles/app.css";

import type { LinksFunction, MetaFunction } from "@remix-run/node";

let isMount = true;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});

export default function App() {
  let location = useLocation();
  let matches = useMatches();

  const [scrollTop, setScrollTop] = useState(0);
  const [closed, setClosed] = useState(true);

  const onScroll = (e: any): void => {
    setScrollTop(e.target.documentElement.scrollTop);
  };

  const [selectedTheme, setSelectedTheme] = useLocalStorage<string | null>("theme", null);

  useEffect(() => {
    if (document && document.documentElement) {
      if (
        selectedTheme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        setSelectedTheme("dark");
      } else {
        document.documentElement.classList.remove("dark");
        setSelectedTheme("light");
      }
    } else {
      setSelectedTheme("light");
    }
  }, [selectedTheme, setSelectedTheme]);
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, []);

  function isPromise(p: any): boolean {
    if (typeof p === "object" && typeof p.then === "function") {
      return true;
    }

    return false;
  }

  useEffect(() => {
    let mounted = isMount;
    isMount = false;

    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches: matches.filter((route) => {
            if (route.data) {
              return (
                Object.values(route.data!).filter((elem) => {
                  return isPromise(elem);
                }).length === 0
              );
            }
            return true;
          }),
          manifest: window.__remixManifest
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches: matches.filter((route) => {
              if (route.data) {
                return (
                  Object.values(route.data!).filter((elem) => {
                    return isPromise(elem);
                  }).length === 0
                );
              }
              return true;
            }),
            manifest: window.__remixManifest
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener("controllerchange", listener);
        };
      }
    }
  }, [location]);

  return (
    <html lang="en" className="antialiased [font-feature-settings:'ss01']">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={`${!closed && "overflow-hidden"} bg-white font-inter font-feature-text ss01 dark:bg-slate-900`}>
        <Header
          selectedTheme={selectedTheme}
          scrollTop={scrollTop}
          setSelectedTheme={setSelectedTheme}
          closed={closed}
          setClosed={setClosed}
        />
        {location.pathname == "/" && <Hero />}
        <div className="relative flex justify-center mx-auto max-w-[88rem] sm:px-2 lg:px-8 xl:px-12">
          <div className="hidden ml-5 lg:relative lg:block lg:flex-none">
            <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
            <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-slate-800 dark:block"></div>
            <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-slate-800 dark:block"></div>
            <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
              <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
                <ul className="space-y-9">
                  <li>
                    <h2 className="font-medium font-display text-slate-900 dark:text-white">Introduction</h2>
                    <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full font-semibold text-sky-500 before:bg-sky-500"
                          href="/"
                        >
                          Getting started
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/installation"
                        >
                          Installation
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <h2 className="font-medium font-display text-slate-900 dark:text-white">Core concepts</h2>
                    <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/understanding-caching"
                        >
                          Understanding caching
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/predicting-user-behavior"
                        >
                          Predicting user behavior
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/basics-of-time-travel"
                        >
                          Basics of time-travel
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <Outlet />
          <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
            <nav aria-labelledby="on-this-page-title" className="w-56">
              <h2 id="on-this-page-title" className="text-sm font-medium font-display text-slate-900 dark:text-white">
                On this page
              </h2>
              <ol className="mt-4 space-y-3 text-sm">
                <li>
                  <h3>
                    <a className="text-sky-500" href="/#quick-start">
                      Quick start
                    </a>
                  </h3>
                  <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#installing-dependencies">
                        Installing dependencies
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#configuring-the-library">
                        Configuring the library
                      </a>
                    </li>
                  </ol>
                </li>
                <li>
                  <h3>
                    <a
                      className="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      href="/#basic-usage"
                    >
                      Basic usage
                    </a>
                  </h3>
                  <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#your-first-cache">
                        Your first cache
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#clearing-the-cache">
                        Clearing the cache
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#adding-middleware">
                        Adding middleware
                      </a>
                    </li>
                  </ol>
                </li>
                <li>
                  <h3>
                    <a
                      className="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      href="/#getting-help"
                    >
                      Getting help
                    </a>
                  </h3>
                  <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#submit-an-issue">
                        Submit an issue
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#join-the-community">
                        Join the community
                      </a>
                    </li>
                  </ol>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
