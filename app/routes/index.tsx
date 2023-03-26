import { getPostContent } from '~/utils/server/github.server';
import { mdxToHtml } from '~/utils/server/mdx.server';

import type { LoaderFunction } from '@remix-run/node';

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

export default function Index() {
  return (
    <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      <article>
        <header className="mb-9 space-y-1">
          <p className="font-display text-sm font-medium text-sky-500">Introduction</p>
          <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">Installation</h1>
        </header>
        <div className="prose prose-slate max-w-none dark:prose-invert dark:text-slate-400 prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem] prose-lead:text-slate-500 dark:prose-lead:text-slate-400 prose-a:font-semibold dark:prose-a:text-sky-400 prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px] prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10 dark:prose-hr:border-slate-800">
          <p>
            Quasi sapiente voluptates aut minima non doloribus similique quisquam. In quo expedita ipsum nostrum
            corrupti incidunt. Et aut eligendi ea perferendis.
          </p>
          <hr />
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores eligendi rem dolorum officia impedit aut
            animi, quis minus odit fuga adipisci ipsam accusantium tempora est sapiente repellat necessitatibus illo
            possimus totam. Similique asperiores et debitis officiis iusto odit excepturi totam at ratione error
            aliquid, ab unde dolor saepe possimus ullam dolorem! Autem, ratione inventore molestias
          </p>
          <h2>Hello, World!</h2>
          <pre>
            <code>console.log("Hello, Rust!")</code>
          </pre>
          <p>
            praesentium consequatur a eveniet exercitationem. Quod, optio beatae ea iure, non animi dolor cupiditate
            neque voluptatum soluta minus maiores porro magnam, reprehenderit quasi eum hic unde dicta similique
            perspiciatis. Unde autem vero, eius exercitationem placeat, facere ipsa officia nobis reprehenderit
            architecto non ipsam obcaecati amet?
          </p>
        </div>
      </article>
    </div>
  );
}
