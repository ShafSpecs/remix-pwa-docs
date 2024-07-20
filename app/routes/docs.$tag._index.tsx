import { json, redirect } from '@remix-run/node'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

import { Documentation } from '~/components/layout/Documentation'
import { getFirstPost, getPostContent, redirectToFirstPost, tagHasIndex } from '~/utils/server/doc.server'
import { mdxToHtml } from '~/utils/server/mdx.server'

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const tag = params.tag ?? 'main'
  const hasIndex = await tagHasIndex(tag)

  if (!hasIndex) {
    throw redirect(`/docs/${tag}/${await redirectToFirstPost(tag)}`)
  }

  const postContent = (await getPostContent(tag, '/')) ?? '' // handle null cases later

  const { code, frontmatter } = await mdxToHtml(postContent)
  const next = await getFirstPost(tag)

  return json({
    frontmatter,
    code,
    next,
    prev: null,
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

export default function TagRoute() {
  return <Documentation route="routes/docs.$tag._index" />
}
