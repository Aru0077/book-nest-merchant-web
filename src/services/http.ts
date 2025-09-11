/**
 * HTTP服务 - merchant-web (增强版)
 * 基础axios封装，支持401自动刷新token机制
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiErrorResponse } from '@/api/types'
import { getAccessToken, isTokenExpiringSoon, isRefreshTokenExpired } from '@/utils/token'
import { refreshToken as authRefreshToken, clearAuthData as authClearData } from '@/services/auth'

// 用于避免循环引用的标志
let isRefreshing = false
let failedQueue: Array<{
  resolve: () => void
  reject: (_error: unknown) => void
}> = []

// 处理队列中的请求
const processQueue = (error: unknown) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve()
    }
  })

  failedQueue = []
}

// 创建axios实例
export const http: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加认证token和主动过期检查
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 HTTP Request: ${config.method?.toUpperCase()} ${config.url}`)

    const token = getAccessToken()
    if (token) {
      // eslint-disable-next-line no-console
      console.log('🔑 Token found, checking validity...')

      // 首先检查refresh token是否已过期
      if (isRefreshTokenExpired()) {
        // eslint-disable-next-line no-console
        console.log('❌ Refresh token expired, clearing auth data')
        // refresh token已过期，自动登出
        authClearData()
        return Promise.reject(new Error('Session expired. Please login again.'))
      }

      // 检查access token是否即将过期，如果是则先刷新
      if (isTokenExpiringSoon() && !isRefreshing) {
        // eslint-disable-next-line no-console
        console.log('🔄 Access token expiring soon, refreshing...')
        try {
          await authRefreshToken()
          // eslint-disable-next-line no-console
          console.log('✅ Token refreshed successfully')
          // 使用新的token
          const newToken = getAccessToken()
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`
          }
        } catch {
          // eslint-disable-next-line no-console
          console.log('❌ Token refresh failed, using original token')
          // 刷新失败，使用原token，让后续401机制处理
          config.headers.Authorization = `Bearer ${token}`
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('✅ Using existing token')
        config.headers.Authorization = `Bearer ${token}`
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('ℹ️ No token found, making unauthenticated request')
    }
    return config
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.log('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误和401自动刷新
http.interceptors.response.use(
  (response) => {
    // eslint-disable-next-line no-console
    console.log(`✅ HTTP Response: ${response.status} ${response.config?.method?.toUpperCase()} ${response.config?.url}`)
    return response.data // 直接返回data，简化API调用
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status
    const url = error.config?.url
    const method = error.config?.method?.toUpperCase()

    // eslint-disable-next-line no-console
    console.log(`❌ HTTP Error: ${status} ${method} ${url}`)
    // eslint-disable-next-line no-console
    console.log('📋 Error details:', error.response?.data || error.message)

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 处理401未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      // eslint-disable-next-line no-console
      console.log('🔐 401 Unauthorized detected, handling token refresh...')

      if (isRefreshing) {
        // eslint-disable-next-line no-console
        console.log('⏳ Token refresh already in progress, queueing request...')
        // 如果正在刷新token，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(null),
            reject
          })
        }).then(() => {
          return http(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // eslint-disable-next-line no-console
        console.log('🔄 Attempting to refresh token...')
        // 尝试刷新token
        await authRefreshToken()
        // eslint-disable-next-line no-console
        console.log('✅ Token refresh successful')

        // 刷新成功，处理队列中的请求
        processQueue(null)

        // 重试原始请求
        const newToken = getAccessToken()
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }

        // eslint-disable-next-line no-console
        console.log('🔄 Retrying original request with new token...')
        return http(originalRequest)
      } catch (refreshError) {
        // eslint-disable-next-line no-console
        console.log('❌ Token refresh failed:', refreshError)
        // 刷新失败，处理队列中的请求并登出用户
        processQueue(refreshError)

        // 清理认证数据
        authClearData()
        // eslint-disable-next-line no-console
        console.log('🚪 Auth data cleared, user logged out')

        // 可以在这里添加跳转到登录页的逻辑
        // 例如：router.push('/login')

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 直接使用后端返回的错误消息 - 精简高效
    const backendMessage = error.response?.data?.message
    const errorMessage = backendMessage || error.message || '网络请求失败'

    // eslint-disable-next-line no-console
    console.log('🔥 Using backend error message:', errorMessage)
    return Promise.reject(new Error(errorMessage))
  }
)

export default http
