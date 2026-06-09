<template>
  <div class="users">
    <div class="header">
      <h2>用户管理</h2>
      <span>共 {{ total }} 位用户</span>
    </div>

    <el-table :data="users" v-loading="loading" stripe>
      <el-table-column prop="user_id" label="用户ID" width="150" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="first_name" label="昵称" />
      <el-table-column label="余额" width="100">
        <template #default="{ row }">
          ¥{{ (row.balance / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="order_count" label="订单数" width="80" />
      <el-table-column label="消费总额" width="100">
        <template #default="{ row }">
          ¥{{ (row.total_spent / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="invite_code" label="邀请码" width="120" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.is_banned ? 'danger' : 'success'" size="small">
            {{ row.is_banned ? '已封禁' : '正常' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="注册时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="viewDetail(row)">详情</el-button>
          <el-button
            size="small"
            :type="row.is_banned ? 'success' : 'danger'"
            @click="toggleBan(row)"
          >
            {{ row.is_banned ? '解封' : '封禁' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 用户详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="用户详情" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ currentUser?.user_id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentUser?.username || '-' }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ currentUser?.first_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="余额">¥{{ ((currentUser?.balance || 0) / 100).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="订单数">{{ currentUser?.order_count || 0 }}</el-descriptions-item>
        <el-descriptions-item label="消费总额">¥{{ ((currentUser?.total_spent || 0) / 100).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="邀请码">{{ currentUser?.invite_code }}</el-descriptions-item>
        <el-descriptions-item label="邀请人">{{ currentUser?.invited_by || '-' }}</el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ formatDate(currentUser?.created_at) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentUser?.is_banned ? 'danger' : 'success'">
            {{ currentUser?.is_banned ? '已封禁' : '正常' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider>调整余额</el-divider>
      <el-form :inline="true">
        <el-form-item label="金额(分)">
          <el-input-number v-model="balanceAmount" :min="-100000" :max="100000" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="adjustBalance">调整</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api/request'

const users = ref([])
const total = ref(0)
const loading = ref(false)
const showDetailDialog = ref(false)
const currentUser = ref(null)
const balanceAmount = ref(0)

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('/users')
    users.value = res.data
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const viewDetail = async (user) => {
  const res = await api.get(`/users/${user.user_id}`)
  currentUser.value = res.data
  balanceAmount.value = 0
  showDetailDialog.value = true
}

const toggleBan = async (user) => {
  const action = user.is_banned ? '解封' : '封禁'
  await ElMessageBox.confirm(`确定要${action}用户 ${user.username || user.user_id} 吗？`, '提示')
  await api.patch(`/users/${user.user_id}/ban`, { is_banned: !user.is_banned })
  ElMessage.success(`${action}成功`)
  fetchUsers()
}

const adjustBalance = async () => {
  if (balanceAmount.value === 0) {
    ElMessage.warning('请输入调整金额')
    return
  }
  await api.post(`/users/${currentUser.value.user_id}/balance`, {
    amount: balanceAmount.value,
    reason: '管理员调整'
  })
  ElMessage.success('余额已调整')
  showDetailDialog.value = false
  fetchUsers()
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users {
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
</style>
