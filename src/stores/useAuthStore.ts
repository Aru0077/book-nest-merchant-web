/**
 * 认证Store - merchant-web
 * 使用 Pinia Composition API 管理商家用户认证状态
 */

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import http from '@/services/http'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/constants'
import type {
  LoginRequest,
  RegisterRequest,
  MerchantUser,
  TokenPair
} from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<MerchantUser | null>(null)
  const tokens = ref<TokenPair | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!tokens.value)
  const userInfo = computed(() => user.value)
  const hasRole = computed(() => (role: string) => user.value?.role === role)

  // Actions

  /**
   * 初始化认证状态 - 从localStorage恢复
   */
  const initAuth = (): void => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_INFO)
      const storedAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

      if (storedUser && storedAccessToken && storedRefreshToken) {
        user.value = JSON.parse(storedUser)
        tokens.value = {
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
          expiresIn: 0, // 这些值在实际使用时会被刷新
          refreshExpiresIn: 0
        }
      }
    } catch {
      // 认证状态恢复失败，清理数据
      clearAuthData()
    }
  }

  /**
   * 商家登录
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await http.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      const { user: userData, tokens: tokenData } = response.data.data

      // 保存到state
      user.value = userData
      tokens.value = tokenData

      // 持久化到localStorage
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData))
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)

    } catch (err: any) {
      const errorMessage = err.message || '登录失败'
      error.value = errorMessage
      throw new Error(errorMessage)
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
      const response = await http.post(API_ENDPOINTS.AUTH.REGISTER, data)
      const { user: userData, tokens: tokenData } = response.data.data

      // 保存到state
      user.value = userData
      tokens.value = tokenData

      // 持久化到localStorage
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userData))
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)

    } catch (err: any) {
      const errorMessage = err.message || '注册失败'
      error.value = errorMessage
      throw new Error(errorMessage)
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
      const response = await http.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken: tokens.value.refreshToken
      })
      const newTokens = response.data.data.tokens

      // 更新state和localStorage
      tokens.value = newTokens
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken)

    } catch (err: any) {
      const errorMessage = err.message || '刷新令牌失败'
      error.value = errorMessage
      clearAuthData()
      throw new Error(errorMessage)
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
        await http.post(API_ENDPOINTS.AUTH.LOGOUT, {
          refreshToken: tokens.value.refreshToken
        })
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

    // 清理localStorage
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
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
  const updateUser = (userData: Partial<MerchantUser>): void => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user.value))
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
})

// 类型导出
export type AuthStore = ReturnType<typeof useAuthStore>
