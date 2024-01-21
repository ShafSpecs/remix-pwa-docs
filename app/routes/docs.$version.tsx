import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import slugify from "@sindresorhus/slugify";
import { useEffect, useReducer } from "react";
import RootReducer from "~/rootReducer";
import { getPostMetaData } from "~/utils/server/aws.server";
import type { PrevOrNextLink, UpdateLinks } from "~/root";
import type { FrontMatterTypings } from "~/types/mdx";
import { RootContext } from "~/utils/providers/RootProvider";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const version = params.version ?? "main";

  const meta = (await getPostMetaData(version)) ?? [];

  return json({ meta, version }, {
    headers: {
      "Cache-Control": "public, max-age=84600",
    }
  });
}

export default function VersionIndex() {
  const location = useLocation();
  const { meta, version } = useLoaderData<typeof loader>();
  const [state, dispatch] = useReducer(RootReducer, { prev: null, next: null });

  const getPreviousAndNextRoute = (): UpdateLinks => {
    const currentRoute = location.pathname;

    let routes: FrontMatterTypings[] = [];
    routes = meta
      .map((route) => {
        return route.children;
      })
      .flat();

    const currentRouteIndex = routes.findIndex((route) => `/docs/${version}/${slugify(route.shortTitle)}` === currentRoute);

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

  useEffect(() => {
    const { prev, next } = getPreviousAndNextRoute();
    dispatch({ type: "updateLinks", payload: { prev, next } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <RootContext.Provider value={{ state, dispatch }}>
      <Outlet />
    </RootContext.Provider>
  )
}