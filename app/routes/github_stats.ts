import { request } from "@octokit/request";
import { json as serverJson } from "@remix-run/node";
import { generateETag } from "~/utils/server/utils.server";

export const loader = async () => {
  const { data } = await request("GET /repos/{owner}/{repo}", {
    owner: "remix-pwa",
    repo: "monorepo",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const jsonData = {
    stars: data.stargazers_count,
    forks: data.forks,
    fullName: data.full_name,
    url: data.html_url,
  };

  return serverJson(jsonData, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      ETag: generateETag(jsonData),
    },
  });
};
