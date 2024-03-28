import { json } from '@remix-run/node'
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'

import { Documentation } from '~/components/layout/Documentation'
import {
  getPostContent,
  getPreviousAndNextRoutes,
} from '~/utils/server/doc.server'
import { mdxToHtml } from '~/utils/server/mdx.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const tag = params.tag ?? 'main'
  const slug = params.slug as string

  const postContent = (await getPostContent(tag, slug)) ?? '' // handle null cases later
  const { code, frontmatter } = await mdxToHtml(postContent)
  const [prev, next] = await getPreviousAndNextRoutes(tag, slug)

  return json({
    frontmatter,
    code,
    next,
    prev,
    tag,
  })
}

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return [
    {
      title: `${data.frontmatter.title} | Remix PWA`,
    },
    {
      name: 'description',
      content: data.frontmatter.description,
    },
  ]
}

export default function DocRoute() {
  return <Documentation />
}
