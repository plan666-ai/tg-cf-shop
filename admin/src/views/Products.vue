<template>
  <div class="products">
    <div class="header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加商品
      </el-button>
    </div>

    <el-table :data="products" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="category_name" label="分类" width="120" />
      <el-table-column label="价格" width="100">
        <template #default="{ row }">
          ¥{{ (row.price / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="stock_count" label="库存" width="80" />
      <el-table-column prop="sales_count" label="销量" width="80" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'info'">
            {{ row.is_active ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button size="small" @click="editProduct(row)">编辑</el-button>
          <el-button size="small" @click="manageCards(row)">卡密</el-button>
          <el-button
            size="small"
            :type="row.is_active ? 'danger' : 'success'"
            @click="toggleProduct(row)"
          >
            {{ row.is_active ? '下架' : '上架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="showAddDialog" :title="editingId ? '编辑商品' : '添加商品'" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类">
          <el-select v-model="form.category_id" placeholder="请选择分类">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入商品描述" />
        </el-form-item>
        <el-form-item label="价格(分)">
          <el-input-number v-model="form.price" :min="1" />
          <span class="price-hint">¥{{ (form.price / 100).toFixed(2) }}</span>
        </el-form-item>
        <el-form-item label="原价(分)">
          <el-input-number v-model="form.original_price" :min="0" />
        </el-form-item>
        <el-form-item label="自动发货">
          <el-switch v-model="form.auto_delivery" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="发货类型">
          <el-select v-model="form.delivery_type">
            <el-option label="卡密" value="card" />
            <el-option label="链接" value="link" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProduct" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 卡密管理对话框 -->
    <el-dialog v-model="showCardsDialog" title="卡密管理" width="700px">
      <div class="cards-header">
        <span>商品：{{ currentProduct?.name }} | 可用库存：{{ cards.filter(c => !c.is_sold).length }}</span>
      </div>

      <el-table :data="cards" stripe style="margin: 15px 0">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content" label="卡密内容" show-overflow-tooltip />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.is_sold ? 'info' : 'success'" size="small">
              {{ row.is_sold ? '已售' : '可用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="添加时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="deleteCard(row)" :disabled="row.is_sold">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-divider>批量导入</el-divider>
      <el-input
        v-model="importCardsText"
        type="textarea"
        :rows="6"
        placeholder="每行一个卡密，支持批量导入"
      />
      <div style="margin-top: 10px; text-align: right">
        <el-button type="primary" @click="importCardBatch" :loading="importing">
          确认导入
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../api/request'

const products = ref([])
const categories = ref([])
const cards = ref([])
const loading = ref(false)
const saving = ref(false)
const importing = ref(false)
const showAddDialog = ref(false)
const showCardsDialog = ref(false)
const editingId = ref(null)
const currentProduct = ref(null)
const importCardsText = ref('')

const form = ref({
  category_id: '',
  name: '',
  description: '',
  price: 100,
  original_price: 0,
  auto_delivery: 1,
  delivery_type: 'card'
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await api.get('/products')
    products.value = res.data
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  const res = await api.get('/categories')
  categories.value = res.data
}

const fetchCards = async (productId) => {
  const res = await api.get(`/products/${productId}/cards`)
  cards.value = res.data
}

const saveProduct = async () => {
  if (!form.value.name || !form.value.category_id) {
    ElMessage.warning('请填写完整信息')
    return
  }

  saving.value = true
  try {
    if (editingId.value) {
      await api.put(`/products/${editingId.value}`, form.value)
      ElMessage.success('更新成功')
    } else {
      await api.post('/products', form.value)
      ElMessage.success('添加成功')
    }
    showAddDialog.value = false
    fetchProducts()
  } finally {
    saving.value = false
  }
}

const editProduct = (product) => {
  editingId.value = product.id
  form.value = {
    category_id: product.category_id,
    name: product.name,
    description: product.description,
    price: product.price,
    original_price: product.original_price || 0,
    auto_delivery: product.auto_delivery,
    delivery_type: product.delivery_type
  }
  showAddDialog.value = true
}

const toggleProduct = async (product) => {
  await api.patch(`/products/${product.id}/toggle`)
  ElMessage.success('操作成功')
  fetchProducts()
}

const manageCards = async (product) => {
  currentProduct.value = product
  showCardsDialog.value = true
  await fetchCards(product.id)
}

const importCardBatch = async () => {
  const lines = importCardsText.value.split('\n').filter(line => line.trim())
  if (lines.length === 0) {
    ElMessage.warning('请输入卡密')
    return
  }

  importing.value = true
  try {
    await api.post(`/products/${currentProduct.value.id}/cards`, { cards: lines })
    ElMessage.success(`成功导入 ${lines.length} 个卡密`)
    importCardsText.value = ''
    await fetchCards(currentProduct.value.id)
    fetchProducts()
  } finally {
    importing.value = false
  }
}

const deleteCard = async (card) => {
  await ElMessageBox.confirm('确定删除该卡密？', '提示')
  await api.delete(`/products/${currentProduct.value.id}/cards/${card.id}`)
  ElMessage.success('删除成功')
  await fetchCards(currentProduct.value.id)
  fetchProducts()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.products {
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

.price-hint {
  margin-left: 10px;
  color: #909399;
}

.cards-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
