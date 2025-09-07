/**
 * 核心类型定义 - 精简版本
 * 与后端API对齐，遵循YAGNI原则
 */

// ============ API响应类型 ============
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  code: number
  message: string
  timestamp: string
}

export interface ApiErrorResponse {
  success: false
  code: number
  timestamp: string
  path: string
  method: string
  message: string
  error?: {
    name: string
    stack?: string
    [key: string]: unknown
  }
}

// ============ 用户相关类型 ============
// 与backend AuthUser类型对齐
export interface AuthUser {
  id: string
  role: 'MERCHANT'
  email?: string
  phone?: string
  username?: string
}

// 商家用户类型 - 与backend AuthUser完全对齐
export interface MerchantUser extends AuthUser {
  role: 'MERCHANT'
}

// ============ 认证相关类型 ============
export interface LoginRequest {
  identifier: string // 邮箱/手机号/用户名
  password: string
}

export interface RegisterRequest {
  email?: string
  phone?: string
  username?: string
  password: string
}

// 令牌对 - 与backend完全对齐（移除不存在的字段）
export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// 登录响应 - 与backend LoginResponse对齐
export interface LoginResponse {
  user: MerchantUser
  accessToken: string
  refreshToken: string
}

// ============ 基础工具类型 ============
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string | number
