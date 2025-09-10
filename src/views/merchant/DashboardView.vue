<template>
  <div class="dashboard-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>仪表板</h1>
      <p class="page-description">查看商家业务概况和数据统计</p>
    </div>

    <!-- 仪表板内容 -->
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
  </div>
</template>

<script setup lang="ts">
// DashboardView现在是纯内容组件，不需要任何业务逻辑
</script>

<style scoped>
.dashboard-page {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.page-description {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 14px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }
  
  .dashboard-stats {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
