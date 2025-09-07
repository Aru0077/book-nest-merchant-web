import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入全局样式
import '@/styles/index.css'

// 导入认证store
import { useAuthStore } from '@/stores/useAuthStore'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 初始化认证状态 - 从localStorage恢复用户登录状态
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')
