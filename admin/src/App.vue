<template>
  <router-view />
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 防止表格溢出容器 */
.el-table {
  max-width: 100%;
}

.el-table__body-wrapper {
  overflow-x: auto !important;
}

/* 防止对话框溢出 */
.el-dialog {
  max-width: 95vw !important;
  overflow: hidden;
}

.el-dialog__body {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}

/* 防止行和列溢出 */
.el-row {
  max-width: 100%;
}

/* 防止下拉菜单溢出 */
.el-dropdown-menu {
  max-width: 90vw;
}

/* 防止消息提示溢出 */
.el-message {
  max-width: 90vw;
  word-break: break-all;
}

/* 防止通知溢出 */
.el-notification {
  max-width: 90vw;
}

#app {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

/* 全局滚动条美化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

::-webkit-scrollbar-track {
  background: transparent;
}

/* 全局过渡效果 */
.el-button,
.el-input,
.el-select,
.el-dialog,
.el-card,
.el-menu-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 全局卡片样式 */
.el-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 全局表格样式 */
.el-table {
  border-radius: 12px;
  overflow: hidden;
}

.el-table th.el-table__cell {
  background: linear-gradient(180deg, #f5f7fa 0%, #ebeef5 100%);
  color: #606266;
  font-weight: 600;
}

/* 全局按钮样式 */
.el-button--primary {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border: none;
}

.el-button--primary:hover {
  background: linear-gradient(135deg, #66b1ff 0%, #409EFF 100%);
}

/* 全局输入框样式 */
.el-input__wrapper {
  border-radius: 8px;
}

/* 全局对话框样式 */
.el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.el-dialog__header {
  background: linear-gradient(180deg, #f5f7fa 0%, #fff 100%);
  padding: 20px 24px;
  margin: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.el-dialog__title {
  font-weight: 600;
  color: #303133;
}

.el-dialog__body {
  padding: 24px;
}

/* 全局标签样式 */
.el-tag {
  border-radius: 6px;
}

/* 全局消息框样式 */
.el-message-box {
  border-radius: 12px;
}

/* 全局通知样式 */
.el-notification {
  border-radius: 12px;
}

/* 选中文本颜色 */
::selection {
  background: rgba(64, 158, 255, 0.2);
  color: #409EFF;
}
</style>
