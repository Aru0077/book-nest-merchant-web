/**
 * Vite环境变量类型声明
 */

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  // 添加更多环境变量类型...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}