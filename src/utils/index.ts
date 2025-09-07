/**
 * 工具函数集合 - 按需导出，遵循YAGNI原则
 */

// 存储工具函数
export { setStorage, getStorage, removeStorage, hasStorage } from './storage'

// Token管理函数
export { saveTokens, getAccessToken, getRefreshToken, getTokens, clearTokens, hasTokens } from './token'

// 密码验证工具函数
export { validatePassword, getPasswordStrengthInfo, PASSWORD_RULES, type PasswordValidationResult } from './validation'