<template>
  <div class="orders">
    <div class="header">
      <h2>订单管理</h2>
      <div class="filters">
        <el-input
          v-model="searchQuery"
          placeholder="搜索订单号/用户ID/用户名"
          clearable
          style="width: 240px"
          @keyup.enter="fetchOrders"
          @clear="fetchOrders"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="fetchOrders">搜索</el-button>
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

    <!-- 批量操作栏 -->
    <div class="batch-bar" v-if="selectedOrders.length > 0">
      <span class="batch-info">已选择 <strong>{{ selectedOrders.length }}</strong> 项</span>
      <div class="batch-actions">
        <el-button size="small" type="warning" @click="batchCancel">
          <el-icon><Close /></el-icon> 批量取消
        </el-button>
        <el-button size="small" type="danger" @click="batchDelete">
          <el-icon><Delete /></el-icon> 批量删除
        </el-button>
        <el-button size="small" @click="clearSelection">取消选择</el-button>
      </div>
    </div>

    <!-- PC端表格 -->
    <el-table
      ref="tableRef"
      :data="orders"
      v-loading="loading"
      stripe
      class="pc-table"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
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
            v-if="row.status === 'pending'"
            size="small"
            type="warning"
            @click="cancelOrder(row)"
          >
            取消
          </el-button>
          <el-button
            v-if="row.status === 'paid' || row.status === 'delivered'"
            size="small"
            type="warning"
            @click="refundOrder(row)"
          >
            退款
          </el-button>
          <el-button
            v-if="row.status !== 'paid' && row.status !== 'delivered'"
            size="small"
            type="danger"
            @click="deleteOrder(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 手机端卡片列表 -->
    <div class="mobile-cards" v-loading="loading">
      <div v-for="order in orders" :key="order.id"
        class="order-card"
        :class="{ selected: selectedIds.has(order.id) }"
      >
        <div class="order-card-header" @click="toggleSelect(order)">
          <div class="select-area">
            <div class="checkbox" :class="{ checked: selectedIds.has(order.id) }">
              <el-icon v-if="selectedIds.has(order.id)"><Check /></el-icon>
            </div>
            <span class="order-no">{{ order.order_no }}</span>
          </div>
          <el-tag :type="getStatusType(order.status)" size="small">
            {{ getStatusText(order.status) }}
          </el-tag>
        </div>
        <div class="order-card-body" @click="viewDetail(order)">
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
        <div class="order-card-actions" v-if="selectedIds.has(order.id)">
          <el-button v-if="order.status === 'pending'" size="small" type="warning" @click.stop="cancelOrder(order)">取消</el-button>
          <el-button v-if="order.status === 'paid' || order.status === 'delivered'" size="small" type="warning" @click.stop="refundOrder(order)">退款</el-button>
          <el-button v-if="order.status !== 'paid' && order.status !== 'delivered'" size="small" type="danger" @click.stop="deleteOrder(order)">删除</el-button>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close, Delete, Check, Search } from '@element-plus/icons-vue'
import api from '../api/request'

const orders = ref([])
const loading = ref(false)
const statusFilter = ref('')
const searchQuery = ref('')
const showDetailDialog = ref(false)
const currentOrder = ref(null)
const selectedOrders = ref([])
const tableRef = ref(null)

const selectedIds = computed(() => new Set(selectedOrders.value.map(o => o.id)))

const fetchOrders = async () => {
  loading.value = true
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    if (searchQuery.value) params.search = searchQuery.value
    const res = await api.get('/orders', { params })
    orders.value = res.data
  } finally {
    loading.value = false
  }
}

const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
}

const toggleSelect = (order) => {
  const idx = selectedOrders.value.findIndex(o => o.id === order.id)
  if (idx >= 0) {
    selectedOrders.value.splice(idx, 1)
  } else {
    selectedOrders.value.push(order)
  }
}

const clearSelection = () => {
  selectedOrders.value = []
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

const viewDetail = (order) => {
  currentOrder.value = order
  showDetailDialog.value = true
}

const cancelOrder = async (order) => {
  await ElMessageBox.confirm(`确定要取消订单 ${order.order_no} 吗？`, '取消确认')
  try {
    await api.post(`/orders/${order.id}/refund`)
    ElMessage.success('订单已取消')
    fetchOrders()
  } catch (error) {
    // 错误已在拦截器中处理
  }
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

const deleteOrder = async (order) => {
  await ElMessageBox.confirm(`确定要删除订单 ${order.order_no} 吗？此操作不可恢复。`, '删除确认', { type: 'warning' })
  try {
    await api.delete(`/orders/${order.id}`)
    ElMessage.success('订单已删除')
    fetchOrders()
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

const batchCancel = async () => {
  const pendingOrders = selectedOrders.value.filter(o => o.status === 'pending')
  if (pendingOrders.length === 0) {
    ElMessage.warning('没有可取消的待支付订单')
    return
  }
  await ElMessageBox.confirm(`确定要取消选中的 ${pendingOrders.length} 个待支付订单吗？`, '批量取消')
  try {
    for (const order of pendingOrders) {
      await api.post(`/orders/${order.id}/refund`)
    }
    ElMessage.success(`已取消 ${pendingOrders.length} 个订单`)
    clearSelection()
    fetchOrders()
  } catch (error) {
    // 错误已在拦截器中处理
  }
}

const batchDelete = async () => {
  const deletable = selectedOrders.value.filter(o => o.status !== 'paid' && o.status !== 'delivered')
  if (deletable.length === 0) {
    ElMessage.warning('没有可删除的订单（已支付/已完成的订单不可删除）')
    return
  }
  await ElMessageBox.confirm(`确定要删除选中的 ${deletable.length} 个订单吗？此操作不可恢复。`, '批量删除', { type: 'warning' })
  try {
    for (const order of deletable) {
      await api.delete(`/orders/${order.id}`)
    }
    ElMessage.success(`已删除 ${deletable.length} 个订单`)
    clearSelection()
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

/* 批量操作栏 */
.batch-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 8px;
  margin-bottom: 16px;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.batch-info {
  font-size: 14px;
  color: #409EFF;
}

.batch-info strong {
  font-size: 16px;
}

.batch-actions {
  display: flex;
  gap: 8px;
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
  transition: all 0.2s;
}

.order-card.selected {
  border-color: #409EFF;
  background: #ecf5ff;
}

.order-card:active {
  transform: scale(0.98);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.select-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox {
  width: 22px;
  height: 22px;
  border: 2px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.checkbox.checked {
  background: #409EFF;
  border-color: #409EFF;
  color: white;
  font-size: 14px;
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

.order-card-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
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

  .batch-bar {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .batch-actions {
    flex-wrap: wrap;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 10px auto !important;
  }
}
</style>
