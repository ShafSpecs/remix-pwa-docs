import { Link, useLocation } from "@remix-run/react";
import { Fragment, useEffect, useRef, useState } from "react";

/* eslint-disable react/display-name */
import { Disclosure } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useWindowSize } from "usehooks-ts";
import { useTheme } from "~/utils/providers/ThemeProvider";
import { useSidebar } from "~/utils/providers/SidebarProvider";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import RemixLogo from "~/components/RemixLogo";
import { ToggleTheme } from "~/components/ToggleTheme";
import { ClientOnly } from "remix-utils";
import { copyTextToClipboard } from '@remix-pwa/client';

export const ClientHeader = () => {
  const [theme,] = useTheme();

  return (
    <Disclosure
      as="header"
      id="header__main"
      className={`sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-300 dark:shadow-none sm:px-6 lg:px-8 dark:bg-transparent`}
    >
      {({ open }) => (
        <>
          <div className="flex content-center mr-6 lg:hidden">
            {/* Mobile menu button*/}
            <Disclosure.Button className="relative focus:outline-none focus:ring-0" onClick={() => { }}>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block w-6 h-6 stroke-2 stroke-slate-500" aria-hidden="true" />
            </Disclosure.Button>
          </div>
          <div className="relative flex items-center flex-grow basis-0">
            <Link aria-label="Home page" to="/" className="lg:flex">
              <RemixLogo mobile height="h-10" width="w-11" />
              <RemixLogo height="h-9" width="w-10" />

              <p
                className="hidden lg:flex font-[Benzin] font-bold text-slate-700 dark:text-sky-100 text-2xl relative -ml-2.5"
                style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', top: '5.25px' }}
              >
                emix&nbsp;
                <span style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }} className="text-transparent text-[26px] top-[1.5px] bg-clip-text bg-gradient-to-tr from-indigo-500 dark:from-indigo-400 to-sky-300 dark:to-sky-200">
                  PWA
                </span>
              </p>
            </Link>
          </div>
          <div className="mr-6 -my-5 sm:mr-8 md:mr-0">
            <button
              type="button"
              className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96"
            >
              <MagnifyingGlassIcon className="flex-none w-5 h-5 fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" />
              <span className="select-none sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
                Search docs
              </span>
              <kbd className="hidden ml-auto font-medium text-slate-400 dark:text-slate-500 md:block">
                <kbd className="font-sans">Ctrl </kbd>
                <kbd className="font-sans">K</kbd>
              </kbd>
            </button>
          </div>
          <div className="relative flex justify-end gap-6 basis-0 sm:gap-8 md:flex-grow">
            <div className="relative flex content-center justify-end gap-6 basis-0 sm:gap-8 md:flex-grow">
              <label className="sr-only">Theme</label>
              <div className="relative z-10">
                <button
                  className="flex items-center justify-center w-6 h-6 rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
                  onClick={() => { }}
                >
                  {theme === "light" && <SunIcon className="w-4 h-4 fill-sky-400" />}
                  {theme === "dark" && <MoonIcon className="w-4 h-4 fill-sky-400" />}
                </button>
              </div>
              <a
                className="group"
                aria-label="GitHub"
                href="https://github.com/remix-pwa/remix-pwa"
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
        </>
      )}
    </Disclosure>
  )
}

const Header = ({ title, section }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setClosed] = useSidebar();
  const { width } = useWindowSize();
  const location = useLocation();

  useEffect(() => {
    if (width > 1024) {
      setClosed(true);
    }
  }, [setClosed, width]);

  useEffect(() => {
    setClosed(true);
  }, [location.pathname, setClosed]);

  return (
    <Fragment>
      <Disclosure
        as={'div'}
        className={clsx(
          'top-0 z-40 w-full select-none backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06]',
          'bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent'
        )}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-8xl">
              <div
                className={clsx(
                  'py-2 md:py-3 lg:py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10',
                  width <= 1024 ? 'px-4 lg:mx-0' : 'px-4'
                )}
              >
                <div className="relative flex items-center">
                  <Link aria-label="Home page" to="/" className="pointer-events-none md:flex">
                    <span className="sr-only">Remix PWA home page</span>
                    <RemixLogo mobile height="h-10" width="w-11" />
                    <RemixLogo height="h-9" width="w-10" />
                    <p
                      className="hidden md:flex font-[Benzin] font-bold text-slate-700 dark:text-sky-100 text-2xl relative -ml-2.5"
                      style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text', top: '5.25px' }}
                    >
                      emix&nbsp;
                      <span style={{ backgroundClip: 'text', WebkitBackgroundClip: 'text' }} className="text-transparent text-[26px] top-[1.5px] bg-clip-text bg-gradient-to-tr from-indigo-500 dark:from-indigo-400 to-sky-300 dark:to-sky-200">
                        PWA
                      </span>
                    </p>
                  </Link>
                  <div className="relative flex justify-end flex-grow basis-0">
                    <Link to={"/docs/installation"} className="relative content-center justify-end text-sm font-semibold top-0.5 dark:text-white">{width > 420 ? 'Documentation' : 'Docs'}</Link>
                    <div className="relative flex content-center justify-end gap-4 pl-4 ml-4 border-l sm:gap-6 sm:pl-6 sm:ml-6 basis-0 md:gap-8 md:flex-grow border-slate-200 dark:border-slate-800 max-w-fit">
                      <label className="sr-only">Theme</label>
                      <div className="relative z-10">
                        <ToggleTheme />
                      </div>
                      <a
                        className="group"
                        aria-label="GitHub"
                        href="https://github.com/remix-pwa/remix-pwa"
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
          </>
        )}
      </Disclosure>
    </Fragment>
  );
};

