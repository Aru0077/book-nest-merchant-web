import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, publicGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      beforeEnter: publicGuard,
      meta: { title: '商家登录' }
    },
    {
      path: '/register',
      name: 'Register', 
      component: () => import('@/views/auth/RegisterView.vue'),
      beforeEnter: publicGuard,
      meta: { title: '商家注册' }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/merchant/DashboardView.vue'),
      beforeEnter: authGuard,
      meta: { title: '商家仪表板', requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/dashboard'
    }
  ],
})

// 全局导航守卫 - 设置页面标题
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - BookNest 商家端`
  }
})

export default router
