/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server: process.env.NODE_ENV === "development" ? undefined : "./server.ts",
  ignoredRouteFiles: ["**/.*"],
  publicPath: "/build/",
  serverBuildPath: "api/index.js",
  serverModuleFormat: "cjs",
  serverPlatform: "node",
  serverMinify: false,
  serverDependenciesToBundle: [
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^unist.*/,
    /^hast.*/,
    /^bail.*/,
    /^trough.*/,
    /^mdast.*/,
    /^micromark.*/,
    /^decode.*/,
    /^character.*/,
    /^property.*/,
    /^space.*/,
    /^comma.*/,
    /^vfile.*/,
    /^mdx.*/,
    /^github-slugger.*/,
    /^refractor.*/,
    /^emoticon.*/,
    /^zwitch.*/,
    /^ccount.*/,
    /^@agentofuser\/remark-oembed.*/,
    /^markdown-table.*/,
    /^estree-util-is-identifier-name.*/,
    /^fault.*/,
    /^hastscript.*/,
    /^parse-entities.*/,
    /^is.*/,
    /^stringify.*/,
    /^slugify.*/,
    /^@sindresorhus.*/,
    "redent",
    "indent-string",
    "@sindresorhus/slugify",
    "@sindresorhus/transliterate",
    "strip-indent",
    "escape-string-regexp",
    "web-namespaces"
  ],
  appDirectory: "app",
  future: {
    v2_errorBoundary: true,
    v2_meta: false,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true
  },
  tailwind: true
};