const Hero = () => {
  const [copied, setCopied] = useState(false);

  const copyToClicpboard = () => {
    navigator.clipboard.writeText("npx remix-pwa@latest init");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <section className="relative px-4" data-remix-pwa-hero>
      <section className="max-w-5xl pt-20 mx-auto sm:pt-24 lg:pt-32">
        <div className="flex mt-5 font-[Benzin] text-center w-full font-bold text-slate-900 dark:text-white text-4xl tracking-tight sm:text-5xl lg:text-6xl">A Remix PWA Framework that redefines web experiences.</div>
        <p className="max-w-3xl mx-auto mt-5 text-lg text-center md:text-xl xl:text-xl text-slate-600 dark:text-slate-400">Unleash Remix PWA, the PWA artisan's toolbox, where innovation meets limitless creativity. Craft captivating, lightning-fast PWAs with ease ⚡️. Your canvas: the browser 🎨. Your medium: Remix's visionary class of app alchemy 🦄.</p>
        <div className="flex justify-center mt-6 space-x-6 sm:mt-10">
          <Link to={"/docs/installation"} className="flex items-center justify-center w-full h-12 px-6 font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 sm:w-auto dark:bg-sky-600 dark:highlight-white/20 dark:hover:bg-sky-500">Get Started</Link>
          <div className="bg-gradient-to-r p-0.5 shadow-sm dark:from-sky-600 from-slate-900 to-blue-500 h-12 via-red-600 rounded-lg dark:to-purple-500 text-white hidden sm:flex">
            <div className="flex items-center bg-gray-800 rounded-lg dark:bg-gray-600 h-11">
              <svg
                data-hk="0-0"
                width={22}
                height={13}
                viewBox="0 0 22 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative block w-3 ml-4 mr-2 -rotate-90 "
              >
                <path d="M1 1L11 11L21 1" stroke="currentColor" strokeWidth={2} />
              </svg>
              <code data-code="" className="flex-1 leading-none text-left code">
                npx remix-pwa@latest init
              </code>
              <div className="relative">
                {!copied ? <button
                  data-copy-button=""
                  onClick={copyToClicpboard}
                  className="block p-4 transition hover:scale-110 active:scale-100 active:transition-none"
                  title="Copy to clipboard"
                >
                  <svg
                    className="w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button> : <div className="block p-4"><CheckIcon className="w-5 h-5 text-current strke-2" /></div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

// const Testimonials = () => {
//   return (
//     <div className="max-w-5xl pt-20 mx-auto sm:pt-24 lg:pt-36">
//       <span>The Remix PWA Framework that redefines web experiences.</span>
//     </div>
//   )
// }

const Features = () => {
  const mainFeatRed = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (typeof window !== undefined) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("show-custom", entry.isIntersecting);
        })
      })

      Array.from(mainFeatRed.current.children).forEach((child) => observer.observe(child));
    }
  }, [])

  return (
    <Fragment>
      <div className="max-w-5xl px-4 pt-24 mx-auto sm:pt-28 lg:pt-40">
        <h3 className="text-2xl font-[Nasa] font-medium tracking-tight text-center text-slate-900 dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">One PWA Framework to rule them all</h3>
        <p className="max-w-3xl mx-auto mt-5 font-light text-center sm:mt-6 sm:text-lg md:text-xl text-slate-900 dark:text-white">Create captivating native experiences with each line of code, where imagination knows no bounds.</p>
      </div>
      <div ref={mainFeatRed} className="grid grid-cols-1 gap-4 px-4 mt-12 opacity-100 pointer-events-none sm:grid-cols-2 lg:grid-cols-4 sm:mt-14 lg:mt-16">
        <div className="flex flex-col w-full bg-indigo-500 rounded-lg hidden-custom feature dark:bg-indigo-800">
          <div className="w-full rounded-t-lg h-28 sm:h-36 lg:h-40 bg-hero-topography-purple-400-100 dark:bg-hero-topography-purple-500-100"></div>
          <div className="px-2 mt-4 mb-2 text-white lg:mb-0">
            <p className="font-[Nasa] text-xl">Cache Mastery 🕸️</p>
            <blockquote className="my-2 text-sm italic font-light">"Cache control, the way it should be - in your hands!"</blockquote>
            <p>Take control of your cache like a boss. Our cache management tools make sure your app's data is always fresh.</p>
          </div>
        </div>
        <div className="w-full text-white bg-blue-600 rounded-lg hidden-custom feature dark:bg-blue-800">
          <div className="w-full h-28 sm:h-36 lg:h-40 dark:bg-hero-slanted-stars-sky-600-100 bg-hero-slanted-stars-sky-400-100"></div>
          <p className="font-[Nasa] text-xl mt-4 px-2">Offline Magic 🌐</p>
          <blockquote className="px-2 my-2 text-sm italic font-light">"Don't let a spotty connection spoil the party. Our PWA sorcery lets users interact even when they're off the grid."</blockquote>
          <p className="px-2 mb-2 lg:mb-0">Dance like no one's watching, even when there's no Wi-Fi!</p>
        </div>
        <div className="w-full text-white bg-red-500 rounded-lg hidden-custom feature dark:bg-red-700">
          <div className="w-full h-28 sm:h-36 lg:h-40 dark:bg-hero-circuit-board-amber-600-100 bg-hero-circuit-board-amber-500-100"></div>
          <p className="font-[Nasa] text-xl mt-4 px-2">Worker Route APIs 🏞️</p>
          <blockquote className="px-2 my-2 text-sm italic font-light">"Workers on a mission - our route APIs are the GPS to your app's success!"</blockquote>
          <p className="px-2 mb-2">Get your workers working wonders with our route APIs. Shape your app's destiny with granular control over requests and responses.</p>
        </div>
        <div className="w-full text-white rounded-lg hidden-custom feature dark:bg-slate-700 bg-slate-600">
          <div className="w-full h-28 sm:h-36 lg:h-40 bg-hero-floating-cogs-emerald-500-100"></div>
          <p className="font-[Nasa] text-xl mt-4 px-2">Syncing Synced Right ⚙️</p>
          <blockquote className="px-2 my-2 text-sm italic font-light">"Syncing so smooth, it's like a dance party for your data!"</blockquote>
          <p className="px-2 mb-2 md:mb-0">Our sync feature ensures your data syncs like a perfectly choreographed dance. Never miss a beat, even when offline 💃.</p>
        </div>
      </div>
      <Link to={"/docs/installation"} className="flex content-center justify-center px-6 py-3 mx-auto my-8 font-semibold text-center text-white transition-all rounded-lg cursor-pointer hover:shadow-md glow-on-hover bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-0 sm:w-auto dark:bg-sky-600 dark:hover:bg-sky-500 dark:highlight-white/20">
        Blast Off 🚀
      </Link>
    </Fragment>
  )
}

