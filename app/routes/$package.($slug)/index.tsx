import type { LoaderArgs } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { ClientOnly } from "remix-utils";
import GeneralError from "~/components/GeneralError";
import { Doc } from "~/components/layout/Documentation";
import IndexComponent from "~/components/layout/Index";
import Skeleton from "~/components/layout/Skeleton";
import { valid_packages } from "~/utils/PackageHelpers";
import { RequireParam } from "~/utils/ParamHelpers";
import { getPostContent } from "~/utils/server/github.server";
import { mdxToHtml } from "~/utils/server/mdx.server";

export const loader = async ({ params }: LoaderArgs) => {
  const package_string = RequireParam(params, "package");
  const slug = params.slug;

  if (slug == undefined && package_string == "pwa") {
    return redirect("/");
  }

  if (valid_packages.includes(package_string)) {
    const doc = await getPostContent(package_string, slug);
    if (!doc) {
      console.error(`Invalid Slug: ${slug}`);
      throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
    }

    const code = await mdxToHtml(doc);

    return typedjson({ ...code, slug }, 200);
  }

  throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
};

export default function DocPage() {
  const { slug } = useTypedLoaderData<typeof loader>();
  return <ClientOnly fallback={<Skeleton />} children={() => (slug ? <Doc /> : <IndexComponent />)} />;
}

export const ErrorBoundary = () => {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) return <GeneralError status={error.status} statusText={error.statusText} />;

  if (error instanceof Error)
    return <GeneralError status={500} statusText={`Message: ${error.message}. Stack: ${error.stack}`} />;

  return <h1>An Unknown Error Occurred</h1>;
};
