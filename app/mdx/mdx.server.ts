import { bundleMDX } from "mdx-bundler";
import { importSlug, importEmoji, importGfm, importAutolink, importPrism } from "../exports/esm-modules";

const s = `
# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |

## Tasklist

* [ ] to do
* [x] done

!> Here is a tip.

?> And a warning.

x> Or an error.

\`\`\`js {1,3-4} showLineNumbers
function fancyAlert(arg) {
  if (arg) {
    $.facebox({ div: '#foo' })
  }
}
\`\`\`
`.trim();

export async function mdxToHtml(source: string) {
  const { default: gfm } = await importGfm();
  const { default: emoji } = await importEmoji();
  const { default: slug } = await importSlug();
  const { default: rehypeAutolinkHeadings } = await importAutolink();
  const { default: rehypePrismCommon } = await importPrism();

  const { code, frontmatter } = await bundleMDX({
    source: source,
    files: {},
    mdxOptions(options, frontmatter) {
      options.rehypePlugins = [
        ...(options.rehypePlugins || []),
        rehypeAutolinkHeadings,
        slug,
        rehypePrismCommon
      ];
      options.remarkPlugins = [
        ...(options.remarkPlugins || []),
        gfm,
        emoji
        // require('@agentofuser/remark-oembed'),
        // require('remark-hint')
      ];

      return options;
    }
  });

  return { code, frontmatter };
}