const Sponsor = ({
  name,
  image,
  tag
}: {
  name: string;
  image: string;
  tag: string;
}) => {
  return (
    <div className="flex flex-col content-center">
      <img className="w-20 mx-auto rounded-full sm:h-20 lg:w-24 lg:h-24" src={image} alt={name} />
      <span className="mt-2 text-sm text-center dark:text-white text-slate-900 sm:text-base">{name}</span>
      <p className="text-xs text-center pointer-events-none sm:text-sm dark:text-gray-500 text-slate-400">{tag}</p>
    </div>
  )
}

const Sponsors = () => {
  return (
    <div className="max-w-5xl px-4 pt-12 mx-auto sm:pt-20 lg:pt-24">
      <h3 className="max-w-4xl text-xl font-semibold tracking-tight text-center text-slate-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl">Remix PWA is free, and Open Source Software made possible by our awesome sponsors</h3>
      <div className="grid grid-cols-2 mt-8 gap-y-4 sm:grid-cols-4 sm:mt-10 lg:mt-12">
        <Sponsor name={"Anirudh Ravichandran"} image={"https://images.opencollective.com/anirudh-ravichandran/f6363f4/avatar/256.png?height=256"} tag="@aniravi24" />
        <Sponsor name={"Raphaël Moreau"} image={"https://images.opencollective.com/rphlmr/34235d1/avatar/256.png?height=256"} tag="@rphlmr" />
        <Sponsor name={"Alem Tuzlak"} image={"https://media.licdn.com/dms/image/D4D03AQH_TaZ3S3vfbg/profile-displayphoto-shrink_400_400/0/1677009352791?e=1700697600&v=beta&t=UdUzKEwPXj2yabvQDuolTZMiz_TS_N2YQQ95UBuYg1Y"} tag="@AlemTuzlak" />
        <Sponsor name={"Onur Guvenc"} image={"https://pbs.twimg.com/profile_images/1178585409271582720/I7FgUqMz_400x400.jpg"} tag="@OnurGvnc" />
      </div>
      <div className="flex flex-col justify-center mt-6 sm:space-x-6 sm:flex-row sm:mt-10">
        <a href={"https://opencollective.com/remix-pwa"} target="_blank" className="flex content-center justify-center px-6 py-3 my-6 font-semibold text-center text-white transition-all rounded-lg cursor-pointer hover:shadow-md bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-0 sm:w-fit dark:bg-sky-600 dark:hover:bg-sky-500 dark:highlight-white/20" rel="noreferrer">
          Become a Sponsor 🤝
        </a>
        <a href={"https://www.buymeacoffee.com/shafspecs"} target="_blank" className="flex content-center justify-center px-6 py-3 my-0 font-semibold text-center text-white transition-all rounded-lg cursor-pointer sm:my-6 hover:shadow-md bg-slate-900 hover:bg-yellow-300 focus:outline-none focus:ring-0 sm:w-fit dark:bg-sky-600 dark:hover:bg-yellow-500 dark:highlight-white/20" rel="noreferrer">
          Buy me a coffee ☕
        </a>
        <button onClick={() => { copyTextToClipboard('0xf210441358C53dA8B210Fa554e91EF5E59e69d56'); alert('Copied text to clipboard') }} className="flex content-center justify-center px-6 py-3 my-6 font-semibold text-center text-white transition-all rounded-lg cursor-pointer hover:shadow-md bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-0 sm:w-fit dark:bg-sky-600 dark:hover:bg-sky-500 dark:highlight-white/20">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026" alt="ETH" className="w-5 h-5" />
          <p>ETH Address</p>
        </button>
      </div>
    </div>
  )
}

