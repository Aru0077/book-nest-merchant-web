/**
 * 路由认证守卫 - merchant-web (精简版)
 * 遵循YAGNI原则，仅保留核心必需功能
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { hasTokens } from '@/utils/token'

/**
 * 认证守卫 - 检查用户是否已登录
 */
export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  // 检查认证状态
  if (!authStore.isAuthenticated) {
    // 尝试从localStorage恢复
    if (hasTokens()) {
      authStore.initAuth()
    }

    // 仍未认证，跳转到登录页
    if (!authStore.isAuthenticated) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  next()
}

/**
 * 公开路由守卫 - 用于登录/注册页面
 */
export const publicGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const authStore = useAuthStore()

  // 已登录用户重定向到首页
  if (authStore.isAuthenticated) {
    const redirectTo = (to.query.redirect as string) || '/'
    next(redirectTo)
    return
  }

  next()
}
