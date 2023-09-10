import { useState } from 'react'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'
import { Frame } from './Editor';

/**
 * @typedef {React.ReactElement<{ filename?: string }>} CodeBlock
 */

/**
 * Handles styling for a specific ui affordance inside a tab
 *
 * @param {object} props
 * @param {import('clsx').ClassValue} props.className
 */
function TabAdornment({ className }: { className?: clsx.ClassValue }) {
  return <div className={clsx('pointer-events-none absolute inset-0', className)} />
}

/**
 * Represents a styled tab in a snippet group that adjusts its style
 * based on the position of this tab relative to the selected tab(s)
 *
 * Also supports an optional marker icon (close or modified)
 *
 * @param {object} props
 * @param {ReactElement[]} props.children
 * @param {number} props.selectedIndex
 * @param {number} props.myIndex
 * @param {"close" | "modified"} [props.marker]
 */
function TabItem({ children, selectedIndex, myIndex, marker }: { children: React.ReactNode; selectedIndex: number; myIndex: number; marker?: 'close' | 'modified' }) {
  const isSelected = selectedIndex === myIndex
  const isBeforeSelected = selectedIndex === myIndex + 1
  const isAfterSelected = selectedIndex === myIndex - 1

  // A cap is the edge of a list of tabs that has a special border treatment
  // The edges of a tab may be in one of three states:
  // - null if selected
  // - normal if it looks like a normal tab
  // - capped if there's a solid rounded corner on that edge
  const edges = {
    leading: isSelected ? null : isAfterSelected ? 'capped' : 'normal',
    trailing: isSelected ? null : isBeforeSelected ? 'capped' : 'normal',
  }

  return (
    <Tab
      className={clsx(
        'flex items-center relative z-10 overflow-hidden px-4 py-1 [&:not(:focus-visible)]:focus:outline-none',
        isSelected ? 'text-sky-300' : 'text-slate-400'
      )}
    >
      <span className="z-10">{children}</span>

      {marker === 'close' && (
        <svg viewBox="0 0 4 4" className="ml-2.5 flex-none w-1 h-1 text-slate-500 overflow-visible">
          <path d="M-1 -1L5 5M5 -1L-1 5" fill="none" stroke="currentColor" strokeLinecap="round" />
        </svg>
      )}

      {marker === 'modified' && (
        <div className="ml-2.5 flex-none w-1 h-1 rounded-full bg-current" />
      )}

      {/* Inactive tabs with optional edge caps */}
      {!isSelected && (
        <TabAdornment
          className={clsx(
            'bg-slate-700/50 border-y border-slate-500/30',
            edges.leading === 'capped' && 'border-l rounded-tl',
            edges.trailing === 'capped' && 'border-r rounded-tr'
          )}
        />
      )}

      {/* Divider between inactive tabs */}
      {edges.trailing === 'normal' && (
        <TabAdornment className="z-20 border-r inset-y-px border-slate-200/5" />
      )}

      {/* Active tab highlight bar */}
      {isSelected && <TabAdornment className="border-b border-b-sky-300" />}
    </Tab>
  )
}

let snippetGroupWrappers = {
  plain({ children }: { children: React.ReactNode }) {
    return <div className="shadow-md not-prose bg-slate-800 rounded-xl">{children}</div>
  },
  framed({ children, ...props }: { children: React.ReactNode }) {
    return (
      <Frame {...props}>
        <div className="shadow-md not-prose bg-slate-800 rounded-tl-xl">{children}</div>
      </Frame>
    )
  },
}

/**
 * Group multiple code blocks into a tabbed UI
 *
 * @param {object} props
 * @param {CodeBlock[]} props.children
 */
export default function SnippetGroup({ children, style = 'plain', actions, ...props }:any) {
  let [selectedIndex, setSelectedIndex] = useState(0)

  //@ts-ignore
  let Wrapper = snippetGroupWrappers[style]

  return (
    <Wrapper {...props}>
      <Tab.Group as="div" onChange={setSelectedIndex}>
        <div className="flex">
          <Tab.List className="flex pt-2 overflow-hidden text-xs leading-6 text-slate-400 rounded-tl-xl">
            {children?.map((child: any, tabIndex: number) => (
              <TabItem key={child.props.filename} myIndex={tabIndex} selectedIndex={selectedIndex}>
                {child.props.filename}
              </TabItem>
            ))}
          </Tab.List>
          <div className="flex flex-auto pt-2 overflow-hidden rounded-tr-xl">
            <div
              className={clsx(
                'flex-auto flex justify-end bg-slate-700/50 border-y border-slate-500/30 pr-4',
                selectedIndex === children.length - 1 ? 'rounded-tl border-l' : ''
              )}
            />
          </div>
          {actions ? (
            <div className="absolute flex h-8 top-2 right-4">{actions({ selectedIndex })}</div>
          ) : null}
        </div>
        <Tab.Panels className="flex overflow-auto">
          {children.map((child: JSX.Element) => (
            <Tab.Panel
              key={child.props.filename}
              className="flex-none min-w-full p-5 text-sm leading-6 text-slate-50 ligatures-none"
              {...(child.props.code
                ? { dangerouslySetInnerHTML: { __html: child.props.code } }
                : { children: child.props.children })}
            />
          ))}
        </Tab.Panels>
      </Tab.Group>
    </Wrapper>
  )
}