import { defineConfig } from 'vite'
import { resolve } from 'path'
import { ViteEjsPlugin } from 'vite-plugin-ejs';

export default defineConfig({
  plugins: [
    // This enables EJS inside your .html files
    ViteEjsPlugin()
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'), // Keeps root index
        tools: resolve(__dirname, 'src/pages/tools-and-generator.html'),
        button: resolve(__dirname, 'src/pages/button-generator.html'),
        card: resolve(__dirname, 'src/pages/card-generator.html'),
        toast: resolve(__dirname, 'src/pages/toast-generator.html'),
        skeleton: resolve(__dirname, 'src/pages/skeleton-generator.html'),
        gradient: resolve(__dirname, 'src/pages/gradient-generator.html'),
        grid: resolve(__dirname, 'src/pages/grid-layout-generator.html'),
        table: resolve(__dirname, 'src/pages/table-generator.html'),
        form: resolve(__dirname, 'src/pages/form-generator.html'),
        navbar: resolve(__dirname, 'src/pages/navbar-generator.html'),
        signup: resolve(__dirname, 'src/pages/sign-up.html'),
        getstarted: resolve(__dirname, 'src/pages/get-started.html'),
        colorPalette: resolve(__dirname, 'src/pages/color-palette.html'),
        keyframe: resolve(__dirname, 'src/pages/keyframe-generator.html'),
      }
    }
  },
  publicDir: 'public'
})