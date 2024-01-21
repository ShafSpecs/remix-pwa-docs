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
}

const getDevPostsMeta = async () => {
  if (process.env.NODE_ENV === "development") {
    const pwaPath = path.join(__dirname, "posts_dev");
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
}

const metaData = async () => {
  const metadata = [
    { "name": "Getting Started", position: 1, children: [] },
    { "name": "Routes & Worker API", position: 2, children: [] },
    { "name": "Hooks & Components", position: 3, children: [] },
    { "name": "Utilities", position: 4, children: [] },
    { "name": "Other API", position: 5, children: [] },
    { "name": "Guides", position: 6, children: [] }
  ];

  const postsMetadata = await getPostsMeta();

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

    fs.writeFileSync(path.join(__dirname, "posts", "metadata.json"), JSON.stringify(metadata, null, 2).toString(), "utf-8");
}

const devMetaData = async () => {
  const metadata = [
    { "name": "Getting Started", position: 1, children: [] },
    // { "name": "Routes & Worker API", position: 2, children: [] },
    // { "name": "Hooks & Components", position: 3, children: [] },
    // { "name": "Utilities", position: 4, children: [] },
    // { "name": "Other API", position: 5, children: [] },
    // { "name": "Guides", position: 6, children: [] }
  ];

  const postsMetadata = await getDevPostsMeta();

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

    fs.writeFileSync(path.join(__dirname, "posts_dev", "metadata.json"), JSON.stringify(metadata, null, 2).toString(), "utf-8");
}

metaData();
devMetaData();
