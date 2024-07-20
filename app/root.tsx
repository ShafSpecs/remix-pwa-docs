import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
// import { DocSearch } from '@docsearch/react'
import { json } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'

import { ClientHints, getHints } from './components/ClientHint'
import { useTheme } from './hooks/useTheme'
import { getTheme } from './utils/server/theme.server'
import { getVersions } from './utils/server/doc.server'
import { Progress } from './components/Progress'

import '@docsearch/css'
import './styles/code.css'
import './styles/documentation.css'
import './styles/fonts.css'
import './styles/tailwind.css'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const versions = (await getVersions()) ?? []

  const algoliaAppId = process.env.ALGOLIA_APP_ID ?? ''
  const algoliaApiKey = process.env.ALGOLIA_API_KEY ?? ''

  return json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: { theme: getTheme(request) },
    },
    env: {
      algoliaAppId,
      algoliaApiKey,
    },
    versions,
  })
}

// If you want to wrap your app further or include some shared UI
function App() {
  return <Outlet />
}

export default function Document() {
  const loaderData = useLoaderData<typeof loader>()
  const theme = useTheme()

  return (
    <html
      lang="en"
      className={`h-full overflow-x-hidden ${theme} antialiased`}
      data-theme={theme}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <ClientHints />
        <link
          rel="preconnect"
          href="https://S80GZZAO4K-dsn.algolia.net"
          crossOrigin="anonymous"
        />
        <Links />
      </head>
      <body className="bg-background-color">
        <App />
        {/* <DocSearch
          apiKey={loaderData.env.algoliaApiKey}
          indexName="remix-pwa"
          appId={loaderData.env.algoliaAppId}
          insights
        /> */}
        <Progress />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
