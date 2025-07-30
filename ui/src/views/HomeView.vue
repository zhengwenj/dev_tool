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
      
      <!-- 访客统计区域 -->
      <div class="mt-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-lg border border-blue-100 p-8 relative overflow-hidden">
        <!-- 背景装饰 -->
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100 to-blue-100 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>
        
        <!-- 标题 -->
        <div class="text-center mb-8 relative z-10">
          <div class="flex items-center justify-center gap-3 mb-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              网站访问统计
            </h3>
          </div>
          <p class="text-gray-600 text-sm">实时数据，每5分钟自动更新</p>
        </div>

        <!-- 错误状态 -->
        <div v-if="statsError" class="text-center py-8 relative z-10">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <p class="text-red-600 mb-4 font-medium">{{ statsError }}</p>
          <button @click="fetchUmamiStats" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            重新加载
          </button>
        </div>

        <!-- 统计数据 -->
        <div v-else class="space-y-8 relative z-10">
          <!-- 今日统计 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
            <div class="flex items-center justify-center gap-2 mb-6">
              <div class="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">今日数据</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- 今日访问数 -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                  <div v-if="!statsLoading" class="text-2xl font-bold text-white">{{ formatNumber(todayStats.visits) }}</div>
                  <div v-else class="w-16 h-8 bg-white/20 animate-pulse rounded mx-auto"></div>
                </div>
                <p class="text-sm font-medium text-gray-700">今日访问数</p>
              </div>
              
              <!-- 访客数 -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <div v-if="!statsLoading" class="text-2xl font-bold text-white">{{ formatNumber(todayStats.visitors) }}</div>
                  <div v-else class="w-16 h-8 bg-white/20 animate-pulse rounded mx-auto"></div>
                </div>
                <p class="text-sm font-medium text-gray-700">访客数</p>
              </div>
              
              <!-- 浏览量 -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <div v-if="!statsLoading" class="text-2xl font-bold text-white">{{ formatNumber(todayStats.pageviews) }}</div>
                  <div v-else class="w-16 h-8 bg-white/20 animate-pulse rounded mx-auto"></div>
                </div>
                <p class="text-sm font-medium text-gray-700">浏览量</p>
              </div>
            </div>
          </div>
          
          <!-- 历史累计统计 -->
          <div class="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
            <div class="flex items-center justify-center gap-2 mb-6">
              <div class="w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">历史累计</h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- 总访问数 -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <div v-if="!statsLoading" class="text-2xl font-bold text-white">{{ formatNumber(allTimeStats.visits) }}</div>
                  <div v-else class="w-16 h-8 bg-white/20 animate-pulse rounded mx-auto"></div>
                </div>
                <p class="text-sm font-medium text-gray-700">总访问数</p>
              </div>
              
              <!-- 总访客数 -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div v-if="!statsLoading" class="text-2xl font-bold text-white">{{ formatNumber(allTimeStats.visitors) }}</div>
                  <div v-else class="w-16 h-8 bg-white/20 animate-pulse rounded mx-auto"></div>
                </div>
                <p class="text-sm font-medium text-gray-700">总访客数</p>
              </div>
              
              <!-- 总浏览量 -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                  <svg class="w-8 h-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                  <div v-if="!statsLoading" class="text-2xl font-bold text-white">{{ formatNumber(allTimeStats.pageviews) }}</div>
                  <div v-else class="w-16 h-8 bg-white/20 animate-pulse rounded mx-auto"></div>
                </div>
                <p class="text-sm font-medium text-gray-700">总浏览量</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 更新时间 -->
        <div v-if="lastUpdated && !statsError" class="text-center mt-6 relative z-10">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-xs text-gray-600 border border-white/30">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            最后更新：{{ formatUpdateTime(lastUpdated) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Document, Lock, Switch, Search, Clock, Check } from '@element-plus/icons-vue'

// 统计数据状态
const statsLoading = ref(true)
const statsError = ref<string | null>(null)
const websiteId = ref<string | null>(null)
const shareToken = ref<string | null>(null)
const lastUpdated = ref<Date | null>(null)

// 今日统计数据
const todayStats = ref({
  pageviews: 0,
  visitors: 0,
  visits: 0
})

// 历史累计统计数据
const allTimeStats = ref({
  pageviews: 0,
  visitors: 0,
  visits: 0
})

// 缓存认证信息
let cachedAuth: { websiteId: string; shareToken: string; expiry: number } | null = null

// 创建带超时的fetch函数
const fetchWithTimeout = (url: string, options: RequestInit, timeout = 8000): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('请求超时')), timeout)
    )
  ])
}

