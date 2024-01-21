import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
//@ts-ignore
import { ClientOnly } from "remix-utils/client-only";
import GeneralError from "~/components/GeneralError";
import { Doc } from "~/components/layout/Documentation";
import Skeleton from "~/components/layout/Skeleton";
import { getPostContent } from "~/utils/server/aws.server";
import { mdxToHtml } from "~/utils/server/mdx.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const version = params.version;
  const slug = params.slug;

  if (slug == undefined || slug == "") {
    return redirect("/docs/main/installation");
  }

  const doc = await getPostContent(slug, version);

  if (!doc) {
    console.error(`Invalid Slug: ${slug}`);
    throw json(null, { status: 404, statusText: "Oops! This page could not be found." });
  }
  
  const code = await mdxToHtml(doc);

  return json({ ...code, slug, version }, {
    headers: {
      "Cache-Control": "public, max-age=600",
    },
    status: 200
  });
};

// export const meta: MetaFunction = ({ data }: { data: any }) => {
//   const { title, description }: { title: string, description: string } = data.frontmatter;

//   const url = new URL("https://remix-pwa.run/og-image");
//   url.searchParams.set("title", title);
//   url.searchParams.set("description", description);

//   return [
//     {title: data.code ? `${title} - Remix PWA` : "Remix PWA"},
//     {name: "description", content: `${data.code && description}`,},
//     {property: "og:title", content: data.code ? `${title} - Remix PWA` : "Remix PWA",},
//     {property: "og:description", content: `${data.code && description}`,},
//     {property: "og:image", content: url.href,},
//     {property: "og:image:url", content: url.href,},
//     {property: "og:image:secure_url", content: url.href,},
//     {property: "og:image:alt", content: title,},
//     {property: "og:image:type", content: "image/png",},
//     {property: "og:image:width", content: "1200",},
//     {property: "og:image:height", content: "630",},
//     {property: "twitter:title", content: data.code ? `${title} - Remix PWA` : "Remix PWA",},
//     {property: "twitter:description", content: `${data.code && description}`,},
//     {property: "twitter:image", content: url.href,},
//     {property: "twitter:image:alt", content: title,},
//     {property: "twitter:card", content: "summary_large_image",},
//   ]
// };

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
