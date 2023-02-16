import React, { Fragment } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useMatches } from "@remix-run/react";
import { Disclosure, Listbox, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/20/solid";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";
import { useLocalStorage } from "usehooks-ts";

import type { LinksFunction, MetaFunction } from "@remix-run/node";

import styles from "./styles/app.css";

type userTheme = "light" | "dark" | "system";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

let isMount = true;

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});

export default function App() {
  let location = useLocation();
  let matches = useMatches();

  const themes: {
    name: string;
    value: userTheme;
    icon: React.ReactNode;
  }[] = [
    {
      name: "Light",
      value: "light",
      icon: <SunIcon className="w-4 h-4 text-current" aria-hidden="true" />
    },
    {
      name: "Dark",
      value: "dark",
      icon: <MoonIcon className="w-4 h-4 text-current" aria-hidden="true" />
    },
    {
      name: "System",
      value: "system",
      icon: <ComputerDesktopIcon className="w-4 h-4 text-current" aria-hidden="true" />
    }
  ];

  const [selectedTheme, setSelectedTheme] = useLocalStorage<string>("theme", themes[2].value);

  React.useEffect(() => {
    let mounted = isMount;
    isMount = false;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
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

  React.useEffect(() => {
    if (document && document.documentElement) {
      if (
        selectedTheme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches) ||
        (selectedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        setSelectedTheme("dark");
      } else {
        document.documentElement.classList.remove("dark");
        setSelectedTheme("light");
      }
    } else {
      setSelectedTheme("system")
    }
  }, [selectedTheme, setSelectedTheme]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const exampleCode = `
const func = () => {
  console.log("Welcome to Remix PWA!");

  return "Hello World!";
}
  `.trim();

  return (
    <html lang="en" className="antialiased" data-theme="light">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-slate-900">
        <Disclosure
          as="header"
          className="sticky top-0 z-50 flex flex-wrap items-center justify-between px-4 py-5 transition duration-500 bg-white shadow-md shadow-slate-900/5 dark:shadow-none sm:px-6 lg:px-8 dark:bg-transparent dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75"
        >
          {({ open }) => (
            <>
              <div className="mr-6 lg:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative focus:outline-none focus:ring-0">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block w-6 h-6 stroke-2 stroke-slate-500" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block w-6 h-6 stroke-2 stroke-slate-500" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="relative flex items-center flex-grow basis-0">
                <a aria-label="Home page" href="/">
                  <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" className="h-9 w-9 lg:hidden">
                    <g fill="none" stroke="#38BDF8" stroke-linejoin="round" stroke-width="3">
                      <path d="M10.308 5L18 17.5 10.308 30 2.615 17.5 10.308 5z"></path>
                      <path d="M18 17.5L10.308 5h15.144l7.933 12.5M18 17.5h15.385L25.452 30H10.308L18 17.5z"></path>
                    </g>
                  </svg>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 227 36"
                    fill="none"
                    className="hidden w-auto h-9 fill-slate-700 dark:fill-sky-100 lg:block"
                  >
                    <g fill="none" stroke="#38BDF8" stroke-linejoin="round" stroke-width="3">
                      <path d="M10.308 5L18 17.5 10.308 30 2.615 17.5 10.308 5z"></path>
                      <path d="M18 17.5L10.308 5h15.144l7.933 12.5M18 17.5h15.385L25.452 30H10.308L18 17.5z"></path>
                    </g>
                    <path d="M55.96 26.2c-1.027 0-1.973-.173-2.84-.52a6.96 6.96 0 01-2.24-1.5 6.979 6.979 0 01-1.46-2.3c-.347-.893-.52-1.867-.52-2.92 0-1.027.18-1.973.54-2.84a6.71 6.71 0 011.52-2.28 6.922 6.922 0 012.3-1.52 7.48 7.48 0 012.86-.54c.667 0 1.32.093 1.96.28a6.12 6.12 0 011.78.78 5.7 5.7 0 011.4 1.24l-1.88 2.08a6.272 6.272 0 00-1-.82 3.728 3.728 0 00-1.08-.54 3.542 3.542 0 00-1.2-.2 4.14 4.14 0 00-1.62.32 3.991 3.991 0 00-1.3.9 4.197 4.197 0 00-.9 1.38 4.755 4.755 0 00-.32 1.78c0 .667.107 1.273.32 1.82.213.533.513.993.9 1.38.387.373.847.667 1.38.88.547.2 1.147.3 1.8.3a4.345 4.345 0 002.34-.68c.347-.213.653-.46.92-.74l1.46 2.34c-.32.36-.753.687-1.3.98a7.784 7.784 0 01-1.8.7c-.667.16-1.34.24-2.02.24zm6.99-.2l5.48-14h2.68l5.46 14h-3.08l-2.82-7.54c-.08-.213-.18-.487-.3-.82a922.595 922.595 0 00-.68-2.12 13.694 13.694 0 01-.24-.86l.54-.02c-.08.307-.174.627-.28.96-.094.32-.194.653-.3 1-.108.333-.22.66-.34.98-.12.32-.234.633-.34.94L65.91 26h-2.96zm2.54-2.94l.98-2.42h6.42l1 2.42h-8.4zm19.794 3.14c-1.026 0-1.973-.173-2.84-.52a6.96 6.96 0 01-2.24-1.5 6.98 6.98 0 01-1.46-2.3c-.346-.893-.52-1.867-.52-2.92 0-1.027.18-1.973.54-2.84a6.71 6.71 0 011.52-2.28 6.923 6.923 0 012.3-1.52 7.48 7.48 0 012.86-.54c.667 0 1.32.093 1.96.28a6.118 6.118 0 011.78.78c.547.347 1.014.76 1.4 1.24l-1.88 2.08a6.272 6.272 0 00-1-.82 3.728 3.728 0 00-1.08-.54 3.542 3.542 0 00-1.2-.2 4.14 4.14 0 00-1.62.32 3.992 3.992 0 00-1.3.9 4.197 4.197 0 00-.9 1.38 4.755 4.755 0 00-.32 1.78c0 .667.107 1.273.32 1.82.214.533.514.993.9 1.38.387.373.847.667 1.38.88.547.2 1.147.3 1.8.3a4.345 4.345 0 002.34-.68 4.53 4.53 0 00.92-.74l1.46 2.34c-.32.36-.753.687-1.3.98a7.784 7.784 0 01-1.8.7c-.666.16-1.34.24-2.02.24zm17.469-.2V12h3v14h-3zm-8.82 0V12h3v14h-3zm1.2-5.62l.02-2.72h9.14v2.72h-9.16zM110.402 26V12h9.46v2.64h-6.54v8.72h6.68V26h-9.6zm1.4-5.86v-2.56h7.1v2.56h-7.1zM122.437 26l5.48-14h2.68l5.46 14h-3.08l-2.82-7.54c-.08-.213-.18-.487-.3-.82l-.34-1.06-.34-1.06a14.73 14.73 0 01-.24-.86l.54-.02c-.08.307-.173.627-.28.96a63.3 63.3 0 01-.3 1c-.106.333-.22.66-.34.98-.12.32-.233.633-.34.94l-2.82 7.48h-2.96zm2.54-2.94l.98-2.42h6.42l1 2.42h-8.4zM139.023 26V12h5.74c1.027 0 1.953.173 2.78.52.84.333 1.56.813 2.16 1.44a6.097 6.097 0 011.4 2.2c.32.853.48 1.8.48 2.84 0 1.027-.16 1.973-.48 2.84a6.438 6.438 0 01-1.38 2.22 6.394 6.394 0 01-2.16 1.44c-.84.333-1.773.5-2.8.5h-5.74zm3-2.18l-.32-.52h2.96c.6 0 1.14-.1 1.62-.3.48-.213.887-.5 1.22-.86.347-.373.607-.827.78-1.36.173-.533.26-1.127.26-1.78a5.56 5.56 0 00-.26-1.76 3.595 3.595 0 00-.78-1.36 3.323 3.323 0 00-1.22-.86 3.948 3.948 0 00-1.62-.32h-3.02l.38-.48v9.6zM158.671 26l-5.58-14h3.18l2.92 7.58c.16.413.293.78.4 1.1.12.307.22.6.3.88.093.267.18.533.26.8.08.253.16.533.24.84l-.58.02c.107-.413.213-.793.32-1.14.107-.36.227-.733.36-1.12.133-.387.3-.847.5-1.38l2.76-7.58h3.16l-5.62 14h-2.62zm8.114 0l5.48-14h2.68l5.46 14h-3.08l-2.82-7.54c-.08-.213-.18-.487-.3-.82l-.34-1.06-.34-1.06a13.293 13.293 0 01-.24-.86l.54-.02c-.08.307-.173.627-.28.96a63.3 63.3 0 01-.3 1c-.107.333-.22.66-.34.98-.12.32-.233.633-.34.94l-2.82 7.48h-2.96zm2.54-2.94l.98-2.42h6.42l1 2.42h-8.4zM183.371 26V12h2.68l7.74 10.46h-.56c-.054-.413-.1-.813-.14-1.2l-.12-1.2c-.027-.413-.054-.833-.08-1.26-.014-.44-.027-.9-.04-1.38a56.825 56.825 0 01-.02-1.6V12h2.94v14h-2.72l-7.9-10.56.76.02c.066.693.12 1.287.16 1.78a36.623 36.623 0 01.18 2.2c.026.267.04.52.04.76.013.24.02.493.02.76V26h-2.94zm23.175.2c-1.027 0-1.973-.173-2.84-.52-.853-.36-1.6-.86-2.24-1.5a6.979 6.979 0 01-1.46-2.3c-.347-.893-.52-1.867-.52-2.92 0-1.027.18-1.973.54-2.84a6.71 6.71 0 011.52-2.28 6.919 6.919 0 012.3-1.52 7.48 7.48 0 012.86-.54c.667 0 1.32.093 1.96.28a6.12 6.12 0 011.78.78 5.7 5.7 0 011.4 1.24l-1.88 2.08a6.259 6.259 0 00-1-.82 3.721 3.721 0 00-1.08-.54 3.54 3.54 0 00-1.2-.2 4.14 4.14 0 00-1.62.32 3.991 3.991 0 00-1.3.9 4.206 4.206 0 00-.9 1.38 4.76 4.76 0 00-.32 1.78c0 .667.107 1.273.32 1.82.213.533.513.993.9 1.38.387.373.847.667 1.38.88.547.2 1.147.3 1.8.3a4.35 4.35 0 002.34-.68c.347-.213.653-.46.92-.74l1.46 2.34c-.32.36-.753.687-1.3.98a7.773 7.773 0 01-1.8.7c-.667.16-1.34.24-2.02.24zm8.649-.2V12h9.46v2.64h-6.54v8.72h6.68V26h-9.6zm1.4-5.86v-2.56h7.1v2.56h-7.1z"></path>
                  </svg>
                </a>
              </div>
              <div className="mr-6 -my-5 sm:mr-8 md:mr-0">
                <button
                  type="button"
                  className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
                >
                  <MagnifyingGlassIcon className="flex-none w-5 h-5 fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" />
                  <span className="sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
                    Search docs
                  </span>
                  <kbd className="hidden ml-auto font-medium text-slate-400 dark:text-slate-500 md:block">
                    <kbd className="font-sans">Ctrl </kbd>
                    <kbd className="font-sans">K</kbd>
                  </kbd>
                </button>
              </div>
              <div className="relative flex justify-end gap-6 basis-0 sm:gap-8 md:flex-grow">
                <div className="relative flex justify-end gap-6 basis-0 sm:gap-8 md:flex-grow">
                  <Listbox value={selectedTheme} onChange={setSelectedTheme}>
                    {({ open }) => (
                      <>
                        <Listbox.Label className="sr-only">Theme</Listbox.Label>
                        <div className="relative mt-1">
                          <Listbox.Button className="flex items-center justify-center w-6 h-6 rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5">
                            {selectedTheme === "light" ? (
                              <SunIcon className="w-4 h-4 fill-sky-400" />
                            ) : (
                              <MoonIcon className="w-4 h-4 fill-sky-400" />
                            )}
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="-translate-x-[50%] absolute top-full left-1/2 mt-3 w-36 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
                              {themes.map((theme) => (
                                <Listbox.Option
                                  key={theme.value}
                                  value={theme.value}
                                  className={({ active, selected }) =>
                                    classNames(
                                      active ? "bg-slate-100 dark:bg-slate-900/40" : "",
                                      (active && selected) || (!active && selected)
                                        ? "text-sky-500"
                                        : active && !selected
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-700 dark:text-slate-400",
                                      "flex cursor-pointer select-none items-center rounded-[0.625rem] p-1"
                                    )
                                  }
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <div
                                        className={classNames(
                                          "rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
                                        )}
                                      >
                                        {theme.icon}
                                      </div>
                                      <div className="ml-3">{theme.name}</div>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                  <a
                    className="group"
                    aria-label="GitHub"
                    href="https://github.com/ShafSpecs/remix-pwa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="w-6 h-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </>
          )}
        </Disclosure>
        {location.pathname == "/" && (
          <div className="overflow-hidden bg-slate-900 dark:-mb-32 dark:mt-[-4.5rem] dark:pb-32 dark:pt-[4.5rem] dark:lg:mt-[-4.75rem] dark:lg:pt-[4.75rem]">
            <div className="py-16 sm:px-2 lg:relative lg:py-20 lg:px-0">
              <div className="grid items-center max-w-2xl grid-cols-1 px-4 mx-auto gap-y-16 gap-x-8 lg:max-w-[88rem] lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
                <div style={{ width: "100%" }} className="z-10 md:text-center lg:text-left">
                  <img
                    alt=""
                    src="/images/blur-cyan.d28a5585.png"
                    width="530"
                    height="530"
                    decoding="async"
                    data-nimg="1"
                    className="absolute -mb-56 opacity-50 bottom-full right-full -mr-72"
                    style={{ color: "transparent" }}
                  />
                  <div className="relative">
                    <p className="inline text-5xl font-medium tracking-tight text-transparent bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display">
                      Never miss the cache again.
                    </p>
                    <p className="mt-3 text-2xl tracking-tight text-slate-400">
                      Cache every single thing your app could ever do ahead of time, so your code never even has to run
                      at all.
                    </p>
                    <div className="flex gap-4 mt-8 md:justify-center lg:justify-start">
                      <a
                        className="px-4 py-2 text-sm font-semibold rounded-full bg-sky-300 text-slate-900 hover:bg-sky-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500"
                        href="/"
                      >
                        Get started
                      </a>
                      <a
                        className="px-4 py-2 text-sm font-medium text-white rounded-full bg-slate-800 hover:bg-slate-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400"
                        href="/"
                      >
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
                <div className="relative lg:static xl:pl-10">
                  <div className="absolute inset-x-[-50vw] -top-32 -bottom-48 [mask-image:linear-gradient(transparent,white,white)] dark:[mask-image:linear-gradient(transparent,white,transparent)] lg:left-[calc(50%+14rem)] lg:right-0 lg:-top-32 lg:-bottom-32 lg:[mask-image:none] lg:dark:[mask-image:linear-gradient(white,white,transparent)]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 668 1069"
                      width={668}
                      height={1069}
                      fill="none"
                      className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]"
                    >
                      <defs>
                        <clipPath id=":R1l6:-clip-path">
                          <path fill="#fff" transform="rotate(-180 334 534.4)" d="M0 0h668v1068.8H0z" />
                        </clipPath>
                      </defs>
                      <g opacity=".4" clipPath="url(#:R1l6:-clip-path)" strokeWidth={4}>
                        <path
                          opacity=".3"
                          d="M584.5 770.4v-474M484.5 770.4v-474M384.5 770.4v-474M283.5 769.4v-474M183.5 768.4v-474M83.5 767.4v-474"
                          stroke="#334155"
                        />
                        <path
                          d="M83.5 221.275v6.587a50.1 50.1 0 0 0 22.309 41.686l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M83.5 716.012v6.588a50.099 50.099 0 0 0 22.309 41.685l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M183.7 584.5v6.587a50.1 50.1 0 0 0 22.31 41.686l55.581 37.054a50.097 50.097 0 0 1 22.309 41.685v6.588M384.101 277.637v6.588a50.1 50.1 0 0 0 22.309 41.685l55.581 37.054a50.1 50.1 0 0 1 22.31 41.686v6.587M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588"
                          stroke="#334155"
                        />
                        <path
                          d="M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588M484.3 594.937v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054A50.1 50.1 0 0 0 384.1 721.95v6.587M484.3 872.575v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054a50.098 50.098 0 0 0-22.309 41.686v6.582M584.501 663.824v39.988a50.099 50.099 0 0 1-22.31 41.685l-55.581 37.054a50.102 50.102 0 0 0-22.309 41.686v6.587M283.899 945.637v6.588a50.1 50.1 0 0 1-22.309 41.685l-55.581 37.05a50.12 50.12 0 0 0-22.31 41.69v6.59M384.1 277.637c0 19.946 12.763 37.655 31.686 43.962l137.028 45.676c18.923 6.308 31.686 24.016 31.686 43.962M183.7 463.425v30.69c0 21.564 13.799 40.709 34.257 47.529l134.457 44.819c18.922 6.307 31.686 24.016 31.686 43.962M83.5 102.288c0 19.515 13.554 36.412 32.604 40.645l235.391 52.309c19.05 4.234 32.605 21.13 32.605 40.646M83.5 463.425v-58.45M183.699 542.75V396.625M283.9 1068.8V945.637M83.5 363.225v-141.95M83.5 179.524v-77.237M83.5 60.537V0M384.1 630.425V277.637M484.301 830.824V594.937M584.5 1068.8V663.825M484.301 555.275V452.988M584.5 622.075V452.988M384.1 728.537v-56.362M384.1 1068.8v-20.88M384.1 1006.17V770.287M283.9 903.888V759.85M183.699 1066.71V891.362M83.5 1068.8V716.012M83.5 674.263V505.175"
                          stroke="#334155"
                        />
                        <circle
                          cx="83.5"
                          cy="384.1"
                          r="10.438"
                          transform="rotate(-180 83.5 384.1)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="83.5"
                          cy="200.399"
                          r="10.438"
                          transform="rotate(-180 83.5 200.399)"
                          stroke="#334155"
                        />
                        <circle
                          cx="83.5"
                          cy="81.412"
                          r="10.438"
                          transform="rotate(-180 83.5 81.412)"
                          stroke="#334155"
                        />
                        <circle
                          cx="183.699"
                          cy="375.75"
                          r="10.438"
                          transform="rotate(-180 183.699 375.75)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="183.699"
                          cy="563.625"
                          r="10.438"
                          transform="rotate(-180 183.699 563.625)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="384.1"
                          cy="651.3"
                          r="10.438"
                          transform="rotate(-180 384.1 651.3)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="484.301"
                          cy="574.062"
                          r="10.438"
                          transform="rotate(-180 484.301 574.062)"
                          fill="#0EA5E9"
                          fillOpacity=".42"
                          stroke="#0EA5E9"
                        />
                        <circle
                          cx="384.1"
                          cy="749.412"
                          r="10.438"
                          transform="rotate(-180 384.1 749.412)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="384.1"
                          cy="1027.05"
                          r="10.438"
                          transform="rotate(-180 384.1 1027.05)"
                          stroke="#334155"
                        />
                        <circle
                          cx="283.9"
                          cy="924.763"
                          r="10.438"
                          transform="rotate(-180 283.9 924.763)"
                          stroke="#334155"
                        />
                        <circle
                          cx="183.699"
                          cy="870.487"
                          r="10.438"
                          transform="rotate(-180 183.699 870.487)"
                          stroke="#334155"
                        />
                        <circle
                          cx="283.9"
                          cy="738.975"
                          r="10.438"
                          transform="rotate(-180 283.9 738.975)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="83.5"
                          cy="695.138"
                          r="10.438"
                          transform="rotate(-180 83.5 695.138)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="83.5"
                          cy="484.3"
                          r="10.438"
                          transform="rotate(-180 83.5 484.3)"
                          fill="#0EA5E9"
                          fillOpacity=".42"
                          stroke="#0EA5E9"
                        />
                        <circle
                          cx="484.301"
                          cy="432.112"
                          r="10.438"
                          transform="rotate(-180 484.301 432.112)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="584.5"
                          cy="432.112"
                          r="10.438"
                          transform="rotate(-180 584.5 432.112)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="584.5"
                          cy="642.95"
                          r="10.438"
                          transform="rotate(-180 584.5 642.95)"
                          fill="#1E293B"
                          stroke="#334155"
                        />
                        <circle
                          cx="484.301"
                          cy="851.699"
                          r="10.438"
                          transform="rotate(-180 484.301 851.699)"
                          stroke="#334155"
                        />
                        <circle
                          cx="384.1"
                          cy="256.763"
                          r="10.438"
                          transform="rotate(-180 384.1 256.763)"
                          stroke="#334155"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="relative">
                    <img
                      alt=""
                      src="/images/blur-cyan.d28a5585.png"
                      width={530}
                      height={530}
                      decoding="async"
                      data-nimg={1}
                      className="absolute -top-64 -right-64"
                      style={{ color: "transparent" }}
                    />
                    <img
                      alt=""
                      src="/images/blur-indigo.b752cf77.png"
                      width={567}
                      height={567}
                      decoding="async"
                      data-nimg={1}
                      className="absolute -bottom-40 -right-44"
                      style={{ color: "transparent" }}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10" />
                    <div className="relative rounded-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur">
                      <div className="absolute h-px -top-px left-20 right-11 bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
                      <div className="absolute h-px -bottom-px left-11 right-20 bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0" />
                      <div className="pt-4 pl-4">
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 42 10"
                          fill="none"
                          className="h-2.5 w-auto stroke-slate-500/30"
                        >
                          <circle cx={5} cy={5} r="4.5" />
                          <circle cx={21} cy={5} r="4.5" />
                          <circle cx={37} cy={5} r="4.5" />
                        </svg>
                        <div className="flex mt-4 space-x-2 text-xs">
                          <div className="flex h-6 p-px font-medium rounded-full bg-gradient-to-r from-sky-400/30 via-sky-400 to-sky-400/30 text-sky-300">
                            <div className="flex items-center rounded-full px-2.5 bg-slate-800">
                              cache-advance.config.js
                            </div>
                          </div>
                          <div className="flex h-6 rounded-full text-slate-500">
                            <div className="flex items-center rounded-full px-2.5">package.json</div>
                          </div>
                        </div>
                        <div className="flex items-start px-1 mt-6 text-sm">
                          <div
                            aria-hidden="true"
                            className="pr-4 font-mono border-r select-none border-slate-300/5 text-slate-600"
                          >
                            01
                            <br />
                            02
                            <br />
                            03
                            <br />
                            04
                            <br />
                            05
                            <br />
                          </div>
                          <Highlight {...defaultProps} theme={theme} code={exampleCode} language="tsx">
                            {({ tokens, getLineProps, getTokenProps, className }) => (
                              <pre className={`${className} overflow-x-auto pb-6 px-3`}>
                                {tokens.map((line, i) => (
                                  <div {...getLineProps({ line, key: i })}>
                                    {line.map((token, key) => (
                                      <span {...getTokenProps({ token, key })} />
                                    ))}
                                  </div>
                                ))}
                              </pre>
                            )}
                          </Highlight>
                          {/* <pre className="flex pb-6 overflow-x-auto prism-code language-javascript">
                            <code className="px-4">
                              <div className="token-line">
                                <span className="token keyword module">export</span>
                                <span className="token plain"> </span>
                                <span className="token keyword module">default</span>
                                <span className="token plain"> </span>
                                <span className="token punctuation">{"{"}</span>
                                <span className="token plain" />
                              </div>
                              <div className="token-line">
                                <span className="token plain">{"  "}</span>
                                <span className="token literal-property property">strategy</span>
                                <span className="token operator">:</span>
                                <span className="token plain"> </span>
                                <span className="token string">'predictive'</span>
                                <span className="token punctuation">,</span>
                                <span className="token plain" />
                              </div>
                              <div className="token-line">
                                <span className="token plain">{"  "}</span>
                                <span className="token literal-property property">engine</span>
                                <span className="token operator">:</span>
                                <span className="token plain"> </span>
                                <span className="token punctuation">{"{"}</span>
                                <span className="token plain" />
                              </div>
                              <div className="token-line">
                                <span className="token plain">{"    "}</span>
                                <span className="token literal-property property">cpus</span>
                                <span className="token operator">:</span>
                                <span className="token plain"> </span>
                                <span className="token number">12</span>
                                <span className="token punctuation">,</span>
                                <span className="token plain" />
                              </div>
                              <div className="token-line">
                                <span className="token plain">{"    "}</span>
                                <span className="token literal-property property">backups</span>
                                <span className="token operator">:</span>
                                <span className="token plain"> </span>
                                <span className="token punctuation">[</span>
                                <span className="token string">'./storage/cache.wtf'</span>
                                <span className="token punctuation">]</span>
                                <span className="token punctuation">,</span>
                                <span className="token plain" />
                              </div>
                              <div className="token-line">
                                <span className="token plain">{"  "}</span>
                                <span className="token punctuation">{"}"}</span>
                                <span className="token punctuation">,</span>
                                <span className="token plain" />
                              </div>
                              <div className="token-line">
                                <span className="token plain" />
                                <span className="token punctuation">{"}"}</span>
                              </div>
                            </code>
                          </pre> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex justify-center mx-auto max-w-[88rem] sm:px-2 lg:px-8 xl:px-12">
          <div className="hidden ml-5 lg:relative lg:block lg:flex-none">
            <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
            <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-slate-800 dark:block"></div>
            <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-slate-800 dark:block"></div>
            <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
              <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
                <ul role="list" className="space-y-9">
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
          {/* What `Outlet` 'should' technically look like */}
          <div className="flex-auto max-w-2xl min-w-0 px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed quae harum sequi ex assumenda alias architecto
            unde repellat, ullam at, vero asperiores ipsa, ipsam nesciunt blanditiis aut cum autem quisquam? Amet
            deleniti fugiat quam vero, pariatur dolores sed culpa omnis perspiciatis quisquam? Tenetur, atque deserunt
            sapiente veritatis velit ad. Ab voluptatibus culpa, iure accusamus hic molestiae omnis. Magni, sapiente
            officia! Tempore deserunt, autem nihil assumenda minima ab recusandae nesciunt. Omnis eligendi beatae
            laborum corporis possimus saepe porro, quos est nam necessitatibus hic reiciendis tenetur repellendus
            officiis consequatur atque deserunt incidunt. Architecto voluptatem excepturi aut aliquid iste sapiente,
            cupiditate quisquam rerum similique, cumque ex nobis iusto reprehenderit rem doloremque exercitationem
            facere commodi sit illum expedita eum illo culpa error! Commodi, perspiciatis. Dolores repellendus odio
            deleniti laboriosam eaque itaque ab natus, hic explicabo dolorem veniam sed est repudiandae assumenda
            aperiam inventore quia exercitationem placeat voluptas officiis dolor ad modi similique amet. Sit. Eius
            ullam nostrum blanditiis architecto adipisci labore assumenda consequuntur perspiciatis, possimus dolorum
            autem, aliquid ducimus rerum quaerat itaque, qui velit optio ex porro debitis sit placeat temporibus
            quisquam dolores. Repudiandae. Commodi odit soluta sed, animi maiores, aut quasi voluptates nobis beatae vel
            aperiam dolor deserunt necessitatibus mollitia molestias ipsam hic, suscipit pariatur unde alias odio modi?
            Commodi ab necessitatibus nostrum. Corrupti ipsum nesciunt autem quidem pariatur aperiam aspernatur
            praesentium eos, quis, molestiae necessitatibus ea assumenda, incidunt veniam accusamus. Minus pariatur
            perferendis ut ducimus impedit architecto dolorem doloremque. Quia, tempora consequuntur. Libero quisquam
            corporis eum magnam consequatur, inventore officiis assumenda maiores tenetur nesciunt accusamus, rem
            corrupti sunt distinctio nulla nostrum magni quae sapiente illo, dignissimos temporibus fuga eaque
            laboriosam? Explicabo, corrupti! Reiciendis suscipit harum ducimus maxime id deserunt illo amet architecto
            consequatur nobis hic delectus eum repellendus laborum dolorem sequi facere vel, nam molestias laudantium.
            Animi soluta aliquid et eaque reprehenderit. Quam rem nihil qui quo illum eius ipsam quia atque. Dignissimos
            autem repellendus maxime ducimus corrupti sunt, possimus minus labore, quas repudiandae illum aliquam beatae
            et iusto nam deleniti laborum? Soluta quisquam ipsam necessitatibus atque officiis nostrum exercitationem?
            Impedit cum incidunt quos exercitationem rem suscipit dolores assumenda necessitatibus corrupti voluptas
            facere distinctio odit, vel recusandae perspiciatis consequatur, ratione accusamus fuga. Error non ab soluta
            at, adipisci ad quia libero. Necessitatibus nisi repellat eum alias accusantium in eius illum ducimus,
            laudantium sit delectus tempore reiciendis, voluptatibus adipisci distinctio atque sunt nesciunt. Id
            molestias doloribus nisi porro aperiam impedit nam praesentium saepe quaerat tempore natus, quam,
            consectetur amet temporibus assumenda distinctio. Veniam repudiandae tempora, quae laboriosam eaque non
            maxime voluptatum inventore blanditiis. Amet, magni odio quidem quae reprehenderit totam laudantium magnam
            architecto fugit perferendis modi voluptates omnis veniam explicabo impedit iste nobis? Corporis quo modi
            doloribus! Ab officia accusamus blanditiis. Necessitatibus, nam? Dolor minima nulla dignissimos dolorem
            voluptatibus officia itaque laborum aliquid illum, quaerat, adipisci nihil ipsum velit quae provident
            soluta. Minus quia quidem ducimus. Debitis molestiae, eligendi officiis fugit quasi cum? At fugit,
            reprehenderit iure, tempore inventore debitis veritatis accusantium architecto, ducimus nihil cumque
            mollitia aut doloremque voluptates iste aperiam quam exercitationem. Voluptate facere mollitia voluptas
            tempore provident cupiditate, libero eveniet! Quasi sint quaerat facilis eum consectetur non aperiam
            provident reprehenderit obcaecati temporibus impedit culpa, fuga, earum ipsam inventore ullam, commodi quos
            totam ea tempore perferendis illo tenetur amet. Sequi, debitis. Laborum in adipisci facere aliquam porro
            pariatur aperiam repudiandae culpa quas illum, praesentium velit consectetur rerum reprehenderit earum
            delectus explicabo cumque excepturi consequuntur repellat doloribus sed, distinctio fugit animi. Et?
            Provident unde blanditiis cumque suscipit error vel commodi maiores nemo facere nulla? Tenetur amet numquam
            nam, quae quas ab neque, animi vitae sapiente odio explicabo similique, nobis architecto earum ullam.
            Reprehenderit voluptatum temporibus nobis ullam aspernatur natus corrupti officiis. Eius repellat ex sequi
            cum eos animi voluptas ad, autem ducimus tenetur aperiam perferendis assumenda provident, dolorum
            repellendus quod delectus perspiciatis? Qui voluptatibus maxime consequuntur vitae ipsam iure aliquid libero
            voluptas voluptatum dicta nemo aperiam velit, natus quis, ad dolorem non nihil obcaecati impedit tempora
            inventore, nisi tempore eveniet. Labore, quo. Laborum eveniet accusamus aspernatur nemo cupiditate fugit
            magnam. Repellat error, neque quo rerum unde reprehenderit voluptatem explicabo maiores consectetur qui
            esse, quasi fugiat consequatur! Consequatur sed omnis minus id. Sequi! Unde, ut aperiam alias dignissimos
            molestias at accusantium eius fugit quae excepturi, cum pariatur. Explicabo animi facere, libero, ut fuga
            nemo voluptas ipsa perferendis, quo dolore beatae esse. Sapiente, ipsam. Deleniti, minima dolore quo illo
            obcaecati eveniet quam nemo perspiciatis, repellendus ad delectus dolorum cum! Obcaecati vitae aliquid
            voluptas vero voluptatibus soluta numquam quam quidem in, aut sint aliquam ex? Alias voluptas fugiat
            laboriosam repellendus odio ut minima eaque, suscipit dolore recusandae dolorem minus. Similique maiores
            dicta sapiente incidunt aspernatur commodi, voluptatibus nostrum quasi quaerat quibusdam blanditiis sequi,
            obcaecati corporis. Itaque, architecto, repellendus aspernatur qui molestias porro vero doloribus fugit
            provident hic nam eaque quaerat in voluptatum? Delectus quis ipsa, quibusdam at, ullam neque odit recusandae
            dolore nulla voluptatum nemo. Eos officiis quis minima, a suscipit fugiat perspiciatis vitae adipisci
            eveniet laudantium voluptatibus officia perferendis impedit, harum inventore nemo. Provident dolorem ad
            libero inventore laboriosam sint facere modi non doloribus!
          </div>
          <Outlet />
          <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
            <nav aria-labelledby="on-this-page-title" className="w-56">
              <h2 id="on-this-page-title" className="text-sm font-medium font-display text-slate-900 dark:text-white">
                On this page
              </h2>
              <ol role="list" className="mt-4 space-y-3 text-sm">
                <li>
                  <h3>
                    <a className="text-sky-500" href="/#quick-start">
                      Quick start
                    </a>
                  </h3>
                  <ol role="list" className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
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
                  <ol role="list" className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
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
                  <ol role="list" className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
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
