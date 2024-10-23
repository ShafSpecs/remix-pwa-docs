import clsx from "clsx";

export default function Stub({ children = 'Stub' }) {
  return (
    <div className={clsx(
      "inline-flex ml-1.5 items-center text-xs px-2 py-0.5 font-medium transition-colors border rounded-xl cursor-default",
      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
      )}>
      {children}
    </div>
  )
}
