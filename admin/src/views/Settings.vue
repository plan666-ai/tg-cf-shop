<template>
  <div class="settings">
    <div class="header">
      <h2>系统设置</h2>
    </div>

    <el-card>
      <el-form :model="settings" label-width="150px" v-loading="loading">
        <el-form-item label="商店名称">
          <el-input v-model="settings.shop_name" />
        </el-form-item>
        <el-form-item label="商店描述">
          <el-input v-model="settings.shop_description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="欢迎消息">
          <el-input v-model="settings.welcome_message" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="客服用户名">
          <el-input v-model="settings.support_username" placeholder="不带@" />
        </el-form-item>
        <el-form-item label="佣金比例(%)">
          <el-input-number v-model.number="settings.commission_rate" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="最低提现金额(分)">
          <el-input-number v-model.number="settings.min_withdraw" :min="0" />
          <span class="hint">¥{{ (settings.min_withdraw / 100).toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="订单过期时间(分)">
          <el-input-number v-model.number="settings.order_expire_minutes" :min="1" :max="1440" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSettings" :loading="saving">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api/request'

const loading = ref(false)
const saving = ref(false)

const settings = ref({
  shop_name: '',
  shop_description: '',
  welcome_message: '',
  support_username: '',
  commission_rate: 10,
  min_withdraw: 1000,
  order_expire_minutes: 30
})

const fetchSettings = async () => {
  loading.value = true
  try {
    const res = await api.get('/settings')
    const settingsMap = {}
    res.data.forEach(item => {
      settingsMap[item.key] = isNaN(item.value) ? item.value : Number(item.value)
    })
    settings.value = { ...settings.value, ...settingsMap }
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    for (const [key, value] of Object.entries(settings.value)) {
      await api.put('/settings', { key, value: String(value) })
    }
    ElMessage.success('保存成功')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.settings {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.hint {
  margin-left: 10px;
  color: #909399;
}
</style>
