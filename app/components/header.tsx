/* eslint-disable react/display-name */
import { Disclosure, Listbox, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";
import { Fragment, useRef, useEffect } from "react";
import { ClientOnly } from "remix-utils";
import { Link, NavLink, useLocation, useFetcher } from "@remix-run/react";
import { useOnClickOutside, useWindowSize } from "usehooks-ts";
import RemixLight from "./icons/RemixLight";
import RemixDark from "./icons/RemixDark";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useTheme } from "~/utils/providers/ThemeProvider";
import { useSidebar } from "~/utils/providers/SidebarProvider";
import { useTypedLoaderData } from "remix-typedjson";
import type { loader as RootLoader } from "~/root";

type HeaderProps = {
  scrollTop: number;
  selected: any;
  setSelected: React.Dispatch<React.SetStateAction<any>>;
  packages: any;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default ({ scrollTop, selected, setSelected, packages }: HeaderProps) => {
  const { meta: list } = useTypedLoaderData<typeof RootLoader>();
  const fetcher = useFetcher();
  const [theme, setTheme] = useTheme();
  const [closed, setClosed] = useSidebar();
  const { width } = useWindowSize();
  const location = useLocation();
  const sidebarRef = useRef(null);

  useOnClickOutside(sidebarRef, () => {
    setClosed(true);
  });

  useEffect(() => {
    if (width > 1024) {
      setClosed(true);
    }
  }, [setClosed, width]);

  useEffect(() => {
    setClosed(true);
  }, [location, setClosed]);

  return (
    <Disclosure
      as="header"
      id="header__main"
      className={`sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-300 dark:shadow-none sm:px-6 lg:px-8 ${
        scrollTop > 20 && theme == "dark"
          ? "dark:bg-transparentsticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 dark:shadow-none sm:px-6 lg:px-8 dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75"
          : "dark:bg-transparent"
      }`}
    >
      {({ open }) => (
        <>
          <div className="flex content-center mr-6 lg:hidden">
            {/* Mobile menu button*/}
            <Disclosure.Button className="relative focus:outline-none focus:ring-0" onClick={() => setClosed(false)}>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block w-6 h-6 stroke-2 stroke-slate-500" aria-hidden="true" />
            </Disclosure.Button>
          </div>

          {/* Mobile Sidebar */}
          {!closed && (
            <div className="fixed inset-0 top-0 left-0 z-50 flex items-start w-screen h-screen pr-10 overflow-y-auto bg-slate-900/50 backdrop-blur lg:hidden">
              <div
                ref={sidebarRef}
                className="z-50 w-full max-w-xs min-h-full px-4 pt-5 pb-12 bg-white dark:bg-slate-900 sm:px-6"
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
                    {theme === "light" ? (
                      <RemixLight className="h-10 -ml-2 lg:hidden w-11 fill-slate-700" fill="fill-slate-700" />
                    ) : (
                      <RemixDark className="w-10 -ml-2 lg:hidden h-9 fill-sky-100" fill="fill-sky-100" />
                    )}
                  </Link>
                </div>
                <nav className="px-1 mt-5 text-base lg:text-sm">
                  <Listbox value={selected} onChange={setSelected}>
                    <div className="relative mt-1 mb-6">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-sm cursor-default shadow-gray-300 dark:shadow-gray-700 dark:text-white focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm">
                        <span className="block truncate">{selected.name}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronUpDownIcon className="w-5 h-5 text-gray-400 dark:text-gray-200" aria-hidden="true" />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-md dark:shadow-gray-700 dark:bg-slate-900 max-h-60 ring-1 ring-black dark:text-gray-100 ring-opacity-5 focus:outline-none sm:text-sm">
                          {packages.map((pkg: any, packageIdx: number) => (
                            <Listbox.Option
                              key={packageIdx}
                              disabled={pkg.comingSoon}
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                  active ? "bg-sky-100 text-sky-900" : "text-gray-900 dark:text-gray-200"
                                }`
                              }
                              value={pkg}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                    {pkg.name}{" "}
                                    {pkg.comingSoon && (
                                      <span className="text-base text-gray-400 dark:text-gray-500">🚧</span>
                                    )}
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
                    {Array.isArray(list)
                      ? list[packages.indexOf(selected)].children.map((e: any) => {
                          return (
                            <li key={e.name}>
                              <h2 className="font-medium font-display text-slate-900 dark:text-white">{e.name}</h2>
                              <ul className="mt-4 space-y-3 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                                {e.children.map((item: any) => {
                                  return (
                                    <li className="relative" key={item.slug}>
                                      <NavLink to={item.slug} end>
                                        {({ isActive }) => (
                                          <span
                                            className={classNames(
                                              "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                                              isActive
                                                ? "font-semibold text-sky-500 before:bg-sky-500"
                                                : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                                            )}
                                          >
                                            {item.title}
                                          </span>
                                        )}
                                      </NavLink>
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })
                      : list}
                  </ul>
                </nav>
              </div>
            </div>
          )}

          <div className="relative flex items-center flex-grow basis-0">
            <a aria-label="Home page" href="/" className="lg:flex">
              {/* <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" className="h-9 w-9 lg:hidden">
                <g fill="none" stroke="#38BDF8" strokeLinejoin="round" strokeWidth="3">
                  <path d="M10.308 5L18 17.5 10.308 30 2.615 17.5 10.308 5z"></path>
                  <path d="M18 17.5L10.308 5h15.144l7.933 12.5M18 17.5h15.385L25.452 30H10.308L18 17.5z"></path>
                </g>
              </svg> */}
              {theme === "light" ? (
                <RemixLight className="h-10 -ml-2 lg:hidden w-11 fill-slate-700" fill="fill-slate-700" />
              ) : (
                <RemixDark className="h-10 -ml-2 lg:hidden w-11 fill-sky-100" fill="fill-sky-100" />
              )}
              {theme === "light" ? (
                <RemixLight className="hidden w-10 h-9 fill-slate-700 lg:block" fill="fill-slate-700" />
              ) : (
                <RemixDark className="hidden w-10 h-9 fill-sky-100 lg:block" fill="fill-sky-100" />
              )}
              <p className="hidden lg:flex font-[Benzin] font-bold text-slate-700 dark:text-sky-100 content-end text-2xl top-[3px] relative -ml-2.5 leading-10 tracking-wide">
                emix&nbsp;
                <span className="text-transparent text-[26px] top-[1.5px] bg-clip-text bg-gradient-to-tr from-indigo-500 dark:from-indigo-400 to-sky-300 dark:to-sky-200">
                  PWA
                </span>
              </p>
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
              <label className="sr-only">Theme</label>
              <div className="relative z-10">
                <ClientOnly
                  children={() => (
                    <button
                      className="flex items-center justify-center w-6 h-6 rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
                      onClick={() => {
                        if (theme === "light") {
                          setTheme("dark");
                          fetcher.submit({ theme: "dark" }, { method: "post", action: "/updateUserTheme" });
                        } else if (theme === "dark") {
                          setTheme("light");
                          fetcher.submit({ theme: "light" }, { method: "post", action: "/updateUserTheme" });
                        }
                      }}
                    >
                      {theme && theme === "light" ? (
                        <SunIcon className="w-4 h-4 fill-sky-400" />
                      ) : theme && theme === "dark" ? (
                        <MoonIcon className="w-4 h-4 fill-sky-400" />
                      ) : (
                        <p></p>
                      )}
                    </button>
                  )}
                />
              </div>
              <a
                className="group"
                aria-label="GitHub"
                href="https://github.com/remix-pwa/remix-pwa"
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
