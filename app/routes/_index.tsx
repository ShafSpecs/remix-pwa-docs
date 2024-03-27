import type { MetaFunction } from '@remix-run/node'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from '@remix-run/react'
import { HeartIcon } from 'lucide-react'
import { Disclosure } from '@headlessui/react'

import { ThemeSwitcher } from '~/components/ThemeSwitcher'
import { useWindowSize } from '~/hooks/useWindowSize'
export const loader = () => {
  return null
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix PWA' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

function Header() {
  const [isOpaque, setIsOpaque] = useState(false)
  const { width } = useWindowSize()

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
        <div className="mx-auto max-w-8xl">
          <div
            className={
              'mx-4 border-b border-slate-900/10 py-2 dark:border-slate-300/10 md:py-3 lg:mx-0 lg:border-0 lg:px-8 lg:py-4'
            }
          >
            <div className="relative flex content-center items-center">
              <Link
                aria-label="Home page"
                to="/"
                reloadDocument
                className="md:flex"
              >
                <img
                  src="/images/RemixPWA.png"
                  alt="Remix PWA"
                  className="mr-1 h-8 w-8 self-center text-center md:hidden"
                />
                <span className="sr-only">Remix PWA home page</span>
                <p className="relative hidden font-benzin text-4xl font-bold text-slate-700 dark:text-sky-100 md:flex">
                  <img
                    src="/images/RemixPWA.png"
                    alt="Remix PWA"
                    className="mr-2.5 h-9 w-9 self-center text-center"
                  />
                  <span className="mr-2">Remix</span>
                  <span className="h-full bg-gradient-to-tr from-indigo-500 to-sky-300 bg-clip-text pr-1 text-transparent dark:from-indigo-400 dark:to-sky-200">
                    PWA
                  </span>
                </p>
              </Link>
              <div className="relative flex flex-grow basis-0 justify-end md:flex-grow">
                <Link
                  to={'/docs/installation'}
                  className="relative top-0.5 content-center justify-end text-sm font-medium dark:text-white"
                >
                  {width > 420 ? 'Documentation' : 'Docs'}
                </Link>
                <div className="relative ml-4 flex basis-0 content-center justify-end gap-6 border-l border-slate-200 pl-4 dark:border-slate-800 sm:gap-6">
                  {/* <button type="button" className="flex h-6 w-6 lg:hidden">
                      <SearchIcon className="h-6 w-6 flex-none text-slate-400 group-hover:fill-slate-500 dark:text-slate-500 md:group-hover:text-slate-400" />
                      <span className="sr-only select-none">Search docs</span>
                    </button> */}
                  <div className="relative z-10">
                    <button
                      className="flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5 hover:dark:bg-slate-600"
                      onClick={() => {
                        window.location.href =
                          'https://github.com/sponsors/ShafSpecs'
                      }}
                    >
                      <HeartIcon className="h-4 w-4 text-pink-500" />
                    </button>
                  </div>
                  <div className="relative z-10">
                    <ThemeSwitcher />
                  </div>
                  <a
                    className="group"
                    aria-label="GitHub"
                    href="https://github.com/ShafSpecs/journal-stack"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  )
}

function Hero() {
  return (
    <div className="relative py-24 sm:py-32 md:py-40">
      {/* Bg */}
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:gap-y-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-benzin">Remix PWA</h1>
        </div>
      </div>
    </div>
  )
}

export default function Index() {
  return (
    <div className="flex h-screen w-full flex-col dark:text-white">
      <Header />
      <div className="h-full flex-1">
        <Hero />
      </div>
    </div>
  )
}
