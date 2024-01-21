import { useEffect, type ReactNode, useCallback } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useBeforeUnload,
  useLoaderData,
  useLocation,
  useNavigation,
  useRouteError
} from "@remix-run/react";
import { StopFOUC, type Theme, ThemeProvider, useTheme } from "./utils/providers/ThemeProvider";
import { SidebarProvider, useSidebar } from "./utils/providers/SidebarProvider";

import tailwind from "./tailwind.css";
import fonts from "./styles/fonts.css";
import docs from "./styles/docs.css";

import { GetTheme } from "./session.server";
import type { FrontMatterTypings } from "./types/mdx";

import { type LinksFunction, type MetaFunction, type LoaderFunctionArgs, json } from "@remix-run/node";
import { cssBundleHref } from "@remix-run/css-bundle";
import { LiveReload, useSWEffect } from "@remix-pwa/sw";
import type { ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import { pageview } from "./utils/client/gtag.client";

export type PrevOrNextLink = FrontMatterTypings | null;

export type UpdateLinks = { prev: PrevOrNextLink; next: PrevOrNextLink };

export type RootOutletContext = UpdateLinks;

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwind },
    { rel: "stylesheet", href: docs },
    { rel: "stylesheet", href: fonts },
    ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const theme = await GetTheme(request);

  return json(
    { meta, theme, gaTrackingId: process.env.GOOGLE_ANALYTICS_ID ?? '' },
    {
      headers: {
        "Cache-Control": "public, max-age=84600",
      }
    }
  );
};

