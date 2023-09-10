import clsx from 'clsx'

function TabBar({
  primary,
  secondary = [],
  showTabMarkers = true,
  side,
  translucent = false,
  children,
}: {
  primary: { name: string; saved?: boolean }
  secondary?: { name: string; open?: boolean; className?: string }[]
  showTabMarkers?: boolean
  side?: 'left' | 'right'
  translucent?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex text-xs leading-6 text-slate-400">
      <div className="flex items-center flex-none px-4 py-1 border-t border-b text-sky-300 border-t-transparent border-b-sky-300">
        {primary.name}
        {showTabMarkers &&
          (primary.saved ? (
            <svg
              viewBox="0 0 4 4"
              className="ml-2.5 flex-none w-1 h-1 text-slate-500 overflow-visible"
            >
              <path
                d="M-1 -1L5 5M5 -1L-1 5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <div className="ml-2.5 flex-none w-1 h-1 rounded-full bg-current" />
          ))}
      </div>
      <div
        className={clsx(
          'flex-auto flex items-center bg-slate-700/50 border border-slate-500/30',
          side === 'left' ? 'rounded-tl lg:rounded-tr' : 'rounded-tl',
          translucent && 'dark:bg-slate-800/50'
        )}
      >
        {secondary.map(({ name, open = true, className }) => (
          <div
            key={name}
            className={clsx('px-4 py-1 border-r border-slate-200/5', className, { italic: !open })}
          >
            {name}
          </div>
        ))}
        {children && (
          <div className="flex items-center justify-end flex-auto px-4 space-x-4">{children}</div>
        )}
      </div>
    </div>
  )
}

const frameColors = {
  sky: 'from-sky-500 to-cyan-300',
  indigo: 'from-indigo-500 to-blue-400',
  pink: 'from-pink-500 to-fuchsia-400',
  fuchsia: 'from-fuchsia-500 to-purple-400',
  purple: 'from-violet-500 to-purple-500',
}

export function Frame({ className, color = 'sky', children }: { className?: string; color?: string; children: any }) {
  return (
    <div
      className={clsx(
        className,
        // @ts-ignore
        frameColors[color],
        'relative -mx-4 pt-6 pl-4 bg-gradient-to-b sm:mx-0 sm:rounded-2xl sm:pt-12 sm:pl-12'
      )}
    >
      <div className="overflow-hidden rounded-tl-xl sm:rounded-br-xl">{children}</div>
    </div>
  )
}

export function EditorPane({ filename, scroll = false, code, children }: { filename: string; scroll?: boolean; code?: string; children?: any }) {
  return (
    <div className="pt-2 shadow-lg bg-slate-800 group">
      <TabBar primary={{ name: filename }} showTabMarkers={false} />
      <div
        className={clsx(
          'children:my-0 children:!shadow-none children:bg-transparent',
          scroll &&
          clsx(
            'overflow-y-auto max-h-96',
            'scrollbar:w-4 scrollbar:h-4 scrollbar:transparent',
            'scrollbar-thumb:border-4 scrollbar-thumb:border-solid scrollbar-thumb:border-slate-800 scrollbar-thumb:bg-slate-500/50 group-hover:scrollbar-thumb:bg-slate-500/60 scrollbar-thumb:rounded-full',
            'scrollbar-track:rounded'
          )
        )}
        {...(code ? { dangerouslySetInnerHTML: { __html: code } } : { children })}
      />
    </div>
  )
}

export default function Editor({
  filename,
  scroll = false,
  style = 'plain',
  color,
  children,
  code
}: {
  filename: string;
  scroll?: boolean;
  style?: string;
  color?: string;
  children?: any;
  code?: string
}) {
  let passthrough = { scroll }

  if (style === 'framed') {
    return (
      <Frame className="mt-5 mb-8 first:mt-0 last:mb-0" color={color}>
        <EditorPane {...passthrough} filename={filename} code={code} children={children} />
      </Frame>
    )
  }

  return (
    <div className="relative mt-5 mb-8 overflow-hidden first:mt-0 last:mb-0 rounded-2xl">
      <EditorPane {...passthrough} filename={filename} code={code} children={children} />
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl dark:ring-1 dark:ring-white/10 dark:ring-inset"
        aria-hidden="true"
      />
    </div>
  )
}