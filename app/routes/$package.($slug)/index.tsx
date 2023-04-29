import type { LoaderArgs } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { typedjson } from "remix-typedjson";
import { ClientOnly } from "remix-utils";
import GeneralError from "~/components/GeneralError";
import { Doc } from "~/components/layout/Documentation";
import Skeleton from "~/components/layout/Skeleton";
import { RequireParam } from "~/utils/ParamHelpers";
import { getPostContent } from "~/utils/server/github.server";
import { mdxToHtml } from "~/utils/server/mdx.server";

// Really Looks like we want a very general approach to loading the MDX files. If so we can do a double param.
export type ValidPackages = "client" | "push" | "pwa" | "sw";
interface TypeGuardReadonlyArray<T> extends ReadonlyArray<T> {
  includes(searchElement: unknown, fromIndex?: number): searchElement is T;
}
// This is a string literal coercion. We can use this to make sure that the package string we return is valid.
export type PackageData = {
  name: string;
  slug: ValidPackages;
  comingSoon: boolean;
  position: number;
};

export const valid_packages = ["client", "push", "pwa", "sw"] as unknown as TypeGuardReadonlyArray<ValidPackages>;

export const packages: Record<ValidPackages, PackageData> = {
  pwa: { name: "remix-pwa", slug: "pwa", comingSoon: false, position: 0 },
  sw: { name: "@remix-pwa/sw", slug: "sw", comingSoon: false, position: 1 },
  push: { name: "@remix-pwa/push", slug: "push", comingSoon: true, position: 2 },
  client: { name: "@remix-pwa/client", slug: "client", comingSoon: true, position: 3 }
};

export const loader = async ({ params }: LoaderArgs) => {
  const package_string = RequireParam(params, "package");
  const slug = params.slug;
  if (valid_packages.includes(package_string)) {
    const doc = await getPostContent(package_string, slug);
    if (!doc) {
      console.error(`Invalid Slug: ${slug}`);
      throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
    }

    const code = await mdxToHtml(doc);

    return typedjson(code, 200);
  }
  throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
};

export default function DocPage() {
  return <ClientOnly fallback={<Skeleton />} children={() => <Doc />} />;
}

export const ErrorBoundary = () => {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) 
    return <GeneralError status={error.status} statusText={error.statusText} />;
  
  if (error instanceof Error)
    return <GeneralError status={500} statusText={`Message: ${error.message}. Stack: ${error.stack}`} />;

  return <h1>An Unknown Error Occurred</h1>;
};
