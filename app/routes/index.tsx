/* eslint-disable react/jsx-pascal-case */
import { getPostContent } from '~/utils/server/github.server';
import { mdxToHtml } from '~/utils/server/mdx.server';
import { ClientOnly } from 'remix-utils';
import Skeleton from '~/components/layout/Skeleton';
import { Fragment, useMemo, useRef, useState } from 'react';

import type { LoaderFunction } from '@remix-run/node';
import { getMDXComponent } from 'mdx-bundler/client';
import { Link, useLoaderData, useOutletContext } from '@remix-run/react';
import Grid from '~/components/mdx/Grid';
import * as Lin from '~/components/mdx/Link';
import Arrow from '~/components/icons/Arrow';
import Widget from '~/components/icons/Widget';
import Swatch from '~/components/icons/Swatch';
import Plugin from '~/components/icons/Plugin';

export const loader: LoaderFunction = async () => {
  const doc = await getPostContent("intro");

  if (doc === null) {
    return {
      status: 404
    }
  }

  const code = await mdxToHtml(doc);

  return code;
};

const Index = ({ code, frontmatter, next }: any) => {
  const Component = useMemo(() => getMDXComponent(code), [code]);

  const docRef = useRef<HTMLDivElement>(null!)

  const [headings, setHeadings] = useState<any[]>([]);

  // useEffect(() => {
  //   if (typeof document != "undefined") {
  //     const headings = docRef.current!.querySelectorAll('h2, h3');
  //     const toc: Heading[] = [];

  //     headings.forEach((heading) => {
  //       toc.push({
  //         text: heading.textContent!,
  //         level: parseInt(heading.tagName[1]),
  //         id: heading.id
  //       });
  //     });

  //     setHeadings(toc)
  //   }
  // }, []);

  return (
    <Fragment>
      <div className='min-w-0 max-w-2xl scroll-smooth flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16'>
        <article>
          <header className="mb-9 space-y-1">
            <p className="font-display text-sm font-medium text-sky-500">{frontmatter.section}</p>
            <h1 className="font-display text-4xl tracking-tight text-slate-900 dark:text-white">{frontmatter.title}</h1>
          </header>
          <main ref={docRef} className='prose table-auto prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800'>
            <p className='lead'>
              Learn how to get Remix PWA set up in your Remix project. More placeholder text.
            </p>
            <Grid>
              <Lin.default icon={<Arrow />} title={"Installation"} desc={""} />
              <Lin.default icon={<Widget />} title={"Guide"} desc={""} />
              <Lin.default icon={<Plugin />} title={"Plugins"} desc={""} />
              <Lin.default icon={<Swatch />} title={"API Reference"} desc={""} />
            </Grid>
            <p>
              {frontmatter.description}
            </p>
            <hr />
            <Component />
          </main>
        </article>
        <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
          {next[1] !== null &&
            <div className="ml-auto text-right">
              <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                Next
              </dt>
              <dd className="mt-1">
                <Link
                  className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  to={next[1].slug}
                >
                  {next[1].title}<span aria-hidden="true">→</span>
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
            {headings.map((e) => (
              <li key={e.id}>
                {e.level == 2 ? (
                  <h3>
                    <a className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300" href={`#${e.id}`}>
                      {e.text}
                    </a>
                  </h3>
                ) : (
                  <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#installing-dependencies">
                        {e.text}
                      </a>
                    </li>
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </Fragment>
  )
}

export default function IndexRoute() {
  const { code, frontmatter } = useLoaderData();
  //@ts-ignore
  const [next] = useOutletContext();

  return (
    <ClientOnly
      fallback={<Skeleton />}
      children={() => <Index code={code} frontmatter={frontmatter} next={next} />}
    />
  );
}
