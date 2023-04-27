import { request } from "@octokit/request";
import { Repo } from "../handlers/github-api";
import { readFile } from "fs-extra";

const octokit = request.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_KEY}`
  }
});

export const getPostContent = async (slug: string, preSlug: string = "pwa") => {
  // if (process.env.NODE_ENV === "development") {
  //   const content = await readFile(`/posts/${preSlug}/${slug}.mdx`, "utf-8");

  //   if (!content) {
  //     return null;
  //   }
    
  //   return content;
  // }

  const postData = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    ...Repo,
    path: `posts/${preSlug}/${slug}.mdx`,
    ref: "docs"
  });

  if (postData.status !== 200) {
    return null;
  }

  //@ts-ignore
  const content = await fetch(postData.data.download_url).then((res) => res.text());

  return content;
};

export const getPostMetaData = async () => {
  const meta = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    ...Repo,
    path: "posts/metadata.json",
    ref: "control"
  });

  //@ts-ignore
  const content = await fetch(meta.data.download_url)
    .then((res) => res.text())
    .catch((err) => { return null });

  if (!content) {
    return null;
  }
  
  return JSON.parse(content);
};
