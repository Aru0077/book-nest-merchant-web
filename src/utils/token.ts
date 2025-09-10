/**
 * Token 工具函数 - merchant-web (Pinia插件版)
 * 主要提供token过期检查功能，存储由Pinia插件自动管理
 */

import { useAuthStore } from '@/stores/useAuthStore'

/**
 * 获取访问令牌 - 从store获取
 */
export const getAccessToken = (): string | null => {
  const authStore = useAuthStore()
  return authStore.tokens?.accessToken || null
}

/**
 * 获取刷新令牌 - 从store获取  
 */
export const getRefreshToken = (): string | null => {
  const authStore = useAuthStore()
  return authStore.tokens?.refreshToken || null
}

/**
 * 检查token是否存在
 */
export const hasTokens = (): boolean => {
  const authStore = useAuthStore()
  return !!(authStore.tokens?.accessToken && authStore.tokens?.refreshToken)
}

/**
 * 检查token是否即将过期
 * @param threshold 提前刷新的时间阈值（秒），默认5分钟
 */
export const isTokenExpiringSoon = (threshold: number = 300): boolean => {
  const authStore = useAuthStore()
  const tokens = authStore.tokens
  if (!tokens) return true

  return tokens.expiresIn <= threshold
}

/**
 * 检查refresh token是否已过期
 */
export const isRefreshTokenExpired = (): boolean => {
  const authStore = useAuthStore()
  const tokens = authStore.tokens
  if (!tokens) return true

  return tokens.refreshExpiresIn <= 0
}

/**
 * 检查refresh token是否即将过期
 * @param threshold 提前提醒的时间阈值（秒），默认24小时
 */
export const isRefreshTokenExpiringSoon = (threshold: number = 86400): boolean => {
  const authStore = useAuthStore()
  const tokens = authStore.tokens
  if (!tokens) return true

  return tokens.refreshExpiresIn <= threshold
}