const Contributor = ({
  name,
  image,
  tag
}: {
  name: string;
  image: string;
  tag: string;
}) => {
  return (
    <div className="flex flex-col content-center">
      <img className="w-16 h-16 mx-auto bg-gray-400 rounded-full sm:w-24 sm:h-24" src={image} alt={name} />
      <span className="mt-2 text-sm text-center dark:text-white text-slate-900 sm:text-base">{name}</span>
      <a target="_blank" href={`https://github.com/${tag}`} className="text-xs text-center hover:underline sm:text-sm dark:text-gray-500 text-slate-400" rel="noreferrer">@{tag}</a>
    </div>
  )
}

const Contributors = () => {
  return (
    <div className="max-w-6xl px-4 pt-12 mx-auto mb-10 sm:mb-12 lg:mb-16 sm:pt-16 lg:pt-20">
      <h3 className="max-w-4xl mx-auto text-xl font-semibold tracking-tight text-center text-slate-900 dark:text-white sm:text-2xl md:text-3xl lg:text-4xl">Meet the contributors who made it possible 🔥</h3>
      <div className="grid items-center grid-cols-2 mt-8 justify-items-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 sm:mt-10 lg:mt-12 gap-y-3 sm:gap-y-4 md:gap-y-5 lg:gap-y-6">
        <Contributor name="Abdur-Rahman" tag="ShafSpecs" image="https://res.cloudinary.com/practicaldev/image/fetch/s--9tLJDBpM--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/546793/1c00bcbe-7c8d-4542-8b15-9749590a82e4.png" />
        <Contributor name="Juan Pablo Garcia Ripa" tag="Sarabadu" image="https://polywork-images-proxy.imgix.net/https%3A%2F%2Fwww.polywork.com%2Fsarabadu%2Favatar%3Fversion%3Da6ffaadfe839b24d4df87755c28d70b4?ixlib=rails-4.3.1&w=512&h=512&fit=crop&auto=format&s=8c0bb007de5468f4d1ebab175f507143" />
        <Contributor name="Luciano Fantone" tag="lfantone" image="https://avatars.githubusercontent.com/u/850110?v=4" />
        <Contributor name="Afzal Ansari" tag="dev-afzalansari" image="https://th.bing.com/th/id/OIP.Y3NZ-BbQ0mC-xKOxl5rCggAAAA?pid=ImgDet&rs=1" />
        <Contributor name="Douglas Harrington Muhone" tag="theeomm" image="https://avatars.githubusercontent.com/u/19698171?v=4" />
        <Contributor name="Brock Donahue" tag="Brocktho" image="https://avatars.githubusercontent.com/u/71537341?v=4" />
        <Contributor name="Gabriel Momoh" tag="gemmomoh" image="https://pbs.twimg.com/profile_images/1585030149711577088/tPM35dWo_400x400.jpg" />
        <Contributor name="
Mette Nordqvist" tag="mettson" image="https://media.licdn.com/dms/image/C4E03AQGxS4Ih2emjQg/profile-displayphoto-shrink_400_400/0/1580890593861?e=1700697600&v=beta&t=cDg3HBTXWDcMtqBI9DPx_D5KUCPa9R7yXbG8r390j14" />
        <Contributor name="Rahul Jha" tag="rahuljha4171" image="https://avatars.githubusercontent.com/u/104366355?v=4" />
        <Contributor name="Maxx Borer" tag="maxxborer" image="https://himalayas.app/_next/image?url=https%3A%2F%2Fcdn-images.himalayas.app%2Fz9c3j6bc5n3ghejx5npgjkuuakrm&w=256&q=100" />
        <Contributor name="Raphaël Moreau" tag="rphlmr" image="https://images.opencollective.com/rphlmr/34235d1/avatar/256.png?height=256" />
        <Contributor name="Fredrik Hillbert" tag="FredrikHillbert" image="https://media.licdn.com/dms/image/C4E03AQHXG5SDUQqUfQ/profile-displayphoto-shrink_400_400/0/1619083330333?e=1700697600&v=beta&t=EDYNGTDjwiyrS4XoWZGDwmF4HEwRexF14zoC_iTMj3A" />
      </div>
      <p className="mt-6 text-center sm:text-lg text-slate-900 dark:text-white lg:text-xl">and more...</p>
      <p className="mt-2 text-xs text-center sm:text-sm text-slate-500 dark:text-gray-400">We appreciate you all ❤️!</p>
    </div>
  )
}

