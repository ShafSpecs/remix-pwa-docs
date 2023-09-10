import type { ReactNode } from "react";

// eslint-disable-next-line react/display-name
export default ({ title, children }: { title: string; children: ReactNode | JSX.Element }) => {
  return (
    <details className="px-6 py-3 mb-6 -mt-0 prose border rounded-xl prose-slate open:pb-5 dark:prose-dark dark:border-slate-800">
      <summary className="font-medium cursor-pointer select-none text-slate-900 dark:text-slate-200">{title}</summary>
      {children}
    </details>
  )
}