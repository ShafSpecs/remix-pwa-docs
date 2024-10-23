import { request } from "@octokit/request";
import { json, WorkerLoaderArgs } from "@remix-pwa/sw";
import { json as serverJson } from "@remix-run/node";
import { ServiceWorkerContext } from "~/types/sw";
import { generateETag } from "~/utils/server/utils.server";

export const loader = async () => {
  const { data } = await request("GET /repos/{owner}/{repo}", {
    owner: "remix-pwa",
    repo: "monorepo",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  console.log('loader')

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

export const workerLoader = async ({ context }: WorkerLoaderArgs) => {
  const { cache, fetchFromServer } = context as ServiceWorkerContext

  console.log('workerLoader')

  try {
    const response = await cache.match('/github_stats')
    if (response) {
      return json(response)
    } else {
      const response = await fetchFromServer()
      if (response) {
        cache.addToCache('/github_stats', response)
        return json(response)
      }
      return new Response(null, { status: 500 })
    }
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