const Footer = () => {
  return (
    <div className="flex justify-between px-4 py-6 border-t sm:px-6 text-slate-900 dark:text-white dark:bg-black">
      <span className="text-lg font-medium pointer-events-none">Remix PWA </span>
      <div>
        <span><a href='https://github.com/remix-pwa/monorepo/blob/main/LICENSE.md' target='_blank' className="hover:underline" rel="noreferrer">MIT License</a>&nbsp;&copy;&nbsp;{new Date().getFullYear()}</span>
      </div>
    </div>
  )
}

export default function Index() {
  return (
    <div className="flex flex-col h-screen overflow-x-hidden">
      <ClientOnly fallback={<div></div>} children={() => <Header />} />
      <Hero />
      <Features />
      <Sponsors />
      <Contributors />
      <div className="px-4 py-24 lg:py-32 dark:bg-gradient-to-b sm:px-6 font-[Nasa] dark:from-slate-900 flex relative flex-col content-center text-center dark:via-black dark:to-black">
        <img src="/images/Doodle.png" className="absolute bottom-0 right-0 block h-32 sm:h-36 lg:h-48 dark:hidden" alt="" />
        <img src="/images/Doodle.png" className="absolute bottom-0 left-0 block h-32 sm:h-36 lg:h-48 dark:hidden -scale-x-100" alt="" />
        <img src="/images/DoodleBlack.png" className="absolute bottom-0 right-0 hidden h-32 sm:h-36 lg:h-48 dark:block" alt="" />
        <img src="/images/DoodleBlack.png" className="absolute bottom-0 left-0 hidden h-32 sm:h-36 lg:h-48 dark:block -scale-x-100" alt="" />
        <p className="relative mx-auto text-xl dark:text-white text-slate-900 sm:text-2xl top-6 sm:top-8 md:text-3xl lg:text-4xl">
          What are we waiting for?
        </p>
        <Link to={"/docs/installation"} className="relative flex content-center justify-center px-6 py-3 mx-auto my-8 font-semibold text-center text-white transition-all rounded-lg cursor-pointer lg:top-6 top-4 hover:shadow-md glow-on-hover bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-0 dark:text-slate-900 sm:w-auto dark:bg-white dark:hover:bg-gray-100">
          Let's Go ✈️
        </Link>
      </div>
      <ClientOnly fallback={<Footer />} children={() => <Footer />} />
    </div>
  )
}