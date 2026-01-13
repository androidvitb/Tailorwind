import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'), // Keeps root index
        tools: resolve(__dirname, 'src/pages/tools-and-generator.html'),
        button: resolve(__dirname, 'src/pages/button-generator.html'),
        card: resolve(__dirname, 'src/pages/card-generator.html'),
        grid: resolve(__dirname, 'src/pages/grid-layout-generator.html'),
        table: resolve(__dirname, 'src/pages/table-generator.html'),
        form: resolve(__dirname, 'src/pages/form-generator.html'),
        navbar: resolve(__dirname, 'src/pages/navbar.html'),
        signup: resolve(__dirname, 'src/pages/sign-up.html'), 
        getstarted: resolve(__dirname, 'src/pages/get-started.html')
      }
    }
  },
  publicDir: 'public'
})