import { useState, useEffect, Fragment, type ReactNode, useReducer } from "react";
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate
} from "@remix-run/react";
import { getPostMetaData } from "./utils/server/github.server";
import { ClientOnly } from "remix-utils";
import { Listbox, Transition } from "@headlessui/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Hero from "./components/hero";
import Header from "./components/header";
import { StopFOUC, type Theme, ThemeProvider, useTheme } from "./utils/providers/ThemeProvider";
import { SidebarProvider, useSidebar } from "./utils/providers/SidebarProvider";

import type { LinksFunction } from "@remix-run/node";
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";

import styles from "./styles/app.css";
import theme from "./styles/night-owl.css";
import prism from "./styles/code.css";
import { GetTheme } from "./session.server";
import RootReducer from "./rootReducer";
import { packages, valid_packages } from "./routes/$package.($slug)";
import { FrontMatterTypings } from "./types/mdx";

let isMount = true;

export type PrevOrNextLink = {
  slug: string;
  title: string;
} | null;

export type UpdateLinks = { prev: PrevOrNextLink; next: PrevOrNextLink };

export type RootOutletContext = { prev: PrevOrNextLink; next: PrevOrNextLink };

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: theme },
    { rel: "stylesheet", href: prism }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  let meta = await getPostMetaData();
  const theme = await GetTheme(request);

  // When reading from file system, `meta` is returned as a string,
  // so we need to parse it into an object.
  if (meta && typeof meta === "string") meta = JSON.parse(meta);

  // can add session theme data here if we want to store that. Otherwise, just using the regular script tag in the document works.
  if (meta)
    return typedjson(
      { meta, theme },
      {
        headers: {
          "Cache-Control": "max-age=0, s-maxage=86400"
        }
      }
    );
  // throw error? How necessary is meta? Seems pretty necessary.
  // Depending on how much we need meta, we can just return null and handle it where meta would go.
  throw new Error("Uh oh! Something went wrong!");
};

