import { json as serverJson } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import type { ClientLoaderFunctionArgs } from '@remix-run/react'
import { Outlet } from '@remix-run/react'
import { cacheClientLoader, useCachedLoaderData } from 'remix-client-cache'

import { Sidebar } from '~/components/layout/Sidebar'
import { getParsedMetadata } from '~/utils/server/doc.server'
import type { MetadataType } from '~/utils/server/doc.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let metadata: MetadataType = {
    paths: {},
    hasIndex: false,
    sections: [],
    meta: {},
  } // default values

  if (params.tag) {
    metadata = (await getParsedMetadata(params.tag)) ?? metadata
  }

  const DOMAIN = process.env.NODE_ENV === 'production' ? 'https://remix-pwa.run' : 'http://localhost:3000'

  const data = await fetch(DOMAIN + '/github_stats')
    .then(res => res.json())
    .catch((_) => ({
      stars: 0,
      forks: 0,
      fullName: 'remix-pwa/monorepo',
      url: 'https://github.com/remix-pwa/monorepo',
    }))

  return serverJson({
    metadata,
    tag: params.tag,
    ...data,
  })
}

export const clientLoader = async (args: ClientLoaderFunctionArgs) => cacheClientLoader(args)

clientLoader.hydrate = true

export default function TagRoute() {
  const { metadata } = useCachedLoaderData<{
    metadata: MetadataType
  }>()

  return (
    <Sidebar metadata={metadata}>
      <span
        className="hidden absolute dark:block inset-0 overflow-hidden h-[64rem]"
        style={{
          background:
            "radial-gradient(49.63% 57.02% at 58.99% -7.2%, rgba(86, 168, 215, 0.1) 39.4%, rgba(0, 0, 0, 0) 100%)"
        }}
      >
      </span>
      <span
        className="block absolute dark:hidden inset-0 overflow-hidden h-[64rem]"
        style={{
          background:
            "radial-gradient(49.63% 57.02% at 58.99% -7.2%, rgba(13, 130, 148, 0.1) 39.4%, rgba(0, 0, 0, 0) 100%)"
        }}
      >
      </span>

      <Outlet />
    </Sidebar>
  )
}
