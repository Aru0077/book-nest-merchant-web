/**
 * Vite环境变量类型声明 - 精简版
 * 仅声明实际使用的环境变量
 */

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

 
interface ImportMeta {
  readonly env: ImportMetaEnv
}
