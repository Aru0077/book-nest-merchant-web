/**
 * API类型定义 - 与backend DTO完全对齐
 * 精简版本，仅包含merchant相关类型
 */

// ============ 基础认证类型 ============
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

export interface RefreshTokenRequest {
  refreshToken: string
}

// ============ 验证码认证类型 ============
export interface PhoneVerificationRequest {
  phone: string
  code: string
}

export interface EmailVerificationRequest {
  email: string
  code: string
}

// ============ 账户绑定类型 ============
export interface AccountSetupRequest {
  username: string
  password: string
}

// ============ 安全密码类型 ============
export interface SetSecurityPasswordRequest {
  securityPassword: string
}

export interface VerifySecurityPasswordRequest {
  securityPassword: string
}

// ============ 响应类型 ============
export interface AuthUser {
  id: string
  role: 'MERCHANT'
  email?: string
  phone?: string
  username?: string
}

export interface LoginResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}

export interface MerchantAuthProfile {
  hasAccount: boolean
  hasPhone: boolean
  phoneVerified: boolean
  hasEmail: boolean
  emailVerified: boolean
  hasSecurityPassword: boolean
}

export interface SimpleMessageResponse {
  message: string
}

// 令牌对类型 - 用于前端状态管理
export interface TokenPair {
  accessToken: string
  refreshToken: string
  expiresIn: number
  refreshExpiresIn: number
}

// ============ API统一响应格式 ============
export interface ApiResponse<T = unknown> {
  success: true
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
  error?: unknown
}