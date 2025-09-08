/**
 * 认证服务 - 避免循环依赖的中介服务
 * 为HTTP拦截器提供认证操作接口
 */

import type { useAuthStore } from '@/stores/useAuthStore'

// 认证服务接口
interface AuthService {
  refreshToken: () => Promise<void>
  clearAuthData: () => void
}

let authService: AuthService | null = null

/**
 * 注册认证服务实例
 */
export const registerAuthService = (store: ReturnType<typeof useAuthStore>): void => {
  authService = {
    refreshToken: () => store.refreshToken(),
    clearAuthData: () => store.clearAuthData()
  }
}

/**
 * 刷新token
 */
export const refreshToken = async (): Promise<void> => {
  if (!authService) {
    throw new Error('Auth service not registered')
  }
  return authService.refreshToken()
}

/**
 * 清除认证数据
 */
export const clearAuthData = (): void => {
  if (!authService) {
    throw new Error('Auth service not registered')
  }
  authService.clearAuthData()
}