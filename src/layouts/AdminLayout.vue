<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏容器 -->
      <el-aside 
        :width="isCollapse ? '64px' : '200px'"
        :class="{ 'mobile-hidden': isMobile }"
      >
        <div class="sidebar">
          <!-- Logo区域 -->
          <div class="logo">
            <h2 v-if="!isCollapse">{{ APP_CONFIG.NAME }}</h2>
            <h2 v-else>BN</h2>
          </div>
          
          <!-- 导航菜单 -->
          <el-menu
            :default-active="currentRoute"
            :collapse="isCollapse"
            :unique-opened="true"
            router
          >
            <el-menu-item index="/dashboard">
              <el-icon><House /></el-icon>
              <span>仪表板</span>
            </el-menu-item>
            
            <el-sub-menu index="hotels">
              <template #title>
                <el-icon><OfficeBuilding /></el-icon>
                <span>酒店管理</span>
              </template>
              <el-menu-item index="/hotels">
                <el-icon><List /></el-icon>
                <span>酒店列表</span>
              </el-menu-item>
              <el-menu-item index="/hotels/create">
                <el-icon><Plus /></el-icon>
                <span>添加酒店</span>
              </el-menu-item>
            </el-sub-menu>
            
            <el-sub-menu index="rooms">
              <template #title>
                <el-icon><HomeFilled /></el-icon>
                <span>房间管理</span>
              </template>
              <el-menu-item index="/rooms">
                <el-icon><List /></el-icon>
                <span>房间列表</span>
              </el-menu-item>
              <el-menu-item index="/rooms/create">
                <el-icon><Plus /></el-icon>
                <span>添加房间</span>
              </el-menu-item>
            </el-sub-menu>
            
            <el-menu-item index="/orders">
              <el-icon><Document /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
            
            <el-menu-item index="/profile">
              <el-icon><User /></el-icon>
              <span>个人中心</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>

      <el-container>
        <!-- 顶栏容器 -->
        <el-header height="60px">
          <div class="header-content">
            <!-- 左侧：菜单控制 -->
            <div class="header-left">
              <el-button 
                text 
                :icon="isCollapse ? Expand : Fold"
                size="large"
                @click="toggleCollapse"
              />
              
              <!-- 移动端汉堡菜单 -->
              <el-button 
                v-if="isMobile"
                text
                :icon="Menu"
                size="large"
                @click="toggleMobileMenu"
              />
            </div>

            <!-- 右侧：用户信息和操作 -->
            <div class="header-right">
              <div class="user-info">
                <span>欢迎，{{ authStore.userInfo?.username || authStore.userInfo?.email }}</span>
                <el-dropdown>
                  <span class="user-avatar">
                    <el-icon size="20"><User /></el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="$router.push('/profile')">
                        <el-icon><User /></el-icon>
                        个人中心
                      </el-dropdown-item>
                      <el-dropdown-item divided @click="handleLogout">
                        <el-icon><SwitchButton /></el-icon>
                        退出登录
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </el-header>

        <!-- 主要区域容器 -->
        <el-main>
          <div class="main-content">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 移动端侧边栏抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      size="250px"
      :with-header="false"
    >
      <div class="mobile-sidebar">
        <div class="logo">
          <h2>{{ APP_CONFIG.NAME }}</h2>
        </div>
        <el-menu
          :default-active="currentRoute"
          router
          @select="handleMobileMenuSelect"
        >
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <span>仪表板</span>
          </el-menu-item>
          
          <el-sub-menu index="hotels">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>酒店管理</span>
            </template>
            <el-menu-item index="/hotels">
              <el-icon><List /></el-icon>
              <span>酒店列表</span>
            </el-menu-item>
            <el-menu-item index="/hotels/create">
              <el-icon><Plus /></el-icon>
              <span>添加酒店</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="rooms">
            <template #title>
              <el-icon><HomeFilled /></el-icon>
              <span>房间管理</span>
            </template>
            <el-menu-item index="/rooms">
              <el-icon><List /></el-icon>
              <span>房间列表</span>
            </el-menu-item>
            <el-menu-item index="/rooms/create">
              <el-icon><Plus /></el-icon>
              <span>添加房间</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/orders">
            <el-icon><Document /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  House,
  OfficeBuilding,
  HomeFilled,
  Document,
  User,
  List,
  Plus,
  Menu,
  Fold,
  Expand,
  SwitchButton
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { APP_CONFIG } from '@/constants'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 响应式状态
const isCollapse = ref(false)
const isMobile = ref(false)
const drawerVisible = ref(false)

// 当前路由
const currentRoute = computed(() => route.path)

// 检查是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) {
    drawerVisible.value = false
  }
}

// 切换侧边栏收缩状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  drawerVisible.value = !drawerVisible.value
}

// 移动端菜单选择处理
const handleMobileMenuSelect = () => {
  drawerVisible.value = false
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '退出登录失败'
    ElMessage.error(errorMessage)
  }
}

// 生命周期
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  width: 100vw;
}

.el-container {
  height: 100%;
}

/* 侧边栏样式 */
.el-aside {
  background-color: #001529;
  transition: width 0.3s;
}

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #1f2937;
  color: #fff;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.el-menu {
  flex: 1;
  border: none;
  background-color: #001529;
}

:deep(.el-menu-item) {
  color: #d1d5db;
}

:deep(.el-menu-item:hover) {
  background-color: #1f2937;
  color: #fff;
}

:deep(.el-menu-item.is-active) {
  background-color: #1d4ed8;
  color: #fff;
}

:deep(.el-sub-menu__title) {
  color: #d1d5db;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #1f2937;
  color: #fff;
}

/* 顶栏样式 */
.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #374151;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar:hover {
  background-color: #e5e7eb;
}

/* 主要内容区域 */
.el-main {
  padding: 20px;
  background-color: #f9fafb;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* 移动端侧边栏 */
.mobile-sidebar {
  height: 100%;
  background-color: #001529;
}

.mobile-sidebar .logo {
  background-color: #001529;
}

.mobile-sidebar .el-menu {
  background-color: #001529;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mobile-hidden {
    display: none !important;
  }
  
  .el-main {
    padding: 15px;
  }
  
  .header-content {
    padding: 0 15px;
  }
  
  .main-content {
    max-width: none;
  }
  
  .user-info span {
    display: none;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .el-main {
    padding: 18px;
  }
  
  .main-content {
    max-width: 960px;
  }
}
</style>