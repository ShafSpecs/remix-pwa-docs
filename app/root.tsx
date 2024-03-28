import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { json } from '@remix-run/node'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { ClientHints, getHints } from './components/ClientHint'
import { useTheme } from './hooks/useTheme'
import { getTheme } from './utils/server/theme.server'
import { getVersions } from './utils/server/doc.server'

import './styles/code.css'
import './styles/documentation.css'
import './styles/fonts.css'
import './styles/tailwind.css'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const versions = (await getVersions()) ?? []

  return json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: { theme: getTheme(request) },
    },
    versions,
  })
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Remix PWA',
    },
    {
      name: 'description',
      content:
        'The home of Remix PWA. A PWA Framework that redefines web experiences.',
    },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:creator', content: '@ShafSpecs' },
    { property: 'twitter:title', content: 'Remix PWA Docs' },
    {
      property: 'twitter:image',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/RemixPWA_v3_Poster.png',
    },
    { property: 'og:title', content: 'Remix PWA Docs' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://remix-pwa.run' },
    {
      property: 'twitter:description',
      content:
        'The home of Remix PWA. A PWA Framework that redefines web experiences.',
    },
    { property: 'og:locale', content: 'en_US' },
    {
      property: 'og:image',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/RemixPWA_v3_Poster.png',
    },
    {
      property: 'og:image:url',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/RemixPWA_v3_Poster.png',
    },
    {
      property: 'og:image:secure_url',
      content:
        'https://ucarecdn.com/e5ab139d-5fa2-477b-b3da-2b801252d2d9/RemixPWA_v3_Poster.png',
    },
    { property: 'og:image:alt', content: 'Remix PWA Documentation' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:type', content: 'image/png' },
    {
      property: 'og:description',
      content:
        'The home of Remix PWA. A PWA Framework that redefines web experiences.',
    },
  ]
}

// If you want to wrap your app further or include some shared UI
function App() {
  return <Outlet />
}

export default function Document() {
  const theme = useTheme()

  return (
    <html lang="en" className={`h-full overflow-x-hidden ${theme} antialiased`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <ClientHints />
        <Links />
      </head>
      <body className="bg-background-color">
        <App />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
