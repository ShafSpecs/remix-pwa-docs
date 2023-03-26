const { request } = require("@octokit/request");
const grayMatter = require("gray-matter");
require('dotenv').config();

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
    ref: "docs"
  });

  return Promise.all(posts.data.filter(e => !e.name.includes("metadata.json")).map(async (post) => {
    const { download_url } = post;
    const content = await fetch(download_url).then(res => res.text())
    const { data } = grayMatter(content);

    return data;
  }))
}

const getMetaDataSHA = async () => {
  const meta = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/metadata.json",
    ref: "docs"
  });

  return meta.data.sha;
}

const metaData = async () => {
  const metadata = [
    {"name": "Getting Started", position: 1, children: []},
    {"name": "Guides", position: 2, children: []},
    {"name": "Packages", position: 3, children: []},
    {"name": "API Reference", position: 4, children: []},
    {"name": "Examples", position: 5, children: []},
    {"name": "Community", position: 6, children: []},
  ];

  const meta = await getAllPostMeta();
  const sha = await getMetaDataSHA();

  meta.forEach((m) => {
    const section = metadata.find(e => e.name === m.section);

    if (section) {
      section.children.push({
        title: m.title,
        description: m.description,
        slug: m.slug,
        position: m.position
      })

      section.children.sort((a, b) => a.position - b.position);

      metadata.sort((a, b) => a.position - b.position);
    }
  })

  const content = Buffer.from(JSON.stringify(metadata, null, 2)).toString("base64");

  await octokit('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/metadata.json",
    branch: "docs",
    sha,
    message: 'chore: Updated metadata.json',
    content: content,
  })
}

metaData();
