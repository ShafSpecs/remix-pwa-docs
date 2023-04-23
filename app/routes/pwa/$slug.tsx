import { useMemo, useRef, useEffect, useState, Fragment } from 'react';
import { mdxToHtml } from "~/utils/server/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { ClientOnly } from 'remix-utils';
import type { CatchBoundaryComponent } from '@remix-run/react';
import { json } from "@remix-run/node"
import { Link, useCatch, useLoaderData, useOutletContext, useLocation } from '@remix-run/react';

import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { getPostContent, validateSlug } from '~/utils/server/github.server';
import Skeleton from '~/components/layout/Skeleton';
import { useIsFirstRender } from 'usehooks-ts';

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

  const validSlug: boolean = await validateSlug(`/pwa/${slug!}`)

  if (!validSlug) {
    console.error("Invalid slug: " + slug!);

    throw json(null, { status: 404, statusText: "Oops! This page could not be found." })
  }

  const doc = await getPostContent(slug!, "pwa");
  const code = await mdxToHtml(doc!);

  return code;
};

type Heading = {
  id: string;
  text: string;
  level: number;
  element: Element
}

function Doc({ code, frontmatter, next }: any) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const location = useLocation()

  const docRef = useRef<HTMLDivElement>(null!)

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [listItems, setListItems] = useState<any[]>([]);

  const isFirstRender = useIsFirstRender();
  const headingsRef = useRef<HTMLElement[]>([]);

  const [activeHeading, setActiveHeading] = useState<Element | HTMLElement | null>(null);
  const [activeH2, setActiveH2] = useState<Element | HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const headingElements = Array.from(docRef.current.querySelectorAll('h2, h3'));
      const toc: Heading[] = [];

      if (toc.length == 0) {
        headingElements.map((heading) =>
          toc.push({
            text: heading.textContent!,
            level: parseInt(heading.tagName[1]),
            id: heading.id,
            element: heading
          })
        );
      }

      if (headings.length !== toc.length) {
        setHeadings(toc)
        setActiveHeading(headingElements[0])
        if (headingElements[0].tagName.includes('2')) {
          setActiveH2(headingElements[0])
        }
      }

      let currentOl = null;
      const listItems = [];

      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];

        if (heading.level === 2) {
          let headingId = heading.text.replaceAll(/[#'?$]/g, '').replaceAll(' ', '-').toLowerCase();

          if (currentOl) {
            listItems.push(currentOl);
            currentOl = null;
          }

          const subheadings = [];
          while (i + 1 < headings.length && headings[i + 1].level === 3) {
            subheadings.push(
              // eslint-disable-next-line no-loop-func
              <li key={headings[i + 1].id} ref={(el: HTMLLIElement) => (headingsRef.current[headingsRef.current.length] = el)}>
                <Link className={`${activeHeading!.id === headings[i + 1].text.replaceAll(/[#'?$]/g, '').replaceAll(' ', '-').toLowerCase() ? "text-sky-500" : "hover:text-slate-600 dark:hover:text-slate-300"}`} to={`${location.pathname}#${headings[i + 1]!.text.replaceAll(' ', '-').toLowerCase()}`}>
                  {headings[i + 1].text}
                </Link>
              </li>
            );
            i++;
          }

          listItems.push(
            <li key={heading.id}>
              <h3
                ref={(el: HTMLHeadingElement) => (headingsRef.current[headingsRef.current.length] = el)}
              >
                <Link to={`${location.pathname}#${headingId}`} className={`${(activeHeading!.id == headingId || (activeH2 && activeH2.id == headingId)) ? "text-sky-500" : "font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}>
                  {heading.text}
                </Link>
              </h3>
              {subheadings.length > 0 && <ol className='pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400'>{subheadings}</ol>}
            </li>
          );
        } else if (heading.level === 3) {
          let headingId = heading.text.replaceAll(/[#'?$]/g, '').replaceAll(' ', '-').toLowerCase();

          if (!currentOl) {
            currentOl = <ol className='pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400' key={headings[i - 1].id}>{[]}</ol>;
          }

          currentOl.props.children.push(
            <li key={heading.id} ref={(el: HTMLLIElement) => (headingsRef.current[headingsRef.current.length] = el)}>
              <Link className={`${activeHeading!.id === headingId ? "text-sky-500" : "hover:text-slate-600 dark:hover:text-slate-300"}`} to={`${location.pathname}#${heading.text.replaceAll(' ', '-').toLowerCase()}}`}>
                {heading.text}
              </Link>
            </li>
          );
        }
      }

      if (currentOl) {
        listItems.push(currentOl);
      }

      setListItems(listItems);
    }
  }, [activeH2, activeHeading, headings, location])


  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    const headingElements = Array.from(docRef.current.querySelectorAll('h2, h3'));

    function handleScroll() {
      const topDistances = headingElements.map(headingElement => ({
        element: headingElement,
        topDistance: Math.abs(headingElement.getBoundingClientRect().top),
      }));
      topDistances.sort((a, b) => a.topDistance - b.topDistance);
      const closestHeadingElement = topDistances[0].element;
      const closestHeading = headings.find(heading => heading.id === closestHeadingElement.id);

      const activeIndex = headings.findIndex((h) => h.id === closestHeading!.id);

      // Update the active heading if it's different from the current active heading
      if (closestHeading && closestHeading.id !== activeHeading!.id) {
        if (activeIndex > 0 && headings[activeIndex].level === 3) {
          // Find the index of the last level 2 (h2) heading before the active heading
          for (let i = activeIndex - 1; i >= 0; i--) {
            if (headings[i].level === 2) {
              const lastH2 = headings[i];
              lastH2 !== undefined && setActiveH2(lastH2.element)
              break;
            }
          }
        }

        if (activeIndex > 0 && headings[activeIndex].level === 2) {
          setActiveH2(closestHeading.element);
        }

        setActiveHeading(closestHeading.element);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeHeading, isFirstRender, activeH2]);

  return (
    <Fragment>
      <div className='flex-auto max-w-2xl min-w-0 px-4 py-16 scroll-smooth lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16'>
        <article>
          <header className="space-y-1 mb-9">
            <p className="text-sm font-medium font-display text-sky-500">{frontmatter.section}</p>
            <h1 className="text-4xl tracking-tight font-display text-slate-900 dark:text-white">{frontmatter.title}</h1>
          </header>
          <main ref={docRef} className='prose table-auto prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800'>
            <p>
              {frontmatter.description}
            </p>
            <hr />
            <Component />
          </main>
        </article>
        <dl className="flex pt-6 mt-12 border-t border-slate-200 dark:border-slate-800">
          {next[0] !== null &&
            <div>
              <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">
                Previous
              </dt>
              <dd className="mt-1">
                <Link
                  className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  to={next[0].slug}
                >
                  <span aria-hidden="true">←</span> {next[0].title}
                </Link>
              </dd>
            </div>}
          {next[1] !== null &&
            <div className="ml-auto text-right">
              <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">
                Next
              </dt>
              <dd className="mt-1">
                <Link
                  className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  to={next[1].slug}
                >
                  {next[1].title}{/* */} <span aria-hidden="true">→</span>
                </Link>
              </dd>
            </div>
          }
        </dl>
      </div>
      <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
        <nav aria-labelledby="on-this-page-title" className="w-56">
          <h2 id="on-this-page-title" className="text-sm font-medium font-display text-slate-900 dark:text-white">
            On this page
          </h2>
          <ol className="mt-4 space-y-3 text-sm">
            {listItems}
          </ol>
        </nav>
      </div>
    </Fragment>
  )
}

export default function DocPage() {
  const loaderData = useLoaderData();
  //@ts-ignore
  const [next] = useOutletContext();

  return (
    <ClientOnly
      fallback={<Skeleton />}
      children={() =>
        <Doc
          next={next}
          code={loaderData.code}
          frontmatter={loaderData.frontmatter}
        />
      }
    />
  );
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();

  return (
    <div id='catch-doc' className="flex-auto max-w-2xl min-w-0 px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      <article>
        <main className='prose prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800'>
          {caught.status} | {caught.statusText}
        </main>
      </article>
      <dl className="flex pt-6 mt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="ml-auto text-right">
          <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">
            Next
          </dt>
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
  )
}