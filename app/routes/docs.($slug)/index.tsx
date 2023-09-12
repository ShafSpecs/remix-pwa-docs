import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { redirect, typedjson } from "remix-typedjson";
import { ClientOnly } from "remix-utils";
import GeneralError from "~/components/GeneralError";
import { Doc } from "~/components/layout/Documentation";
import Skeleton from "~/components/layout/Skeleton";
import { getPostContent } from "~/utils/server/github.server";
import { mdxToHtml } from "~/utils/server/mdx.server";

// export const loader = async ({ params }: LoaderArgs) => {
//   const slug = params.slug;

//   if (slug == undefined || slug == "") {
//     return redirect("/docs/installation");
//   }

//   const doc = await getPostContent(slug);

//   if (!doc) {
//     console.error(`Invalid Slug: ${slug}`);
//     throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
//   }

//   const code = await mdxToHtml(doc);

//   return typedjson({ ...code, slug }, 200);
// };

// export const meta: MetaFunction = ({ data }) => {
//   return {
//     title: `${data.slug ? data.slug[0].toUpperCase() + data.slug.substr(1) + " | " : ""}Remix Docs`,
//     description: `${data.code && data.frontmatter.description}`,
//   }
// };

export default function DocPage() {
  return <ClientOnly fallback={<Skeleton />} children={() => (<p>Component</p>)} />;
}

export const ErrorBoundary = () => {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) return <GeneralError status={error.status} statusText={error.statusText} />;

  if (error instanceof Error)
    return <GeneralError status={500} statusText={`Message: ${error.message}. Stack: ${error.stack}`} />;

  return <h1>An Unknown Error Occurred</h1>;
};
