/**
 * HTTP服务 - merchant-web (增强版)
 * 基础axios封装，支持401自动刷新token机制
 */

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiErrorResponse } from '@/types'
import { getAccessToken } from '@/utils/token'

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

// 请求拦截器 - 添加认证token
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误和401自动刷新
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // 处理401未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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
        // 动态导入auth store以避免循环依赖
        const { useAuthStore } = await import('@/stores/useAuthStore')
        const authStore = useAuthStore()
        
        // 尝试刷新token
        await authStore.refreshToken()
        
        // 刷新成功，处理队列中的请求
        processQueue(null)
        
        // 重试原始请求
        const newToken = getAccessToken()
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        
        return http(originalRequest)
      } catch (refreshError) {
        // 刷新失败，处理队列中的请求并登出用户
        processQueue(refreshError)
        
        // 动态导入auth store进行登出
        const { useAuthStore } = await import('@/stores/useAuthStore')
        const authStore = useAuthStore()
        authStore.clearAuthData()
        
        // 可以在这里添加跳转到登录页的逻辑
        // 例如：router.push('/login')
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 构造错误响应数据
    const errorData = error.response?.data || {
      code: error.response?.status || 500,
      message: error.message || 'Network Error'
    }

    return Promise.reject(errorData)
  }
)

export default http
