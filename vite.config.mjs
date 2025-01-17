import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '*.html',
          dest: ''   
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        toolsAndGenerator: './tools-and-generator.html',
        cardGenerator: './card-generator.html',
        gridLayoutGenerator: './grid-layout-generator.html',
        tableGenerator: './table-generator.html'
      }
    }
  }
});
