import { useLocation, Link } from "@remix-run/react";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo, useRef, useState, useEffect, Fragment } from "react";
import { useTypedLoaderData } from "remix-typedjson";
import type { loader as ExampleLoaderResponse } from "~/routes/docs.($slug)";
import { useRoot } from "~/utils/providers/RootProvider";
import SidebarLayout from "./Sidebar";
import Header, { ClientHeader } from "../Header";
import slugify from '@sindresorhus/slugify';
import { useMediaQuery } from "usehooks-ts";
import { ClientOnly } from "remix-utils";
import clsx from "clsx";
import redent from 'redent';
import Editor from '../mdx/Editor';
import SnippetGroup from '../mdx/Snippet';
import Heading from "../mdx/Heading";
import Info from "../mdx/Info";
import Warn from "../mdx/Warn";

export type Heading = {
  id: string;
  text: string;
  level: number;
  element?: Element;
};

/**
 * @description We can easily use this component if we at minimum return the result of mdxToHtml spread from our loader like:
 * @example
 * ```ts
 * const code = await mdxToHtml(doc);
 * return typedjson({...code}, 200);
 * ```
 * @returns
 */
export function Doc() {
  const { code, frontmatter } = useTypedLoaderData<typeof ExampleLoaderResponse>();
  const { next, prev } = useRoot();
  const Component = useMemo(() => getMDXComponent(code,
    {
      clsx,
      redent,
      Editor,
      Snippet: SnippetGroup,
      Heading,
      Info,
      Warn,
    }
  ), [code]);
  const location = useLocation();
  const mobile = useMediaQuery('(max-width: 1024px)');

  const docRef = useRef<HTMLDivElement>(null!);
  const tocRef = useRef<HTMLOListElement>(null!);

  const [listItems, setListItems] = useState<any[]>([]);

  const [activeHeading, setActiveHeading] = useState<Heading | null>(null);
  const [activeH2, setActiveH2] = useState<Heading | null>(null);

  useEffect(() => {
    setListItems([]);

    if (typeof window !== "undefined") {
      const storageKey = `docs:${location.pathname}`;

      if (docRef.current) {
        const headingElements: HTMLHeadingElement[] = Array.from(docRef.current.querySelectorAll("h2, h3"));
        const toc: Heading[] = [];

        headingElements.map((heading) =>
          toc.push({
            text: heading.textContent!,
            level: parseInt(heading.tagName[1]),
            id: heading.id ?? slugify(heading.textContent!),
          })
        );

        if (toc.length === 0) {
          return;
        }

        localStorage.setItem(storageKey, JSON.stringify(toc));
      }

      const pathHeadings = localStorage.getItem(storageKey);

      let currentOl = null;
      const $listItems = [];
      const $headings: Heading[] = JSON.parse(pathHeadings ?? '[]');

      if ($headings.length === 0) {
        return;
      }

      setActiveHeading($headings[0]);

      if ($headings[0].level === 2) {
        setActiveH2($headings[0]);
      }

      if (!$headings) {
        return;
      }

      for (let i = 0; i < $headings.length; i++) {
        const heading = $headings[i];

        if (currentOl) {
          $listItems.push(currentOl);
          currentOl = null;
        }

        const subheadings = [];
        while (i + 1 < $headings.length && $headings[i + 1].level === 3) {
          subheadings.push(
            {
              text: $headings[i + 1].text,
            }
          );
          i++;
        }

        $listItems.push(
          {
            text: heading.text,
            subheadings: subheadings,
            hasSubheadings: subheadings.length > 0
          }
        );
      }

      if (currentOl) {
        $listItems.push(currentOl);
      }

      setListItems($listItems);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window !== "undefined" && !mobile) {
      const headingElements: Heading[] = JSON.parse(localStorage.getItem(`docs:${location.pathname}`) ?? '[]');
      setActiveHeading(headingElements[0] ?? null);

      function handleScroll() {
        if (headingElements.length === 0) {
          return;
        }

        const topDistances = headingElements.map((headingElement) => {
          const elem = docRef.current.querySelector(`#${headingElement.id}`);

          if (!elem) return null;

          return {
            element: elem!,
            topDistance: Math.abs(elem!.getBoundingClientRect().top - 109)
          }
        }).filter((heading) => heading !== null) as unknown as { element: Element, topDistance: number }[];

        topDistances.sort((a, b) => a.topDistance - b.topDistance);
        const closestHeadingElement = topDistances[0].element;
        const closestHeading = headingElements.find((heading) => heading.id === closestHeadingElement.id);

        if (!closestHeading) {
          return;
        }

        const activeIndex = headingElements.findIndex((h) => h.id === closestHeading!.id);

        const activeIndexIsGreaterThanZero = activeIndex > 0;

        // Update the active heading if it's different from the current active heading
        if (!activeHeading || closestHeading.id !== activeHeading.id) {
          if (activeIndexIsGreaterThanZero && headingElements[activeIndex].level === 3) {
            // Find the index of the last level 2 (h2) heading before the active heading
            for (let i = activeIndex - 1; i >= 0; i--) {
              if (headingElements[i].level === 2) {
                const lastH2 = headingElements[i];
                lastH2 !== undefined && setActiveH2(lastH2);
                break;
              }
            }
          }

          if (headingElements[activeIndex].level === 2) {
            setActiveH2(closestHeading);
          }

          setActiveHeading(closestHeading);
        }

        if (activeHeading?.level === 2 && activeH2?.id !== activeHeading.id) {
          setActiveH2(activeHeading);
        }
      }

      window.addEventListener("scroll", handleScroll, {
        passive: true,
        capture: true,
        once: false,
      });

      return () => window.removeEventListener("scroll", handleScroll, {
        capture: true
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, mobile]);

  useEffect(() => {
    if (typeof window !== "undefined" && !mobile) {
      const scrollIntoView = (e: MouseEvent, el: Element) => {
        if (!el.parentNode?.nodeName.toUpperCase().includes('H')) {
          return;
        }

        e.preventDefault();

        const scrollTo = docRef.current.querySelector(`#${el.getAttribute('href')!.replace('#', '')}`);

        if (scrollTo) {
          const scrollToRect = scrollTo.getBoundingClientRect();
          const offsetPos = scrollToRect.top + window.scrollY - 106;

          window.scrollTo({
            top: offsetPos,
            behavior: 'smooth'
          });

          window.history.pushState(null, '', `${location.pathname}#${el.getAttribute('href')!.replace('#', '')}`);
        }
      };

      const scrollIntoviewToC = (e: MouseEvent, el: HTMLAnchorElement) => {
        if (!el.parentNode?.nodeName.toUpperCase().includes('H') && !el.classList.contains('toc-anchor')) {
          el.setAttribute('target', '_blank');
          el.click();
          return;
        }

        e.preventDefault();

        const hrefAttr = el.getAttribute('href')!;
        const substr = hrefAttr.search('#');
        const href = hrefAttr.substring(substr + 1);

        const scrollTo = docRef.current.querySelector(`#${href}`);

        if (scrollTo) {
          const scrollToRect = scrollTo.getBoundingClientRect();
          const offsetPos = scrollToRect.top + window.scrollY - 106;

          window.history.pushState(null, '', `${location.pathname}#${el.getAttribute('href')!.replace('#', '')}`);

          window.scrollTo({
            top: offsetPos,
            behavior: 'smooth'
          });
        }
      }

      docRef.current.querySelectorAll('a').forEach((el) => {
        el.addEventListener('click', (e) => scrollIntoView(e, el))
      });

      tocRef.current.querySelectorAll('a').forEach((el) => {
        el.addEventListener('click', (e) => scrollIntoviewToC(e, el))
      });

      return () => {
        document.getElementById('article-main')!.querySelectorAll('a').forEach((el) => {
          el.removeEventListener('click', (e) => scrollIntoView(e, el))
        });

        document.getElementById('toc-id')!.querySelectorAll('a').forEach((el) => {
          el.removeEventListener('click', (e) => scrollIntoviewToC(e, el))
        });
      };
    }
  }, [listItems, location.pathname, mobile])

  return (
    <Fragment>
      <ClientOnly fallback={<ClientHeader />} children={() => <Header title={frontmatter.title} section={frontmatter.section} />} />
      <SidebarLayout>
        <div className="max-w-3xl mx-auto pt-10 xl:max-w-none xl:ml-0 xl:mr-[15.5rem] xl:pr-16">
          <div className="flex-auto mb-8 scroll-smooth">
            <article>
              <header id="header" className="relative z-20">
                <div>
                  <h5 className="mb-2 text-sm font-semibold leading-6 text-sky-500 dark:text-sky-400">
                    {frontmatter.section}
                  </h5>
                  <div className="flex items-center">
                    <h1 className="inline-block text-2xl font-extrabold tracking-tight sm:text-3xl text-slate-900 dark:text-slate-200">
                      {frontmatter.title}
                    </h1>
                  </div>
                </div>
                <p className="mt-2 text-lg text-slate-700 dark:text-slate-400">
                  {frontmatter.description}
                </p>
              </header>

              <main
                ref={docRef}
                id="article-main"
                className="relative z-20 mt-8 prose prose-slate dark:prose-dark scroll-smooth prose-h2:flex prose-h2:whitespace-pre-wrap prose-h2:not-prose prose-h2:mb-2 prose-h2:text-sm prose-h2:leading-6 prose-h2:text-sky-500 prose-h2:font-semibold prose-h2:tracking-normal prose-h2:dark:text-sky-400 prose-code:dark:text-[#e2e8f0] prose-code:font-medium prose-code:text-sm prose-code:font-fira"
              >
                <Component />
              </main>
            </article>
            <dl className="flex pt-6 mt-12 border-t border-slate-200 dark:border-slate-800">
              {prev && (
                <div>
                  <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">Previous</dt>
                  <dd className="mt-1">
                    <Link
                      className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                      to={`/docs/${slugify(prev.shortTitle)}`}
                    // reloadDocument={true}
                    // prefetch="intent"
                    >
                      <span aria-hidden="true">←</span>&nbsp;{prev.shortTitle}
                    </Link>
                  </dd>
                </div>
              )}
              {next && (
                <div className="ml-auto text-right">
                  <dt className="text-sm font-medium font-display text-slate-900 dark:text-white">Next</dt>
                  <dd className="mt-1">
                    <Link
                      className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                      to={`/docs/${slugify(next.shortTitle)}`}
                    // reloadDocument={true}
                    // prefetch="intent"
                    >
                      {next.shortTitle}
                      {/* */}&nbsp;<span aria-hidden="true">→</span>
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className="fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 overflow-y-auto hidden xl:block">
            <nav aria-labelledby="on-this-page-title" className="px-8">
              {listItems.length > 0 ? <h2 id="on-this-page-title" className="mb-4 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                On this page
              </h2> : <h5></h5>}
              <ol className="text-sm leading-6 text-slate-700" id="toc-id" ref={tocRef}>
                {
                  listItems.map((item, i) => {
                    return (
                      <li key={i}>
                        <h3>
                          <Link
                            to={`${location.pathname}#${slugify(item.text)}`}
                            className={`${activeHeading!.id == slugify(item.text) || (activeH2 && activeH2.id == slugify(item.text))
                              ? "font-medium text-sky-500 dark:text-sky-400"
                              : "hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                              } ${item.hasSubheadings ? "font-medium" : ""} block py-1 toc-anchor`}
                          >
                            {item.text}
                          </Link>
                        </h3>
                        {
                          item.hasSubheadings && (
                            <ol className="ml-4">
                              {
                                item.subheadings.map((subheading: { text: string }, i: number) => {
                                  return (
                                    <li key={i}>
                                      <Link
                                        to={`${location.pathname}#${slugify(subheading.text)}`}
                                        className={`${activeHeading!.id ===
                                          slugify(subheading.text)
                                          ? "text-sky-500 dark:text-sky-400"
                                          : "hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300"
                                          } group flex items-start py-1 toc-anchor`}
                                      >
                                        <svg
                                          width={3}
                                          height={24}
                                          viewBox="0 -9 3 24"
                                          className="mr-2 overflow-visible text-slate-400 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-500"
                                        >
                                          <path
                                            d="M0 0L3 3L0 6"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                        {" "}{subheading.text}
                                      </Link>
                                    </li>
                                  )
                                })
                              }
                            </ol>
                          )
                        }
                      </li>
                    )
                  })
                }
              </ol>
            </nav>
          </div>
        </div>
      </SidebarLayout>
    </Fragment>
  );
}
