/**
 * 认证Store - merchant-web
 * 使用 Pinia Composition API 管理商家用户认证状态
 */

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { authApi } from '@/api'
import { STORAGE_KEYS, getFriendlyErrorMessage } from '@/constants'
import type {
  LoginRequest,
  RegisterRequest,
  AuthUser,
  TokenPair
} from '@/api/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const tokens = ref<TokenPair | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!tokens.value?.accessToken && !!tokens.value?.refreshToken)
  const userInfo = computed(() => user.value)
  const hasRole = computed(() => (role: string) => user.value?.role === role)

  // Actions

  /**
   * 通用错误处理函数
   */
  const handleAuthError = (err: any, defaultMessage: string): void => {
    const friendlyMessage = getFriendlyErrorMessage(err, defaultMessage)
    error.value = friendlyMessage
    isLoading.value = false
    throw new Error(friendlyMessage)
  }

  /**
   * 初始化认证状态 - Pinia插件会自动从localStorage恢复
   * 这个方法现在主要用于计算token过期时间
   */
  const initAuth = (): void => {
    // Pinia插件会自动恢复user和tokens状态
    // 这里只需要重新计算过期时间（因为插件不会保存计算后的时间差）
    if (tokens.value) {
      const now = Date.now()
      // 从保存的过期时间戳重新计算剩余时间
      const accessExpiresAt = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT)
      const refreshExpiresAt = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT)

      if (accessExpiresAt && refreshExpiresAt) {
        const expiresIn = Math.max(0, Math.floor((parseInt(accessExpiresAt, 10) - now) / 1000))
        const refreshExpiresIn = Math.max(0, Math.floor((parseInt(refreshExpiresAt, 10) - now) / 1000))

        tokens.value = {
          ...tokens.value,
          expiresIn,
          refreshExpiresIn
        }
      }
    }
  }

  /**
   * 商家登录
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const loginResponse = await authApi.login(credentials)
      const { user: userData, accessToken, refreshToken, expiresIn, refreshExpiresIn } = loginResponse.data

      // 保存到state (Pinia插件会自动持久化user和tokens)
      user.value = userData
      tokens.value = { accessToken, refreshToken, expiresIn, refreshExpiresIn }

      // 仅保存过期时间戳用于重新计算
      const now = Date.now()
      const accessExpiresAt = now + expiresIn * 1000
      const refreshExpiresAt = now + refreshExpiresIn * 1000
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, accessExpiresAt.toString())
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT, refreshExpiresAt.toString())

    } catch (err: any) {
      handleAuthError(err, '登录失败')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 商家注册
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const registerResponse = await authApi.register(data)
      const { user: userData, accessToken, refreshToken, expiresIn, refreshExpiresIn } = registerResponse.data

      // 保存到state (Pinia插件会自动持久化user和tokens)
      user.value = userData
      tokens.value = { accessToken, refreshToken, expiresIn, refreshExpiresIn }

      // 仅保存过期时间戳用于重新计算
      const now = Date.now()
      const accessExpiresAt = now + expiresIn * 1000
      const refreshExpiresAt = now + refreshExpiresIn * 1000
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, accessExpiresAt.toString())
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT, refreshExpiresAt.toString())

    } catch (err: any) {
      handleAuthError(err, '注册失败')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 刷新访问令牌
   */
  const refreshToken = async (): Promise<void> => {
    if (!tokens.value?.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const refreshResponse = await authApi.refreshToken({
        refreshToken: tokens.value.refreshToken
      })
      const { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn } = refreshResponse.data

      // 更新state (Pinia插件会自动持久化tokens)
      tokens.value = { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn }

      // 更新过期时间戳
      const now = Date.now()
      const accessExpiresAt = now + expiresIn * 1000
      const refreshExpiresAt = now + refreshExpiresIn * 1000
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT, accessExpiresAt.toString())
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT, refreshExpiresAt.toString())

    } catch (err: any) {
      clearAuthData()
      handleAuthError(err, '刷新令牌失败')
    }
  }

  /**
   * 商家注销
   */
  const logout = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // 调用后端注销接口
      if (tokens.value?.refreshToken) {
        await authApi.logout()
      }
    } catch {
      // 注销接口失败不影响本地清理
      // 注销接口失败不影响本地清理
    } finally {
      // 无论接口是否成功，都清理本地数据
      clearAuthData()
      isLoading.value = false
    }
  }

  /**
   * 清除认证数据
   */
  const clearAuthData = (): void => {
    user.value = null
    tokens.value = null
    error.value = null

    // 清理过期时间戳 (Pinia插件会自动处理其他数据)
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN_EXPIRES_AT)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN_EXPIRES_AT)
  }

  /**
   * 清除错误信息
   */
  const clearError = (): void => {
    error.value = null
  }

  /**
   * 更新用户信息
   */
  const updateUser = (userData: Partial<AuthUser>): void => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      // Pinia插件会自动持久化更新后的用户数据
    }
  }

  // 返回store的状态和方法
  return {
    // State
    user: readonly(user),
    tokens: readonly(tokens),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Getters
    isAuthenticated,
    userInfo,
    hasRole,

    // Actions
    initAuth,
    login,
    register,
    refreshToken,
    logout,
    clearAuthData,
    clearError,
    updateUser
  }
}, {
  // Pinia插件持久化配置
  persist: {
    key: 'booknest-merchant-auth',
    storage: localStorage,
    pick: ['user', 'tokens'], // 仅持久化核心认证数据
  }
})

// 类型导出
export type AuthStore = ReturnType<typeof useAuthStore>
