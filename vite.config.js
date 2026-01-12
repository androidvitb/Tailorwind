import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        tools: resolve(__dirname, 'tools-and-generator.html'),
        tools: resolve(__dirname, 'button-generator.html'),
        card: resolve(__dirname, 'card-generator.html'),
        grid: resolve(__dirname, 'grid-layout-generator.html'),
        table: resolve(__dirname, 'table-generator.html'),
        form: resolve(__dirname, 'form-generator.html'),
        navbar: resolve(__dirname, 'navbar.html')
      }
    }
  },
  publicDir: 'public'
})
