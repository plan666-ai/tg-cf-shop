<template>
  <div class="orders">
    <div class="header">
      <h2>订单管理</h2>
      <div class="filters">
        <el-select v-model="statusFilter" placeholder="订单状态" clearable @change="fetchOrders">
          <el-option label="全部" value="" />
          <el-option label="待支付" value="pending" />
          <el-option label="已支付" value="paid" />
          <el-option label="已完成" value="delivered" />
          <el-option label="已退款" value="refunded" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </div>
    </div>

    <!-- PC端表格 -->
    <el-table :data="orders" v-loading="loading" stripe class="pc-table">
      <el-table-column prop="order_no" label="订单号" width="200" />
      <el-table-column prop="username" label="用户" width="120" />
      <el-table-column prop="product_name" label="商品" />
      <el-table-column prop="quantity" label="数量" width="80" />
      <el-table-column label="金额" width="100">
        <template #default="{ row }">
          ¥{{ (row.amount / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="100">
        <template #default="{ row }">
          {{ row.payment_method === 'stars' ? 'Stars' : row.payment_method === 'balance' ? '余额' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
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
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row)">详情</el-button>
          <el-button
            v-if="row.status === 'paid' || row.status === 'delivered'"
            size="small"
            type="warning"
            @click="refundOrder(row)"
          >
            退款
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 手机端卡片列表 -->
    <div class="mobile-cards" v-loading="loading">
      <div v-for="order in orders" :key="order.id" class="order-card" @click="viewDetail(order)">
        <div class="order-card-header">
          <span class="order-no">{{ order.order_no }}</span>
          <el-tag :type="getStatusType(order.status)" size="small">
            {{ getStatusText(order.status) }}
          </el-tag>
        </div>
        <div class="order-card-body">
          <div class="order-info-row">
            <span class="label">商品</span>
            <span class="value">{{ order.product_name || '-' }}</span>
          </div>
          <div class="order-info-row">
            <span class="label">用户</span>
            <span class="value">{{ order.username || '-' }}</span>
          </div>
          <div class="order-info-row">
            <span class="label">数量</span>
            <span class="value">{{ order.quantity }}</span>
          </div>
        </div>
        <div class="order-card-footer">
          <span class="order-amount">¥{{ (order.amount / 100).toFixed(2) }}</span>
          <span class="order-time">{{ formatDate(order.created_at) }}</span>
        </div>
      </div>
      <el-empty v-if="!loading && orders.length === 0" description="暂无订单" />
    </div>

    <!-- 订单详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="订单详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ currentOrder?.order_no }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ currentOrder?.user_id }}</el-descriptions-item>
        <el-descriptions-item label="商品名称">{{ currentOrder?.product_name }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ currentOrder?.quantity }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ ((currentOrder?.amount || 0) / 100).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentOrder?.status)">
            {{ getStatusText(currentOrder?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(currentOrder?.created_at) }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ formatDate(currentOrder?.paid_at) }}</el-descriptions-item>
      </el-descriptions>

      <div v-if="currentOrder?.card_content" style="margin-top: 20px">
        <h4>卡密信息</h4>
        <el-input type="textarea" :model-value="currentOrder.card_content" :rows="4" readonly />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api/request'

const orders = ref([])
const loading = ref(false)
const statusFilter = ref('')
const showDetailDialog = ref(false)
const currentOrder = ref(null)

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    const res = await api.get('/orders', { params })
    orders.value = res.data
  } finally {
    loading.value = false
  }
}

const viewDetail = (order) => {
  currentOrder.value = order
  showDetailDialog.value = true
}

const refundOrder = async (order) => {
  await ElMessageBox.confirm(`确定要退款订单 ${order.order_no} 吗？`, '退款确认')
  try {
    await api.post(`/orders/${order.id}/refund`)
    ElMessage.success('退款成功')
    fetchOrders()
  } catch (error) {
    // 错误已在拦截器中处理
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
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.filters {
  display: flex;
  gap: 10px;
}

/* 手机端卡片 */
.mobile-cards {
  display: none;
}

.order-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.order-card:active {
  transform: scale(0.98);
  background: #f5f7fa;
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-no {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  font-family: monospace;
}

.order-card-body {
  margin-bottom: 10px;
}

.order-info-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}

.order-info-row .label {
  color: #909399;
}

.order-info-row .value {
  color: #303133;
  font-weight: 500;
  max-width: 60%;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.order-amount {
  font-size: 16px;
  font-weight: 700;
  color: #409EFF;
}

.order-time {
  font-size: 12px;
  color: #909399;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .orders {
    padding: 12px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    margin-bottom: 12px;
  }

  .header h2 {
    font-size: 18px;
  }

  .filters {
    flex-wrap: wrap;
  }

  .pc-table {
    display: none;
  }

  .mobile-cards {
    display: block;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 10px auto !important;
  }
}
</style>
