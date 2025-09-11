import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { setupElementPlus } from '@/plugins/element-plus'
import '@/styles/index.css'

import { useAuthStore } from '@/stores/useAuthStore'
import { registerAuthService } from '@/services/auth'

const app = createApp(App)

// 配置Pinia和持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Element Plus设置
setupElementPlus(app)

// 初始化认证状态 - 从localStorage恢复用户登录状态
const authStore = useAuthStore()
authStore.initAuth()

// 注册认证服务，供HTTP拦截器使用
registerAuthService(authStore)

app.mount('#app')
