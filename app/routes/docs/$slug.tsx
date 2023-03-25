import { useMemo } from 'react';
import { mdxToHtml } from "~/mdx/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { ClientOnly } from 'remix-utils';
import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const s = `
  ---
title: Example Post
published: 2021-02-13
description: This is some description
prompt: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt, sint officia distinctio sapiente magnam porro. Asperiores voluptatum ea adipisci eveniet?
---

import Warn from './warn.tsx'

Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente accusantium magni aspernatur illo dicta. Mollitia commodi sint cumque dolorum eveniet obcaecati fuga atque porro, 
tempora libero, fugit excepturi hic nulla quo unde voluptatum aspernatur animi voluptates minus numquam magni quisquam. Maiores optio iusto asperiores accusamus!

  # GFM
  
  ## Autolink literals

  :+1:

  ### Warning

  <Warn>Hello from MDX!</Warn>
  🎈
  
  www.example.com, https://example.com, and contact@example.com.
  
  ## Footnote
  
  A note[^1]
  
  [^1]: Big note.
  
  ## Strikethrough
  
  ~one~ or ~~two~~ tildes.
  
  ## Table
  
  | a | b  |  c |  d  |
  | - | :- | -: | :-: |
  
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

  const code = await mdxToHtml(s);

  return code;
}

function Doc({ code, frontmatter }: any) {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className='min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16'>
      <article>
        <header className="mb-9 space-y-1">
          <p className="font-display text-sm font-medium text-sky-500">Introduction</p>
          <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">{frontmatter.title}</h1>
        </header>
        <main className='prose table-auto prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800'>
          <p>
            {frontmatter.prompt}
          </p>
          <hr />
          <Component />
        </main>
      </article>
      <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
        <div className="ml-auto text-right">
          <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
            Next
          </dt>
          <dd className="mt-1">
            <a
              className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
              href="/docs/installation"
            >
              Installation{/* */} <span aria-hidden="true">→</span>
            </a>
          </dd>
        </div>
      </dl>

    </div>
  )
}

const Skeleton = () => {
  return(
    <div className='min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16'>
      <article>
        <header className="mb-9 space-y-1">
          <p className="font-display text-sm font-medium text-sky-500">Introduction</p>
          <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">{}</h1>
        </header>
        <main className='prose table-auto prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800'>
          <p>
            {/* {frontmatter.prompt} */}
          </p>
          <hr />
          {/* <Component /> */}
        </main>
      </article>
    </div>
  )
}

export default function DocPage() {
  const loaderData = useLoaderData();

  return (
    <ClientOnly
      fallback={<Skeleton />}
      children={() =>
        <Doc
          code={loaderData.code}
          frontmatter={loaderData.frontmatter}
        />
      } />
  );
}
