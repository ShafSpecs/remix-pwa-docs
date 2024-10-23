import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Link, NavLink, useLocation, useNavigate, useRouteLoaderData } from '@remix-run/react'
import clsx from 'clsx'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { animated, useTransition } from 'react-spring'

import { ThemeSwitcher } from '~/components/ThemeSwitcher'
import { useOnClickOutside } from '~/hooks/useOnClickOutside'
import { DEFAULT_TAG } from '~/utils/defatult'
import type { MetadataType } from '~/utils/server/doc.server'
import Stub from '../Stub'

function Breadcrumb({
  section,
  setIsNavOpen,
  title,
}: {
  section: string
  title: string
  setIsNavOpen: (arg0: boolean) => void
}) {
  return (
    <Fragment>
      {/* {width <= 1024 && ( */}
      <div className="flex select-none items-center border-b border-slate-900/10 p-4 dark:border-slate-50/[0.06] lg:hidden">
        <Disclosure.Button
          type="button"
          onClick={() => setIsNavOpen(true)}
          className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
        >
          <span className="sr-only">Open side menu</span>
          <svg width="24" height="24">
            <path d="M5 6h14M5 12h14M5 18h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Disclosure.Button>
        {/* eslint-disable-next-line multiline-ternary */}
        {section.length > 0 ? (
          <ol className="flex ml-4 min-w-0 text-sm leading-6 whitespace-nowrap">
            {section && (
              <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                {section}
                <svg width="3" height="6" aria-hidden="true" className="overflow-visible mx-3 text-slate-400">
                  <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </li>
            )}
            <li className="font-semibold truncate text-slate-900 dark:text-slate-200">{title}</li>
          </ol>
        ) : (
          <ol className="flex ml-4 min-w-0 text-sm leading-6 whitespace-nowrap">
            <li className="flex items-center text-sm text-slate-500 dark:text-slate-400">Journal Stack Home</li>
          </ol>
        )}
      </div>
      {/* )} */}
    </Fragment>
  )
}

