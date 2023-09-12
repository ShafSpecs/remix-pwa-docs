import { useTypedRouteLoaderData } from "remix-typedjson";
import NavItem from "../NavItem";
import type { loader as RootLoader } from "~/root";
import type { MetaDataObject } from "~/utils/server/aws.server";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useRef, useState } from "react";
import { useIsomorphicLayoutEffect, useMediaQuery } from "usehooks-ts";
import { useLocation } from "@remix-run/react";
import { Dialog } from "@headlessui/react";
import { useActionKey } from "~/hooks/useActionKey";

/**
 * Find the nearst scrollable ancestor (or self if scrollable)
 *
 * Code adapted and simplified from the smoothscroll polyfill
 *
 *
 * @param {Element} el
 */
function nearestScrollableContainer(el: Element) {
  /**
   * indicates if an element can be scrolled
   *
   * @param {Node} el
   */
  function isScrollable(el: Element) {
    const style = window.getComputedStyle(el)
    const overflowX = style['overflowX']
    const overflowY = style['overflowY']
    const canScrollY = el.clientHeight < el.scrollHeight
    const canScrollX = el.clientWidth < el.scrollWidth

    const isScrollableY = canScrollY && (overflowY === 'auto' || overflowY === 'scroll')
    const isScrollableX = canScrollX && (overflowX === 'auto' || overflowX === 'scroll')

    return isScrollableY || isScrollableX
  }

  while (el !== document.body && isScrollable(el) === false) {
    // @ts-ignore
    el = el.parentNode || el.host
  }

  return el
}

export const SidebarContext = createContext<{
  navIsOpen: boolean;
  setNavIsOpen: Dispatch<SetStateAction<boolean>>;
}>({ navIsOpen: false, setNavIsOpen: () => { } });

function Wrapper({ allowOverflow, children }: { allowOverflow?: boolean; children?: React.ReactNode }) {
  return <div className={allowOverflow ? undefined : 'overflow-hidden'}>{children}</div>
}

export function Nav({ children, fallbackHref }: { children?: React.ReactNode, fallbackHref?: string }) {
  // @ts-ignore
  const { meta } = useTypedRouteLoaderData<typeof RootLoader>('root');
  const location = useLocation();
  const actionKey = useActionKey();

  const mobile = useMediaQuery('(max-width: 1024px)');

  const activeItemRef = useRef<HTMLElement>()
  const previousActiveItemRef = useRef<HTMLElement>()
  const scrollRef = useRef<HTMLDivElement>(null!)

  useIsomorphicLayoutEffect(() => {
    function updatePreviousRef() {
      previousActiveItemRef.current = activeItemRef.current
    }

    if (activeItemRef.current) {
      if (activeItemRef.current === previousActiveItemRef.current) {
        updatePreviousRef()
        return
      }

      updatePreviousRef()

      const scrollable = nearestScrollableContainer(scrollRef.current)

      const scrollRect = scrollable.getBoundingClientRect()
      const activeItemRect = activeItemRef.current.getBoundingClientRect()

      const top = activeItemRef.current.offsetTop
      const bottom = top - scrollRect.height + activeItemRect.height

      if (scrollable.scrollTop > top || scrollable.scrollTop < bottom) {
        scrollable.scrollTop = top - scrollRect.height / 2 + activeItemRect.height / 2
      }
    }
  }, [location.pathname])

  return (
    <nav ref={scrollRef} id="nav" className="relative lg:text-sm lg:leading-6">
      <div className="sticky top-0 -ml-0.5 pointer-events-none">
        {!mobile && <div className="h-10 bg-white dark:bg-slate-900" />}
        <div className="relative bg-white pointer-events-auto dark:bg-slate-900">
          {/* Todo: Extract this as a separate `SearchButton` */}
          <button type="button" className="hidden w-full lg:flex items-center text-sm leading-6 text-slate-400 rounded-md  ring-slate-900/10 outline-none shadow-sm py-1.5 pl-2 pr-3 hover:ring-slate-300 dark:bg-slate-800 dark:highlight-white/5 dark:hover:bg-slate-700">
            <>
              <svg
                width="24"
                height="24"
                fill="none"
                aria-hidden="true"
                className="flex-none mr-3"
              >
                <path
                  d="m19 19-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Quick search...
              {actionKey && (
                <span className="flex-none pl-3 ml-auto text-xs font-semibold">
                  {actionKey[0]}K
                </span>
              )}
            </>
          </button>
        </div>
        {!mobile && <div className="h-8 bg-gradient-to-b from-white dark:from-slate-900" />}
      </div>
      <ul className="lg:-mt-6">
        {meta.map((el: MetaDataObject, i: number) => (
          <NavItem key={`${i}-${el.name}`} {...el} />
        ))}
      </ul>
    </nav>
  )
}

export default function SidebarLayout({
  children,
  layoutProps: { allowOverflow = true } = {},
}: {
  children?: React.ReactNode
  layoutProps?: { allowOverflow?: boolean }
}) {
  const [navIsOpen, setNavIsOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ navIsOpen, setNavIsOpen }}>
      <Wrapper allowOverflow={allowOverflow}>
        <div className="px-4 mx-auto max-w-8xl sm:px-6 md:px-8">
          <div className="hidden lg:block fixed z-20 inset-0 top-[3.8125rem] left-[max(0px,calc(50%-45rem))] right-auto w-[19rem] pb-10 pl-8 pr-6 overflow-y-auto">
            <Nav fallbackHref={''} />
          </div>
          <div className="lg:pl-[19.5rem]">{children}</div>
        </div>
      </Wrapper>
      <Dialog
        as="div"
        open={navIsOpen}
        onClose={() => setNavIsOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto lg:hidden"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
        <div className="relative bg-white w-80 max-w-[calc(100%-3rem)] p-6 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setNavIsOpen(false)}
            className="absolute z-10 flex items-center justify-center w-8 h-8 top-5 right-5 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
          >
            <span className="sr-only">Close navigation</span>
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible">
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Nav fallbackHref={''} />
        </div>
      </Dialog>
    </SidebarContext.Provider>
  )
}