import { Fragment } from "react"

/* eslint-disable react/display-name */
export default () => {
  return (
    <Fragment>
      <div className='min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16'>
        <article>
          <header className="mb-9 space-y-1 animate-pulse">
            <p className="bg-slate-200 dark:bg-slate-700 h-5 w-24 rounded-full"></p>
            <h1 className="bg-slate-200 dark:bg-slate-700 mt-6 text-slate-900 dark:text-white h-8 w-60 rounded-xl"></h1>
          </header>
          <main className='prose animate-pulse table-auto prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800'>
            <p className='w-full h-36 bg-slate-200 dark:bg-slate-700 rounded-3xl'></p>
            <hr />
            <p className='w-36 bg-slate-200 dark:bg-slate-700 h-6 rounded-full'></p>
            <p className='w-full bg-slate-200 dark:bg-slate-700 h-28 rounded-2xl'></p>
            <p className="bg-slate-200 dark:bg-slate-700 h-5 w-48 rounded-full"></p>
            <p className="bg-slate-200 dark:bg-slate-700 h-48 w-full rounded-2xl"></p>
          </main>
        </article>
      </div>
    </Fragment>
  )
}