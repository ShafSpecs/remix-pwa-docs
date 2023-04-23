import { useState, useEffect, Fragment } from "react";
import { Links, LiveReload, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useLoaderData, useLocation, useMatches, useNavigate, useNavigation } from "@remix-run/react";
import { useLocalStorage } from "usehooks-ts";
import Hero from "./components/hero";
import Header from "./components/header";
import { json } from "@remix-run/node";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import styles from "./styles/app.css";
import theme from "./styles/night-owl.css";
import prism from "./styles/code.css";

import type { LinksFunction, MetaFunction, LoaderFunction, TypedResponse } from "@remix-run/node";
import { getPostMetaData } from "./utils/server/github.server";
import type { MetaDataObject } from "./types/mdx";
import type { FrontMatterTypings } from './types/mdx';
import { ClientOnly } from "remix-utils";
import { Listbox, Transition } from "@headlessui/react";

type LoaderData = {
  meta: MetaDataObject[];
}

let isMount = true;

const packages = [
  { name: 'remix-pwa', slug: 'pwa' },
  { name: '@remix-pwa/sw', slug: 'sw' },
  { name: '@remix-pwa/push', slug: 'push' },
]

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
  const navigate = useNavigate();

  const [scrollTop, setScrollTop] = useState(0);
  const [closed, setClosed] = useState(true);
  const [next, setNext] = useState<any[]>([null, null])

  const onScroll = (e: any): void => {
    setScrollTop(e.target.documentElement.scrollTop);
  };

  const [selectedTheme, setSelectedTheme] = useLocalStorage<string | null>("theme", null);
  const [selected, setSelected] = useState(packages[0])

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

  const getPreviousAndNextRoute = () => {
    const currentRoute = location.pathname;
    const routes = meta.map((meta) => meta.children);

    //@ts-ignore
    const childrenArr = [].concat(...routes);

    //@ts-ignore
    const currentRouteIndex = childrenArr.findIndex((route) => route.slug === currentRoute);

    let nextRoute: FrontMatterTypings | null = null;
    let prevRoute: FrontMatterTypings | null = null;

    if (currentRouteIndex < (childrenArr.length - 1)) {
      nextRoute = childrenArr[currentRouteIndex + 1];
    }

    if (currentRouteIndex > 0) {
      prevRoute = childrenArr[currentRouteIndex - 1];
    }

    return [prevRoute, nextRoute];
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
  }, [location, matches]);

  useEffect(() => {
    setNext(getPreviousAndNextRoute())

    if (location.pathname.includes("/pwa/")) {
      setSelected(packages[0])
    }

    if (location.pathname.includes("/sw/")) {
      setSelected(packages[1])
    }

    if (location.pathname.includes("/push/")) {
      setSelected(packages[2])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, selected]);

  return (
    <html lang="en" className="antialiased [font-feature-settings:'ss01']">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={`${!closed && "overflow-hidden"} bg-white transition-colors duration-300 font-inter font-feature-text ss01 dark:bg-slate-900`}>
        <ClientOnly fallback={<></>} children={
          () =>
            <Header
              selectedTheme={selectedTheme}
              scrollTop={scrollTop}
              setSelectedTheme={setSelectedTheme}
              closed={closed}
              setClosed={setClosed}
              selected={selected}
              setSelected={setSelected}
              packages={packages}
              //@ts-ignore
              list={meta}
            />
          // Todo: Create a fallback component
        }
        />
        {location.pathname == "/" && <Hero />}
        <div className="relative flex justify-center mx-auto max-w-[88rem] sm:px-2 lg:px-8 xl:px-12">
          <div className="hidden ml-5 lg:relative lg:block lg:flex-none">
            <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
            <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-slate-800 dark:block"></div>
            <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-slate-800 dark:block"></div>
            <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
              <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
                <Listbox value={selected} onChange={setSelected}>
                  <div className="relative mt-1 mb-6">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-sm cursor-default shadow-gray-300 dark:shadow-gray-700 dark:text-white focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
                      <span className="block truncate">{selected.name}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDownIcon
                          className="w-5 h-5 text-gray-400 dark:text-gray-200"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-md dark:shadow-gray-700 dark:bg-slate-900 max-h-60 ring-1 ring-black dark:text-gray-100 ring-opacity-5 focus:outline-none sm:text-sm">
                        {packages.map((pkg, packageIdx) => (
                          <Listbox.Option
                            key={packageIdx}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-sky-100 text-sky-900' : 'text-gray-900 dark:text-gray-200'
                              }`
                            }
                            value={pkg}
                            onClick={() => navigate(`/${pkg.slug}`)}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {pkg.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                                    <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <ul className="space-y-9">
                  {meta[packages.indexOf(selected)].children.map((el: any) => {
                    return (
                      <li key={el.name}>
                        <h2 className="font-medium font-display text-slate-900 dark:text-white">{el.name}</h2>
                        <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                          {el.children.map((sub: any) => {
                            return (
                              <li className="relative" key={sub.slug}>
                                <NavLink prefetch="render" to={sub.slug} end={true} >
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
          <Outlet context={[next]} />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
