import clsx from 'clsx'
import { useEffect, useState } from 'react'

function CopyButton({ code }: { code: string }) {
  let [{ state, i }, setState] = useState({ state: 'idle', i: 0 })

  useEffect(() => {
    if (state === 'copied') {
      let handle = window.setTimeout(() => {
        setState({ state: 'idle', i: i + 1 })
      }, 1500)
      return () => {
        window.clearTimeout(handle)
      }
    }
  }, [state, i])

  return (
    <div className="relative flex -mr-2">
      <button
        type="button"
        className={clsx({
          'text-slate-500 hover:text-slate-400': state === 'idle',
          'text-emerald-400': state === 'copied',
        })}
        onClick={() => {
          navigator.clipboard.writeText(/* Todo: Add redent later */(code.replace(/^[+>-]/gm, ' '))).then(() => {
            setState({ state: 'copied', i: i + 1 })
          })
        }}
      >
        {state !== 'copied' ? <svg
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
        </svg> :
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        }
      </button>
    </div>
  )
}

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
      <TabBar primary={{ name: filename }} showTabMarkers={false}>
        <CopyButton code={code?.replace(/<[^>]+>/g, '') || ''} />
      </TabBar>
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
        {...(code ? {
          dangerouslySetInnerHTML: {
            __html: code
              // .split('\n')
              // .map((line) => {
              //   if (filename.toLowerCase() === 'terminal') {
              //     line = `<span class="flex"><svg viewBox="0 -9 3 24" aria-hidden="true" class="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3"><path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="flex-auto">${line}</span></span>`
              //   }
              //   return line
              // })
              // .join(filename.toLowerCase() === 'terminal' ? '' : '\n'),
          }
        } : { children })}
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