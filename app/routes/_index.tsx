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
                <p className="relative hidden font-benzin text-3xl font-bold text-slate-700 dark:text-sky-100 md:flex">
                  <img
                    src="/images/RemixPWA.png"
                    alt="Remix PWA"
                    className="mr-2.5 h-8 w-8 self-center text-center"
                  />
                  <span className="mr-2">Remix</span>
                  <span className="h-full bg-gradient-to-tr from-indigo-500 to-sky-300 bg-clip-text pr-1 text-transparent dark:from-indigo-400 dark:to-sky-200">
                    PWA
                  </span>
                </p>
              </Link>
              <div className="relative flex flex-grow basis-0 justify-end md:flex-grow">
                <Link
                  to={'/docs/main'}
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
                        const anchor = document.createElement('a')
                        anchor.href = 'https://github.com/sponsors/ShafSpecs'
                        anchor.target = '_blank'
                        anchor.rel = 'noreferrer'
                        anchor.click()
                        anchor.remove()
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
                    href="https://github.com/remix-pwa"
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
    <div className="relative mx-auto max-w-5xl py-24 sm:py-32 md:py-40">
      {/* Bg */}
      <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="text-center text-slate-900 dark:text-white">
          <h1 className="font-benzin text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Remix PWA
          </h1>
          <h3 className="mb-2.5 mt-4 text-xl font-medium md:text-3xl lg:text-4xl">
            A PWA Framework that redefines web experiences.
          </h3>
          <span className="text-slate-500 dark:text-slate-400 sm:text-lg md:text-xl">
            Unlock the future of web artistry with Remix PWA 🔑. Powered by Vite
            ⚡, craft Progressive Web Apps that redefine the boundaries of
            creativity and performance 🚀. Your digital canvas awaits! 👩‍🎨
          </span>
        </div>
        <div className="mx-auto mt-10 w-full max-w-sm sm:flex sm:w-fit sm:max-w-none sm:justify-center">
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link
              to="/docs/main"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-slate-800 shadow-sm hover:bg-blue-50 sm:px-8"
            >
              Get Started
            </Link>
            <a
              aria-label="GitHub"
              href="https://github.com/remix-pwa/monorepo"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center rounded-md bg-slate-700 px-4 py-3 font-medium text-white hover:bg-slate-800"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="mr-2.5 h-6  w-6 fill-white group-hover:fill-slate-100 dark:group-hover:fill-slate-300 sm:mr-3"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path>
              </svg>
              <span>Source Code</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function LandingCard({ description, icon, title }: any) {
  return (
    <div className="background-gradient group relative isolate flex flex-1 flex-col rounded-xl shadow ring-1 ring-gray-200 before:absolute before:-inset-[2px] before:z-[-1] before:hidden before:h-[calc(100%+4px)] before:w-[calc(100%+4px)] before:rounded-[13px] dark:ring-gray-800 before:lg:block">
      <div className="flex flex-1 flex-col divide-y divide-gray-200 overflow-hidden rounded-xl bg-white transition-[background-opacity] hover:bg-opacity-90 dark:divide-gray-800 dark:bg-gray-900 dark:hover:bg-opacity-90">
        <div className="flex flex-1 flex-col gap-x-8 gap-y-4 rounded-xl px-4 py-5 sm:p-6">
          <div className="">
            <div className="pointer-events-none mb-2">
              <span
                className="icon flex-shrink-0 !text-2xl text-gray-900 dark:text-white"
                style={{
                  fontSize: '1em',
                  lineHeight: '1em',
                  width: '1em',
                  height: '1em',
                }}
              >
                {icon}
              </span>
            </div>
            <p className="truncate text-base font-bold text-gray-900 dark:text-white">
              {title}
            </p>
            <p className="mt-1 text-[15px] text-gray-500 dark:text-gray-400">
              <p className="max-w-[65ch]">
                <p className="m-0">{description}</p>
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Features() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-nasa text-3xl text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          One PWA Framework to rule them all
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center font-nunito font-light text-slate-900 dark:text-white sm:mt-5 sm:text-lg md:text-xl">
          Create captivating native experiences with each line of code, where
          imagination knows no bounds.
        </p>
      </div>
      <div className="mt-8 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:mt-10 sm:grid-cols-2 sm:px-6 lg:px-8 xl:grid-cols-3">
        <LandingCard
          title="Vite"
          icon="⚡"
          description="Faster bundling, faster loading, faster everything. Vite is a next-generation front-end tooling that's blazing fast."
        />
        <LandingCard
          title="Compact"
          icon="💼"
          description="Compact and lightweight, Remix PWA is now much lighter than before."
        />
        <LandingCard
          title="Worker Route APIs"
          icon="🪧"
          description="Bringing the power of Service Workers into your routes."
        />
        <LandingCard
          title="TypeScript"
          icon="🦺"
          description="TypeScript support out-of-the-box."
        />
        <LandingCard
          title="Runtimes"
          icon="⚙️"
          description="Swappable runtimes to customise the flow and behaviour of your entire application."
        />
        <LandingCard
          title="Cache API"
          icon="💰"
          description="Powerful and extensible caching capabilities to supercharge your PWA's performance."
        />
        <LandingCard
          title="Background Sync"
          icon="🔁"
          description="Reliably synchronise data with your server. Even when offline."
        />
        <LandingCard
          title="PWA Hooks"
          icon="🪝"
          description="Take your PWA even farther with utility hooks that makes life easier."
        />
        <LandingCard
          title="Web Manifest"
          icon="📜"
          description="Scaffold Web App Manifests for your PWA with typings and ease"
        />
      </div>
    </div>
  )
}

