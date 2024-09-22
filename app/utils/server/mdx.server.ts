import { readFileSync } from 'fs'
import { join } from 'path'
import { bundleMDX } from 'mdx-bundler'
import { cwd } from 'process'
import slug from 'rehype-slug'
import emoji from 'remark-emoji'
import gfm from 'remark-gfm'

import type { FrontMatterType } from '~/types/mdx'

import checkbox from '../../rehype/checkbox'
import role from '../../rehype/role'
import highlight from '../../remark/highlight'
import toc from '../../remark/toc'

const IMPORT_STATEMENT = `
import Heading from './heading.tsx'
import Editor from './Editor.tsx'
import Warn from './warn.tsx'
import Snippet from './snippet.tsx'
import Info from './info.tsx'
import Details from './details.tsx'
import Tooltip from './tooltip.tsx'
`

export async function mdxToHtml(source: string) {
  // inject Heading into the doc just below the frontmatter
  const injectHeading = (source: string) => {
    const frontMatterEnd = source.indexOf('---', 10) + 3
    return `${source.slice(0, frontMatterEnd)}\n\n${IMPORT_STATEMENT}${source.slice(
      frontMatterEnd
    )}`
  }

  try {
    const { code, frontmatter } = await bundleMDX<FrontMatterType>({
      source: injectHeading(source),
      files: {
        './info.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Info.tsx')).toString(),
        './warn.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Warn.tsx')).toString(),
        './heading.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Heading.tsx')).toString(),
        './details.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Details.tsx')).toString(),
        './Editor.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Editor.tsx')).toString(),
        './snippet.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Snippet.tsx')).toString(),
        './tooltip.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Tooltip.tsx')).toString(),
      },
      mdxOptions(options) {
        options.rehypePlugins = [...(options.rehypePlugins || []), role, slug]
        options.remarkPlugins = [...(options.remarkPlugins || []), checkbox, highlight, toc, gfm, emoji]

        return options
      },
    })

    return {
      code,
      frontmatter: {
        ...frontmatter,
        toc: frontmatter.toc ?? true,
        hidden: frontmatter.hidden ?? false,
        alternateTitle: frontmatter.alternateTitle ?? frontmatter.title,
      },
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}
