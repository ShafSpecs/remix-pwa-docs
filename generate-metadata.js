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
    ref: "main"
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
    ref: "main"
  });

  return meta.data.sha;
}

const metaData = async () => {
  const metadata = [];

  const meta = await getAllPostMeta();
  const sha = await getMetaDataSHA();

  meta.forEach((m) => {
    metadata.push({
      title: m.title,
      description: m.description,
      section: m.section,
      slug: m.slug,
    });
  })

  const content = Buffer.from(JSON.stringify(metadata, null, 2)).toString("base64");

  await octokit('PUT /repos/{owner}/{repo}/contents/{path}', {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/metadata.json",
    ref: "main",
    sha,
    message: 'chore: Updated metadata.json',
    content: content,
  })
}

metaData();