export const meta: MetaFunction = () => {
  return [
    { name: "charset", content: "utf-8" },
    { title: "Remix PWA Docs" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    { name: "keywords", content: "Remix,ShafSpecs,Remix PWA,Remix PWA Docs,Remix PWA Documentation,Remix PWA Documentation,remix-pwa,remix-pwa-docs,@remix-pwa,v3" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: "@ShafSpecs" },
    { name: "twitter:title", content: "Remix PWA Docs" },
    { name: "twitter:image", content: "https://ucarecdn.com/43135828-6822-4549-a0b7-23219e7353d1/-/preview/1200x630/-/quality/smart_retina/-/format/auto/" },
    { name: "og:title", content: "Remix PWA Docs" },
    { name: "og:type", content: "website" },
    { name: "og:url", content: "https://remix-pwa.run" },
    { name: "twitter:description", content: "The home of Remix PWA. Enhance your Remix application with PWA functionalities like never before." },
    { name: "og:locale", content: "en_US" },
    { name: "og:image", content: "https://ucarecdn.com/43135828-6822-4549-a0b7-23219e7353d1/-/preview/1200x630/-/quality/smart_retina/-/format/auto/" },
    { name: "og:image:url", content: "https://ucarecdn.com/43135828-6822-4549-a0b7-23219e7353d1/-/preview/1200x630/-/quality/smart_retina/-/format/auto/" },
    { name: "og:image:secure_url", content: "https://ucarecdn.com/43135828-6822-4549-a0b7-23219e7353d1/-/preview/1200x630/-/quality/smart_retina/-/format/auto/" },
    { name: "og:image:alt", content: "Remix PWA Documentation", },
    { name: "og:image:width", content: "1200", },
    { name: "og:image:height", content: "630", },
    { name: "og:image:type", content: "image/png", },
    { name: "og:description", content: "The home of Remix PWA. Enhance your Remix application with PWA functionalities like never before.", },
  ]
};

function ElementScrollRestoration({
  elementQuery,
  ...props
}: { elementQuery: string } & React.HTMLProps<HTMLScriptElement>) {
  const STORAGE_KEY = `position:${elementQuery}`
  const navigation = useNavigation()
  const location = useLocation()

  const updatePositions = useCallback(() => {
    const element = document.querySelector(elementQuery)
    if (!element) return
    let positions = {}
    try {
      const rawPositions = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || '{}',
      )
      if (typeof rawPositions === 'object' && rawPositions !== null) {
        positions = rawPositions
      }
    } catch (error) {
      console.warn(`Error parsing scroll positions from sessionStorage:`, error)
    }
    const newPositions = {
      ...positions,
      [location.key]: element.scrollTop,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newPositions))
  }, [STORAGE_KEY, elementQuery, location.key])

  useEffect(() => {
    if (navigation.state === 'idle') {
      const element = document.querySelector(elementQuery)
      if (!element) return
      try {
        const positions = JSON.parse(
          sessionStorage.getItem(STORAGE_KEY) || '{}',
        ) as any
        const storedY = positions[window.history.state.key]
        if (typeof storedY === 'number') {
          element.scrollTop = storedY
        }
      } catch (error: unknown) {
        console.error(error)
        sessionStorage.removeItem(STORAGE_KEY)
      }
    } else {
      updatePositions()
    }
  }, [STORAGE_KEY, elementQuery, navigation.state, updatePositions])

  useBeforeUnload(() => {
    updatePositions()
  })

  function restoreScroll(storageKey: string, elementQuery: string) {
    const element = document.querySelector(elementQuery)
    if (!element) {
      console.warn(`Element not found: ${elementQuery}. Cannot restore scroll.`)
      return
    }
    if (!window.history.state || !window.history.state.key) {
      const key = Math.random().toString(32).slice(2)
      window.history.replaceState({ key }, '')
    }
    try {
      const positions = JSON.parse(
        sessionStorage.getItem(storageKey) || '{}',
      ) as any
      const storedY = positions[window.history.state.key]
      if (typeof storedY === 'number') {
        element.scrollTop = storedY
      }
    } catch (error: unknown) {
      console.error(error)
      sessionStorage.removeItem(storageKey)
    }
  }
  return (
    <script
      {...props}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(${restoreScroll})(${JSON.stringify(
          STORAGE_KEY,
        )}, ${JSON.stringify(elementQuery)})`,
      }}
    />
  )
}

/**
 * @description Separate out main styles and desired components from the App component so that we have a baseline for any errors that happen.
 *
 * @param children - The children of the document
 * @param ssr_theme - The theme that is set on the server
 *
 * @returns The main styles and components of the app
 */
const MainDocument = ({ children, ssr_theme, gaTrackingId }: { children: ReactNode; ssr_theme: Theme | null, gaTrackingId: string | null }) => {
  const [theme] = useTheme();
  const [closed] = useSidebar();
  useSWEffect();

  return (
    <html lang="en" className={`antialiased ${theme || ""}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#2b5797" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
        {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js',new Date());
                gtag('config','${gaTrackingId}',{page_path: window.location.pathname});`,
              }}
            />
          </>
        )}
        <Links />
        <StopFOUC ssr_theme={ssr_theme !== null} />
      </head>
      <body
        className={`${!closed && "overflow-hidden"
          } bg-white scroll-smooth antialiased dark:bg-slate-900`}
      >
        {children}
        <ScrollRestoration />
        <ElementScrollRestoration elementQuery="[data-restore-scroll='true']" />
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
const MainDocumentWithProviders = ({ ssr_theme, children, gaTrackingId }: { ssr_theme: Theme | null; children: ReactNode, gaTrackingId: string | null }) => {
  return (
    <ThemeProvider ssr_theme={ssr_theme}>
      <SidebarProvider>
        <MainDocument ssr_theme={ssr_theme} gaTrackingId={gaTrackingId}>{children}</MainDocument>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default function App() {
  const { theme, gaTrackingId } = useLoaderData<typeof loader>();
  let location = useLocation();

  useEffect(() => {
    if (gaTrackingId) {
      pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  return (
    <MainDocumentWithProviders ssr_theme={theme} gaTrackingId={gaTrackingId}>
      <Outlet />
    </MainDocumentWithProviders>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
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
    <MainDocumentWithProviders gaTrackingId={null} ssr_theme={null}>
      <h1>Status: {message}</h1>
      <h2>StatusText: {stack}</h2>
    </MainDocumentWithProviders>
  );
};
