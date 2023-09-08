/* eslint-disable react/display-name */
import { Disclosure } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { useWindowSize } from "usehooks-ts";
import { useTheme } from "~/utils/providers/ThemeProvider";
import { useSidebar } from "~/utils/providers/SidebarProvider";
import { ToggleTheme } from "./ToggleTheme";
import MobileSidebar from "./MobileSidebar";
import RemixLogo from "./RemixLogo";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";

type HeaderProps = {
  scrollTop: number;
};

export const ClientHeader = () => {
  const [theme,] = useTheme();

  return (
    <Disclosure
      as="header"
      id="header__main"
      className={`sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-300 dark:shadow-none sm:px-6 lg:px-8 dark:bg-transparent`}
    >
      {({ open }) => (
        <>
          <div className="flex content-center mr-6 lg:hidden">
            {/* Mobile menu button*/}
            <Disclosure.Button className="relative focus:outline-none focus:ring-0" onClick={() => { }}>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block w-6 h-6 stroke-2 stroke-slate-500" aria-hidden="true" />
            </Disclosure.Button>
          </div>
          <div className="relative flex items-center flex-grow basis-0">
            <Link aria-label="Home page" to="/" className="lg:flex">
              <RemixLogo mobile height="h-10" width="w-11" />
              <RemixLogo height="h-9" width="w-10" />

              <p
                className="hidden lg:flex font-[Benzin] font-bold text-slate-700 dark:text-sky-100 text-2xl relative -ml-2.5"
                style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', top: '5.25px' }}
              >
                emix&nbsp;
                <span style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }} className="text-transparent text-[26px] top-[1.5px] bg-clip-text bg-gradient-to-tr from-indigo-500 dark:from-indigo-400 to-sky-300 dark:to-sky-200">
                  PWA
                </span>
              </p>
            </Link>
          </div>
          <div className="mr-6 -my-5 sm:mr-8 md:mr-0">
            <button
              type="button"
              className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
            >
              <MagnifyingGlassIcon className="flex-none w-5 h-5 fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" />
              <span className="select-none sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
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
                <button
                  className="flex items-center justify-center w-6 h-6 rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
                  onClick={() => {}}
                >
                  {theme === "light" && <SunIcon className="w-4 h-4 fill-sky-400" />}
                  {theme === "dark" && <MoonIcon className="w-4 h-4 fill-sky-400" />}
                </button>
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
  )
}

export default ({ scrollTop }: HeaderProps) => {
  const [theme] = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setClosed] = useSidebar();
  const { width } = useWindowSize();
  const location = useLocation();

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
      className={`sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-300 dark:shadow-none sm:px-6 lg:px-8 ${scrollTop > 20 && theme == "dark"
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
          <MobileSidebar />

          <div className="relative flex items-center flex-grow basis-0">
            <Link aria-label="Home page" to="/" className="lg:flex">
              <RemixLogo mobile height="h-10" width="w-11" />
              <RemixLogo height="h-9" width="w-10" />

              <p
                className="hidden lg:flex font-[Benzin] font-bold text-slate-700 dark:text-sky-100 text-2xl relative -ml-2.5"
                style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', top: '5.25px' }}
              >
                emix&nbsp;
                <span style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }} className="text-transparent text-[26px] top-[1.5px] bg-clip-text bg-gradient-to-tr from-indigo-500 dark:from-indigo-400 to-sky-300 dark:to-sky-200">
                  PWA
                </span>
              </p>
            </Link>
          </div>
          <div className="mr-6 -my-5 sm:mr-8 md:mr-0">
            <button
              type="button"
              className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
            >
              <MagnifyingGlassIcon className="flex-none w-5 h-5 fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" />
              <span className="select-none sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
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
                <ToggleTheme />
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
