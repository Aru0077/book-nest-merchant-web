/**
 * 密码验证工具 - 与后端IsStrongPassword保持一致
 * 基于BookNest后端的密码策略
 */

/**
 * 常见弱密码列表（与后端保持同步）
 */
const COMMON_WEAK_PASSWORDS = [
  '12345678',
  '87654321', 
  'password',
  'Password',
  'password123',
  'Password123',
  'abcd1234',
  'qwerty123',
  'admin123',
  'user1234',
  '11111111',
  '00000000',
  'password1',
  'Password1',
  'qwertyui',
  'asdfghjk',
  '1qaz2wsx',
  '1q2w3e4r',
  '123456789',
  '987654321'
]

/**
 * 密码验证结果接口
 */
export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

/**
 * 验证密码强度（与后端IsStrongPassword规则一致）
 * @param password 待验证的密码
 * @returns 密码验证结果
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []

  // 检查密码是否存在
  if (!password) {
    return {
      isValid: false,
      errors: ['密码不能为空'],
      strength: 'weak'
    }
  }

  // 1. 长度检查：8-50字符
  if (password.length < 8) {
    errors.push('密码长度不能少于8位')
  }
  if (password.length > 50) {
    errors.push('密码长度不能超过50位')
  }

  // 2. 字符要求检查：必须包含字母和数字
  const hasLetter = /[A-Za-z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  if (!hasLetter || !hasNumber) {
    errors.push('密码必须包含字母和数字')
  }

  // 3. 特殊字符检查（允许的特殊字符）
  const validCharPattern = /^[A-Za-z\d@$!%*?&.,-_]+$/
  if (!validCharPattern.test(password)) {
    errors.push('密码只能包含字母、数字和特殊字符(@$!%*?&.,-_)')
  }

  // 4. 常见弱密码检查
  const lowerPassword = password.toLowerCase()
  if (COMMON_WEAK_PASSWORDS.some(weak => lowerPassword === weak.toLowerCase())) {
    errors.push('密码过于简单，请使用更复杂的密码')
  }

  // 5. 连续重复字符检查（不允许连续3个相同字符）
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) {
      errors.push('密码不能包含连续重复的字符')
      break
    }
  }

  // 计算密码强度
  const strength = calculatePasswordStrength(password, errors.length === 0)

  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}

/**
 * 计算密码强度
 * @param password 密码
 * @param passesBasicValidation 是否通过基础验证
 * @returns 密码强度级别
 */
function calculatePasswordStrength(password: string, passesBasicValidation: boolean): 'weak' | 'medium' | 'strong' {
  if (!passesBasicValidation || password.length < 8) {
    return 'weak'
  }

  let score = 0

  // 长度加分
  if (password.length >= 12) score += 2
  else if (password.length >= 10) score += 1

  // 字符类型多样性加分
  if (/[a-z]/.test(password)) score += 1  // 小写字母
  if (/[A-Z]/.test(password)) score += 1  // 大写字母
  if (/\d/.test(password)) score += 1     // 数字
  if (/[@$!%*?&.,-_]/.test(password)) score += 1  // 特殊字符

  // 复杂度加分
  if (password.length >= 16) score += 1

  if (score >= 6) return 'strong'
  if (score >= 4) return 'medium'
  return 'weak'
}

/**
 * 获取密码强度描述和颜色
 * @param strength 密码强度
 * @returns 强度描述和CSS类名
 */
export function getPasswordStrengthInfo(strength: 'weak' | 'medium' | 'strong') {
  switch (strength) {
    case 'strong':
      return { text: '强', color: 'var(--color-success)', class: 'password-strength-strong' }
    case 'medium': 
      return { text: '中等', color: 'var(--color-warning)', class: 'password-strength-medium' }
    case 'weak':
    default:
      return { text: '弱', color: 'var(--color-error)', class: 'password-strength-weak' }
  }
}

/**
 * 密码规则说明文本
 */
export const PASSWORD_RULES = [
  '长度为8-50个字符',
  '必须包含字母和数字', 
  '可以包含特殊字符 @$!%*?&.,-_',
  '不能是常见的弱密码',
  '不能包含连续重复的字符'
] as const