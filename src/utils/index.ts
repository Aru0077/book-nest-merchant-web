/**
 * 通用工具函数库
 */

// ============ 类型工具 ============
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value)
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value)
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true
  if (isString(value) || isArray(value)) return value.length === 0
  if (isObject(value)) return Object.keys(value).length === 0
  return false
}

// ============ 字符串工具 ============
export const capitalize = (str: string): string => 
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const camelCase = (str: string): string =>
  str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

export const kebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const truncate = (str: string, length: number): string =>
  str.length <= length ? str : `${str.slice(0, length)}...`

// ============ 数字工具 ============
export const formatCurrency = (amount: number, currency = '¥'): string =>
  `${currency}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`

export const formatPercent = (value: number, decimals = 2): string =>
  `${(value * 100).toFixed(decimals)}%`

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

// ============ 日期工具 ============
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
  return `${Math.floor(diffDays / 365)}年前`
}

// ============ 对象工具 ============
export const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

// ============ 数组工具 ============
export const unique = <T>(array: T[]): T[] => [...new Set(array)]

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    groups[groupKey] = groups[groupKey] || []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// ============ URL工具 ============
export const buildUrl = (base: string, params?: Record<string, unknown>): string => {
  if (!params) return base
  
  const url = new URL(base, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

export const parseUrl = (url: string): { pathname: string; search: Record<string, string> } => {
  const urlObj = new URL(url, window.location.origin)
  const search: Record<string, string> = {}
  
  urlObj.searchParams.forEach((value, key) => {
    search[key] = value
  })
  
  return {
    pathname: urlObj.pathname,
    search,
  }
}

// ============ 存储工具 ============
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 静默处理存储错误
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      // 静默处理存储错误
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear()
    } catch {
      // 静默处理存储错误
    }
  },
}

// ============ 防抖和节流 ============
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), delay)
  }
}

export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}