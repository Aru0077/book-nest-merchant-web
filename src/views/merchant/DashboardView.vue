<template>
  <div class="dashboard">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>商家仪表板</h1>
          <div class="user-info">
            <span>欢迎，{{ authStore.userInfo?.username || authStore.userInfo?.email }}</span>
            <el-button type="text" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>

      <el-main>
        <div class="dashboard-content">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>业务概览</span>
                  </div>
                </template>
                <div class="dashboard-stats">
                  <p>这里将显示商家业务统计信息</p>
                  <p>酒店数量、房间总数、订单统计、收益分析等</p>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>酒店管理</span>
                    <el-button type="primary" size="small">
                      添加酒店
                    </el-button>
                  </div>
                </template>
                <div class="hotel-list">
                  <el-empty description="暂无酒店数据" />
                </div>
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>最近订单</span>
                  </div>
                </template>
                <div class="order-list">
                  <el-empty description="暂无订单数据" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    ElMessage.error((error as Error).message || '退出登录失败')
  }
}
</script>

<style scoped>
.dashboard {
  height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-stats {
  text-align: center;
  padding: 40px;
  color: var(--el-text-color-regular);
}

.hotel-list,
.order-list {
  min-height: 200px;
}
</style>
