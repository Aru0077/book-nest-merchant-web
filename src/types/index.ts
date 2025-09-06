/**
 * 全局类型定义
 * 基于Backend项目的统一响应格式
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

// ============ 分页类型 ============
export interface PaginationMeta {
  page: number
  size: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  offset: number
}

export interface PaginatedData<T> {
  items: T[]
  pagination: PaginationMeta
}

export type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>

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
  // merchant特有字段可以在这里扩展
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

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}

// ============ 表单验证类型 ============
export interface ValidationRule {
  required?: boolean
  message?: string
  validator?: (value: string) => boolean | Promise<boolean>
}

export interface FormRules {
  [key: string]: ValidationRule[]
}

// ============ HTTP请求类型 ============
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestConfig {
  method?: HttpMethod
  headers?: Record<string, string>
  params?: Record<string, unknown>
  data?: unknown
}

// ============ 路由类型 ============
export interface RouteConfig {
  path: string
  name: string
  component: () => Promise<unknown>
  meta?: {
    requiresAuth?: boolean
    title?: string
    icon?: string
  }
}

// ============ 通用工具类型 ============
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string | number