/**
 * 验证码倒计时状态管理 - 精简高效实现
 * 修复倒计时显示问题，确保响应式更新
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVerificationStore = defineStore('verification', () => {
  // 手机验证码倒计时
  const phoneCountdown = ref(0)
  // 邮箱验证码倒计时
  const emailCountdown = ref(0)
  
  // 定时器引用
  let phoneTimer: ReturnType<typeof setInterval> | null = null
  let emailTimer: ReturnType<typeof setInterval> | null = null

  // 计算属性，确保响应式
  const phoneCodeCountdown = computed(() => phoneCountdown.value)
  const emailCodeCountdown = computed(() => emailCountdown.value)

  // 开始手机验证码倒计时
  const startPhoneCountdown = () => {
    if (phoneTimer) {
      clearInterval(phoneTimer)
      phoneTimer = null
    }
    
    phoneCountdown.value = 60
    phoneTimer = setInterval(() => {
      phoneCountdown.value--
      if (phoneCountdown.value <= 0) {
        clearInterval(phoneTimer!)
        phoneTimer = null
      }
    }, 1000)
  }

  // 开始邮箱验证码倒计时
  const startEmailCountdown = () => {
    if (emailTimer) {
      clearInterval(emailTimer)
      emailTimer = null
    }
    
    emailCountdown.value = 60
    emailTimer = setInterval(() => {
      emailCountdown.value--
      if (emailCountdown.value <= 0) {
        clearInterval(emailTimer!)
        emailTimer = null
      }
    }, 1000)
  }

  // 清理定时器
  const cleanup = () => {
    if (phoneTimer) {
      clearInterval(phoneTimer)
      phoneTimer = null
    }
    if (emailTimer) {
      clearInterval(emailTimer)
      emailTimer = null
    }
    phoneCountdown.value = 0
    emailCountdown.value = 0
  }

  return {
    // 响应式状态
    phoneCodeCountdown,
    emailCodeCountdown,
    
    // 操作
    startPhoneCountdown,
    startEmailCountdown,
    cleanup
  }
})