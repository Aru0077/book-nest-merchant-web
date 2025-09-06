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
export interface User {
  id: string
  email?: string
  phone?: string
  username?: string
  emailVerified: boolean
  phoneVerified: boolean
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface MerchantUser extends User {
  role?: 'merchant'
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

export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}

export interface LoginResponse {
  user: MerchantUser
  tokens: TokenPair
}

// ============ 基础工具类型 ============
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string | number