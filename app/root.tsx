import { useState, useEffect } from "react";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation, useMatches } from "@remix-run/react";
import { useLocalStorage } from "usehooks-ts";
import Hero from "./components/hero";
import Header from "./components/header";

import type { LinksFunction, MetaFunction } from "@remix-run/node";

import styles from "./styles/app.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

let isMount = true;

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1"
});

export default function App() {
  let location = useLocation();
  let matches = useMatches();

  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = (e: any) => {
    setScrollTop(e.target.documentElement.scrollTop);
  };

  const [selectedTheme, setSelectedTheme] = useLocalStorage<string | null>("theme", null);

  useEffect(() => {
    let mounted = isMount;
    isMount = false;
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: "REMIX_NAVIGATION",
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest
        });
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready;
          navigator.serviceWorker.controller?.postMessage({
            type: "REMIX_NAVIGATION",
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest
          });
        };
        navigator.serviceWorker.addEventListener("controllerchange", listener);
        return () => {
          navigator.serviceWorker.removeEventListener("controllerchange", listener);
        };
      }
    }
  }, [location]);

  useEffect(() => {
    if (document && document.documentElement) {
      if (
        selectedTheme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        setSelectedTheme("dark");
      } else {
        document.documentElement.classList.remove("dark");
        setSelectedTheme("light");
      }
    } else {
      setSelectedTheme("light");
    }
  }, [selectedTheme, setSelectedTheme]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
  }, []);

  return (
    <html lang="en" className="antialiased">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-slate-900">
        <Header selectedTheme={selectedTheme} scrollTop={scrollTop} setSelectedTheme={setSelectedTheme} />
        {location.pathname == "/" && <Hero />}
        <div className="relative flex justify-center mx-auto max-w-[88rem] sm:px-2 lg:px-8 xl:px-12">
          <div className="hidden ml-5 lg:relative lg:block lg:flex-none">
            <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
            <div className="absolute bottom-0 right-0 hidden w-px h-12 top-16 bg-gradient-to-t from-slate-800 dark:block"></div>
            <div className="absolute bottom-0 right-0 hidden w-px top-28 bg-slate-800 dark:block"></div>
            <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
              <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
                <ul className="space-y-9">
                  <li>
                    <h2 className="font-medium font-display text-slate-900 dark:text-white">Introduction</h2>
                    <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full font-semibold text-sky-500 before:bg-sky-500"
                          href="/"
                        >
                          Getting started
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/installation"
                        >
                          Installation
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <h2 className="font-medium font-display text-slate-900 dark:text-white">Core concepts</h2>
                    <ul className="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/understanding-caching"
                        >
                          Understanding caching
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/predicting-user-behavior"
                        >
                          Predicting user behavior
                        </a>
                      </li>
                      <li className="relative">
                        <a
                          className="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                          href="/docs/basics-of-time-travel"
                        >
                          Basics of time-travel
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          {/* What `Outlet` 'should' technically look like */}
          <div className="flex-auto max-w-2xl min-w-0 px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed quae harum sequi ex assumenda alias architecto
            unde repellat, ullam at, vero asperiores ipsa, ipsam nesciunt blanditiis aut cum autem quisquam? Amet
            deleniti fugiat quam vero, pariatur dolores sed culpa omnis perspiciatis quisquam? Tenetur, atque deserunt
            sapiente veritatis velit ad. Ab voluptatibus culpa, iure accusamus hic molestiae omnis. Magni, sapiente
            officia! Tempore deserunt, autem nihil assumenda minima ab recusandae nesciunt. Omnis eligendi beatae
            laborum corporis possimus saepe porro, quos est nam necessitatibus hic reiciendis tenetur repellendus
            officiis consequatur atque deserunt incidunt. Architecto voluptatem excepturi aut aliquid iste sapiente,
            cupiditate quisquam rerum similique, cumque ex nobis iusto reprehenderit rem doloremque exercitationem
            facere commodi sit illum expedita eum illo culpa error! Commodi, perspiciatis. Dolores repellendus odio
            deleniti laboriosam eaque itaque ab natus, hic explicabo dolorem veniam sed est repudiandae assumenda
            aperiam inventore quia exercitationem placeat voluptas officiis dolor ad modi similique amet. Sit. Eius
            ullam nostrum blanditiis architecto adipisci labore assumenda consequuntur perspiciatis, possimus dolorum
            autem, aliquid ducimus rerum quaerat itaque, qui velit optio ex porro debitis sit placeat temporibus
            quisquam dolores. Repudiandae. Commodi odit soluta sed, animi maiores, aut quasi voluptates nobis beatae vel
            aperiam dolor deserunt necessitatibus mollitia molestias ipsam hic, suscipit pariatur unde alias odio modi?
            Commodi ab necessitatibus nostrum. Corrupti ipsum nesciunt autem quidem pariatur aperiam aspernatur
            praesentium eos, quis, molestiae necessitatibus ea assumenda, incidunt veniam accusamus. Minus pariatur
            perferendis ut ducimus impedit architecto dolorem doloremque. Quia, tempora consequuntur. Libero quisquam
            corporis eum magnam consequatur, inventore officiis assumenda maiores tenetur nesciunt accusamus, rem
            corrupti sunt distinctio nulla nostrum magni quae sapiente illo, dignissimos temporibus fuga eaque
            laboriosam? Explicabo, corrupti! Reiciendis suscipit harum ducimus maxime id deserunt illo amet architecto
            consequatur nobis hic delectus eum repellendus laborum dolorem sequi facere vel, nam molestias laudantium.
            Animi soluta aliquid et eaque reprehenderit. Quam rem nihil qui quo illum eius ipsam quia atque. Dignissimos
            autem repellendus maxime ducimus corrupti sunt, possimus minus labore, quas repudiandae illum aliquam beatae
            et iusto nam deleniti laborum? Soluta quisquam ipsam necessitatibus atque officiis nostrum exercitationem?
            Impedit cum incidunt quos exercitationem rem suscipit dolores assumenda necessitatibus corrupti voluptas
            facere distinctio odit, vel recusandae perspiciatis consequatur, ratione accusamus fuga. Error non ab soluta
            at, adipisci ad quia libero. Necessitatibus nisi repellat eum alias accusantium in eius illum ducimus,
            laudantium sit delectus tempore reiciendis, voluptatibus adipisci distinctio atque sunt nesciunt. Id
            molestias doloribus nisi porro aperiam impedit nam praesentium saepe quaerat tempore natus, quam,
            consectetur amet temporibus assumenda distinctio. Veniam repudiandae tempora, quae laboriosam eaque non
            maxime voluptatum inventore blanditiis. Amet, magni odio quidem quae reprehenderit totam laudantium magnam
            architecto fugit perferendis modi voluptates omnis veniam explicabo impedit iste nobis? Corporis quo modi
            doloribus! Ab officia accusamus blanditiis. Necessitatibus, nam? Dolor minima nulla dignissimos dolorem
            voluptatibus officia itaque laborum aliquid illum, quaerat, adipisci nihil ipsum velit quae provident
            soluta. Minus quia quidem ducimus. Debitis molestiae, eligendi officiis fugit quasi cum? At fugit,
            reprehenderit iure, tempore inventore debitis veritatis accusantium architecto, ducimus nihil cumque
            mollitia aut doloremque voluptates iste aperiam quam exercitationem. Voluptate facere mollitia voluptas
            tempore provident cupiditate, libero eveniet! Quasi sint quaerat facilis eum consectetur non aperiam
            provident reprehenderit obcaecati temporibus impedit culpa, fuga, earum ipsam inventore ullam, commodi quos
            totam ea tempore perferendis illo tenetur amet. Sequi, debitis. Laborum in adipisci facere aliquam porro
            pariatur aperiam repudiandae culpa quas illum, praesentium velit consectetur rerum reprehenderit earum
            delectus explicabo cumque excepturi consequuntur repellat doloribus sed, distinctio fugit animi. Et?
            Provident unde blanditiis cumque suscipit error vel commodi maiores nemo facere nulla? Tenetur amet numquam
            nam, quae quas ab neque, animi vitae sapiente odio explicabo similique, nobis architecto earum ullam.
            Reprehenderit voluptatum temporibus nobis ullam aspernatur natus corrupti officiis. Eius repellat ex sequi
            cum eos animi voluptas ad, autem ducimus tenetur aperiam perferendis assumenda provident, dolorum
            repellendus quod delectus perspiciatis? Qui voluptatibus maxime consequuntur vitae ipsam iure aliquid libero
            voluptas voluptatum dicta nemo aperiam velit, natus quis, ad dolorem non nihil obcaecati impedit tempora
            inventore, nisi tempore eveniet. Labore, quo. Laborum eveniet accusamus aspernatur nemo cupiditate fugit
            magnam. Repellat error, neque quo rerum unde reprehenderit voluptatem explicabo maiores consectetur qui
            esse, quasi fugiat consequatur! Consequatur sed omnis minus id. Sequi! Unde, ut aperiam alias dignissimos
            molestias at accusantium eius fugit quae excepturi, cum pariatur. Explicabo animi facere, libero, ut fuga
            nemo voluptas ipsa perferendis, quo dolore beatae esse. Sapiente, ipsam. Deleniti, minima dolore quo illo
            obcaecati eveniet quam nemo perspiciatis, repellendus ad delectus dolorum cum! Obcaecati vitae aliquid
            voluptas vero voluptatibus soluta numquam quam quidem in, aut sint aliquam ex? Alias voluptas fugiat
            laboriosam repellendus odio ut minima eaque, suscipit dolore recusandae dolorem minus. Similique maiores
            dicta sapiente incidunt aspernatur commodi, voluptatibus nostrum quasi quaerat quibusdam blanditiis sequi,
            obcaecati corporis. Itaque, architecto, repellendus aspernatur qui molestias porro vero doloribus fugit
            provident hic nam eaque quaerat in voluptatum? Delectus quis ipsa, quibusdam at, ullam neque odit recusandae
            dolore nulla voluptatum nemo. Eos officiis quis minima, a suscipit fugiat perspiciatis vitae adipisci
            eveniet laudantium voluptatibus officia perferendis impedit, harum inventore nemo. Provident dolorem ad
            libero inventore laboriosam sint facere modi non doloribus!
          </div>
          <Outlet />
          <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
            <nav aria-labelledby="on-this-page-title" className="w-56">
              <h2 id="on-this-page-title" className="text-sm font-medium font-display text-slate-900 dark:text-white">
                On this page
              </h2>
              <ol className="mt-4 space-y-3 text-sm">
                <li>
                  <h3>
                    <a className="text-sky-500" href="/#quick-start">
                      Quick start
                    </a>
                  </h3>
                  <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#installing-dependencies">
                        Installing dependencies
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#configuring-the-library">
                        Configuring the library
                      </a>
                    </li>
                  </ol>
                </li>
                <li>
                  <h3>
                    <a
                      className="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      href="/#basic-usage"
                    >
                      Basic usage
                    </a>
                  </h3>
                  <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#your-first-cache">
                        Your first cache
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#clearing-the-cache">
                        Clearing the cache
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#adding-middleware">
                        Adding middleware
                      </a>
                    </li>
                  </ol>
                </li>
                <li>
                  <h3>
                    <a
                      className="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      href="/#getting-help"
                    >
                      Getting help
                    </a>
                  </h3>
                  <ol className="pl-5 mt-2 space-y-3 text-slate-500 dark:text-slate-400">
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#submit-an-issue">
                        Submit an issue
                      </a>
                    </li>
                    <li>
                      <a className="hover:text-slate-600 dark:hover:text-slate-300" href="/#join-the-community">
                        Join the community
                      </a>
                    </li>
                  </ol>
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
