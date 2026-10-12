import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    // 单文件产物：所有 JS/CSS/字体全部内联进 index.html
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
  },
  server: { port: 5173, open: false },
})
