import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, publicGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 认证相关路由（不使用布局）
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

    // 主应用路由（使用AdminLayout布局）
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/merchant/DashboardView.vue'),
          meta: { title: '仪表板' }
        },
        // 预留的酒店管理路由
        {
          path: 'hotels',
          name: 'Hotels',
          component: () => import('@/views/merchant/DashboardView.vue'), // 临时使用Dashboard
          meta: { title: '酒店列表' }
        },
        {
          path: 'hotels/create',
          name: 'CreateHotel',
          component: () => import('@/views/merchant/DashboardView.vue'), // 临时使用Dashboard
          meta: { title: '添加酒店' }
        },
        // 预留的房间管理路由
        {
          path: 'rooms',
          name: 'Rooms',
          component: () => import('@/views/merchant/DashboardView.vue'), // 临时使用Dashboard
          meta: { title: '房间列表' }
        },
        {
          path: 'rooms/create',
          name: 'CreateRoom',
          component: () => import('@/views/merchant/DashboardView.vue'), // 临时使用Dashboard
          meta: { title: '添加房间' }
        },
        // 预留的订单管理路由
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('@/views/merchant/DashboardView.vue'), // 临时使用Dashboard
          meta: { title: '订单管理' }
        },
        // 预留的个人中心路由
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/merchant/DashboardView.vue'), // 临时使用Dashboard
          meta: { title: '个人中心' }
        }
      ]
    },

    // 404重定向
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
