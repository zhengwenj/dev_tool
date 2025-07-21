<template>
  <el-container class="min-h-screen">
    <!-- 侧边栏 -->
    <el-aside width="240px" class="bg-gray-50 border-r">
      <div class="p-4">
        <h1 class="text-xl font-bold text-gray-800 mb-6">开发工具箱</h1>
        <el-menu
          :default-active="$route.path"
          router
          class="border-none bg-transparent"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          
          <el-sub-menu index="json">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>JSON 工具</span>
            </template>
            <el-menu-item index="/json/formatter">格式化/压缩</el-menu-item>
            <el-menu-item index="/json/converter">JSON 转换</el-menu-item>
            <el-menu-item index="/json/validator">JSON 验证</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="encode">
            <template #title>
              <el-icon><Lock /></el-icon>
              <span>编码/解码</span>
            </template>
            <el-menu-item index="/encode/base64">Base64</el-menu-item>
            <el-menu-item index="/encode/url">URL 编码</el-menu-item>
            <el-menu-item index="/encode/html">HTML 实体</el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="converter">
            <template #title>
              <el-icon><Switch /></el-icon>
              <span>格式转换</span>
            </template>
            <el-menu-item index="/converter/markdown">Markdown 转 HTML</el-menu-item>
            <el-menu-item index="/converter/csv">CSV 转 JSON</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/regex">
            <el-icon><Search /></el-icon>
            <span>正则表达式</span>
          </el-menu-item>
          
          <el-menu-item index="/timestamp">
            <el-icon><Clock /></el-icon>
            <span>时间戳转换</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container>
      <el-header class="bg-white border-b flex items-center justify-between px-6">
        <div class="text-lg font-medium text-gray-700">
          {{ currentTitle }}
        </div>
        <div class="flex items-center gap-4">
          <el-button link>
            <el-icon><QuestionFilled /></el-icon>
            帮助
          </el-button>
          <el-button link>
            <el-icon><Setting /></el-icon>
            设置
          </el-button>
        </div>
      </el-header>
      
      <el-main class="bg-gray-50">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
      
      <!-- 页脚备案信息 -->
      <el-footer class="bg-gray-100 border-t text-center py-4 text-sm text-gray-600">
        <div>
          <span>Copyright © 2024-{{ currentYear }} 码农工具箱|九八五个人空间</span>
          <span class="mx-2">|</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-blue-600">
            陇ICP备19000003号-7
          </a>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  Document,
  Lock,
  Switch,
  Search,
  Clock,
  QuestionFilled,
  Setting
} from '@element-plus/icons-vue'

const route = useRoute()

const currentTitle = computed(() => {
  return route.meta.title || '开发工具箱'
})

// 获取当前年份
const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.el-menu {
  border-right: none;
}

.el-menu-item.is-active {
  background-color: #e0e7ff !important;
  color: #4f46e5 !important;
}
</style>