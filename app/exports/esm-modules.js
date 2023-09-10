module.exports = {
  importGfm: async () => import('remark-gfm'),
  importEmoji: async () => import('remark-emoji'),
  importToC: async () => import('../remark/toc'),
  importExample: async () => import('../remark/code'),
  importHighlighter: async () => import('../remark/highlight'),
  importSlug: async () => import('rehype-slug'),
  importPrism: async () => import('rehype-prism-plus/common'),
  importPrismOG: async () => import('rehype-prism'),
  importRole: async () => import('../rehype/role'),
  importCheckbox: async () => import('../rehype/checkbox'),
}