import { request } from "@octokit/request";
import { Repo } from "../handlers/github-api";
import { readFile } from "fs-extra";
import { resolve } from "path";
import { z } from "zod";
import type { ValidPackages } from "~/routes/$package.($slug)";

const octokit = request.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_KEY}`
  }
});

const octokitWithDownloadUrl = z.object({
  data: z.object({
    download_url: z.string()
  })
});

const FrontMatterTypingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  section: z.string(),
  position: z.number()
});

const MetaDataObjectSchema = z.object({
  name: z.string(),
  position: z.number(),
  children: z.array(FrontMatterTypingsSchema)
});

const LocalMetaDataFileSchema = z.object({
  slug: z.string(),
  children: z.array(MetaDataObjectSchema)
});

/**
 *
 * @param packageSlug - Slug of the package we're interested in
 * @param slug - Slug of the post we're interested in
 * @returns
 */
export const getPostContent = async (packageSlug: ValidPackages, slug: string | undefined) => {
  /**
   * If we are in development mode, we can just read the file from the file system.
   */
  if (process.env.NODE_ENV === "development") {
    const content = await readFile(resolve(__dirname, "../", `posts/${packageSlug}/${slug || "intro"}.mdx`), "utf-8");

    if (!content) {
      return null;
    }

    return content;
  }

  const postData = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    ...Repo,
    path: `posts/${packageSlug}/${slug || "intro"}.mdx`,
    ref: "docs"
  });

  if (postData.status !== 200) {
    return null;
  }
  const download_url_obj = octokitWithDownloadUrl.parse(postData);
  const content = await fetch(download_url_obj.data.download_url).then((res) => res.text());

  return content;
};

export const getPostMetaData = async () => {
  /**
   * If we are in development mode, we can just read the file from the file system.
   */
  if (process.env.NODE_ENV === "development") {
    /**
     * Don't want to automate this part cause I don't feel like.
     *
     * Before you run `npm run dev`, run `npm run generator` first. This keeps the post metadata up to date,
     * if you add a new post or delete, open another terminal and re-run. Then refresh your application to
     * get the latest metadata.
     *
     * Todo: Generate metadata in development without the use of a github token.
     */
    const content = readFile(resolve(__dirname, "../", `posts/metadata.json`), "utf-8");

    if (!content) {
      return null;
    }
    const parsed_content = JSON.parse(await content);

    return z.array(LocalMetaDataFileSchema).parse(parsed_content);
  }

  const meta = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    ...Repo,
    path: "posts/metadata.json",
    ref: "control"
  });
  const download_url_obj = octokitWithDownloadUrl.parse(meta);
  const content = await fetch(download_url_obj.data.download_url)
    .then((res) => res.text())
    .catch((err) => {
      return null;
    });

  if (!content) {
    return null;
  }
  const data = z.array(MetaDataObjectSchema).parse(JSON.parse(content));
  return data;
};
