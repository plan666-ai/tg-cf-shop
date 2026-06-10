<template>
  <el-container class="layout-container">
    <!-- 手机端遮罩层 -->
    <div v-if="isMobile && !isCollapse" class="mobile-overlay" @click="isCollapse = true"></div>

    <el-aside :width="asideWidth" :class="['aside', { 'mobile-aside': isMobile, 'mobile-open': isMobile && !isCollapse }]">
      <div class="logo">
        <el-icon class="logo-icon"><ShoppingCart /></el-icon>
        <h1 v-show="!isCollapse">TG商店</h1>
        <h1 v-show="isCollapse">TG</h1>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        router
        @select="onMenuSelect"
      >
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <!-- 手机端：三条横线汉堡按钮 -->
          <div v-if="isMobile" class="hamburger-btn" @click="toggleSidebar">
            <span :class="['bar', { open: !isCollapse }]"></span>
            <span :class="['bar', { open: !isCollapse }]"></span>
            <span :class="['bar', { open: !isCollapse }]"></span>
          </div>
          <el-icon v-else class="collapse-btn" @click="toggleSidebar">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb v-if="!isMobile" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
          <span v-else class="mobile-title">{{ route.meta.title }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-icon class="avatar-icon"><User /></el-icon>
              <span v-if="!isMobile">管理员</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ShoppingCart,
  DataAnalysis,
  ShoppingBag,
  List,
  User,
  Key,
  Setting,
  Fold,
  Expand,
  ArrowDown,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const isMobile = ref(false)

const menuItems = [
  { path: '/dashboard', title: '数据看板', icon: DataAnalysis },
  { path: '/products', title: '商品管理', icon: ShoppingBag },
  { path: '/orders', title: '订单管理', icon: List },
  { path: '/users', title: '用户管理', icon: User },
  { path: '/cards', title: '卡密管理', icon: Key },
  { path: '/settings', title: '系统设置', icon: Setting }
]

const asideWidth = computed(() => {
  if (isMobile.value) return '260px'
  return isCollapse.value ? '64px' : '220px'
})

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    isCollapse.value = true
  }
}

function toggleSidebar() {
  isCollapse.value = !isCollapse.value
}

function onMenuSelect() {
  if (isMobile.value) {
    isCollapse.value = true
  }
}

const handleCommand = (command) => {
  if (command === 'logout') {
    localStorage.removeItem('admin_token')
    router.push('/login')
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  overflow: hidden;
  width: 100%;
  max-width: 100vw;
}

/* 手机端遮罩层 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

.aside {
  background: linear-gradient(180deg, #1a2332 0%, #243447 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

/* 手机端侧边栏 */
.mobile-aside {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-aside.mobile-open {
  transform: translateX(0);
}

.logo {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.logo:hover::before {
  left: 100%;
}

.logo-icon {
  font-size: 32px;
  margin-right: 10px;
  color: #409EFF;
  filter: drop-shadow(0 2px 4px rgba(64, 158, 255, 0.4));
}

.logo h1 {
  font-size: 22px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fff 0%, #a0cfff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

:deep(.el-menu) {
  border-right: none;
  background: transparent !important;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #bfcbd9 !important;
}

:deep(.el-menu-item:hover) {
  background: rgba(64, 158, 255, 0.2) !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, #409EFF 0%, #66b1ff 100%) !important;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  color: #fff !important;
}

:deep(.el-menu-item .el-icon) {
  font-size: 18px;
  margin-right: 8px;
}

/* 折叠状态下的菜单文字隐藏 */
:deep(.el-menu--collapse .el-menu-item span) {
  display: none;
}

:deep(.el-menu--collapse .el-menu-item) {
  text-align: center;
  padding: 0 !important;
}

.header {
  background: linear-gradient(90deg, #fff 0%, #f8f9fb 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0 16px;
  height: 60px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 22px;
  cursor: pointer;
  color: #606266;
  transition: all 0.3s;
  padding: 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

.collapse-btn:hover {
  color: #409EFF;
  background: rgba(64, 158, 255, 0.1);
}

/* 汉堡按钮 */
.hamburger-btn {
  width: 28px;
  height: 22px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2px 0;
  flex-shrink: 0;
}

.hamburger-btn .bar {
  display: block;
  width: 100%;
  height: 2.5px;
  background: #303133;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger-btn .bar.open:first-child {
  transform: translateY(9.75px) rotate(45deg);
}

.hamburger-btn .bar.open:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-btn .bar.open:last-child {
  transform: translateY(-9.75px) rotate(-45deg);
}

.mobile-title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s;
  color: #606266;
  font-size: 14px;
}

.el-dropdown-link:hover {
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.avatar-icon {
  font-size: 20px;
  color: #409EFF;
}

.main {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  min-width: 0;
  width: 100%;
  max-width: 100%;
}

/* 防止表格溢出 */
:deep(.el-table) {
  width: 100% !important;
  max-width: 100%;
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

/* 防止卡片溢出 */
:deep(.el-card) {
  max-width: 100%;
  overflow: hidden;
}

/* 滚动条美化 */
.main::-webkit-scrollbar {
  width: 5px;
}

.main::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.main::-webkit-scrollbar-track {
  background: transparent;
}

/* 手机端优化 */
@media (max-width: 768px) {
  .header {
    padding: 0 12px;
    height: 56px;
  }

  .main {
    padding: 12px;
  }

  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
  }
}

/* 小手机优化 */
@media (max-width: 375px) {
  .header {
    padding: 0 8px;
  }

  .collapse-btn {
    padding: 6px;
    font-size: 20px;
  }

  .mobile-title {
    font-size: 15px;
  }

  .main {
    padding: 10px;
  }
}
</style>
