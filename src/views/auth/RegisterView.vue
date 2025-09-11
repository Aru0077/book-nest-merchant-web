<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <h2>BookNest 商家注册</h2>
          <p class="subtitle">注册后即可开始管理您的酒店</p>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="register-tabs">
        <!-- 用户名密码注册 -->
        <el-tab-pane label="用户名密码" name="username">
          <el-form
            ref="usernameFormRef"
            :model="usernameForm"
            :rules="usernameRules"
            class="register-form"
            @submit.prevent="handleRegister">
            <el-form-item prop="username">
              <el-input
                v-model="usernameForm.username"
                placeholder="请输入用户名"
                size="large"
                :prefix-icon="User"
                clearable />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="usernameForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                :prefix-icon="Lock"
                show-password
                clearable />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="usernameForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                :prefix-icon="Lock"
                show-password
                clearable
                @keyup.enter="handleRegister" />
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :loading="authStore.isLoading"
                @click="handleRegister">
                {{ authStore.isLoading ? '注册中...' : '立即注册' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 手机验证码注册 -->
        <el-tab-pane label="手机验证码" name="phone">
          <el-form
            ref="phoneFormRef"
            :model="phoneForm"
            :rules="phoneRules"
            class="register-form"
            @submit.prevent="handleRegister">
            <el-form-item prop="phone">
              <el-input
                v-model="phoneForm.phone"
                placeholder="请输入手机号"
                size="large"
                :prefix-icon="Phone"
                clearable />
            </el-form-item>

            <el-form-item prop="code">
              <div class="code-input-group">
                <el-input
                  v-model="phoneForm.code"
                  placeholder="请输入验证码"
                  size="large"
                  clearable
                  @keyup.enter="handleRegister" />
                <el-button
                  :disabled="phoneCodeCountdown > 0 || !phoneForm.phone"
                  size="large"
                  @click="sendPhoneCode">
                  {{ phoneCodeCountdown > 0 ? `${phoneCodeCountdown}s` : '发送验证码' }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :loading="authStore.isLoading"
                @click="handleRegister">
                {{ authStore.isLoading ? '注册中...' : '立即注册' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 邮箱验证码注册 -->
        <el-tab-pane label="邮箱验证码" name="emailCode">
          <el-form
            ref="emailCodeFormRef"
            :model="emailCodeForm"
            :rules="emailCodeRules"
            class="register-form"
            @submit.prevent="handleRegister">
            <el-form-item prop="email">
              <el-input
                v-model="emailCodeForm.email"
                placeholder="请输入邮箱"
                size="large"
                :prefix-icon="Message"
                clearable />
            </el-form-item>

            <el-form-item prop="code">
              <div class="code-input-group">
                <el-input
                  v-model="emailCodeForm.code"
                  placeholder="请输入验证码"
                  size="large"
                  clearable
                  @keyup.enter="handleRegister" />
                <el-button
                  :disabled="emailCodeCountdown > 0 || !emailCodeForm.email"
                  size="large"
                  @click="sendEmailCode">
                  {{ emailCodeCountdown > 0 ? `${emailCodeCountdown}s` : '发送验证码' }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :loading="authStore.isLoading"
                @click="handleRegister">
                {{ authStore.isLoading ? '注册中...' : '立即注册' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="form-footer">
        <span>已有账号？</span>
        <el-link type="primary" @click="$router.push('/login')">
          立即登录
        </el-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Phone } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useVerificationStore } from '@/stores/useVerificationStore'
import { authApi } from '@/api'

const router = useRouter()
const authStore = useAuthStore()
const verificationStore = useVerificationStore()

// 当前激活的标签页
const activeTab = ref('username')

// 表单引用
const usernameFormRef = ref()
const phoneFormRef = ref()
const emailCodeFormRef = ref()

// 用户名密码注册表单
const usernameForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 手机验证码注册表单
const phoneForm = reactive({
  phone: '',
  code: ''
})

// 邮箱验证码注册表单
const emailCodeForm = reactive({
  email: '',
  code: ''
})

// 使用共享的验证码倒计时状态
const { phoneCodeCountdown, emailCodeCountdown } = verificationStore

// 密码确认验证器
const validateUsernameConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== usernameForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const usernameRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20位字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateUsernameConfirmPassword, trigger: 'blur' }
  ]
}

const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const emailCodeRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

// 发送手机验证码
const sendPhoneCode = async () => {
  if (!phoneForm.phone || phoneCodeCountdown > 0) return

  try {
    await authApi.sendRegisterSmsCode({ phone: phoneForm.phone })
    ElMessage.success('验证码已发送')
    verificationStore.startPhoneCountdown()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败'
    ElMessage.error(message)
  }
}

// 发送邮箱验证码
const sendEmailCode = async () => {
  if (!emailCodeForm.email || emailCodeCountdown > 0) return

  try {
    await authApi.sendRegisterEmailCode({ email: emailCodeForm.email })
    ElMessage.success('验证码已发送')
    verificationStore.startEmailCountdown()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败'
    ElMessage.error(message)
  }
}


// 统一注册处理
const handleRegister = async () => {
  let formRef: any
  let formData: any
  let registerMethod: () => Promise<void>

  // 根据当前标签页选择对应的表单和方法
  switch (activeTab.value) {
    case 'username':
      formRef = usernameFormRef.value
      formData = usernameForm
      registerMethod = () => {
        const { confirmPassword: _, ...registerData } = formData
        return authStore.register(registerData)
      }
      break
    case 'phone':
      formRef = phoneFormRef.value
      formData = phoneForm
      registerMethod = () => authStore.registerByPhoneCode(formData)
      break
    case 'emailCode':
      formRef = emailCodeFormRef.value
      formData = emailCodeForm
      registerMethod = () => authStore.registerByEmailCode(formData)
      break
    default:
      return
  }

  if (!formRef) return

  try {
    await formRef.validate()
    await registerMethod()

    ElMessage.success('注册成功')
    router.push('/dashboard')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '操作失败'
    ElMessage.error(message)
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
}

.register-card {
  width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.register-tabs {
  padding: 20px 20px 0;
}

.register-form {
  padding: 0;
}

.code-input-group {
  display: flex;
  gap: 12px;
}

.code-input-group .el-input {
  flex: 1;
}

.code-input-group .el-button {
  width: 120px;
  flex-shrink: 0;
}

.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  font-size: 14px;
  color: var(--el-text-color-regular);
  padding: 20px;
  border-top: 1px solid var(--el-border-color-light);
  margin-top: 20px;
}

/* 标签页样式调整 */
:deep(.el-tabs__header) {
  margin: 0 0 20px;
}

:deep(.el-tabs__nav) {
  width: 100%;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
}
</style>
