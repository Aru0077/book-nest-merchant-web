import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 精简的 Vite 配置 - 遵循YAGNI原则
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(), // 开发时的Vue调试工具
  ],
  
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  
  server: {
    port: 5173,
    open: true,
    // API代理到后端
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.css";',
      },
    },
  },
})
