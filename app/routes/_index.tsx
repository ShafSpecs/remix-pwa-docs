/* eslint-disable react/jsx-pascal-case */
import { getPostContent } from "~/utils/server/github.server";
import { mdxToHtml } from "~/utils/server/mdx.server";
import { ClientOnly } from "remix-utils";
import Skeleton from "~/components/layout/Skeleton";

import { typedjson } from "remix-typedjson";
import IndexComponent from "~/components/layout/Index";

export const loader = async () => {
  const doc: string | null = await getPostContent("pwa", "intro");

  if (doc === null) {
    throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
  }

  const code = await mdxToHtml(doc);

  return typedjson(code, 200);
};

export default function IndexRoute() {
  return <ClientOnly fallback={<Skeleton />} children={() => <IndexComponent />} />;
}
