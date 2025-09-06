/**
 * 全局常量定义
 */

// ============ API相关常量 ============
export const API_ENDPOINTS = {
  // 认证接口
  AUTH: {
    LOGIN: '/merchant/auth/login',
    REGISTER: '/merchant/auth/register',
    REFRESH: '/merchant/auth/refresh',
    LOGOUT: '/merchant/auth/logout',
  },
  // 其他业务接口可在此扩展...
} as const

// ============ 应用配置常量 ============
export const APP_CONFIG = {
  NAME: 'BookNest商家端',
  VERSION: '1.0.0',
  DESCRIPTION: '酒店预订平台商家管理系统',
} as const

// ============ 存储键名常量 ============
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'booknest_access_token',
  REFRESH_TOKEN: 'booknest_refresh_token',
  USER_INFO: 'booknest_user_info',
  THEME: 'booknest_theme',
  LANGUAGE: 'booknest_language',
} as const

// ============ 路由路径常量 ============
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  // 其他页面路径...
} as const

// ============ HTTP状态码常量 ============
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// ============ 表单验证常量 ============
export const VALIDATION_RULES = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^1[3-9]\d{9}$/,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 20,
} as const

// ============ 错误消息常量 ============
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接异常，请检查网络设置',
  LOGIN_FAILED: '登录失败，请检查用户名和密码',
  TOKEN_EXPIRED: '登录已过期，请重新登录',
  PERMISSION_DENIED: '权限不足，无法访问',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
} as const

// ============ 成功消息常量 ============ 
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '退出成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
} as const

// ============ 分页配置常量 ============
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 10,
  MAX_SIZE: 100,
  SIZE_OPTIONS: [10, 20, 50, 100],
} as const