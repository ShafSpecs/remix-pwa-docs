import type { ReactNode } from "react";
import Link from "~/components/mdx/Link";

export type GeneralErrorProps = { status: ReactNode; statusText: ReactNode };

const GeneralError = ({ status, statusText }: GeneralErrorProps) => {
  return (
    <div id="catch-doc" className="flex-auto max-w-2xl min-w-0 px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      <article>
        <main className="prose prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800">
          {status} | {statusText}
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

export default GeneralError;
