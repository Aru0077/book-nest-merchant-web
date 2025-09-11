/**
 * 验证码倒计时状态管理 - 简单实现
 * 支持手机号和邮箱的独立倒计时，跨页面共享
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVerificationStore = defineStore('verification', () => {
  // 手机验证码倒计时
  const phoneCodeCountdown = ref(0)
  // 邮箱验证码倒计时
  const emailCodeCountdown = ref(0)
  
  // 定时器引用
  let phoneTimer: number | null = null
  let emailTimer: number | null = null

  // 开始手机验证码倒计时
  const startPhoneCountdown = () => {
    if (phoneTimer) clearInterval(phoneTimer)
    
    phoneCodeCountdown.value = 60
    phoneTimer = setInterval(() => {
      phoneCodeCountdown.value--
      if (phoneCodeCountdown.value <= 0) {
        clearInterval(phoneTimer!)
        phoneTimer = null
      }
    }, 1000)
  }

  // 开始邮箱验证码倒计时
  const startEmailCountdown = () => {
    if (emailTimer) clearInterval(emailTimer)
    
    emailCodeCountdown.value = 60
    emailTimer = setInterval(() => {
      emailCodeCountdown.value--
      if (emailCodeCountdown.value <= 0) {
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
  }

  return {
    // 状态
    phoneCodeCountdown,
    emailCodeCountdown,
    
    // 操作
    startPhoneCountdown,
    startEmailCountdown,
    cleanup
  }
})