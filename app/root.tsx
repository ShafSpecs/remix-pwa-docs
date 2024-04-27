import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { json } from '@remix-run/node'
import { KBarProvider } from 'kbar'
import type { LoaderFunctionArgs } from '@remix-run/node'

import { ClientHints, getHints } from './components/ClientHint'
import { useTheme } from './hooks/useTheme'
import { getTheme } from './utils/server/theme.server'
import { getVersions } from './utils/server/doc.server'
import { Progress } from './components/Progress'
import { Search } from './components/Search'

import './styles/code.css'
import './styles/documentation.css'
import './styles/fonts.css'
import './styles/tailwind.css'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const versions = (await getVersions()) ?? []

  const algoliaAppId = process.env.ALGOLIA_APP_ID
  const algoliaApiKey = process.env.ALGOLIA_API_KEY

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
  return (
    <KBarProvider
      options={{
        disableDocumentLock: false,
        disableScrollbarManagement: true,
      }}
    >
      <Search />
      <Outlet />
    </KBarProvider>
  )
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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"
        />
        <Links />
      </head>
      <body className="bg-background-color">
        <App />
        <Progress />
        <ScrollRestoration />
        <script src="https://cdn.jsdelivr.net/npm/@docsearch/js@3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            docsearch({
              apiKey: "${process.env.ALGOLIA_API_KEY}",
              indexName: "remix-run",
              inputSelector: "#search",
              debug: false,
              algoliaOptions: {
                hitsPerPage: 5,
              },
              transformItems: (items) => {
                return items.map((item) => {
                  item.url = item.url.replace('https://remix.run', '');
                  return item;
                });
              },
            });
          `,
          }}
        />
        <Scripts />
      </body>
    </html>
  )
}
