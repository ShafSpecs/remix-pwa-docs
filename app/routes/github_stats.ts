import { request } from '@octokit/request'
import { json } from '@remix-run/node'

export const loader = async () => {
  const { data } = await request('GET /repos/{owner}/{repo}', {
    owner: 'remix-pwa',
    repo: 'monorepo',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return json({
    stars: data.stargazers_count,
    forks: data.forks,
    fullName: data.full_name,
    url: data.html_url,
  })
}