// 获取认证信息（带缓存）
const getAuthInfo = async () => {
  // 检查缓存是否有效（缓存30分钟）
  if (cachedAuth && cachedAuth.expiry > Date.now()) {
    console.log('使用缓存的认证信息')
    return cachedAuth
  }
  
  console.log('获取新的认证令牌...')
  const authStartTime = Date.now()
  
  const authResponse = await fetchWithTimeout('https://statistics.bughub.cn/api/share/5e02Eum148AR3BdZ', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  }, 5000) // 认证请求5秒超时
  
  if (!authResponse.ok) {
    throw new Error(`认证失败: ${authResponse.status}`)
  }
  
  const authData = await authResponse.json()
  console.log(`认证完成，耗时: ${Date.now() - authStartTime}ms`)
  
  // 缓存认证信息30分钟
  cachedAuth = {
    websiteId: authData.websiteId,
    shareToken: authData.token,
    expiry: Date.now() + 30 * 60 * 1000
  }
  
  return cachedAuth
}

// 获取umami统计数据
const fetchUmamiStats = async () => {
  statsError.value = null
  statsLoading.value = true
  
  const startTime = Date.now()
  console.log('🚀 开始获取统计数据...')
  
  try {
    // 步骤1：获取认证令牌（带缓存）
    const authInfo = await getAuthInfo()
    websiteId.value = authInfo.websiteId
    shareToken.value = authInfo.shareToken
    
    // 步骤2：并行获取今日和历史统计数据
    const todayStart = getTodayStartTimestamp()
    const todayEnd = getTodayEndTimestamp()
    const allTimeStart = 0 // 从最早开始
    const allTimeEnd = Date.now()
    
    console.log('📊 开始并行请求统计数据...')
    const dataStartTime = Date.now()
    
    // 并行请求今日和历史数据，设置较短超时
    const [todayStatsResponse, allTimeStatsResponse] = await Promise.all([
      // 今日统计
      fetchWithTimeout(
        `https://statistics.bughub.cn/api/websites/${websiteId.value}/stats?startAt=${todayStart}&endAt=${todayEnd}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'x-umami-share-token': shareToken.value || ''
          }
        },
        6000 // 6秒超时
      ),
      // 历史统计
      fetchWithTimeout(
        `https://statistics.bughub.cn/api/websites/${websiteId.value}/stats?startAt=${allTimeStart}&endAt=${allTimeEnd}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'x-umami-share-token': shareToken.value || ''
          }
        },
        6000 // 6秒超时
      )
    ])
    
    console.log(`📈 数据请求完成，耗时: ${Date.now() - dataStartTime}ms`)
    
    if (!todayStatsResponse.ok) {
      throw new Error(`今日数据获取失败: ${todayStatsResponse.status}`)
    }
    
    if (!allTimeStatsResponse.ok) {
      throw new Error(`历史数据获取失败: ${allTimeStatsResponse.status}`)
    }
    
    const parseStartTime = Date.now()
    const [todayData, allTimeData] = await Promise.all([
      todayStatsResponse.json(),
      allTimeStatsResponse.json()
    ])
    
    console.log(`🔄 数据解析完成，耗时: ${Date.now() - parseStartTime}ms`)
    
    todayStats.value = {
      pageviews: todayData.pageviews?.value || 0,
      visitors: todayData.visitors?.value || 0,
      visits: todayData.visits?.value || 0
    }
    
    allTimeStats.value = {
      pageviews: allTimeData.pageviews?.value || 0,
      visitors: allTimeData.visitors?.value || 0,
      visits: allTimeData.visits?.value || 0
    }
    
    lastUpdated.value = new Date()
    statsLoading.value = false
    
    console.log(`✅ 统计数据加载完成！总耗时: ${Date.now() - startTime}ms`)
    console.log('📊 今日数据:', todayStats.value)
    console.log('📈 历史数据:', allTimeStats.value)
    
  } catch (err: any) {
    console.error('❌ 获取统计数据失败:', err)
    console.log(`💥 失败总耗时: ${Date.now() - startTime}ms`)
    
    // 根据错误类型提供更具体的错误信息
    if (err.message.includes('超时')) {
      statsError.value = '网络请求超时，请检查网络连接后重试'
    } else if (err.message.includes('认证失败')) {
      statsError.value = '认证失败，请稍后重试'
    } else if (err.message.includes('Failed to fetch')) {
      statsError.value = '网络连接失败，请检查网络后重试'
    } else {
      statsError.value = err.message || '加载数据时出现错误'
    }
    
    statsLoading.value = false
  }
}

// 获取今日开始时间戳（上海时区）
const getTodayStartTimestamp = () => {
  const now = new Date()
  const shanghaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"}))
  shanghaiTime.setHours(0, 0, 0, 0)
  return shanghaiTime.getTime()
}

// 获取今日结束时间戳（上海时区）
const getTodayEndTimestamp = () => {
  const now = new Date()
  const shanghaiTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"}))
  shanghaiTime.setHours(23, 59, 59, 999)
  return shanghaiTime.getTime()
}

// 格式化数字显示
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化更新时间
const formatUpdateTime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }
  return new Date(date).toLocaleString('zh-CN', options)
}

// 组件挂载时获取统计数据
onMounted(() => {
  fetchUmamiStats()
  // 每5分钟更新一次统计数据
  setInterval(fetchUmamiStats, 5 * 60 * 1000)
})
</script>