const sponsors = [
  {
    image:
      'https://images.opencollective.com/anirudh-ravichandran/f6363f4/avatar/256.png?height=256',
  },
  {
    image:
      'https://images.opencollective.com/rphlmr/34235d1/avatar/256.png?height=256',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/18480956?v=4',
  },
  {
    image:
      'https://pbs.twimg.com/profile_images/1178585409271582720/I7FgUqMz_400x400.jpg',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/1288694?v=4',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/2639639?s=52&v=4',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/82425492?v=4',
  },
]

// Have a loader, load this in dynamically ig
function Sponsor({ image, link }: any) {
  return (
    <div className="h-12 w-12 rounded-full sm:h-16 sm:w-16">
      {/* <a href={link} target="_blank" rel="noreferrer"> */}
      <div>
        <img src={image} alt="Sponsor" className="rounded-full" />
      </div>
    </div>
  )
}

function Sponsors() {
  return (
    <div className="py-12 sm:py-20">
      <h3 className="mx-auto mb-10 text-center font-nasa text-2xl sm:mb-12 sm:text-3xl lg:text-4xl">
        💖 Sponsors
      </h3>
      <div className="mx-auto grid max-w-lg grid-cols-7 content-center items-center justify-center px-8 align-middle">
        {sponsors.map((sponsor, index) => (
          <Sponsor key={index} {...sponsor} />
        ))}
      </div>
      <a
        aria-label="GitHub Sponsor"
        href="https://github.com/sponsors/ShafSpecs"
        target="_blank"
        rel="noreferrer"
        className="mx-auto mt-6 flex max-w-64 items-center justify-center rounded-md bg-slate-700 px-4 py-2 text-white hover:bg-slate-800 sm:mt-8"
      >
        <HeartIcon className="mr-2 h-6 w-6 text-pink-500" />
        <span>Become a Sponsor</span>
      </a>
    </div>
  )
}

const contributors = [
  {
    image: 'https://avatars.githubusercontent.com/u/69679506?v=4',
    link: 'https://github.com/ShafSpecs',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/850110?s=64&v=4',
    link: 'https://github.com/lfantone',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/1770453?s=64&v=4',
    link: 'https://github.com/Sarabadu',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/20722140?s=64&v=4',
    link: 'https://github.com/rphlmr',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/1288694?s=64&v=4',
    link: 'https://github.com/wKovacs64',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/89535738?s=64&v=4',
    link: 'https://github.com/dev-afzalansari',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/71537341?s=60&v=4',
    link: 'https://github.com/Brocktho',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/104901333?s=60&v=4',
    link: 'https://github.com/gemmomoh',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/19698171?s=64&v=4',
    link: 'https://github.com/theeomm',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/104366355?s=64&v=4',
    link: 'https://github.com/rahuljha4171',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/44510263?s=64&v=4',
    link: 'https://github.com/maxxborer',
  },
]

function Contributors() {
  return (
    <div className="px-4 py-12 sm:py-20">
      <h3 className="mx-auto mb-10 text-center font-nasa text-2xl sm:mb-12 sm:text-3xl lg:text-4xl">
        Made by the community
      </h3>
      <a
        href="https://github.com/remix-pwa/monorepo/graphs/contributors"
        className=""
      >
        <img
          src="https://contrib.rocks/image?repo=remix-pwa/monorepo"
          className="mx-auto"
          alt="Contributors"
        />
      </a>
    </div>
  )
}

export default function Index() {
  return (
    <div className="flex h-screen w-full flex-col dark:text-white">
      <Header />
      <div className="h-full flex-1">
        <Hero />
        <Features />
        <Sponsors />
        <Contributors />

        <footer>
          <div className="mx-auto max-w-5xl pb-8 pt-12">
            <div className="text-center text-slate-900 dark:text-white">
              <p className="text-sm font-light">
                Made with ❤️ by the&nbsp;
                <a
                  href="https://github.com/orgs/remix-pwa/people"
                  className="hover:underline"
                >
                  Remix PWA team
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
