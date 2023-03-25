import { bundleMDX } from "mdx-bundler";
import { importSlug, importEmoji, importGfm, importAutolink, importPrism } from "../exports/esm-modules";
import { readFileSync } from "fs-extra";
import { join } from "path";
import { cwd } from "process"

export async function mdxToHtml(source: string) {
  const { default: gfm } = await importGfm();
  const { default: emoji } = await importEmoji();
  const { default: slug } = await importSlug();
  const { default: rehypeAutolinkHeadings } = await importAutolink();
  const { default: rehypePrismCommon } = await importPrism();

  const { code, frontmatter } = await bundleMDX({
    source: source,
    files: {
      "./info.tsx": readFileSync(join(cwd(), "app", "components/mdx/Info.tsx")).toString(),
      "./warn.tsx": readFileSync(join(cwd(), "app", "components/mdx/Warn.tsx")).toString(),
      "./link.tsx": readFileSync(join(cwd(), "app", "components/mdx/Link.tsx")).toString(),
      "./grid.tsx": readFileSync(join(cwd(), "app", "components/mdx/Grid.tsx")).toString(),
      "./arrow.tsx": readFileSync(join(cwd(), "app", "components/icons/Arrow.tsx")).toString(),
      "./plugin.tsx": readFileSync(join(cwd(), "app", "components/icons/Plugin.tsx")).toString(),
      "./swatch.tsx": readFileSync(join(cwd(), "app", "components/icons/Swatch.tsx")).toString(),
      "./widget.tsx": readFileSync(join(cwd(), "app", "components/icons/Widget.tsx")).toString(),
    },
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
      ];

      return options;
    }
  });

  return { code, frontmatter };
}
