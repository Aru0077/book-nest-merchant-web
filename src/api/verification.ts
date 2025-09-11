/**
 * 验证码API - 精简实现
 * 区分通用验证码和注册专用验证码
 */

import { http } from '@/services/http'
import type {
  SendPhoneCodeRequest,
  SendEmailCodeRequest,
  SimpleMessageResponse,
  ApiResponse
} from './types'

// ============ 通用验证码接口 (登录、修改密码等) ============

/**
 * 发送手机验证码 - 通用
 */
export const sendPhoneCode = (data: SendPhoneCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post('/sms/send-code', data)
}

/**
 * 发送邮箱验证码 - 通用
 */
export const sendEmailCode = (data: SendEmailCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post('/email/send-code', data)
}

// ============ 商家注册专用验证码接口 ============

/**
 * 发送注册用手机验证码 (会检查是否已注册)
 */
export const sendRegisterSmsCode = (data: SendPhoneCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post('/merchant/auth/send-sms-code', data)
}

/**
 * 发送注册用邮箱验证码 (会检查是否已注册)  
 */
export const sendRegisterEmailCode = (data: SendEmailCodeRequest): Promise<ApiResponse<SimpleMessageResponse>> => {
  return http.post('/merchant/auth/send-email-code', data)
}