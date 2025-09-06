/**
 * 本地存储工具函数 - merchant-web (精简版)
 * 遵循YAGNI原则，仅保留核心必需功能
 */

/**
 * 存储数据到localStorage
 */
export const setStorage = <T>(key: string, value: T): boolean => {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
    return true
  } catch {
    // localStorage存储失败
    return false
  }
}

/**
 * 从localStorage获取数据
 */
export const getStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return null
    }
    return JSON.parse(item) as T
  } catch {
    // localStorage获取失败
    return null
  }
}

/**
 * 从localStorage删除数据
 */
export const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {
    // localStorage删除失败
  }
}

/**
 * 检查localStorage中是否存在某个key
 */
export const hasStorage = (key: string): boolean => {
  return localStorage.getItem(key) !== null
}