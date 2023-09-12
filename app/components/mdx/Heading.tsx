import { classNames } from "~/utils/StyleHelpers"

// Useful for preventing AlgoliaSearch from indexing a heading
export default function Heading({
  level,
  id,
  children,
  className = '',
  hidden = false,
  ignore = false,
  style = {},
  nextElement,
  ...props
}: any) {
  let Component = `h${level}`

  return (
    <Component
      className={classNames('flex whitespace-pre-wrap not-prose', className,
        level === 2 && nextElement?.type === 'heading' && nextElement?.depth === 3 ? 'mb-2 text-sm leading-6 text-sky-500 font-semibold tracking-normal dark:text-sky-400' : ''
      )}
      id={id}
      style={{ ...(hidden ? { marginBottom: 0 } : {}), ...style }}
      data-docsearch-ignore={ignore ? '' : undefined}
      {...props}
    >
      <a
        className={className('group relative border-none', hidden ? 'sr-only' : 'lg:-ml-2 lg:pl-2')}
        href={`#${id}`}
      >
        <div className="absolute items-center hidden -ml-8 border-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 lg:flex">
          &#8203;
          <div className="flex items-center justify-center w-6 h-6 rounded-md shadow-sm text-slate-400 ring-1 ring-slate-900/5 hover:text-slate-700 hover:shadow hover:ring-slate-900/10 dark:bg-slate-700 dark:text-slate-300 dark:shadow-none dark:ring-0">
            <svg width="12" height="12" fill="none" aria-hidden="true">
              <path
                d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        {children}
      </a>
    </Component>
  )
}