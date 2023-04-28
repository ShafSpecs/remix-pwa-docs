import { useMemo, useRef, useEffect, useState, Fragment } from "react";
import { mdxToHtml } from "~/utils/server/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { ClientOnly } from "remix-utils";
import type { CatchBoundaryComponent } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useOutletContext, useLocation } from "@remix-run/react";

import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { getPostContent } from "~/utils/server/github.server";
import Skeleton from "~/components/layout/Skeleton";
import { useIsFirstRender } from "usehooks-ts";
import { Doc } from "~/components/layout/Documentation";

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const _s = `
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
  `.trim();

  const slug = params.slug;

  const doc = await getPostContent(slug!, "push");
  if (!doc) {
    console.error("Invalid slug: " + slug!);

    throw json(null, { status: 404, statusText: "Oops! This page could not be found." });
  }

  const code = await mdxToHtml(doc);

  return code;
};

export default function DocPage() {
  const loaderData = useLoaderData();
  //@ts-ignore
  const [next] = useOutletContext();

  return (
    <ClientOnly
      fallback={<Skeleton />}
      children={() => <Doc next={next} code={loaderData.code} frontmatter={loaderData.frontmatter} />}
    />
  );
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return (
    <div id="catch-doc" className="flex-auto max-w-2xl min-w-0 px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      <article>
        <main className="prose prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800">
          {caught.status} | {caught.statusText}
        </main>
      </article>
      <dl className="flex pt-6 mt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="ml-auto text-right">
          <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">Next</dt>
          <dd className="mt-1">
            <Link
              className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              to="/"
            >
              Getting started{/* */} <span aria-hidden="true">→</span>
            </Link>
          </dd>
        </div>
      </dl>
    </div>
  );
};
