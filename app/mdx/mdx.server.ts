import { bundleMDX } from "mdx-bundler";
import { importSlug, importEmoji, importGfm, importAutolink, importPrism, importHint, importOembed } from "../exports/esm-modules";

export async function mdxToHtml(source: string) {
  const { default: gfm } = await importGfm();
  const { default: emoji } = await importEmoji();
  const { default: slug } = await importSlug();
  const { default: rehypeAutolinkHeadings } = await importAutolink();
  const { default: rehypePrismCommon } = await importPrism();
  const { default: hint } = await importHint();
  const { default: oembed } = await importOembed();

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
        emoji,
        hint,
        oembed
      ];

      return options;
    }
  });

  return { code, frontmatter };
}
