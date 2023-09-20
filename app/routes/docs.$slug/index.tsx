import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { redirect, typedjson } from "remix-typedjson";
import { ClientOnly } from "remix-utils";
import GeneralError from "~/components/GeneralError";
import { Doc } from "~/components/layout/Documentation";
import Skeleton from "~/components/layout/Skeleton";
import { getPostContent } from "~/utils/server/aws.server";
import { mdxToHtml } from "~/utils/server/mdx.server";

export const loader = async ({ params }: LoaderArgs) => {
  const slug = params.slug;

  if (slug == undefined || slug == "") {
    return redirect("/docs/installation");
  }

  const doc = await getPostContent(slug);

  if (!doc) {
    console.error(`Invalid Slug: ${slug}`);
    throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
  }
  
  const code = await mdxToHtml(doc);

  return typedjson({ ...code, slug }, {
    headers: {
      "Cache-Control": "public, max-age=18000",
    },
    status: 200
  });
}; 

export const meta: MetaFunction = ({ data }) => {
  const { title, description }: { title: string, description: string } = data.frontmatter;

  const url = new URL("https://remix-pwa.run/og-image");
  url.searchParams.set("title", title);
  url.searchParams.set("description", description);

  return {
    title: data.code ? `${title} - Remix PWA` : "Remix PWA",
    description: `${data.code && description}`,
    "og:title": data.code ? `${title} - Remix PWA` : "Remix PWA",
    "og:description": `${data.code && description}`,
    "og:image": url.href,
    "og:image:url": url.href,
    "og:image:secure_url": url.href,
    "og:image:alt": title,
    "og:image:type": "image/png",
    "og:image:width": "1200",
    "og:image:height": "630",
    "twitter:title": data.code ? `${title} - Remix PWA` : "Remix PWA",
    "twitter:description": `${data.code && description}`,
    "twitter:image": url.href,
    "twitter:image:alt": title,
    "twitter:card": "summary_large_image",
  }
};

export default function DocPage() {
  return <ClientOnly fallback={<Skeleton />} children={() => <Doc />} />;
}

export const ErrorBoundary = () => {
  let error = useRouteError();

  if (isRouteErrorResponse(error)) return <GeneralError status={error.status} statusText={error.statusText} />;

  if (error instanceof Error)
    return <GeneralError status={500} statusText={`Message: ${error.message}. Stack: ${error.stack}`} />;

  return <h1>An Unknown Error Occurred</h1>;
};
