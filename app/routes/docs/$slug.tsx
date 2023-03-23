import { useMemo, useState, useEffect } from 'react';
import { mdxToHtml } from "~/mdx/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { ClientOnly } from 'remix-utils';
import { useLoaderData } from '@remix-run/react';

import type { LoaderFunction } from "@remix-run/node"

export const loader: LoaderFunction = async () => {
  const s = `
  # GFM
  
  ## Autolink literals
  
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
  
  !> Here is a tip.
  
  ?> And a warning.
  
  x> Or an error.
  
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

function Post({ code, frontmatter }: any) {
  // it's generally a good idea to memoize this function call to
  // avoid re-creating the component every render.
  const Component = useMemo(() => getMDXComponent(code), [code])
  return (
    <>
      <header>
        <h1></h1>
      </header>
      <main>
        <Component />
      </main>
    </>
  )
}

export default function DocPage() {
  const loaderData = useLoaderData();

  return (
    <ClientOnly children={() =>
      <Post
        code={loaderData.code}
        frontmatter={loaderData.frontmatter}
      />
    } />
  );
}
