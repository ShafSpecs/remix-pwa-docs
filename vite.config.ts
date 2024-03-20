import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import { remixDevTools } from 'remix-development-tools'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [remixDevTools(), remix(), tsconfigPaths()],
  server: {
    open: false,
    port: 3000,
  },
})
