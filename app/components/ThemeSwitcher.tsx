import { useFetcher } from '@remix-run/react'

import { useTheme } from '~/hooks/useTheme'

export const ThemeSwitcher = () => {
  const fetcher = useFetcher()
  const theme = useTheme()

  const themeSwitcher = () => {
    if (theme === 'light') {
      fetcher.submit({ theme: 'dark' }, { method: 'post', action: '/updateTheme' })
    } else if (theme === 'dark') {
      fetcher.submit({ theme: 'light' }, { method: 'post', action: '/updateTheme' })
    }
  }

  const toggleTheme = () => {
    if (!document.startViewTransition) themeSwitcher()

    document.startViewTransition(themeSwitcher)
  }

  return (
    <div className="flex items-center">
      <button
        className="flex justify-center items-center p-2 group"
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          className="block text-gray-400 size-4 dark:hidden group-hover:text-gray-600"
          viewBox="0 0 16 16"
        >
          <g
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            clipPath="url(#clip0_2880_7340)"
          >
            <path d="M8 1.111v.89M12.871 3.129l-.628.628M14.889 8H14M12.871 12.871l-.628-.628M8 14.889V14M3.129 12.871l.628-.628M1.111 8h.89M3.129 3.129l.628.628M8 11.778a3.778 3.778 0 100-7.555 3.778 3.778 0 000 7.555z"></path>
          </g>
          <defs>
            <clipPath id="clip0_2880_7340">
              <path fill="#fff" d="M0 0H16V16H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          className="hidden text-gray-500 size-4 dark:block dark:group-hover:text-gray-300"
          viewBox="0 0 16 16"
        >
          <g clipPath="url(#clip0_2880_7355)">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M11.556 10.444A5.555 5.555 0 016 4.89c0-1.202.385-2.31 1.033-3.22a6.443 6.443 0 001.19 12.775c2.997 0 5.509-2.05 6.23-4.82a5.517 5.517 0 01-2.897.82z"
            ></path>
          </g>
          <defs>
            <clipPath id="clip0_2880_7355">
              <path fill="#fff" d="M0 0H16V16H0z"></path>
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  )
}
