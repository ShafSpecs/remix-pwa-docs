import { bundleMDX } from "mdx-bundler";
import { importSlug, importEmoji, importGfm, importAutolink, importPrism, importPrismOG } from "../../exports/esm-modules";
import { readFileSync } from "fs-extra";
import { join } from "path";
import { cwd } from "process";

// import "prismjs/components/prism-typescript";
// import "prismjs/components/prism-jsx";
// import "prismjs/components/prism-bash";
// import "prismjs/components/prism-json";
// import "prismjs/components/prism-css";
// import "prismjs/components/prism-tsx";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-sql";

// import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
// import "prismjs/plugins/toolbar/prism-toolbar";
// import "prismjs/plugins/file-highlight/prism-file-highlight";

import type { FrontMatterTypings } from "~/types/mdx";

export async function mdxToHtml(source: string) {
  const { default: gfm } = await importGfm();
  const { default: emoji } = await importEmoji();
  const { default: slug } = await importSlug();
  const { default: rehypeAutolinkHeadings } = await importAutolink();
  const { default: rehypePrismCommon } = await importPrism();
  const { default: prismOG } = await importPrismOG();

  const { code, frontmatter } = await bundleMDX<FrontMatterTypings>({
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
        rehypePrismCommon,
        // [prismOG, { plugins: ["copy-to-clipboard", "toolbar"] }]
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
