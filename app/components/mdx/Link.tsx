import { Link } from "@remix-run/react"

/* eslint-disable react/display-name */
export default ({ icon, title, desc }: any) => {
  return (
    <div className="relative border group rounded-xl border-slate-200 dark:border-slate-800">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
      <div className="relative p-6 overflow-hidden rounded-xl">
        {icon}
        <span className="mt-4 text-base font-display text-slate-900 dark:text-white">
          <Link prefetch="render" to="/">
            <span className="absolute font-medium -inset-px rounded-xl" />
            {title}
          </Link>
        </span>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
          {desc}
        </p>
      </div>
    </div>

  )
}