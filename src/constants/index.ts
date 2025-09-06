/**
 * 核心常量定义 - 精简版本
 * 遵循YAGNI原则，仅定义当前需要的常量
 */

// ============ API端点 ============
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/merchant/auth/login',
    REGISTER: '/merchant/auth/register',
    REFRESH: '/merchant/auth/refresh',
    LOGOUT: '/merchant/auth/logout',
  },
} as const

// ============ 应用配置 ============
export const APP_CONFIG = {
  NAME: 'BookNest商家端',
  VERSION: '1.0.0',
} as const

// ============ 存储键名 ============
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'booknest_access_token',
  REFRESH_TOKEN: 'booknest_refresh_token',
  USER_INFO: 'booknest_user_info',
} as const