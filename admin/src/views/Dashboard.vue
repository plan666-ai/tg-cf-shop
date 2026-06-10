<template>
  <div class="dashboard">
    <el-row :gutter="16" class="stat-cards">
      <el-col :xs="12" :sm="12" :md="6">
        <el-card class="stat-card user" shadow="hover">
          <div class="card-header">
            <span>总用户</span>
            <div class="icon-wrapper user">
              <el-icon class="icon user"><User /></el-icon>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalUsers || 0 }}</div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>+12%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card class="stat-card order" shadow="hover">
          <div class="card-header">
            <span>总订单</span>
            <div class="icon-wrapper order">
              <el-icon class="icon order"><List /></el-icon>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalOrders || 0 }}</div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>+8%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card class="stat-card money" shadow="hover">
          <div class="card-header">
            <span>总收入</span>
            <div class="icon-wrapper money">
              <el-icon class="icon money"><Money /></el-icon>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-value">¥{{ ((stats.totalRevenue || 0) / 100).toFixed(2) }}</div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>+15%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <el-card class="stat-card today" shadow="hover">
          <div class="card-header">
            <span>今日订单</span>
            <div class="icon-wrapper today">
              <el-icon class="icon today"><TrendCharts /></el-icon>
            </div>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.todayOrders || 0 }}</div>
            <div class="stat-trend down">
              <el-icon><Bottom /></el-icon>
              <span>-3%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :md="16">
        <el-card>
          <template #header>
            <span>最近订单趋势</span>
          </template>
          <div class="chart-container">
            <Line v-if="chartData" :data="chartData" :options="chartOptions" />
            <el-empty v-else description="暂无订单数据" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="8">
        <el-card style="margin-top: 16px">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Top, Bottom } from '@element-plus/icons-vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import api from '../api/request'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const stats = ref({})
const recentOrders = ref([])
const topProducts = ref([])

const chartData = computed(() => {
  if (!recentOrders.value.length) return null

  const orders = [...recentOrders.value].reverse()
  const labels = orders.map(order => {
    const date = new Date(order.created_at)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`
  })
  const amounts = orders.map(order => (order.amount / 100).toFixed(2))

  return {
    labels,
    datasets: [
      {
        label: '订单金额 (¥)',
        data: amounts,
        borderColor: '#409EFF',
        backgroundColor: 'rgba(64, 158, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#409EFF',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#409EFF',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 13,
          weight: '600'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14,
        weight: '600'
      },
      bodyFont: {
        size: 13
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return `金额: ¥${context.parsed.y}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 12
        },
        color: '#909399'
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        font: {
          size: 12
        },
        color: '#909399',
        callback: function(value) {
          return '¥' + value
        }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index'
  }
}

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

let fetchTimer = null

onMounted(() => {
  fetchStats()
})

onUnmounted(() => {
  if (fetchTimer) {
    clearTimeout(fetchTimer)
    fetchTimer = null
  }
})
</script>

<style scoped>
.stat-cards {
  margin-bottom: 24px;
}

.stat-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card.user::before {
  background: linear-gradient(90deg, #409EFF 0%, #66b1ff 100%);
}

.stat-card.order::before {
  background: linear-gradient(90deg, #67C23A 0%, #85ce61 100%);
}

.stat-card.money::before {
  background: linear-gradient(90deg, #E6A23C 0%, #ebb563 100%);
}

.stat-card.today::before {
  background: linear-gradient(90deg, #F56C6C 0%, #f78989 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 10px;
}

.card-header span {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-wrapper.user {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.1) 100%);
}

.icon-wrapper.order {
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.2) 0%, rgba(103, 194, 58, 0.1) 100%);
}

.icon-wrapper.money {
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.2) 0%, rgba(230, 162, 60, 0.1) 100%);
}

.icon-wrapper.today {
  background: linear-gradient(135deg, rgba(245, 108, 108, 0.2) 0%, rgba(245, 108, 108, 0.1) 100%);
}

.icon {
  font-size: 24px;
}

.icon.user { color: #409EFF; }
.icon.order { color: #67C23A; }
.icon.money { color: #E6A23C; }
.icon.today { color: #F56C6C; }

.stat-content {
  padding: 10px 20px 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.up {
  color: #67C23A;
}

.stat-trend.down {
  color: #F56C6C;
}

:deep(.el-card__body) {
  padding: 0;
}

.top-products {
  min-height: 200px;
  padding: 10px 0;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.product-item:hover {
  background: rgba(64, 158, 255, 0.05);
}

.product-item:last-child {
  border-bottom: none;
}

.rank {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  margin-right: 14px;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
}

.product-item:nth-child(1) .rank {
  background: linear-gradient(135deg, #F56C6C 0%, #f78989 100%);
  box-shadow: 0 4px 8px rgba(245, 108, 108, 0.3);
}

.product-item:nth-child(2) .rank {
  background: linear-gradient(135deg, #E6A23C 0%, #ebb563 100%);
  box-shadow: 0 4px 8px rgba(230, 162, 60, 0.3);
}

.product-item:nth-child(3) .rank {
  background: linear-gradient(135deg, #67C23A 0%, #85ce61 100%);
  box-shadow: 0 4px 8px rgba(103, 194, 58, 0.3);
}

.name {
  flex: 1;
  font-weight: 500;
  color: #303133;
}

.sales {
  color: #909399;
  font-size: 14px;
  background: rgba(144, 147, 153, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
}

/* 订单表格美化 */
:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-table th) {
  background: linear-gradient(180deg, #f5f7fa 0%, #ebeef5 100%);
  color: #606266;
  font-weight: 600;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background: rgba(64, 158, 255, 0.02);
}

:deep(.el-table .el-table__row:hover > td.el-table__cell) {
  background: rgba(64, 158, 255, 0.06);
}

:deep(.el-card) {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 18px 20px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  height: 350px;
  padding: 20px;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .stat-cards {
    margin-bottom: 12px;
  }

  .card-header {
    padding: 14px 14px 8px;
  }

  .card-header span {
    font-size: 13px;
  }

  .icon-wrapper {
    width: 36px;
    height: 36px;
    border-radius: 8px;
  }

  .icon {
    font-size: 18px;
  }

  .stat-content {
    padding: 6px 14px 14px;
  }

  .stat-value {
    font-size: 22px;
    margin-bottom: 4px;
  }

  .stat-trend {
    font-size: 11px;
  }

  .chart-container {
    height: 250px;
    padding: 10px;
  }

  .product-item {
    padding: 10px 14px;
  }

  .rank {
    width: 24px;
    height: 24px;
    font-size: 12px;
    margin-right: 10px;
  }

  .name {
    font-size: 13px;
  }

  .sales {
    font-size: 12px;
    padding: 3px 8px;
  }

  :deep(.el-card__header) {
    padding: 14px 16px;
    font-size: 14px;
  }
}
</style>
