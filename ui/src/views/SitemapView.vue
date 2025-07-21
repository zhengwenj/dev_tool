<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">网站地图</h1>
        <p class="text-gray-600">浏览本站所有页面和工具</p>
      </div>

      <!-- 站点地图内容 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 首页 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 text-blue-600">
            <el-icon class="mr-2"><HomeFilled /></el-icon>
            首页
          </h2>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Link /></el-icon>
                工具导航首页
              </router-link>
            </li>
          </ul>
        </div>

        <!-- JSON 工具 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 text-green-600">
            <el-icon class="mr-2"><Document /></el-icon>
            JSON 工具
          </h2>
          <ul class="space-y-2">
            <li>
              <router-link to="/json/formatter" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Brush /></el-icon>
                JSON 格式化/压缩
              </router-link>
            </li>
            <li>
              <router-link to="/json/validator" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><CircleCheck /></el-icon>
                JSON 验证
              </router-link>
            </li>
            <li>
              <router-link to="/json/converter" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Switch /></el-icon>
                JSON 转换
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 编码/解码工具 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 text-purple-600">
            <el-icon class="mr-2"><Key /></el-icon>
            编码/解码工具
          </h2>
          <ul class="space-y-2">
            <li>
              <router-link to="/encode/base64" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Lock /></el-icon>
                Base64 编码/解码
              </router-link>
            </li>
            <li>
              <router-link to="/encode/url" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Link /></el-icon>
                URL 编码/解码
              </router-link>
            </li>
            <li>
              <router-link to="/encode/html" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><ChromeFilled /></el-icon>
                HTML 实体转换
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 格式转换工具 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 text-orange-600">
            <el-icon class="mr-2"><Refresh /></el-icon>
            格式转换工具
          </h2>
          <ul class="space-y-2">
            <li>
              <router-link to="/converter/markdown" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Document /></el-icon>
                Markdown 转 HTML
              </router-link>
            </li>
            <li>
              <router-link to="/converter/csv" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Grid /></el-icon>
                CSV 转 JSON
              </router-link>
            </li>
          </ul>
        </div>

        <!-- 其他工具 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 text-red-600">
            <el-icon class="mr-2"><Tools /></el-icon>
            其他工具
          </h2>
          <ul class="space-y-2">
            <li>
              <router-link to="/regex" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Search /></el-icon>
                正则表达式测试
              </router-link>
            </li>
            <li>
              <router-link to="/timestamp" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Clock /></el-icon>
                时间戳转换
              </router-link>
            </li>
          </ul>
        </div>

        <!-- SEO 信息 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-semibold mb-4 text-indigo-600">
            <el-icon class="mr-2"><InfoFilled /></el-icon>
            SEO 资源
          </h2>
          <ul class="space-y-2">
            <li>
              <a href="/sitemap.xml" target="_blank" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Document /></el-icon>
                XML 站点地图
              </a>
            </li>
            <li>
              <a href="/sitemap.html" target="_blank" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><ChromeFilled /></el-icon>
                HTML 站点地图
              </a>
            </li>
            <li>
              <a href="/robots.txt" target="_blank" class="text-gray-700 hover:text-blue-600 flex items-center">
                <el-icon class="mr-1"><Setting /></el-icon>
                Robots.txt
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- 站点统计 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">站点统计</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ totalPages }}</div>
            <div class="text-sm text-gray-600">总页面数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ jsonTools }}</div>
            <div class="text-sm text-gray-600">JSON 工具</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ encodeTools }}</div>
            <div class="text-sm text-gray-600">编码工具</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ converterTools }}</div>
            <div class="text-sm text-gray-600">转换工具</div>
          </div>
        </div>
      </div>

      <!-- 更新信息 -->
      <div class="mt-6 text-center text-sm text-gray-500">
        <p>最后更新：{{ lastUpdated }}</p>
        <p class="mt-2">
          <el-button link type="primary" @click="copySitemapUrl">
            <el-icon class="mr-1"><CopyDocument /></el-icon>
            复制站点地图链接
          </el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  HomeFilled,
  Document,
  Key,
  Refresh,
  Tools,
  InfoFilled,
  Link,
  Brush,
  CircleCheck,
  Switch,
  Lock,
  ChromeFilled,
  Grid,
  Search,
  Clock,
  Setting,
  CopyDocument
} from '@element-plus/icons-vue'

// 统计数据
const totalPages = ref(11)
const jsonTools = ref(3)
const encodeTools = ref(3)
const converterTools = ref(2)

// 最后更新时间
const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 复制站点地图 URL
const copySitemapUrl = async () => {
  try {
    const url = window.location.origin + '/sitemap.xml'
    await navigator.clipboard.writeText(url)
    ElMessage.success('站点地图链接已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.el-icon {
  vertical-align: middle;
}
</style>