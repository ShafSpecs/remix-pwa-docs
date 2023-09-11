// Anytime push is made to `docs`, sync it with S3 bucket
// run this before syncing to S3
const grayMatter = require("gray-matter");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const getPostsMeta = async () => {
  if (process.env.NODE_ENV === "development") {
    const pwaPath = path.join(__dirname, "posts");
    let dirData = [];

    fs.readdirSync(pwaPath).forEach(file => {
      if (file === "metadata.json") return;

      const content = fs.readFileSync(path.join(pwaPath, file), "utf8");
      const { data } = grayMatter(content);
      dirData.push(data);
      return data;
    })

    return dirData;
  }


  // const posts = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
  //   owner: "ShafSpecs",
  //   repo: "remix-pwa-docs",
  //   path: "posts",
  //   ref: "docs"
  // });

  // return Promise.all(posts.data.map(async (post) => {
  //   const { download_url } = post;

  //   // Skip metadata.json file
  //   if (download_url.includes("metadata.json")) return;

  //   const content = await fetch(download_url).then(res => res.text())
  //   const { data } = grayMatter(content);

  //   return data;
  // }))
}

const getMetaDataSHA = async () => {
  const meta = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "ShafSpecs",
    repo: "remix-pwa-docs",
    path: "posts/metadata.json",
    ref: "control"
  });

  return meta.data.sha;
}

const metaData = async () => {
  const metadata = [
    { "name": "Getting Started", position: 1, children: [] },
    { "name": "Routes & Worker API", position: 2, children: [] },
    { "name": "Hooks & Components", position: 3, children: [] },
    { "name": "Utilities", position: 4, children: [] },
    { "name": "Guides", position: 5, children: [] }
  ];

  const postsMetadata = await getPostsMeta();

  // if (process.env.NODE_ENV !== "development")
  //   sha = await getMetaDataSHA();

  postsMetadata.forEach((m) => {
    const section = metadata.find(e => e.name === m.section);

    if (section) {
      section.children.push({
        title: m.title,
        description: m.description,
        section: m.section,
        shortTitle: m.shortTitle,
        position: m.position
      })

      section.children.sort((a, b) => a.position - b.position);

      metadata.sort((a, b) => a.position - b.position);
    }
  })

  const content = Buffer.from(JSON.stringify(metadata, null, 2)).toString("base64");

  if (process.env.NODE_ENV !== "development")
  // await octokit('PUT /repos/{owner}/{repo}/contents/{path}', {
  //   owner: "ShafSpecs",
  //   repo: "remix-pwa-docs",
  //   path: "posts/metadata.json",
  //   branch: "control",
  //   sha,
  //   message: 'chore: Updated metadata.json',
  //   content: content,
  // })
    console.log("Data")
  else
    fs.writeFileSync(path.join(__dirname, "posts", "metadata.json"), JSON.stringify(metadata, null, 2).toString(), "utf-8");
}

metaData();
