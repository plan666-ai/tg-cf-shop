<template>
  <div class="cards">
    <div class="header">
      <h2>卡密管理</h2>
      <el-select v-model="selectedProduct" placeholder="选择商品" clearable @change="fetchCards">
        <el-option
          v-for="product in products"
          :key="product.id"
          :label="product.name"
          :value="product.id"
        />
      </el-select>
    </div>

    <el-row :gutter="20" class="stats">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <span class="label">总卡密数</span>
            <span class="value">{{ cards.length }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <span class="label">可用库存</span>
            <span class="value success">{{ cards.filter(c => !c.is_sold).length }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <span class="label">已售出</span>
            <span class="value info">{{ cards.filter(c => c.is_sold).length }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-table :data="cards" v-loading="loading" stripe style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="product_id" label="商品ID" width="100" />
      <el-table-column prop="content" label="卡密内容" show-overflow-tooltip />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.is_sold ? 'info' : 'success'" size="small">
            {{ row.is_sold ? '已售' : '可用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" label="关联订单" width="100">
        <template #default="{ row }">
          {{ row.order_id || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="添加时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="deleteCard(row)" :disabled="row.is_sold">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 批量导入对话框 -->
    <el-dialog v-model="showImportDialog" title="批量导入卡密" width="600px">
      <el-form>
        <el-form-item label="选择商品">
          <el-select v-model="importProductId" placeholder="请选择商品">
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡密内容">
          <el-input
            v-model="importText"
            type="textarea"
            :rows="10"
            placeholder="每行一个卡密"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="importCards" :loading="importing">导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api/request'

const products = ref([])
const cards = ref([])
const loading = ref(false)
const importing = ref(false)
const selectedProduct = ref(null)
const showImportDialog = ref(false)
const importProductId = ref(null)
const importText = ref('')

const fetchProducts = async () => {
  const res = await api.get('/products')
  products.value = res.data
}

const fetchCards = async () => {
  if (!selectedProduct.value) {
    cards.value = []
    return
  }
  loading.value = true
  try {
    const res = await api.get(`/products/${selectedProduct.value}/cards`)
    cards.value = res.data
  } finally {
    loading.value = false
  }
}

const deleteCard = async (card) => {
  await ElMessageBox.confirm('确定删除该卡密？', '提示')
  await api.delete(`/products/${card.product_id}/cards/${card.id}`)
  ElMessage.success('删除成功')
  fetchCards()
}

const importCards = async () => {
  if (!importProductId.value) {
    ElMessage.warning('请选择商品')
    return
  }
  const lines = importText.value.split('\n').filter(line => line.trim())
  if (lines.length === 0) {
    ElMessage.warning('请输入卡密')
    return
  }

  importing.value = true
  try {
    await api.post(`/products/${importProductId.value}/cards`, { cards: lines })
    ElMessage.success(`成功导入 ${lines.length} 个卡密`)
    showImportDialog.value = false
    importText.value = ''
    fetchCards()
  } finally {
    importing.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.cards {
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

.stats {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-item .label {
  display: block;
  color: #909399;
  margin-bottom: 10px;
}

.stat-item .value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-item .value.success {
  color: #67C23A;
}

.stat-item .value.info {
  color: #909399;
}
</style>
