<template>
  <div class="text-xs text-gray-500">
    <span>今日访问: {{ todayVisits }}</span>
    <span class="mx-2">|</span>
    <span>总访问量: {{ totalVisits }}</span>
    <span class="mx-2">|</span>
    <span>在线用户: {{ onlineUsers }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 访客统计数据
const todayVisits = ref(0)
const totalVisits = ref(0)
const onlineUsers = ref(1)

// 获取umami统计数据
const fetchUmamiStats = async () => {
  try {
    // 这里可以调用umami API获取真实统计数据
    // 由于umami API需要认证，这里先使用模拟数据
    // 实际使用时可以通过后端API代理调用umami统计接口
    
    // 模拟今日访问量（可以通过localStorage记录）
    const today = new Date().toDateString()
    const storedTodayVisits = localStorage.getItem(`visits_${today}`)
    if (storedTodayVisits) {
      todayVisits.value = parseInt(storedTodayVisits)
    } else {
      todayVisits.value = Math.floor(Math.random() * 50) + 20
      localStorage.setItem(`visits_${today}`, todayVisits.value.toString())
    }
    
    // 模拟总访问量（递增存储）
    const storedTotalVisits = localStorage.getItem('total_visits')
    if (storedTotalVisits) {
      totalVisits.value = parseInt(storedTotalVisits) + Math.floor(Math.random() * 5)
    } else {
      totalVisits.value = Math.floor(Math.random() * 5000) + 2000
    }
    localStorage.setItem('total_visits', totalVisits.value.toString())
    
    // 模拟在线用户数
    onlineUsers.value = Math.floor(Math.random() * 15) + 1
    
  } catch (error) {
    console.error('获取访客统计失败:', error)
    // 设置默认值
    todayVisits.value = 1
    totalVisits.value = 1000
    onlineUsers.value = 1
  }
}

// 真实的umami API调用示例（需要后端支持）
const fetchRealUmamiStats = async () => {
  try {
    // 这需要后端API来代理umami的统计接口
    // const response = await fetch('/api/umami-stats')
    // const data = await response.json()
    // todayVisits.value = data.todayVisits
    // totalVisits.value = data.totalVisits
    // onlineUsers.value = data.onlineUsers
  } catch (error) {
    console.error('获取umami统计失败:', error)
  }
}

// 组件挂载时获取统计数据
onMounted(() => {
  fetchUmamiStats()
  // 每5分钟更新一次统计数据
  setInterval(fetchUmamiStats, 5 * 60 * 1000)
})
</script>