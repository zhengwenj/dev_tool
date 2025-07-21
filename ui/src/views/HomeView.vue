<template>
  <div class="p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">欢迎使用开发工具箱</h1>
      <p class="text-gray-600 mb-8">为开发者提供的在线工具集合，提高您的开发效率</p>
      
      <!-- 工具分类卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- JSON 工具 -->
        <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <el-icon class="text-2xl text-blue-500 mr-3"><Document /></el-icon>
            <h2 class="text-xl font-semibold">JSON 工具</h2>
          </div>
          <p class="text-gray-600 mb-4">格式化、压缩、验证和转换 JSON 数据</p>
          <div class="space-y-2">
            <router-link to="/json/formatter" class="block text-blue-500 hover:text-blue-600">
              → JSON 格式化/压缩
            </router-link>
            <router-link to="/json/converter" class="block text-blue-500 hover:text-blue-600">
              → JSON 转换工具
            </router-link>
            <router-link to="/json/validator" class="block text-blue-500 hover:text-blue-600">
              → JSON 验证器
            </router-link>
          </div>
        </div>
        
        <!-- 编码/解码工具 -->
        <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <el-icon class="text-2xl text-green-500 mr-3"><Lock /></el-icon>
            <h2 class="text-xl font-semibold">编码/解码</h2>
          </div>
          <p class="text-gray-600 mb-4">各种编码格式的转换工具</p>
          <div class="space-y-2">
            <router-link to="/encode/base64" class="block text-blue-500 hover:text-blue-600">
              → Base64 编码/解码
            </router-link>
            <router-link to="/encode/url" class="block text-blue-500 hover:text-blue-600">
              → URL 编码/解码
            </router-link>
            <router-link to="/encode/html" class="block text-blue-500 hover:text-blue-600">
              → HTML 实体转换
            </router-link>
          </div>
        </div>
        
        <!-- 格式转换 -->
        <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <el-icon class="text-2xl text-purple-500 mr-3"><Switch /></el-icon>
            <h2 class="text-xl font-semibold">格式转换</h2>
          </div>
          <p class="text-gray-600 mb-4">不同数据格式之间的转换</p>
          <div class="space-y-2">
            <router-link to="/converter/markdown" class="block text-blue-500 hover:text-blue-600">
              → Markdown 转 HTML
            </router-link>
            <router-link to="/converter/csv" class="block text-blue-500 hover:text-blue-600">
              → CSV 转 JSON
            </router-link>
          </div>
        </div>
        
        <!-- 正则表达式 -->
        <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <el-icon class="text-2xl text-orange-500 mr-3"><Search /></el-icon>
            <h2 class="text-xl font-semibold">正则表达式</h2>
          </div>
          <p class="text-gray-600 mb-4">测试和调试正则表达式</p>
          <router-link to="/regex" class="block text-blue-500 hover:text-blue-600">
            → 正则表达式测试器
          </router-link>
        </div>
        
        <!-- 时间工具 -->
        <div class="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center mb-4">
            <el-icon class="text-2xl text-red-500 mr-3"><Clock /></el-icon>
            <h2 class="text-xl font-semibold">时间工具</h2>
          </div>
          <p class="text-gray-600 mb-4">时间戳和日期格式转换</p>
          <router-link to="/timestamp" class="block text-blue-500 hover:text-blue-600">
            → 时间戳转换器
          </router-link>
        </div>
      </div>
      
      <!-- 特性介绍 -->
      <div class="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">为什么选择我们的工具？</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-1 mr-2"><Check /></el-icon>
            <div>
              <h4 class="font-medium">完全免费</h4>
              <p class="text-sm text-gray-600">所有工具永久免费使用</p>
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-1 mr-2"><Check /></el-icon>
            <div>
              <h4 class="font-medium">隐私安全</h4>
              <p class="text-sm text-gray-600">所有处理都在本地完成</p>
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-1 mr-2"><Check /></el-icon>
            <div>
              <h4 class="font-medium">简单易用</h4>
              <p class="text-sm text-gray-600">直观的界面，无需学习</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document, Lock, Switch, Search, Clock, Check } from '@element-plus/icons-vue'
</script>