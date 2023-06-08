module.exports = {
  importGfm: async () => import('remark-gfm'),
  importEmoji: async () => import('remark-emoji'),
  importSlug: async () => import('rehype-slug'),
  importPrism: async () => import('rehype-prism-plus/common'),
  importPrismOG: async () => import('rehype-prism'),
  importAutolink: async () => import('rehype-autolink-headings')
}