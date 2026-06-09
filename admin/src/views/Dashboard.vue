<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总用户</span>
              <el-icon class="icon user"><User /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalUsers || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总订单</span>
              <el-icon class="icon order"><List /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ stats.totalOrders || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总收入</span>
              <el-icon class="icon money"><Money /></el-icon>
            </div>
          </template>
          <div class="stat-value">¥{{ ((stats.totalRevenue || 0) / 100).toFixed(2) }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日订单</span>
              <el-icon class="icon today"><TrendCharts /></el-icon>
            </div>
          </template>
          <div class="stat-value">{{ stats.todayOrders || 0 }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>最近订单</span>
          </template>
          <el-table :data="recentOrders" stripe>
            <el-table-column prop="order_no" label="订单号" width="200" />
            <el-table-column prop="username" label="用户" />
            <el-table-column label="金额">
              <template #default="{ row }">
                ¥{{ (row.amount / 100).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>热门商品</span>
          </template>
          <div class="top-products">
            <div v-for="(product, index) in topProducts" :key="index" class="product-item">
              <span class="rank">{{ index + 1 }}</span>
              <span class="name">{{ product.name }}</span>
              <span class="sales">销量: {{ product.sales_count }}</span>
            </div>
            <el-empty v-if="topProducts.length === 0" description="暂无数据" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/request'

const stats = ref({})
const recentOrders = ref([])
const topProducts = ref([])

const fetchStats = async () => {
  try {
    const res = await api.get('/stats/overview')
    stats.value = res.data
    recentOrders.value = res.data.recentOrders || []
    topProducts.value = res.data.topProducts || []
  } catch (error) {
    console.error('获取统计失败:', error)
  }
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    paid: 'primary',
    delivered: 'success',
    refunded: 'info',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待支付',
    paid: '已支付',
    delivered: '已完成',
    refunded: '已退款',
    cancelled: '已取消'
  }
  return map[status] || '未知'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.stat-cards {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon {
  font-size: 24px;
}

.icon.user { color: #409EFF; }
.icon.order { color: #67C23A; }
.icon.money { color: #E6A23C; }
.icon.today { color: #F56C6C; }

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.top-products {
  min-height: 200px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.product-item:last-child {
  border-bottom: none;
}

.rank {
  width: 24px;
  height: 24px;
  background: #409EFF;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  margin-right: 10px;
}

.product-item:nth-child(1) .rank { background: #F56C6C; }
.product-item:nth-child(2) .rank { background: #E6A23C; }
.product-item:nth-child(3) .rank { background: #67C23A; }

.name {
  flex: 1;
}

.sales {
  color: #909399;
  font-size: 14px;
}
</style>