function MobileSidebar({
  navIsOpen,
  setNavIsOpen,
}: {
  navIsOpen: boolean
  setNavIsOpen: (arg0: boolean) => void
}) {
  const { metadata, tag } = useRouteLoaderData('routes/docs.$tag') as {
    metadata: MetadataType
    tag: string
  }

  const sideBartransitions = useTransition(navIsOpen, {
    from: { opacity: 0, transform: 'translateX(-100%)' },
    enter: { opacity: 1, transform: 'translateX(0%)' },
    leave: { opacity: 0, transform: 'translateX(-100%)' },
  })

  const [docList, setDocList] = useState<{ section: string; children: any[] }[]>([])

  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = {} as any

    for (const key in metadata.meta) {
      const item = metadata.meta[key]
      const section = item.section ?? ''

      if (!reduced[section]) {
        reduced[section] = []
      }

      reduced[section].push(item)
    }

    const result = Object.keys(reduced).map(section => {
      return { section, children: reduced[section] }
    })

    setDocList(result)
  }, [metadata.meta])

  useOnClickOutside(sidebarRef, () => {
    setNavIsOpen(false)
  })

  return sideBartransitions((style, item) =>
    // eslint-disable-next-line multiline-ternary
    item ? (
      <animated.div
        style={style}
        className={clsx(
          'overflow-y-auto fixed inset-0 top-0 left-0 items-start pr-10 w-screen h-screen backdrop-blur z-[999] bg-slate-900/50 lg:hidden',
          navIsOpen ? 'flex' : 'hidden'
        )}
      >
        <div
          ref={sidebarRef}
          className="z-50 px-4 pt-5 pb-12 w-80 max-w-xs min-h-full bg-white dark:bg-slate-900 sm:px-6"
        >
          <div className="flex justify-between items-center">
            <Link to={'/'}>
              <img src="/images/RemixPWA.png" alt="Remix PWA" className="w-10 h-10" />
            </Link>
            <Disclosure.Button className="relative focus:outline-none focus:ring-0" onClick={() => setNavIsOpen(false)}>
              <XIcon
                className="block w-6 h-6 stroke-2 text-slate-700 dark:text-sky-100"
                stroke="currentColor"
                aria-hidden="true"
              />
            </Disclosure.Button>
          </div>
          <nav className="px-1 mt-5 text-base lg:text-sm">
            <ul className="space-y-8">
              {docList.map((section: { section: string; children: any[] }, index: number) => {
                return (
                  <li className="mt-6 lg:mt-8" key={index}>
                    <h3 className="mb-8 font-semibold text-slate-900 dark:text-slate-200 lg:mb-3">{section.section}</h3>
                    <ul
                      className={
                        'space-y-6 border-l border-slate-100 dark:border-slate-700 lg:space-y-2 lg:dark:border-slate-800'
                      }
                    >
                      {section.children.map(sub => {
                        return (
                          <li className="" key={sub.alternateTitle ?? sub.title}>
                            <NavLink
                              prefetch="intent"
                              to={`/docs/${tag ?? DEFAULT_TAG ?? 'main'}/${sub.slug}`}
                              end={true}
                            >
                              {({ isActive }) => (
                                <span
                                  className={clsx('block pl-4 -ml-px border-l', {
                                    'font-semibold text-sky-500 border-current dark:text-sky-400': isActive,
                                    'border-transparent hover:border-slate-400 dark:hover:border-slate-500': !isActive,
                                    'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300':
                                      !isActive,
                                    'text-slate-400': !isActive,
                                  })}
                                >
                                  {sub.alternateTitle ?? sub.title}
                                  {' '}
                                  {sub.stub ? <Stub /> : null}
                                </span>
                              )}
                            </NavLink>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </animated.div>
    ) : null
  )
}

export default function Header({
  section,
  title,
}: {
  title: string
  section: string
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { versions } = useRouteLoaderData('root') as { versions: string[] }
  const { stars, forks, fullName, url } = useRouteLoaderData<any>('routes/docs.$tag')
  // const stars = 100;
  // const forks = 10;
  // const fullName = 'remix-pwa/monoepo';
  // const url = 'https://github.com'

  const [navIsOpen, setNavIsOpen] = useState(false)
  const [isOpaque, setIsOpaque] = useState(false)
  const [currentTag, setTag] = useState(location.pathname.split('/')[2])

  useEffect(() => {
    // Duplicate of sidebar provider
    setTag(location.pathname.split('/')[2])
  }, [location.pathname])

  useEffect(() => {
    const offset = 50

    function onScroll() {
      if (!isOpaque && window.scrollY > offset) {
        setIsOpaque(true)
      } else if (isOpaque && window.scrollY <= offset) {
        setIsOpaque(false)
      }
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [isOpaque])

  useEffect(() => {
    setNavIsOpen(false)

    const resizeHandler = (e: UIEvent) => {
      const target = e.target as Window

      if (target.innerWidth > 1024) {
        setNavIsOpen(false)
      }
    }

    if (typeof window !== 'undefined') {
      document.addEventListener('resize', resizeHandler)
    }

    return () => document.removeEventListener('resize', resizeHandler)
  }, [location.pathname])

  return (
    <Disclosure
      as="div"
      className={clsx(
        'sticky top-0 z-40 w-full flex-none backdrop-blur dark:border-slate-50/[0.06] lg:z-50 lg:border-b lg:border-slate-900/10',
        isOpaque
          ? 'bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75'
          : 'bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent'
      )}
    >
      {({ open }) => (
        <>
          {/* --- Mobile Sidebar here --- */}
          <MobileSidebar navIsOpen={navIsOpen} setNavIsOpen={setNavIsOpen} />
          <div className="mx-auto max-w-8xl">
            <div
              className={
                'py-2 mx-4 border-b border-slate-900/10 dark:border-slate-300/10 md:py-3 lg:mx-0 lg:border-0 lg:px-8 lg:py-4'
              }
            >
              <div className="flex relative content-center items-center">
                <Link aria-label="Home page" to="/" reloadDocument className="md:flex">
                  <img
                    src="/images/RemixPWA.png"
                    alt="Remix PWA"
                    className="self-center mr-1 text-center size-8 md:size-9"
                  />
                  <span className="sr-only">Remix PWA home page</span>
                  {/* <p className="hidden relative text-4xl font-bold font-benzin text-slate-700 dark:text-sky-100 md:flex">
                    <img
                      src="/images/RemixPWA.png"
                      alt="Remix PWA"
                      className="mr-2.5 h-9 w-9 self-center text-center"
                    />
                    <span className="mr-2">Remix</span>
                    <span className="pr-1 h-full text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 to-sky-300 dark:from-indigo-400 dark:to-sky-200">
                      PWA
                    </span>
                  </p> */}
                </Link>
                {/* eslint-disable-next-line multiline-ternary */}
                {versions.length > 1 ? (
                  <div className="relative ml-4 pt-1.5">
                    <Menu as="div" className="inline-block relative text-left">
                      <div>
                        <Menu.Button className="flex items-center px-3 py-1 space-x-2 text-sm font-medium leading-5 text-gray-500 rounded-full dark:text-gray-400 dark:highlight-white/5 bg-slate-400/10 hover:bg-slate-400/20">
                          {currentTag}
                          <ChevronDownIcon className="ml-2 w-3 h-3 stroke-2 stroke-gray-500 dark:stroke-gray-400" aria-hidden="true" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute left-0 top-full py-2 mt-1 w-40 text-sm font-medium leading-6 bg-white rounded-lg ring-1 shadow origin-top-left dark:highlight-white/5 text-slate-700 ring-slate-900/5 dark:bg-slate-800 dark:text-slate-300">
                          {versions.map((version: string) => (
                            <Menu.Item key={version} disabled={currentTag === version}>
                              {({ active }) => (
                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                                <span
                                  className={clsx(
                                    currentTag === version
                                      ? 'flex items-center justify-between px-3 py-1 text-sky-500 dark:text-sky-400 cursor-pointer'
                                      : 'block px-3 py-1',
                                    active &&
                                    currentTag !== version &&
                                    'cursor-pointer bg-slate-50 text-slate-900 dark:bg-slate-600/30 dark:text-white'
                                  )}
                                  onClick={() => navigate(`/docs/${version}`)}
                                  role="button"
                                  tabIndex={0}
                                >
                                  {version}
                                  {/* eslint-disable-next-line multiline-ternary */}
                                  {currentTag === version ? (
                                    <svg width="24" height="24" fill="none" aria-hidden="true">
                                      <path
                                        d="m7.75 12.75 2.25 2.5 6.25-6.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : null}
                                </span>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : null}
                <div className="flex relative flex-grow gap-6 justify-end basis-0 sm:gap-8">
                  <div className="flex relative gap-6 justify-end content-center basis-0 sm:gap-6 md:flex-grow">
                    {/* Stat keeper */}
                    <nav className="text-sm">
                      <ul className="flex items-center space-x-6">
                        <li className="hidden cursor-pointer lg:flex">
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div className="flex items-center space-x-3 group">
                              <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className='size-5 fill-gray-700 group-hover:fill-gray-900 dark:fill-gray-300 dark:group-hover:fill-gray-200'
                              >
                                <title>{"GitHub"}</title>
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                              </svg>
                              <div className="font-normal">
                                <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-gray-200">
                                  {fullName}
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                  <span className="flex items-center space-x-1">
                                    <svg
                                      className="bg-gray-600 size-3 dark:bg-gray-400 group-hover:bg-gray-700 dark:group-hover:bg-gray-300"
                                      style={{
                                        maskImage: "url('/star.svg')",
                                        maskRepeat: "no-repeat",
                                        maskPosition: "center center",
                                      }}
                                    />
                                    <span>{stars}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <svg
                                      className="bg-gray-600 size-3 dark:bg-gray-400 group-hover:bg-gray-700 dark:group-hover:bg-gray-300"
                                      style={{
                                        maskImage: "url('/fork.svg')",
                                        maskRepeat: "no-repeat",
                                        maskPosition: "center center",
                                      }}
                                    />
                                    <span>{forks}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </nav>
                    {/* Theme Switcher */}
                    <div className="relative z-10">
                      <ThemeSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Breadcrumb section={section} title={title} setIsNavOpen={setNavIsOpen} />
        </>
      )}
    </Disclosure>
  )
}
