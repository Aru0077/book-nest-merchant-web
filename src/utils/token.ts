/**
 * Token 管理工具函数 - merchant-web (精简版)
 * 遵循YAGNI原则，仅保留核心必需功能
 */

import { STORAGE_KEYS } from '@/constants'
import type { TokenPair } from '@/api/types'

/**
 * 保存token对到localStorage
 */
export const saveTokens = (tokens: TokenPair): void => {
  const accessExpiresAt = Date.now() + (tokens.expiresIn * 1000)
  const refreshExpiresAt = Date.now() + (tokens.refreshExpiresIn * 1000)

  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken)
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken)
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, accessExpiresAt.toString())
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT, refreshExpiresAt.toString())
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
  const accessExpiresAt = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT)
  const refreshExpiresAt = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT)

  if (!accessToken || !refreshToken || !accessExpiresAt || !refreshExpiresAt) {
    return null
  }

  const now = Date.now()
  const accessExpireTime = parseInt(accessExpiresAt, 10)
  const refreshExpireTime = parseInt(refreshExpiresAt, 10)
  const expiresIn = Math.max(0, Math.floor((accessExpireTime - now) / 1000))
  const refreshExpiresIn = Math.max(0, Math.floor((refreshExpireTime - now) / 1000))

  return {
    accessToken,
    refreshToken,
    expiresIn,
    refreshExpiresIn
  }
}

/**
 * 清除所有token
 */
export const clearTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT)
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT)
}

/**
 * 检查token是否存在
 */
export const hasTokens = (): boolean => {
  return !!(getAccessToken() && getRefreshToken())
}

/**
 * 检查token是否即将过期
 * @param threshold 提前刷新的时间阈值（秒），默认5分钟
 */
export const isTokenExpiringSoon = (threshold: number = 300): boolean => {
  const tokens = getTokens()
  if (!tokens) return true

  return tokens.expiresIn <= threshold
}

/**
 * 检查refresh token是否已过期
 */
export const isRefreshTokenExpired = (): boolean => {
  const tokens = getTokens()
  if (!tokens) return true

  return tokens.refreshExpiresIn <= 0
}

/**
 * 检查refresh token是否即将过期
 * @param threshold 提前提醒的时间阈值（秒），默认24小时
 */
export const isRefreshTokenExpiringSoon = (threshold: number = 86400): boolean => {
  const tokens = getTokens()
  if (!tokens) return true

  return tokens.refreshExpiresIn <= threshold
}
