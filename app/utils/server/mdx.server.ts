import { bundleMDX } from "mdx-bundler";
import {
  importSlug,
  importEmoji,
  importGfm,
  importToC,
  importHighlighter,
  importRole,
  importCheckbox
} from "../../exports/esm-modules";
import { readFileSync } from "fs-extra";
import { join } from "path";
import { cwd } from "process";

import type { FrontMatterTypings } from "~/types/mdx";

export async function mdxToHtml(source: string) {
  const { default: gfm } = await importGfm();
  const { default: emoji } = await importEmoji();
  const { default: slug } = await importSlug();
  const { default: toc } = await importToC();
  const { default: highlight } = await importHighlighter();
  const { default: role } = await importRole();
  const { default: checkbox } = await importCheckbox();

  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = join(process.cwd(), "node_modules", "esbuild", "esbuild.exe");
  } else {
    process.env.ESBUILD_BINARY_PATH = join(process.cwd(), "node_modules", "esbuild", "bin", "esbuild");
  }

  const { code, frontmatter } = await bundleMDX<FrontMatterTypings>({
    source: source,
    files: {
      "./info.tsx": readFileSync(join(cwd(), "app", "components/mdx/Info.tsx")).toString(),
      "./warn.tsx": readFileSync(join(cwd(), "app", "components/mdx/Warn.tsx")).toString(),
      "./link.tsx": readFileSync(join(cwd(), "app", "components/mdx/Link.tsx")).toString(),
      "./grid.tsx": readFileSync(join(cwd(), "app", "components/mdx/Grid.tsx")).toString(),
      "./tip.tsx": readFileSync(join(cwd(), "app", "components/mdx/Tip.tsx")).toString(),
      "./heading.tsx": readFileSync(join(cwd(), "app", "components/mdx/Heading.tsx")).toString(),
      "./details.tsx": readFileSync(join(cwd(), "app", "components/mdx/Details.tsx")).toString(),
      "./editor.tsx": readFileSync(join(cwd(), "app", "components/mdx/Editor.tsx")).toString(),
      "./snippet.tsx": readFileSync(join(cwd(), "app", "components/mdx/Snippet.tsx")).toString(),

      "./arrow.tsx": readFileSync(join(cwd(), "app", "components/icons/Arrow.tsx")).toString(),
      "./plugin.tsx": readFileSync(join(cwd(), "app", "components/icons/Plugin.tsx")).toString(),
      "./swatch.tsx": readFileSync(join(cwd(), "app", "components/icons/Swatch.tsx")).toString(),
      "./widget.tsx": readFileSync(join(cwd(), "app", "components/icons/Widget.tsx")).toString()
    },
    globals: {
      // redent: 'redent'
    },
    mdxOptions(options, frontmatter) {
      options.rehypePlugins = [...(options.rehypePlugins || []), slug, role];
      options.remarkPlugins = [
        ...(options.remarkPlugins || []),
        gfm,
        toc,
        highlight,
        emoji,
        checkbox
      ];

      return options;
    }
  });

  return { code, frontmatter };
}
