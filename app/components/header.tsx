/* eslint-disable react/display-name */
import { Disclosure, Listbox, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";
import { Fragment, useRef, useEffect } from 'react';
import { ClientOnly } from "remix-utils";
import { Link } from "@remix-run/react";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";

type HeaderProps = {
  scrollTop: number;
  selectedTheme: string | null;
  setSelectedTheme: React.Dispatch<React.SetStateAction<string | null>>;
  closed: boolean;
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
  list: {
    topic: string;
    children: {
      slug: string;
      name: string;
    }[]
  }[]
};
type userTheme = "light" | "dark";

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
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default ({ scrollTop, selectedTheme, setSelectedTheme, closed, setClosed, list }: HeaderProps) => {
  const { width, height: _ } = useWindowSize();
  const sidebarRef = useRef(null);

  useOnClickOutside(sidebarRef, () => {
    setClosed(true);
  });

  useEffect(() => {
    if (width > 1024) {
      setClosed(true);
    }
  }, [setClosed, width])

  return (
    <Disclosure
      as="header"
      className={`sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8 ${
        scrollTop > 20 && selectedTheme == "dark"
          ? "dark:bg-transparentsticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8 dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75"
          : "dark:bg-transparent"
      }`}
    >
      {({ open }) => (
        <>
          <div className="mr-6 lg:hidden flex content-center">
            {/* Mobile menu button*/}
            <Disclosure.Button className="relative focus:outline-none focus:ring-0" onClick={() => setClosed(false)}>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block w-6 h-6 stroke-2 stroke-slate-500" aria-hidden="true" />
            </Disclosure.Button>
          </div>

          {/* Mobile Sidebar */}
          {!closed && (
            <div className="fixed top-0 left-0 w-screen h-screen inset-0 w-screen z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur lg:hidden">
              <div
                ref={sidebarRef}
                className="z-50 min-h-full w-full max-w-xs bg-white px-4 pt-5 pb-12 dark:bg-slate-900 sm:px-6"
              >
                <div className="flex items-center">
                  <Disclosure.Button
                    className="relative focus:outline-none focus:ring-0"
                    onClick={() => setClosed(true)}
                  >
                    <XMarkIcon
                      className="block w-6 h-6 stroke-2 stroke-slate-500"
                      aria-hidden="true"
                      onClick={() => setClosed(true)}
                    />
                  </Disclosure.Button>
                  <Link to={"/"} className="ml-6">
                    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" className="h-9 w-9 lg:hidden">
                      <g fill="none" stroke="#38BDF8" strokeLinejoin="round" strokeWidth="3">
                        <path d="M10.308 5L18 17.5 10.308 30 2.615 17.5 10.308 5z"></path>
                        <path d="M18 17.5L10.308 5h15.144l7.933 12.5M18 17.5h15.385L25.452 30H10.308L18 17.5z"></path>
                      </g>
                    </svg>
                  </Link>
                </div>
                <nav className="text-base lg:text-sm mt-5 px-1">
                  <ul className="space-y-9">
                    <li>
                      <h2 className="font-display font-medium text-slate-900 dark:text-white">Introduction</h2>
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
                      <h2 className="font-display font-medium text-slate-900 dark:text-white">Core concepts</h2>
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
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/introduction-to-string-theory"
                          >
                            Introduction to string theory
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/the-butterfly-effect"
                          >
                            The butterfly effect
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <h2 className="font-display font-medium text-slate-900 dark:text-white">Advanced guides</h2>
                      <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/writing-plugins"
                          >
                            Writing plugins
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/neuralink-integration"
                          >
                            Neuralink integration
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/temporal-paradoxes"
                          >
                            Temporal paradoxes
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/testing"
                          >
                            Testing
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/compile-time-caching"
                          >
                            Compile-time caching
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/predictive-data-generation"
                          >
                            Predictive data generation
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <h2 className="font-display font-medium text-slate-900 dark:text-white">API reference</h2>
                      <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/cacheadvance-predict"
                          >
                            CacheAdvance.predict()
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/cacheadvance-flush"
                          >
                            CacheAdvance.flush()
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/cacheadvance-revert"
                          >
                            CacheAdvance.revert()
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/cacheadvance-regret"
                          >
                            CacheAdvance.regret()
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <h2 className="font-display font-medium text-slate-900 dark:text-white">Contributing</h2>
                      <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/how-to-contribute"
                          >
                            How to contribute
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/architecture-guide"
                          >
                            Architecture guide
                          </a>
                        </li>
                        <li className="relative">
                          <a
                            className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            href="/docs/design-principles"
                          >
                            Design principles
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}

          <div className="relative flex items-center flex-grow basis-0">
            <a aria-label="Home page" href="/">
              <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" className="h-9 w-9 lg:hidden">
                <g fill="none" stroke="#38BDF8" strokeLinejoin="round" strokeWidth="3">
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
                <g fill="none" stroke="#38BDF8" strokeLinejoin="round" strokeWidth="3">
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
            <div className="relative flex content-center justify-end gap-6 basis-0 sm:gap-8 md:flex-grow">
              <Listbox value={selectedTheme} onChange={setSelectedTheme}>
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only">Theme</Listbox.Label>
                    <div className="relative z-10">
                      <ClientOnly
                        children={() => (
                          <Listbox.Button className="flex items-center justify-center w-6 h-6 rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5">
                            {selectedTheme && selectedTheme === "light" ? (
                              <SunIcon className="w-4 h-4 fill-sky-400" />
                            ) : selectedTheme && selectedTheme === "dark" ? (
                              <MoonIcon className="w-4 h-4 fill-sky-400" />
                            ) : (
                              <p></p>
                            )}
                          </Listbox.Button>
                        )}
                      />

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
  );
};
