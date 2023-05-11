const { request } = require("@octokit/request");
const grayMatter = require("gray-matter");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const octokit = request.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_KEY}`
  }
})

const getPWAPostMeta = async () => {
  if (process.env.NODE_ENV === "development") {
    const pwaPath = path.join(__dirname, "posts/pwa");
    let dirData = [];

    fs.readdirSync(pwaPath).forEach(file => {
      const content = fs.readFileSync(path.join(pwaPath, file), "utf8");
      const { data } = grayMatter(content);
      dirData.push(data);
      return data;
    })

    return dirData;
  }


  const posts = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/pwa",
    ref: "docs"
  });

  return Promise.all(posts.data.map(async (post) => {
    const { download_url } = post;
    const content = await fetch(download_url).then(res => res.text())
    const { data } = grayMatter(content);

    return data;
  }))
}

const getPushPostMeta = async () => {
  if (process.env.NODE_ENV === "development") {
    const pwaPath = path.join(__dirname, "posts/push");
    let dirData = [];

    fs.readdirSync(pwaPath).forEach(file => {
      const content = fs.readFileSync(path.join(pwaPath, file), "utf8");
      const { data } = grayMatter(content);
      dirData.push(data);
      return data;
    })

    return dirData;
  }

  const posts = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/push",
    ref: "docs"
  });

  return Promise.all(posts.data.map(async (post) => {
    const { download_url } = post;
    const content = await fetch(download_url).then(res => res.text())
    const { data } = grayMatter(content);

    return data;
  }))
}

const getSWPostMeta = async () => {
  if (process.env.NODE_ENV === "development") {
    const pwaPath = path.join(__dirname, "posts/sw");
    let dirData = [];

    fs.readdirSync(pwaPath).forEach(file => {
      const content = fs.readFileSync(path.join(pwaPath, file), "utf8");
      const { data } = grayMatter(content);
      dirData.push(data);
      return data;
    })

    return dirData;
  }

  const posts = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/sw",
    ref: "docs"
  });

  return Promise.all(posts.data.map(async (post) => {
    const { download_url } = post;
    const content = await fetch(download_url).then(res => res.text())
    const { data } = grayMatter(content);

    return data;
  }))
}

const getClientPostMeta = async () => {
  if (process.env.NODE_ENV === "development") {
    const pwaPath = path.join(__dirname, "posts/client");
    let dirData = [];

    fs.readdirSync(pwaPath).forEach(file => {
      const content = fs.readFileSync(path.join(pwaPath, file), "utf8");
      const { data } = grayMatter(content);
      dirData.push(data);
      return data;
    })

    return dirData;
  }

  const posts = await octokit("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "remix-pwa",
    repo: "remix-pwa-docs",
    path: "posts/client",
    ref: "docs"
  });

  return Promise.all(posts.data.map(async (post) => {
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
    ref: "control"
  });

  return meta.data.sha;
}

const metaData = async () => {
  const metadata = [
    {
      slug: 'pwa',
      children: [
        { "name": "Introduction", position: 1, children: [] },
        { "name": "Guides", position: 2, children: [] },
        { "name": "Packages", position: 3, children: [] },
        { "name": "Examples", position: 4, children: [] }
      ]
    },
    {
      slug: 'sw',
      children: [
        { "name": "Introduction", position: 1, children: [] },
        { "name": "Guides", position: 2, children: [] },
        { "name": "Hooks", position: 3, children: [] },
        { "name": "Plugins", position: 4, children: [] },
        { "name": "API Reference", position: 5, children: [] }
      ]
    },
    {
      slug: 'push',
      children: [
        { "name": "Introduction", position: 1, children: [] },
        { "name": "Guides", position: 2, children: [] },
        { "name": "Packages", position: 3, children: [] },
        { "name": "API Reference", position: 4, children: [] },
      ]
    },
    {
      slug: 'client',
      children: [
        { "name": "Introduction", position: 1, children: [] },
        { "name": "Guides", position: 2, children: [] },
        { "name": "Packages", position: 3, children: [] },
        { "name": "API Reference", position: 4, children: [] }
      ]
    }
  ];

  const metaPWA = await getPWAPostMeta();
  const metaPush = await getPushPostMeta();
  const metaSW = await getSWPostMeta();
  const metaClient = await getClientPostMeta();

  let sha;

  if (process.env.NODE_ENV !== "development")
    sha = await getMetaDataSHA();

  metaPWA.forEach((m) => {
    const section = metadata[0].children.find(e => e.name === m.section);

    if (section) {
      section.children.push({
        title: m.title,
        description: m.description,
        section: m.section,
        slug: m.slug,
        position: m.position
      })

      section.children.sort((a, b) => a.position - b.position);

      metadata[0].children.sort((a, b) => a.position - b.position);
    }
  })

  metaSW.forEach((m) => {
    const section = metadata[1].children.find(e => e.name === m.section);

    if (section) {
      section.children.push({
        title: m.title,
        description: m.description,
        section: m.section,
        slug: m.slug,
        position: m.position
      })

      section.children.sort((a, b) => a.position - b.position);

      metadata[1].children.sort((a, b) => a.position - b.position);
    }
  })

  metaPush.forEach((m) => {
    const section = metadata[2].children.find(e => e.name === m.section);

    if (section) {
      section.children.push({
        title: m.title,
        description: m.description,
        section: m.section,
        slug: m.slug,
        position: m.position
      })

      section.children.sort((a, b) => a.position - b.position);

      metadata[2].children.sort((a, b) => a.position - b.position);
    }
  })

  metaClient.forEach((m) => {
    const section = metadata[2].children.find(e => e.name === m.section);

    if (section) {
      section.children.push({
        title: m.title,
        description: m.description,
        section: m.section,
        slug: m.slug,
        position: m.position
      })

      section.children.sort((a, b) => a.position - b.position);

      metadata[2].children.sort((a, b) => a.position - b.position);
    }
  })

  const content = Buffer.from(JSON.stringify(metadata, null, 2)).toString("base64");

  if (process.env.NODE_ENV !== "development")
    await octokit('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: "remix-pwa",
      repo: "remix-pwa-docs",
      path: "posts/metadata.json",
      branch: "control",
      sha,
      message: 'chore: Updated metadata.json',
      content: content,
    })
  else
    fs.writeFileSync(path.join(__dirname, "posts", "metadata.json"), JSON.stringify(metadata, null, 2).toString(), "utf-8");
}

metaData();
