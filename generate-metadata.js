import { request } from "@octokit/request";
const grayMatter = require("gray-matter")

const octokit = request.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_KEY}`
  }
})

const getAllPostMeta = async () => {
  const posts = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts",
    ref: "main"
  });

  return Promise.all(posts.data.filter(e => !e.name.includes("metadata.json")).map(async (post) => {
    const { download_url } = post;
    const content = await fetch(download_url).then(res => res.text())
    const { data } = grayMatter(content);

    return data;
  }))
}

const metaData = async () => {
  const metadata = [];

  const meta = await getAllPostMeta();

  meta.forEach((m) => {
    metadata.push({
      title: m.title,
      description: m.description,
      section: m.section,
      slug: m.slug,
    });
  })

  const content = Buffer.from(JSON.stringify(metadata, null, 2)).toString("base64");

  await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/metadata.json",
    ref: "main",
    message: 'chore: Updated metadata.json',
    content: content,
  })
}

await metaData();
