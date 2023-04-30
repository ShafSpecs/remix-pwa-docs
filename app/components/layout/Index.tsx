/* eslint-disable react/jsx-pascal-case */
import { Link } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import type { loader as ExampleLoaderResponse } from "~/routes/_index";
import * as CustomLink from "~/components/mdx/Link";
import Arrow from "~/components/icons/Arrow";
import Widget from "~/components/icons/Widget";
import type { Heading } from "./Documentation";
import { useIsFirstRender } from "usehooks-ts";
import Grid from "../mdx/Grid";
import { useRoot } from "~/utils/providers/RootProvider";

const IndexComponent = () => {
  const { code, frontmatter } = useTypedLoaderData<typeof ExampleLoaderResponse>();
  const { next } = useRoot();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  const docRef = useRef<HTMLDivElement>(null!);

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [listItems, setListItems] = useState<any[]>([]);

  const isFirstRender = useIsFirstRender();
  const headingsRef = useRef<HTMLElement[]>([]);

  const [activeHeading, setActiveHeading] = useState<Element | HTMLElement | null>(null);
  const [activeH2, setActiveH2] = useState<Element | HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const headingElements = Array.from(docRef.current.querySelectorAll("h2, h3"));
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
        setHeadings(toc);
        setActiveHeading(headingElements[0]);
      }

      let currentOl = null;
      const listItems = [];

      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];

        if (heading.level === 2) {
          let headingId = heading.text.replaceAll(" ", "-").toLowerCase();

          if (currentOl) {
            listItems.push(currentOl);
            currentOl = null;
          }

          const subheadings = [];
          while (i + 1 < headings.length && headings[i + 1].level === 3) {
            subheadings.push(
              // eslint-disable-next-line no-loop-func
              <li
                key={headings[i + 1].id}
                ref={(el: HTMLLIElement) => (headingsRef.current[headingsRef.current.length] = el)}
              >
                <Link
                  className={`${activeHeading!.id === headings[i + 1].text.replaceAll(" ", "-").toLowerCase()
                      ? "text-sky-500"
                      : "hover:text-slate-600 dark:hover:text-slate-300"
                    }`}
                  to={`/#${headings[i + 1]!.text.replaceAll(" ", "-").toLowerCase()}`}
                >
                  {headings[i + 1].text}
                </Link>
              </li>
            );
            i++;
          }

          listItems.push(
            <li key={heading.id}>
              <h3 ref={(el: HTMLHeadingElement) => (headingsRef.current[headingsRef.current.length] = el)}>
                <Link
                  to={`/#${headingId}`}
                  className={`${activeHeading!.id == headingId || (activeH2 && activeH2.id == headingId)
                      ? "text-sky-500"
                      : "font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    }`}
                >
                  {heading.text}
                </Link>
              </h3>
              {subheadings.length > 0 && (
                <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">{subheadings}</ol>
              )}
            </li>
          );
        } else if (heading.level === 3) {
          let headingId = heading.text.replaceAll(" ", "-").toLowerCase();

          if (!currentOl) {
            currentOl = (
              <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400" key={headings[i - 1].id}>
                {[]}
              </ol>
            );
          }

          currentOl.props.children.push(
            <li key={heading.id} ref={(el: HTMLLIElement) => (headingsRef.current[headingsRef.current.length] = el)}>
              <Link
                className={`${activeHeading!.id === headingId ? "text-sky-500" : "hover:text-slate-600 dark:hover:text-slate-300"
                  }`}
                to={`/#${heading.text.replaceAll(" ", "-").toLowerCase()}}`}
              >
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
  }, [activeH2, activeHeading, headings]);

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    const headingElements = Array.from(docRef.current.querySelectorAll("h2, h3"));

    function handleScroll() {
      const topDistances = headingElements.map((headingElement) => ({
        element: headingElement,
        topDistance: Math.abs(headingElement.getBoundingClientRect().top)
      }));
      topDistances.sort((a, b) => a.topDistance - b.topDistance);
      const closestHeadingElement = topDistances[0].element;
      const closestHeading = headings.find((heading) => heading.id === closestHeadingElement.id);

      const activeIndex = headings.findIndex((h) => h.id === closestHeading!.id);

      // Update the active heading if it's different from the current active heading
      if (closestHeading && closestHeading.id !== activeHeading!.id) {
        if (activeIndex > 0 && headings[activeIndex].level === 3) {
          // Find the index of the last level 2 (h2) heading before the active heading
          for (let i = activeIndex - 1; i >= 0; i--) {
            if (headings[i].level === 2) {
              // Found the last h2 element, do something with it
              const lastH2 = headings[i];
              lastH2 !== undefined && setActiveH2(lastH2.element);
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

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, activeHeading, isFirstRender, activeH2]);

  return (
    <Fragment>
      <div className="flex-auto max-w-2xl min-w-0 px-4 py-16 scroll-smooth lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
        <article>
          <header className="space-y-1 mb-9">
            <p className="text-sm font-medium font-display text-sky-500">{frontmatter.section}</p>
            <h1 className="text-4xl tracking-tight font-display text-slate-900 dark:text-white">{frontmatter.title}</h1>
          </header>
          <main
            ref={docRef}
            className="prose table-auto prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800"
          >
            <p className="lead">
              Learn how to get Remix PWA up and running in your Remix application or explore the ecosystem 🌍!
            </p>
            <Grid>
              <CustomLink.default
                icon={<Arrow />}
                title={"Installation"}
                desc={"Set up Remix PWA in your application easily!"}
              />
              <CustomLink.default
                icon={<Widget />}
                title={"Guide"}
                desc={"Explore the possibilities and check out more that Remix PWA can do."}
              />
            </Grid>
            <p>{frontmatter.description}</p>
            <hr />
            <div className="relative z-10 col-span-3 -ml-10 shadow-lg bg-slate-800 rounded-xl xl:ml-0 dark:shadow-none dark:ring-1 dark:ring-inset dark:ring-white/10">
              <div className="relative flex text-xs leading-6 text-slate-400">
                <div className="flex items-center flex-none px-4 py-1 mt-2 border-t border-b text-sky-300 border-t-transparent border-b-sky-300">
                  Terminal
                </div>
                <div className="flex flex-auto pt-2 overflow-hidden rounded-tr-xl">
                  <div className="flex-auto -mr-px border rounded-tl bg-slate-700/50 border-slate-500/30" />
                </div>
                <div className="absolute right-0 flex items-center h-8 pr-4 top-2">
                  <div className="relative flex -mr-2">
                    <button type="button" className="text-slate-500 hover:text-slate-400">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="w-8 h-8"
                      >
                        <path d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19" />
                        <path d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <pre className="flex overflow-auto text-sm leading-6 text-slate-50 ligatures-none">
                  <code className="flex-none min-w-full p-5">
                    <span className="flex">
                      <svg
                        viewBox="0 -9 3 24"
                        aria-hidden="true"
                        className="flex-none w-auto h-6 mr-3 overflow-visible text-pink-400"
                      >
                        <path
                          d="M0 0L3 3L0 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="flex-auto">npm install -D tailwindcss</span>
                    </span>
                    <span className="flex">
                      <svg
                        viewBox="0 -9 3 24"
                        aria-hidden="true"
                        className="flex-none w-auto h-6 mr-3 overflow-visible text-pink-400"
                      >
                        <path
                          d="M0 0L3 3L0 6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="flex-auto">npx tailwindcss init</span>
                    </span>
                  </code>
                </pre>
              </div>
            </div>

            <Component />
          </main>
        </article>
        <dl className="flex pt-6 mt-12 border-t border-slate-200 dark:border-slate-800">
          {next && (
            <div className="ml-auto text-right">
              <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">Next</dt>
              <dd className="mt-1">
                <Link
                  className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  to={next.slug}
                >
                  {next.title}
                  <span aria-hidden="true">→</span>
                </Link>
              </dd>
            </div>
          )}
        </dl>
      </div>
      <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
        <nav aria-labelledby="on-this-page-title" className="w-56">
          <h2 id="on-this-page-title" className="text-sm font-medium font-display text-slate-900 dark:text-white">
            On this page
          </h2>
          <ol className="mt-4 space-y-3 text-sm">{listItems}</ol>
        </nav>
      </div>
    </Fragment>
  );
};

export default IndexComponent;
