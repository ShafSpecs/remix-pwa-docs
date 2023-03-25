import { request } from "@octokit/request";
import { Repo } from "../handlers/github-api";

const octokit = request.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_KEY}`
  }
})

export const getAllPosts = async () => {
  return octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    ...Repo,
    path: "posts",
    ref: "main"
  })
}

export const getPostContent = async (slug: string) => {
  const postData = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    ...Repo,
    path: `posts/${slug}.mdx`,
    ref: "main"
  });

  //@ts-ignore
  const content = await fetch(postData.data.download_url).then(res => res.text());

  return content;
}

export const getAllPostMeta = async () => {
  return "placeholder string"
}