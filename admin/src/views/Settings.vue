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

    <!-- 支付方式配置 -->
    <el-card style="margin-top:20px">
      <template #header>
        <div style="display:flex;align-items:center;gap:8px">
          <el-icon><Wallet /></el-icon>
          <span style="font-weight:600">支付方式配置</span>
        </div>
      </template>
      <el-alert type="warning" :closable="false" style="margin-bottom:20px">
        开启支付方式后，用户在下单时可选择对应方式进行支付
      </el-alert>

      <!-- Telegram Stars -->
      <div class="payment-item">
        <div class="payment-header">
          <div class="payment-info">
            <div class="payment-icon stars">⭐</div>
            <div>
              <div class="payment-name">Telegram Stars</div>
              <div class="payment-desc">TG 内置支付，自动发货</div>
            </div>
          </div>
          <el-switch v-model="payment.payment_stars_enabled" />
        </div>
      </div>

      <!-- USDT -->
      <div class="payment-item">
        <div class="payment-header">
          <div class="payment-info">
            <div class="payment-icon usdt">₮</div>
            <div>
              <div class="payment-name">USDT 支付</div>
              <div class="payment-desc">支持 TRC20 / ERC20 网络</div>
            </div>
          </div>
          <el-switch v-model="payment.payment_usdt_enabled" @change="onPaymentToggle('usdt')" />
        </div>
        <div v-if="payment.payment_usdt_enabled" class="payment-fields">
          <el-form label-width="120px">
            <el-form-item label="收款地址">
              <el-input v-model="payment.payment_usdt_address" placeholder="TRC20 收款地址" />
            </el-form-item>
            <el-form-item label="汇率">
              <el-input-number v-model.number="payment.payment_usdt_rate" :min="0" :precision="2" :step="0.1" />
              <span class="hint">CNY/USDT</span>
            </el-form-item>
            <el-form-item label="网络类型">
              <el-select v-model="payment.payment_usdt_network">
                <el-option label="TRC20" value="TRC20" />
                <el-option label="ERC20" value="ERC20" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 易支付 -->
      <div class="payment-item">
        <div class="payment-header">
          <div class="payment-info">
            <div class="payment-icon yipay"><el-icon><CreditCard /></el-icon></div>
            <div>
              <div class="payment-name">易支付</div>
              <div class="payment-desc">支付宝 / 微信 / QQ 钱包</div>
            </div>
          </div>
          <el-switch v-model="payment.payment_yipay_enabled" @change="onPaymentToggle('yipay')" />
        </div>
        <div v-if="payment.payment_yipay_enabled" class="payment-fields">
          <el-form label-width="120px">
            <el-form-item label="接口地址">
              <el-input v-model="payment.payment_yipay_url" placeholder="https://pay.example.com" />
            </el-form-item>
            <el-form-item label="商户ID">
              <el-input v-model="payment.payment_yipay_pid" placeholder="商户ID" />
            </el-form-item>
            <el-form-item label="商户密钥">
              <el-input v-model="payment.payment_yipay_key" type="password" show-password placeholder="商户密钥" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 码支付 -->
      <div class="payment-item">
        <div class="payment-header">
          <div class="payment-info">
            <div class="payment-icon codepay"><el-icon><Iphone /></el-icon></div>
            <div>
              <div class="payment-name">码支付</div>
              <div class="payment-desc">扫码支付，自动回调</div>
            </div>
          </div>
          <el-switch v-model="payment.payment_codepay_enabled" @change="onPaymentToggle('codepay')" />
        </div>
        <div v-if="payment.payment_codepay_enabled" class="payment-fields">
          <el-form label-width="120px">
            <el-form-item label="接口地址">
              <el-input v-model="payment.payment_codepay_url" placeholder="https://codepay.example.com" />
            </el-form-item>
            <el-form-item label="商户ID">
              <el-input v-model="payment.payment_codepay_id" placeholder="商户ID" />
            </el-form-item>
            <el-form-item label="商户密钥">
              <el-input v-model="payment.payment_codepay_key" type="password" show-password placeholder="商户密钥" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div style="text-align:right;margin-top:16px">
        <el-button type="primary" @click="savePayment" :loading="paymentSaving">保存支付配置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Wallet, CreditCard, Iphone } from '@element-plus/icons-vue'
import api from '../api/request'

const loading = ref(false)
const saving = ref(false)
const paymentSaving = ref(false)

const settings = ref({
  shop_name: '',
  shop_description: '',
  welcome_message: '',
  support_username: '',
  commission_rate: 10,
  min_withdraw: 1000,
  order_expire_minutes: 30
})

const payment = ref({
  payment_stars_enabled: true,
  payment_usdt_enabled: false,
  payment_usdt_address: '',
  payment_usdt_rate: 7.2,
  payment_usdt_network: 'TRC20',
  payment_yipay_enabled: false,
  payment_yipay_url: '',
  payment_yipay_pid: '',
  payment_yipay_key: '',
  payment_codepay_enabled: false,
  payment_codepay_url: '',
  payment_codepay_id: '',
  payment_codepay_key: ''
})

const fetchSettings = async () => {
  loading.value = true
  try {
    const res = await api.get('/settings')
    const settingsMap = {}
    const paymentMap = {}
    res.data.forEach(item => {
      if (item.key.startsWith('payment_')) {
        if (item.key.endsWith('_enabled')) {
          paymentMap[item.key] = item.value === '1'
        } else if (item.key === 'payment_usdt_rate') {
          paymentMap[item.key] = Number(item.value) || 7.2
        } else {
          paymentMap[item.key] = item.value
        }
      } else {
        settingsMap[item.key] = isNaN(item.value) ? item.value : Number(item.value)
      }
    })
    settings.value = { ...settings.value, ...settingsMap }
    payment.value = { ...payment.value, ...paymentMap }
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
    ElMessage.success('设置保存成功')
  } finally {
    saving.value = false
  }
}

const savePayment = async () => {
  paymentSaving.value = true
  try {
    for (const [key, value] of Object.entries(payment.value)) {
      const val = typeof value === 'boolean' ? (value ? '1' : '0') : String(value)
      await api.put('/settings', { key, value: val })
    }
    ElMessage.success('支付配置保存成功')
  } finally {
    paymentSaving.value = false
  }
}

const onPaymentToggle = (type) => {
  // Toggle callback - already handled by v-model
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

/* 支付方式样式 */
.payment-item {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.payment-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.payment-icon.stars {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  font-size: 22px;
}

.payment-icon.usdt {
  background: linear-gradient(135deg, #26a17b, #1a8a6a);
}

.payment-icon.yipay {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  font-size: 20px;
}

.payment-icon.codepay {
  background: linear-gradient(135deg, #10b981, #059669);
  font-size: 20px;
}

.payment-name {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
}

.payment-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.payment-fields {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 手机端适配 */
@media (max-width: 768px) {
  .settings {
    padding: 12px;
  }

  .header h2 {
    font-size: 18px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
  }

  :deep(.el-input-number) {
    width: 100%;
  }

  :deep(.el-textarea) {
    width: 100%;
  }

  .payment-item {
    padding: 16px;
  }

  .payment-icon {
    width: 38px;
    height: 38px;
    font-size: 14px;
  }

  .payment-icon.yipay,
  .payment-icon.codepay {
    font-size: 18px;
  }

  .payment-name {
    font-size: 14px;
  }

  :deep(.el-form-item__label) {
    width: 100px !important;
  }
}
</style>