export const meta: V2_MetaFunction = () => [
  {
    charset: "utf-8",
    title: "Remix PWA Docs",
    viewport: "width=device-width,initial-scale=1"
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * @description Separate out main styles and desired components from the App component so that we have a baseline for any errors that happen.
 *
 * @param children - The children of the document
 * @param ssr_theme - The theme that is set on the server
 *
 * @returns The main styles and components of the app
 */
const MainDocument = ({ children, ssr_theme }: { children: ReactNode; ssr_theme: Theme | null }) => {
  const [theme] = useTheme();
  const [closed] = useSidebar();

  return (
    <html lang="en" className={`antialiased [font-feature-settings:'ss01'] ${theme || ""}`}>
      <head>
        <Meta />
        <Links />
        <StopFOUC ssr_theme={ssr_theme !== null} />
      </head>
      <body
        className={`${!closed && "overflow-hidden"
          } bg-white transition-colors duration-300 font-inter font-feature-text ss01 dark:bg-slate-900`}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

/**
 * @description Wrap the main document in the theme provider so that we can use the theme context on the html element.
 *
 * @param ssr_theme - The theme that is set on the server
 * @param children - The children of the document
 *
 * @returns
 */
const MainDocumentWithProviders = ({ ssr_theme, children }: { ssr_theme: Theme | null; children: ReactNode }) => {
  return (
    <ThemeProvider ssr_theme={ssr_theme}>
      <SidebarProvider>
        <MainDocument ssr_theme={ssr_theme}>{children}</MainDocument>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default function App() {
  const { meta, theme } = useTypedLoaderData<typeof loader>();
  let location = useLocation();
  const navigate = useNavigate();

  const getPreviousAndNextRoute = (): UpdateLinks => {
    const currentRoute = location.pathname;
    // fix types later on
    let routes: any[] = [];

    if (currentRoute === "/" || currentRoute.includes("/pwa")) {
      //@ts-ignore
      routes = meta[0].children.map((route) => { return route.children });
    } else if (currentRoute.includes("/sw")) {
      //@ts-ignore
      routes = meta[1].children.map((route) => { return route.children });
    } else if (currentRoute.includes("/push")) {
      //@ts-ignore
      routes = meta[2].children.map((route) => { return route.children });
    } else if (currentRoute.includes("/client")) {
      //@ts-ignore
      routes = meta[3].children.map((route) => { return route.children });
    }

    const childrenArr = [].concat(...routes);

    //@ts-ignore
    const currentRouteIndex = childrenArr.findIndex((route) => route.slug === currentRoute);

    let nextRoute: FrontMatterTypings | null = null;
    let prevRoute: FrontMatterTypings | null = null;

    if (currentRouteIndex < childrenArr.length - 1) {
      nextRoute = childrenArr[currentRouteIndex + 1];
    }

    if (currentRouteIndex > 0) {
      prevRoute = childrenArr[currentRouteIndex - 1];
    }

    return { prev: prevRoute, next: nextRoute };
  };

  // mainly using a reducer here to minimize state updates. Probably why we previously used an tuple of [prev,next] instead.
  const [{ selected }, dispatch] = useReducer(RootReducer, {
    selected: location.pathname.substring(0, 6).includes("client") ?
      packages.client :
      location.pathname.substring(0, 6).includes("push") ?
        packages.push :
        location.pathname.substring(0, 6).includes("sw") ?
          packages.sw : packages.pwa
  });

  const [scrollTop, setScrollTop] = useState(0);
  const [routes, setRoutes] = useState<UpdateLinks>({ prev: getPreviousAndNextRoute().prev, next: getPreviousAndNextRoute().next });

  const onScroll = (e: any): void => {
    setScrollTop(e.target.documentElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Run on mount and when location `pathname` changes only. 
  // Adding `selected` overrides the dispath call made on clicking the options, 
  // when we change the location. For some reason, the `selected` state is not updated
  // to the newer pathname but the old one. Used logs to confirm this. 
  useEffect(() => {
    const split = location.pathname.split("/");
    let package_route = split[1];
    
    if (package_route === "") {
      package_route = "pwa";
    }
    
    if (valid_packages.includes(package_route)) {
      const { prev, next } = getPreviousAndNextRoute();

      dispatch({ type: "updateLinks", payload: { selected: packages[package_route] } });
      setRoutes({ prev, next });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <MainDocumentWithProviders ssr_theme={theme}>
      <ClientOnly
        fallback={<></>}
        children={
          () => <Header scrollTop={scrollTop} selected={selected} packages={packages} />
          // Todo: Create a fallback component
        }
      />
      {(location.pathname === "/" || location.pathname === "/pwa" || location.pathname === "/pwa/") && <Hero />}
      <div className="relative flex justify-center mx-auto max-w-[88rem] sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden ml-5 lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
          <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-slate-800 dark:block"></div>
          <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-slate-800 dark:block"></div>
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
            <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
              <Listbox value={selected}>
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
                      {Object.values(packages).map((pkg, packageIdx) => (
                        <Listbox.Option
                          key={packageIdx}
                          disabled={pkg.comingSoon}
                          className={({ active }) =>
                            `relative select-none py-2 pl-10 pr-4 text-sm 
                              ${pkg.comingSoon
                              ? "text-sm cursor-not-allowed bg-slate-200 text-gray-800 dark:bg-slate-700 dark:text-gray-200"
                              : "cursor-pointer xl:text-base"
                            } 
                              ${active ? "bg-sky-100 text-sky-900" : "text-gray-900 dark:text-gray-200"}
                              `
                          }
                          value={pkg}
                          onClick={() => {
                            navigate(`/${pkg.slug}`);
                            dispatch({ type: "updateLinks", payload: { selected: packages[pkg.slug] } });
                          }}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                {pkg.name}{" "}
                                {pkg.comingSoon && (
                                  <span className="text-gray-400 text-baase dark:text-gray-500">🚧</span>
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
                {Array.isArray(meta)
                  ? meta[selected.position].children.map((el: any) => {
                    return (
                      <li key={el.name}>
                        <h2 className="font-medium font-display text-slate-900 dark:text-white">{el.name}</h2>
                        <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                          {el.children.map((sub: any) => {
                            return (
                              <li className="relative" key={sub.slug}>
                                <NavLink prefetch="render" to={sub.slug} end={true}>
                                  {({ isActive }) => (
                                    <span
                                      className={classNames(
                                        "block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                                        isActive
                                          ? "font-semibold text-sky-500 before:bg-sky-500"
                                          : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                                      )}
                                    >
                                      {sub.title}
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
                  : meta}
              </ul>
            </nav>
          </div>
        </div>
        <Outlet context={{ prev: routes.prev, next: routes.next }} />
      </div>
    </MainDocumentWithProviders>
  );
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  return (
    <MainDocumentWithProviders ssr_theme={null}>
      <h1>Uh oh!</h1>
    </MainDocumentWithProviders>
  );
};
