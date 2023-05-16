import { useState, useEffect, type ReactNode, useReducer } from "react";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
  useRouteError
} from "@remix-run/react";
import { type MetaDataObject, getPostMetaData } from "./utils/server/github.server";
import { ClientOnly } from "remix-utils";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Hero from "./components/Hero";
import Header from "./components/Header";
import { StopFOUC, type Theme, ThemeProvider, useTheme } from "./utils/providers/ThemeProvider";
import { SidebarProvider, useSidebar } from "./utils/providers/SidebarProvider";
import { Analytics } from "@vercel/analytics/react"

import type { LinksFunction, MetaFunction } from "@remix-run/node";
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import type { LoaderArgs } from "@remix-run/node";

// Imported this way because unstable_tailwindcss flag in remix.config.js (https://tailwindcss.com/docs/guides/remix)
import tailwind from "./tailwind.css";

import appcss from "./styles/app.css";
import theme from "./styles/night-owl.css";
import prism from "./styles/code.css";
import { GetTheme } from "./session.server";
import type { FrontMatterTypings } from "./types/mdx";
import NavItem from "./components/NavItem";
import RouteListBox from "./components/RouteListBox";
import RootReducer from "./rootReducer";
import { type ValidPackages, packages, valid_packages } from "./utils/PackageHelpers";
import { RootContext } from "./utils/providers/RootProvider";

export type PrevOrNextLink = FrontMatterTypings | null;

export type UpdateLinks = { prev: PrevOrNextLink; next: PrevOrNextLink };

export type RootOutletContext = { prev: PrevOrNextLink; next: PrevOrNextLink };

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwind },
    { rel: "stylesheet", href: appcss },
    { rel: "stylesheet", href: theme },
    { rel: "stylesheet", href: prism }
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const meta_nullable = await getPostMetaData();
  const theme = await GetTheme(request);

  // can add session theme data here if we want to store that. Otherwise, just using the regular script tag in the document works.
  if (meta_nullable) {
    const meta = meta_nullable.reduce(
      (prev: Record<ValidPackages, Array<MetaDataObject>>, next) => {
        prev[next.slug] = next.children;
        return prev;
      },
      {
        client: [],
        pwa: [],
        sw: [],
        push: []
      }
    );

    return typedjson(
      { meta, theme },
      {
        headers: {
          "Cache-Control": "max-age=0, s-maxage=86400"
        }
      }
    );
  }
  // throw error? How necessary is meta? Seems pretty necessary.
  // Depending on how much we need meta, we can just return null and handle it where meta would go.
  throw new Error("Uh oh! Something went wrong!");
};

export const meta: MetaFunction = () => {
  return {
    charset: "utf-8",
    title: "Remix PWA Docs",
    viewport: "width=device-width,initial-scale=1",
    keywords: "Remix,ShafSpecs,Remix PWA,Remix PWA Docs,Remix PWA Documentation,Remix PWA Documentation,remix-pwa,remix-pwa-docs,@remix-pwa",
    "twitter:image": "https://ucarecdn.com/87064c0f-8145-4d65-a3bb-aa4f8bfc9d2a/",
    "og:image": "https://ucarecdn.com/87064c0f-8145-4d65-a3bb-aa4f8bfc9d2a/",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@ShafSpecs",
    "twitter:title": "Remix PWA Docs",
    "og:title": "Remix PWA Docs",
    "og:type": "website",
    "og:url": "https://remix-pwa-docs.vercel.app",
    "twitter:description": "Progressively enhance your Remix application with PWA features like never before.",
    "og:locale": "en_US",
    "og:image:alt": "Remix PWA Documentation",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "og:image:secure_url": "https://ucarecdn.com/87064c0f-8145-4d65-a3bb-aa4f8bfc9d2a/",
    "og:image:url": "https://ucarecdn.com/87064c0f-8145-4d65-a3bb-aa4f8bfc9d2a/",
    "og:description": "Progressively enhance your Remix application with PWA features like never before.",
  }
};

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/icons/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/icons/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icons/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/icons/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/icons/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icons/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/icons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/resources/manifest.webmanifest" />
        <Links />
        <StopFOUC ssr_theme={ssr_theme !== null} />
      </head>
      <body
        className={`${!closed && "overflow-hidden"
          } bg-white transition-colors scroll-smooth duration-300 font-inter font-feature-text ss01 dark:bg-slate-900`}
      >
        {children}
        <ScrollRestoration />
        <Analytics />
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

  const split = location.pathname.split("/");
  let package_route = split[1];

  if (!package_route) {
    package_route = "pwa";
  }
  const GetInitialSelected = () => {
    let selected = packages.pwa;
    if (valid_packages.includes(package_route)) {
      selected = packages[package_route];
    }
    return { selected, prev: null, next: null };
  };

  // mainly using a reducer here to minimize state updates. Probably why we previously used an tuple of [prev,next] instead.
  const [state, dispatch] = useReducer(RootReducer, GetInitialSelected());

  const { selected } = state;

  const getPreviousAndNextRoute = (): UpdateLinks => {
    const currentRoute = location.pathname;
    // fix types later on
    let routes: FrontMatterTypings[] = [];
    if (valid_packages.includes(package_route)) {
      routes = meta[package_route]
        .map((route) => {
          return route.children;
        })
        .flat();
    }

    const currentRouteIndex = routes.findIndex((route) => route.slug === currentRoute);

    // Updated PrevOrNextLink type definition to be FrontMatterTypings | null
    let nextRoute: PrevOrNextLink = null;
    let prevRoute: PrevOrNextLink = null;

    if (currentRouteIndex < routes.length - 1) {
      nextRoute = routes[currentRouteIndex + 1];
    }

    if (currentRouteIndex > 0) {
      prevRoute = routes[currentRouteIndex - 1];
    }

    return { prev: prevRoute, next: nextRoute };
  };

  const [scrollTop, setScrollTop] = useState(0);

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
    if (valid_packages.includes(package_route)) {
      const { prev, next } = getPreviousAndNextRoute();
      const selected = packages[package_route];
      dispatch({ type: "updateLinks", payload: { selected, prev, next } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <MainDocumentWithProviders ssr_theme={theme}>
      <RootContext.Provider value={{ state, dispatch }}>
        <ClientOnly
          fallback={<></>}
          children={
            () => <Header scrollTop={scrollTop} />
            // Todo: Create a fallback component
          }
        />
        {(location.pathname === "/" || location.pathname === "/pwa" || location.pathname === "/pwa/") && <Hero />}
        <div className="relative flex justify-center mx-auto max-w-[88rem] body sm:px-2 lg:px-8 xl:px-12">
          <div className="hidden ml-5 lg:relative lg:block lg:flex-none">
            <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
            <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-slate-800 dark:block"></div>
            <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-slate-800 dark:block"></div>
            <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
              <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
                <RouteListBox />
                <ul className="space-y-9">
                  {meta[selected.slug].map((el, i) => (
                    <NavItem key={`${i}-${el.name}`} {...el} />
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          <Outlet />
        </div>
      </RootContext.Provider>
    </MainDocumentWithProviders>
  );
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  const error = useRouteError();
  let message: string | number = "";
  let stack: undefined | string = "";
  if (error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }
  if (isRouteErrorResponse(error)) {
    message = error.status;
    stack = error.statusText;
  }
  return (
    <MainDocumentWithProviders ssr_theme={null}>
      <h1>Status: {message}</h1>
      <h2>StatusText: {stack}</h2>
    </MainDocumentWithProviders>
  );
};
