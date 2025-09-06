import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      // 只在开发环境启用 Vue DevTools
      ...(command === 'serve' ? [vueDevTools()] : []),
    ],
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    
    // 服务器配置
    server: {
      port: 5173,
      open: true,
      cors: true,
      // 代理配置 - 开发时代理到后端API
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    
    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      minify: 'esbuild',
      // 分包配置
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
            'pinia-vendor': ['pinia'],
          },
        },
      },
      // 构建时移除console和debugger
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
    },
    
    // CSS配置
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variables.css";',
        },
      },
    },
    
    // 依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
      exclude: ['vue-demi'],
    },
    
    // 环境变量配置
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  }
})
