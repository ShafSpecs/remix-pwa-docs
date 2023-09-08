module.exports = {
  importGfm: async () => import('remark-gfm'),
  importToC: async () => import('../remark/toc'),
  importExample: async () => import('../remark/code'),
  importHighlighter: async () => import('../remark/highlight'),
  importEmoji: async () => import('remark-emoji'),
  importSlug: async () => import('rehype-slug'),
  importPrism: async () => import('rehype-prism-plus/common'),
  importPrismOG: async () => import('rehype-prism'),
}