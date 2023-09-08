export default function Index() {
  return (
    <div>
      <div className="mb-20 overflow-hidden sm:mb-32 md:mb-40">
        <header className="relative">
          <div className="px-4 sm:px-6 md:px-8">
            <div className="absolute inset-0 bottom-10 bg-bottom bg-no-repeat bg-slate-50 dark:bg-[#0B1120] index_beams__yWcJT">
              <div
                className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent, black)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent, black)"
                }}
              />
            </div>
            <div className="relative flex items-center justify-between pt-6 text-sm font-semibold leading-6 lg:pt-8 text-slate-700 dark:text-slate-200">
              <svg
                viewBox="0 0 248 31"
                className="w-auto h-5 text-slate-900 dark:text-white"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
                  fill="#38bdf8"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M76.546 12.825h-4.453v8.567c0 2.285 1.508 2.249 4.453 2.106v3.463c-5.962.714-8.332-.928-8.332-5.569v-8.567H64.91V9.112h3.304V4.318l3.879-1.143v5.937h4.453v3.713zM93.52 9.112h3.878v17.849h-3.878v-2.57c-1.365 1.891-3.484 3.034-6.285 3.034-4.884 0-8.942-4.105-8.942-9.389 0-5.318 4.058-9.388 8.942-9.388 2.801 0 4.92 1.142 6.285 2.999V9.112zm-5.674 14.636c3.232 0 5.674-2.392 5.674-5.712s-2.442-5.711-5.674-5.711-5.674 2.392-5.674 5.711c0 3.32 2.442 5.712 5.674 5.712zm16.016-17.313c-1.364 0-2.477-1.142-2.477-2.463a2.475 2.475 0 012.477-2.463 2.475 2.475 0 012.478 2.463c0 1.32-1.113 2.463-2.478 2.463zm-1.939 20.526V9.112h3.879v17.849h-3.879zm8.368 0V.9h3.878v26.06h-3.878zm29.053-17.849h4.094l-5.638 17.849h-3.807l-3.735-12.03-3.771 12.03h-3.806l-5.639-17.849h4.094l3.484 12.315 3.771-12.315h3.699l3.734 12.315 3.52-12.315zm8.906-2.677c-1.365 0-2.478-1.142-2.478-2.463a2.475 2.475 0 012.478-2.463 2.475 2.475 0 012.478 2.463c0 1.32-1.113 2.463-2.478 2.463zm-1.939 20.526V9.112h3.878v17.849h-3.878zm17.812-18.313c4.022 0 6.895 2.713 6.895 7.354V26.96h-3.878V16.394c0-2.713-1.58-4.14-4.022-4.14-2.55 0-4.561 1.499-4.561 5.14v9.567h-3.879V9.112h3.879v2.285c1.185-1.856 3.124-2.749 5.566-2.749zm25.282-6.675h3.879V26.96h-3.879v-2.57c-1.364 1.892-3.483 3.034-6.284 3.034-4.884 0-8.942-4.105-8.942-9.389 0-5.318 4.058-9.388 8.942-9.388 2.801 0 4.92 1.142 6.284 2.999V1.973zm-5.674 21.775c3.232 0 5.674-2.392 5.674-5.712s-2.442-5.711-5.674-5.711-5.674 2.392-5.674 5.711c0 3.32 2.442 5.712 5.674 5.712zm22.553 3.677c-5.423 0-9.481-4.105-9.481-9.389 0-5.318 4.058-9.388 9.481-9.388 3.519 0 6.572 1.82 8.008 4.605l-3.34 1.928c-.79-1.678-2.549-2.749-4.704-2.749-3.16 0-5.566 2.392-5.566 5.604 0 3.213 2.406 5.605 5.566 5.605 2.155 0 3.914-1.107 4.776-2.749l3.34 1.892c-1.508 2.82-4.561 4.64-8.08 4.64zm14.472-13.387c0 3.249 9.661 1.285 9.661 7.89 0 3.57-3.125 5.497-7.003 5.497-3.591 0-6.177-1.607-7.326-4.177l3.34-1.927c.574 1.606 2.011 2.57 3.986 2.57 1.724 0 3.052-.571 3.052-2 0-3.176-9.66-1.391-9.66-7.781 0-3.356 2.909-5.462 6.572-5.462 2.945 0 5.387 1.357 6.644 3.713l-3.268 1.82c-.647-1.392-1.904-2.035-3.376-2.035-1.401 0-2.622.607-2.622 1.892zm16.556 0c0 3.249 9.66 1.285 9.66 7.89 0 3.57-3.124 5.497-7.003 5.497-3.591 0-6.176-1.607-7.326-4.177l3.34-1.927c.575 1.606 2.011 2.57 3.986 2.57 1.724 0 3.053-.571 3.053-2 0-3.176-9.66-1.391-9.66-7.781 0-3.356 2.908-5.462 6.572-5.462 2.944 0 5.386 1.357 6.643 3.713l-3.268 1.82c-.646-1.392-1.903-2.035-3.375-2.035-1.401 0-2.622.607-2.622 1.892z"
                  fill="currentColor"
                />
              </svg>
              <div className="flex items-center">
                <button
                  type="button"
                  className="flex items-center justify-center w-8 h-8 -my-1 text-slate-500 hover:text-slate-600 md:hidden dark:hover:text-slate-300"
                >
                  <span className="sr-only">Search</span>
                  <svg
                    width={24}
                    height={24}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m19 19-3.5-3.5" />
                    <circle cx={11} cy={11} r={6} />
                  </svg>
                </button>
                <div className="ml-2 -my-1 -mr-1 md:hidden">
                  <button
                    type="button"
                    className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <span className="sr-only">Navigation</span>
                    <svg width={24} height={24} fill="none" aria-hidden="true">
                      <path
                        d="M12 6v.01M12 12v.01M12 18v.01M12 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    style={{
                      position: "fixed",
                      top: 1,
                      left: 1,
                      width: 1,
                      height: 0,
                      padding: 0,
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: 0,
                      display: "none"
                    }}
                  />
                </div>
                <div className="items-center hidden md:flex">
                  <nav>
                    <ul className="flex items-center gap-x-8">
                      <li>
                        <a
                          className="hover:text-sky-500 dark:hover:text-sky-400"
                          href="/docs/installation"
                        >
                          Docs
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://tailwindui.com/?ref=top"
                          className="hover:text-sky-500 dark:hover:text-sky-400"
                        >
                          Components
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-sky-500 dark:hover:text-sky-400"
                          href="/blog"
                        >
                          Blog
                        </a>
                      </li>
                      <li>
                        <a
                          className="hover:text-sky-500 dark:hover:text-sky-400"
                          href="/showcase"
                        >
                          Showcase
                        </a>
                      </li>
                    </ul>
                  </nav>
                  <div className="flex items-center pl-6 ml-6 border-l border-slate-200 dark:border-slate-800">
                    <label
                      className="sr-only"
                      id="headlessui-listbox-label-:R1jeilb6:"
                      data-headlessui-state=""
                    >
                      Theme
                    </label>
                    <button
                      type="button"
                      id="headlessui-listbox-button-:R2jeilb6:"
                      aria-haspopup="true"
                      aria-expanded="false"
                      data-headlessui-state=""
                      aria-labelledby="headlessui-listbox-label-:R1jeilb6: headlessui-listbox-button-:R2jeilb6:"
                    >
                      <span className="dark:hidden">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-6 h-6"
                        >
                          <path
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            className="fill-sky-400/20 stroke-sky-500"
                          />
                          <path
                            d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                            className="stroke-sky-500"
                          />
                        </svg>
                      </span>
                      <span className="hidden dark:inline">
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
                            className="fill-sky-400/20"
                          />
                          <path
                            d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
                            className="fill-sky-500"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
                            className="fill-sky-500"
                          />
                        </svg>
                      </span>
                    </button>
                    <a
                      href="https://github.com/tailwindlabs/tailwindcss"
                      className="block ml-6 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                    >
                      <span className="sr-only">Tailwind CSS on GitHub</span>
                      <svg
                        viewBox="0 0 16 16"
                        className="w-5 h-5"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative max-w-5xl pt-20 mx-auto sm:pt-24 lg:pt-32">
              <h1 className="text-4xl font-extrabold tracking-tight text-center text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                Rapidly build modern websites without ever leaving your HTML.
              </h1>
              <p className="max-w-3xl mx-auto mt-6 text-lg text-center text-slate-600 dark:text-slate-400">
                A utility-first CSS framework packed with classes like{/* */}{" "}
                <code className="font-mono font-medium text-sky-500 dark:text-sky-400">
                  flex
                </code>
                ,{/* */}{" "}
                <code className="font-mono font-medium text-sky-500 dark:text-sky-400">
                  pt-4
                </code>
                ,{/* */}{" "}
                <code className="font-mono font-medium text-sky-500 dark:text-sky-400">
                  text-center
                </code>{" "}
                {/* */}and{/* */}{" "}
                <code className="font-mono font-medium text-sky-500 dark:text-sky-400">
                  rotate-90
                </code>{" "}
                {/* */}that can be composed to build any design, directly in your
                markup.
              </p>
              <div className="flex justify-center mt-6 space-x-6 text-sm sm:mt-10">
                <a
                  className="flex items-center justify-center w-full h-12 px-6 font-semibold text-white rounded-lg bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
                  href="/docs/installation"
                >
                  Get started
                </a>
                <button
                  type="button"
                  className="items-center hidden h-12 px-4 space-x-3 text-left bg-white rounded-lg shadow-sm sm:flex w-72 ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
                >
                  <svg
                    width={24}
                    height={24}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-none text-slate-300 dark:text-slate-400"
                    aria-hidden="true"
                  >
                    <path d="m19 19-3.5-3.5" />
                    <circle cx={11} cy={11} r={6} />
                  </svg>
                  <span className="flex-auto">Quick search...</span>
                  <kbd className="font-sans font-semibold dark:text-slate-500">
                    <abbr
                      title="Command"
                      className="no-underline text-slate-300 dark:text-slate-500"
                    >
                      ⌘
                    </abbr>{" "}
                    K
                  </kbd>
                </button>
              </div>
            </div>
          </div>

        </header>
      </div>
    </div>
  )
}