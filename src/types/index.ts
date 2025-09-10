/**
 * 通用类型定义 - 精简版本
 * 仅包含基础工具类型，API类型请直接从 @/api/types 导入
 */

// ============ 基础工具类型 ============
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string | number
