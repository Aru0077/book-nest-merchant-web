/**
 * Token 管理工具函数 - merchant-web (精简版)
 * 遵循YAGNI原则，仅保留核心必需功能
 */

import { STORAGE_KEYS } from '@/constants'
import type { TokenPair } from '@/types'

/**
 * 保存token对到localStorage
 */
export const saveTokens = (tokens: TokenPair): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
}

/**
 * 获取访问令牌
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
}

/**
 * 获取刷新令牌
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * 获取所有token
 */
export const getTokens = (): TokenPair | null => {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  
  if (!accessToken || !refreshToken) {
    return null
  }
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 0,
    refreshExpiresIn: 0
  }
}

/**
 * 清除所有token
 */
export const clearTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
}

/**
 * 检查token是否存在
 */
export const hasTokens = (): boolean => {
  return !!(getAccessToken() && getRefreshToken())
}