/**
 * 用户友好错误消息映射
 * 将后端错误消息转换为用户可理解的中文提示
 */

/**
 * HTTP状态码错误映射
 */
export const HTTP_ERROR_MESSAGES: Record<number, string> = {
  // 4xx 客户端错误
  400: '请求参数有误，请检查输入信息',
  401: '登录已过期，请重新登录',
  403: '您没有权限进行此操作',
  404: '请求的资源不存在',
  409: '数据冲突，该信息已存在',
  422: '数据验证失败，请检查输入格式',
  429: '操作过于频繁，请稍后再试',

  // 5xx 服务器错误
  500: '服务器内部错误，请稍后重试',
  502: '服务暂时不可用，请稍后重试',
  503: '服务正在维护中，请稍后重试',
  504: '请求超时，请检查网络连接'
} as const

/**
 * 认证相关错误映射
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // 登录错误
  '用户不存在或未激活': '账号不存在或已被停用，请联系管理员',
  '密码错误': '密码错误，请重新输入',
  '登录标识符不能为空': '请输入邮箱、手机号或用户名',
  '密码不能为空': '请输入密码',

  // 注册错误
  '至少提供一个联系方式': '请至少填写邮箱、手机号或用户名中的一项',
  '邮箱已被注册': '该邮箱已被使用，请更换其他邮箱',
  '手机号已被注册': '该手机号已被使用，请更换其他手机号',
  '用户名已被注册': '该用户名已被使用，请更换其他用户名',

  // 密码相关错误
  '密码长度不能少于8位': '密码至少需要8个字符',
  '密码长度不能超过50位': '密码不能超过50个字符',
  '密码必须包含字母和数字': '密码必须同时包含字母和数字',
  '密码过于简单，请使用更复杂的密码': '密码强度太低，请设置更复杂的密码',
  '密码不能包含连续重复的字符': '密码不能有连续相同的字符',

  // Token相关错误
  '刷新令牌已失效': '登录已过期，请重新登录',
  '访问令牌已过期': '登录已过期，正在为您自动刷新...',
  '无效的令牌': '登录状态异常，请重新登录',

  // 网络相关错误
  'Network Error': '网络连接失败，请检查网络设置',
  'timeout': '请求超时，请检查网络连接',
  'Request failed with status code': '请求失败，请稍后重试'
} as const

// 精简通用错误映射 - 仅保留商家端必需的错误类型
export const COMMON_ERROR_MESSAGES: Record<string, string> = {
  '操作失败': '操作失败，请稍后重试',
  '保存失败': '保存失败，请检查输入信息后重试',
  '更新失败': '更新失败，请稍后重试'
} as const

/**
 * 获取用户友好的错误消息 - 精简版
 * 合并网络错误处理逻辑，避免重复函数
 */
export function getFriendlyErrorMessage(
  error: unknown, 
  defaultMessage: string = '操作失败，请稍后重试'
): string {
  // 处理字符串错误消息
  if (typeof error === 'string') {
    // 优先匹配认证错误
    if (AUTH_ERROR_MESSAGES[error]) {
      return AUTH_ERROR_MESSAGES[error]
    }
    
    // 匹配通用错误
    if (COMMON_ERROR_MESSAGES[error]) {
      return COMMON_ERROR_MESSAGES[error]
    }
    
    // 处理网络相关错误字符串
    const lowerError = error.toLowerCase()
    if (lowerError.includes('network') || lowerError.includes('timeout')) {
      return '网络连接失败，请检查网络设置'
    }
    
    return error || defaultMessage
  }

  // 处理错误对象
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>
    
    // 处理HTTP状态码错误
    if (typeof errorObj.code === 'number' && HTTP_ERROR_MESSAGES[errorObj.code]) {
      return HTTP_ERROR_MESSAGES[errorObj.code]
    }
    
    // 处理网络错误码
    if (typeof errorObj.code === 'string') {
      const networkErrors = ['ENOTFOUND', 'ENETUNREACH', 'ECONNREFUSED', 'ETIMEDOUT']
      if (networkErrors.includes(errorObj.code)) {
        return '网络连接失败，请检查网络设置'
      }
    }
    
    // 处理消息字段
    if (typeof errorObj.message === 'string') {
      return getFriendlyErrorMessage(errorObj.message, defaultMessage)
    }
  }

  return defaultMessage
}

// 精简网络错误处理 - 合并到主错误处理函数中
// 移除独立的getNetworkErrorMessage函数以避免重复逻辑