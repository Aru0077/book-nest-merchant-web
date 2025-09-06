/**
 * 加载状态管理组合式函数
 */

import { ref, readonly, type Ref } from 'vue'

export interface UseLoadingReturn {
  isLoading: Readonly<Ref<boolean>>
  setLoading: (loading: boolean) => void
  startLoading: () => void
  stopLoading: () => void
  withLoading: <T>(promise: Promise<T>) => Promise<T>
}

/**
 * 加载状态管理
 * @param initialState 初始加载状态
 */
export function useLoading(initialState = false): UseLoadingReturn {
  const isLoading = ref(initialState)
  
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }
  
  const startLoading = () => {
    isLoading.value = true
  }
  
  const stopLoading = () => {
    isLoading.value = false
  }
  
  const withLoading = async <T>(promise: Promise<T>): Promise<T> => {
    startLoading()
    try {
      const result = await promise
      return result
    } finally {
      stopLoading()
    }
  }
  
  return {
    isLoading: readonly(isLoading),
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
}