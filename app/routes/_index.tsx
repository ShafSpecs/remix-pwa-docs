import { Disclosure } from '@headlessui/react'
import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import clsx from 'clsx'
import { HeartIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ThemeSwitcher } from '~/components/ThemeSwitcher'
import { useWindowSize } from '~/hooks/useWindowSize'
export const loader = () => {
  return null
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Remix PWA',
    },
    {
      name: 'description',
      content: 'The home of Remix PWA. A PWA Framework that redefines web experiences.',
    },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:creator', content: '@ShafSpecs' },
    { property: 'twitter:title', content: 'Remix PWA Docs' },
    {
      property: 'twitter:image',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/-/preview/1200x630/-/quality/smart_retina/-/format/auto/',
    },
    { property: 'og:title', content: 'Remix PWA Docs' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://remix-pwa.run' },
    {
      property: 'twitter:description',
      content: 'The home of Remix PWA. A PWA Framework that redefines web experiences.',
    },
    { property: 'og:locale', content: 'en_US' },
    {
      property: 'og:image',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/-/preview/1200x630/-/quality/smart_retina/-/format/auto/',
    },
    {
      property: 'og:image:url',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/-/preview/1200x630/-/quality/smart_retina/-/format/auto/',
    },
    {
      property: 'og:image:secure_url',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/-/preview/1200x630/-/quality/smart_retina/-/format/auto/',
    },
    { property: 'og:image:alt', content: 'Remix PWA Documentation' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/png' },
    {
      property: 'og:description',
      content: 'The home of Remix PWA. A PWA Framework that redefines web experiences.',
    },
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
              'py-2 mx-4 border-b border-slate-900/10 dark:border-slate-300/10 md:py-3 lg:mx-0 lg:border-0 lg:px-8 lg:py-4'
            }
          >
            <div className="flex relative content-center items-center">
              <Link aria-label="Home page" to="/" reloadDocument className="md:flex">
                <img
                  src="/images/RemixPWA.png"
                  alt="Remix PWA"
                  className="self-center mr-1 w-8 h-8 text-center md:hidden"
                />
                <span className="sr-only">Remix PWA home page</span>
                <p className="hidden relative text-3xl font-bold font-benzin text-slate-700 dark:text-sky-100 md:flex">
                  <img src="/images/RemixPWA.png" alt="Remix PWA" className="mr-2.5 h-8 w-8 self-center text-center" />
                  <span className="mr-2">Remix</span>
                  <span className="pr-1 h-full text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 to-sky-300 dark:from-indigo-400 dark:to-sky-200">
                    PWA
                  </span>
                </p>
              </Link>
              <div className="flex relative flex-grow justify-end basis-0 md:flex-grow">
                <Link
                  to={'/docs/main'}
                  className="relative top-0.5 content-center justify-end text-sm font-medium dark:text-white"
                >
                  {width > 420 ? 'Documentation' : 'Docs'}
                </Link>
                <div className="flex relative gap-6 justify-end content-center pl-4 ml-4 border-l basis-0 border-slate-200 dark:border-slate-800 sm:gap-6">
                  {/* <button type="button" className="flex w-6 h-6 lg:hidden">
                      <SearchIcon className="flex-none w-6 h-6 text-slate-400 group-hover:fill-slate-500 dark:text-slate-500 md:group-hover:text-slate-400" />
                      <span className="select-none sr-only">Search docs</span>
                    </button> */}
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
                      className="w-6 h-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300"
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
    <div className="relative py-24 mx-auto max-w-5xl sm:py-32 md:py-40">
      {/* Bg */}
      <div className="flex flex-col px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center text-slate-900 dark:text-white">
          <h1 className="text-4xl font-bold tracking-tight font-benzin sm:text-5xl lg:text-6xl">Remix PWA</h1>
          <h3 className="mb-2.5 mt-4 text-xl font-medium md:text-3xl lg:text-4xl">
            A PWA Framework that redefines web experiences.
          </h3>
          <span className="text-slate-500 dark:text-slate-400 sm:text-lg md:text-xl">
            Unlock the future of web artistry with Remix PWA 🔑. Powered by Vite ⚡, craft Progressive Web Apps that
            redefine the boundaries of creativity and performance 🚀. Your digital canvas awaits! 👩‍🎨
          </span>
        </div>
        <div className="mx-auto mt-10 w-full max-w-sm sm:flex sm:w-fit sm:max-w-none sm:justify-center">
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            <Link
              to="/docs/main"
              className="flex justify-center items-center px-4 py-3 text-base font-medium bg-white rounded-md border border-transparent shadow-sm text-slate-800 hover:bg-blue-50 sm:px-8"
            >
              Get Started
            </Link>
            <a
              aria-label="GitHub"
              href="https://github.com/remix-pwa/monorepo"
              target="_blank"
              rel="noreferrer"
              className="flex justify-center items-center px-4 py-3 w-full font-medium text-white rounded-md bg-slate-700 hover:bg-slate-800"
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
        <div className="flex flex-col flex-1 gap-y-4 gap-x-8 px-4 py-5 rounded-xl sm:p-6">
          <div className="">
            <div className="mb-2 pointer-events-none">
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
            <p className="text-base font-bold text-gray-900 truncate dark:text-white">{title}</p>
            <div className="mt-1 text-[15px] text-gray-500 dark:text-gray-400">
              <div className="max-w-[65ch]">
                <p className="m-0">{description}</p>
              </div>
            </div>
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
        <h2 className="text-3xl text-center text-gray-900 font-nasa dark:text-white sm:text-4xl lg:text-5xl">
          One PWA Framework to rule them all
        </h2>
        <p className="mx-auto mt-4 max-w-3xl font-light text-center font-nunito text-slate-900 dark:text-white sm:mt-5 sm:text-lg md:text-xl">
          Create captivating native experiences with each line of code, where imagination knows no bounds.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 px-4 mx-auto mt-8 max-w-7xl sm:mt-10 sm:grid-cols-2 sm:px-6 lg:px-8 xl:grid-cols-3">
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
        <LandingCard title="TypeScript" icon="🦺" description="TypeScript support out-of-the-box." />
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
    image: 'https://images.opencollective.com/anirudh-ravichandran/f6363f4/avatar/256.png?height=256',
  },
  {
    image: 'https://images.opencollective.com/rphlmr/34235d1/avatar/256.png?height=256',
  },
  {
    image: 'https://avatars.githubusercontent.com/u/18480956?v=4',
  },
  {
    image: 'https://pbs.twimg.com/profile_images/1178585409271582720/I7FgUqMz_400x400.jpg',
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
    <div className="w-12 h-12 rounded-full sm:h-16 sm:w-16">
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
      <h3 className="mx-auto mb-10 text-2xl text-center font-nasa sm:mb-12 sm:text-3xl lg:text-4xl">💖 Sponsors</h3>
      <div className="grid grid-cols-7 gap-x-1.5 justify-center content-center items-center px-8 mx-auto max-w-lg align-middle">
        {sponsors.map((sponsor, index) => (
          <Sponsor key={index} {...sponsor} />
        ))}
      </div>
      <a
        aria-label="GitHub Sponsor"
        href="https://github.com/sponsors/ShafSpecs"
        target="_blank"
        rel="noreferrer"
        className="flex justify-center items-center px-4 py-2 mx-auto mt-6 text-white rounded-md max-w-64 bg-slate-700 hover:bg-slate-800 sm:mt-8"
      >
        <HeartIcon className="mr-2 w-6 h-6 text-pink-500" />
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
      <h3 className="mx-auto mb-10 text-2xl text-center font-nasa sm:mb-12 sm:text-3xl lg:text-4xl">
        Made by the community
      </h3>
      <a href="https://github.com/remix-pwa/monorepo/graphs/contributors" className="">
        <img src="https://contrib.rocks/image?repo=remix-pwa/monorepo" className="mx-auto" alt="Contributors" />
      </a>
    </div>
  )
}

export default function Index() {
  return (
    <div className="flex flex-col w-full h-screen dark:text-white">
      <Header />
      <div className="flex-1 h-full">
        <Hero />
        <Features />
        <Sponsors />
        <Contributors />

        <footer>
          <div className="pt-12 pb-8 mx-auto max-w-5xl">
            <div className="text-center text-slate-900 dark:text-white">
              <p className="text-sm font-light">
                Made with ❤️ by the&nbsp;
                <a href="https://github.com/orgs/remix-pwa/people" className="hover:underline">
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
