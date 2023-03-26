import React from "react";
import { useState, useEffect } from "react";
import { Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useLoaderData, useLocation, useMatches } from "@remix-run/react";
import { useLocalStorage } from "usehooks-ts";
import Hero from "./components/hero";
import Header from "./components/header";
import { json } from "@remix-run/node";

import styles from "./styles/app.css";
import theme from "./styles/night-owl.css";
import prism from "./styles/code.css";

import type { LinksFunction, MetaFunction, LoaderFunction, TypedResponse} from "@remix-run/node";
import { getPostMetaData } from "./utils/server/github.server";
import type { MetaDataObject } from "./types/mdx";

type LoaderData = {
  meta: MetaDataObject[];
}

let isMount = true;

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: theme },
    { rel: "stylesheet", href: prism }
  ];
};

export const loader: LoaderFunction = async (): Promise<TypedResponse<LoaderData>> => {
  const meta: MetaDataObject[] = await getPostMetaData();

  return json({ meta }, {
    headers: {
      "Cache-Control": "max-age=0, s-maxage=86400"
    }
  });
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix PWA Docs",
  viewport: "width=device-width,initial-scale=1"
});

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const { meta } = useLoaderData<LoaderData>();
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
          //@ts-ignore
          list={meta}
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
                  {meta.map((el) => {
                    return (
                      <li key={el.name}>
                        <h2 className="font-medium font-display text-slate-900 dark:text-white">{el.name}</h2>
                        <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                          {el.children.map((sub) => {
                            return (
                              <li className="relative" key={sub.slug}>
                                <NavLink to={sub.slug} end={true} >
                                  {({ isActive }) => (
                                    <span className={classNames(
                                      "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                                      isActive ?
                                        "font-semibold text-sky-500 before:bg-sky-500" :
                                        "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300")}>
                                      {sub.title}
                                    </span>
                                  )}
                                </NavLink>
                              </li>
                            )
                          })}
                        </ul>
                      </li>
                    )
                  })}
                </ul>
              </nav>

            </div>
          </div>
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
