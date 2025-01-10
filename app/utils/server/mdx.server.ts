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

let IMPORT_STATEMENT = `
import Heading from './Heading.tsx'
import Editor from './Editor.tsx'
import Warn from './Warn.tsx'
import Snippet from './Snippet.tsx'
import Info from './Info.tsx'
import Details from './Details.tsx'
import Tooltip from './Tooltip.tsx'
import Stub from './Stub.tsx'
`

export async function mdxToHtml(source: string) {
  // match stub:{any amount of spaces}true
  if (source.match(/stub:\s*true/)) {
    // IMPORT_STATEMENT += '\nimport Stub from "./stub.tsx"\n'

    source += '\n\n<Stub />'
    // console.log(source)
  }

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
        './Info.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Info.tsx')).toString(),
        './Stub.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Stub.tsx')).toString(),
        './Warn.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Warn.tsx')).toString(),
        './Heading.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Heading.tsx')).toString(),
        './Details.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Details.tsx')).toString(),
        './Editor.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Editor.tsx')).toString(),
        './Snippet.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Snippet.tsx')).toString(),
        './Tooltip.tsx': readFileSync(join(cwd(), 'app', 'components/plugins/Tooltip.tsx')).toString(),
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
        stub: frontmatter.stub ?? false,
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
