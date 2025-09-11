/**
 * Merchant认证API - 完整14个接口实现
 * 与backend merchant-auth.controller.ts完全对应
 */

import { http } from '@/services/http'
import type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  PhoneVerificationRequest,
  EmailVerificationRequest,
  SendPhoneCodeRequest,
  SendEmailCodeRequest,
  AccountSetupRequest,
  SetSecurityPasswordRequest,
  VerifySecurityPasswordRequest,
  LoginResponse,
  RefreshTokenResponse,
  MerchantAuthProfile,
  SimpleMessageResponse,
  ApiResponse
} from './types'

const BASE_URL = '/merchant/auth'

// ============ 基础认证接口 (4个) ============

/**
 * 商家登录
 */
export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return http.post(`${BASE_URL}/login`, data)
}

/**
 * 商家注册
 */
export const register = (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
  return http.post(`${BASE_URL}/register`, data)
}

/**
 * 刷新访问令牌
 */
export const refreshToken = (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
  return http.post(`${BASE_URL}/refresh`, data)
}

/**
 * 商家注销
 */
export const logout = (): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/logout`)
}

// ============ 验证码认证接口 (4个) ============

/**
 * 手机验证码注册
 */
export const registerByPhoneCode = (data: PhoneVerificationRequest): Promise<ApiResponse<LoginResponse>> => {
  return http.post(`${BASE_URL}/register/phone-code`, data)
}

/**
 * 邮箱验证码注册
 */
export const registerByEmailCode = (data: EmailVerificationRequest): Promise<ApiResponse<LoginResponse>> => {
  return http.post(`${BASE_URL}/register/email-code`, data)
}

/**
 * 手机验证码登录
 */
export const loginByPhoneCode = (data: PhoneVerificationRequest): Promise<ApiResponse<LoginResponse>> => {
  return http.post(`${BASE_URL}/login/phone-code`, data)
}

/**
 * 邮箱验证码登录
 */
export const loginByEmailCode = (data: EmailVerificationRequest): Promise<ApiResponse<LoginResponse>> => {
  return http.post(`${BASE_URL}/login/email-code`, data)
}

// ============ 账户绑定接口 (3个) ============

/**
 * 绑定手机号
 */
export const bindPhone = (data: PhoneVerificationRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/bind/phone`, data)
}

/**
 * 绑定邮箱
 */
export const bindEmail = (data: EmailVerificationRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/bind/email`, data)
}

/**
 * 设置账号密码
 */
export const bindAccount = (data: AccountSetupRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/bind/account`, data)
}

// ============ 安全验证接口 (2个) ============

/**
 * 设置安全密码
 */
export const setSecurityPassword = (data: SetSecurityPasswordRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/security/set`, data)
}

/**
 * 验证安全密码
 */
export const verifySecurityPassword = (data: VerifySecurityPasswordRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/security/verify`, data)
}

// ============ 状态查询接口 (1个) ============

/**
 * 获取认证状态
 */
export const getAuthProfile = (): Promise<ApiResponse<MerchantAuthProfile>> => {
  return http.get(`${BASE_URL}/profile`)
}

// ============ 验证码发送接口 (2个) ============

/**
 * 发送手机验证码
 */
export const sendPhoneCode = (data: SendPhoneCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post('/sms/send-code', data)
}

/**
 * 发送邮箱验证码
 */
export const sendEmailCode = (data: SendEmailCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post('/email/send-code', data)
}

// ============ 注册专用验证码发送接口 (2个) ============

/**
 * 发送注册用手机验证码 (会检查是否已注册)
 */
export const sendRegisterSmsCode = (data: SendPhoneCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/send-sms-code`, data)
}

/**
 * 发送注册用邮箱验证码 (会检查是否已注册)  
 */
export const sendRegisterEmailCode = (data: SendEmailCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post(`${BASE_URL}/send-email-code`, data)
}
