import { mdxToHtml } from "~/utils/server/mdx.server";
import { ClientOnly } from "remix-utils";
import { useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";
import { getPostContent } from "~/utils/server/github.server";
import Skeleton from "~/components/layout/Skeleton";
import { Doc } from "~/components/layout/Documentation";
import type { V2_ErrorBoundaryComponent } from "@remix-run/react/dist/routeModules";
import PwaSlugErorr from "./PwaSlugError";
import { typedjson } from "remix-typedjson";

export const loader = async ({ params }: LoaderArgs) => {
  /*  const _s = `
  ---
title: Example Post
published: 2021-02-13
description: This is some description
prompt: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt, sint officia distinctio sapiente magnam porro. Asperiores voluptatum ea adipisci eveniet?
---

import Warn from './warn.tsx'
import { json } from '@remix-run/node';
import { validateSlug } from '../../utils/server/github.server';

Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium magni aspernatur illo dicta. Mollitia commodi sint cumque dolorum eveniet obcaecati fuga atque porro, 
tempora libero, fugit excepturi hic nulla quo unde voluptatum aspernatur animi voluptates minus numquam magni quisquam. Maiores optio iusto asperiores accusamus!

  ## GFM
  
  ## Autolink literals

  :+1:

  ### Warning

  ### Another h3

  <Warn>Hello from MDX!</Warn>
  🎈
  
  www.example.com, https://example.com, and contact@example.com.
  
  ## Footnote

  ### Ahhh!
  
  A note[^1]
  
  [^1]: Big note.
  
  ## Strikethrough
  
  ~one~ or ~~two~~ tildes.
  
  ## Table
  
  | Item         | Price | # In stock |
  |--------------|:-----:|-----------:|
  | Juicy Apples |  1.99 |        739 |
  | Bananas      |  1.89 |          6 |
  
  ## Tasklist
  
  * [ ] to do
  * [x] done
  
  \`\`\`js {1,3-4} showLineNumbers
  function fancyAlert(arg) {
    if (arg) {
      $.facebox({ div: '#foo' })
    }
  }
  \`\`\`
  `.trim(); */

  const slug = params.slug;

  const doc = await getPostContent(slug!, "pwa");

  if (!doc) {
    console.error("Invalid slug: " + slug!);

    throw typedjson(null, { status: 404, statusText: "Oops! This page could not be found." });
  }

  const code = await mdxToHtml(doc);

  return typedjson(code);
};

export default function DocPage() {
  return <ClientOnly fallback={<Skeleton />} children={() => <Doc />} />;
}

export const ErrorBoundary: V2_ErrorBoundaryComponent = () => {
  let error = useRouteError();
  if (isRouteErrorResponse(error)) return <PwaSlugErorr status={error.status} statusText={error.statusText} />;
  if (error instanceof Error)
    return <PwaSlugErorr status={500} statusText={`Message: ${error.message}. Stack: ${error.stack}`} />;
  return <h1>An Unknown Error Occurred</h1>;
};
