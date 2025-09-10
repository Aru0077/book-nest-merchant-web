/**
 * 工具函数集合 - 按需导出，遵循YAGNI原则
 */

// Token管理函数 (精简版)
export { 
  getAccessToken, 
  getRefreshToken, 
  hasTokens, 
  isTokenExpiringSoon,
  isRefreshTokenExpired,
  isRefreshTokenExpiringSoon
} from './token'

