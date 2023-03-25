import { request } from "@octokit/request";
import { Repo } from "../handlers/github-api";

const octokit = request.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_KEY}`
  }
})

export const getAllPosts = () => {
  return octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    ...Repo,
    path: "posts",
    ref: "main"
  })
}