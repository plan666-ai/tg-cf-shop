<template>
  <div class="login-container">
    <!-- 全屏毛玻璃背景 -->
    <div class="glass-bg"></div>
    <!-- 粒子背景 -->
    <div class="particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>
    <div class="login-card">
      <div class="login-left">
        <div class="brand">
          <el-icon class="brand-icon"><ShoppingCart /></el-icon>
          <h2>TG卡密商店</h2>
          <p>管理后台</p>
        </div>
      </div>
      <div class="login-right">
        <div class="form-wrapper">
          <h3>欢迎登录</h3>
          <p class="subtitle">请输入管理员密码</p>
          <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入管理员密码"
                :prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" style="width: 100%" :loading="loading" @click="handleLogin">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock, ShoppingCart } from '@element-plus/icons-vue'
import api from '../api/request'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = ref({
  password: ''
})

const rules = {
  password: [
    { required: true, message: '请填写密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  const password = form.value.password.trim()

  // 简单非空验证
  if (password === '') {
    alert('❌ 请填写密码')
    return
  }

  console.log(`登录尝试：密码=${password}`)

  loading.value = true
  try {
    const res = await api.post('/login', { password })
    localStorage.setItem('admin_token', res.token)
    alert(`✅ 登录成功！\n欢迎回来，管理员\n(毛玻璃+左右弹入动画已生效)`)
    router.push('/dashboard')
  } catch (error) {
    alert(`❌ 登录失败\n${error.response?.data?.error || '密码错误或网络异常'}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 全屏毛玻璃背景层 */
.glass-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  z-index: 0;
}

/* 背景装饰圆 */
.login-container::before,
.login-container::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  z-index: 1;
}

.login-container::before {
  width: 400px;
  height: 400px;
  top: -150px;
  left: -150px;
  animation: float 8s ease-in-out infinite;
}

.login-container::after {
  width: 300px;
  height: 300px;
  bottom: -100px;
  right: -100px;
  animation: float 10s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  50% {
    transform: translate(-20px, 30px) rotate(-5deg);
  }
  75% {
    transform: translate(20px, 15px) rotate(3deg);
  }
}

/* 粒子背景 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

.particle:nth-child(1) {
  left: 10%;
  animation-duration: 8s;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  left: 20%;
  animation-duration: 12s;
  animation-delay: 2s;
}

.particle:nth-child(3) {
  left: 30%;
  animation-duration: 10s;
  animation-delay: 4s;
}

.particle:nth-child(4) {
  left: 40%;
  animation-duration: 14s;
  animation-delay: 1s;
}

.particle:nth-child(5) {
  left: 50%;
  animation-duration: 9s;
  animation-delay: 3s;
}

.particle:nth-child(6) {
  left: 60%;
  animation-duration: 11s;
  animation-delay: 5s;
}

.particle:nth-child(7) {
  left: 70%;
  animation-duration: 13s;
  animation-delay: 2s;
}

.particle:nth-child(8) {
  left: 80%;
  animation-duration: 7s;
  animation-delay: 4s;
}

.particle:nth-child(9) {
  left: 90%;
  animation-duration: 15s;
  animation-delay: 1s;
}

.particle:nth-child(10) {
  left: 15%;
  animation-duration: 10s;
  animation-delay: 6s;
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(720deg);
    opacity: 0;
  }
}

.login-card {
  width: 720px;
  min-height: 420px;
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
  position: relative;
  z-index: 2;
}

/* 左侧品牌区 - 从左边弹入 */
.login-left {
  width: 320px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  animation: slideFromLeft 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}

@keyframes slideFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.brand {
  text-align: center;
  color: #fff;
}

.brand-icon {
  font-size: 56px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: iconPulse 2s ease-in-out infinite 0.7s;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.brand h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
}

.brand p {
  margin: 0;
  font-size: 14px;
  opacity: 0.85;
  letter-spacing: 4px;
}

/* 右侧表单区 - 从右边弹入 */
.login-right {
  flex: 1;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  animation: slideFromRight 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
  animation-delay: 0.15s;
}

@keyframes slideFromRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-wrapper {
  width: 100%;
  max-width: 300px;
}

.form-wrapper h3 {
  margin: 0 0 6px;
  font-size: 22px;
  color: #303133;
  font-weight: 700;
}

.form-wrapper .subtitle {
  margin: 0 0 28px;
  color: #909399;
  font-size: 14px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 4px 12px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.2);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3);
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 4px;
  transition: all 0.3s ease;
  margin-top: 4px;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}
</style>
