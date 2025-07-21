<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">JSON 转换工具</h1>
      <p class="text-gray-600 mb-6">将 JSON 转换为其他格式（YAML、XML等）</p>
      
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <el-empty description="功能开发中，敬请期待">
          <el-button type="primary" @click="$router.push('/json/formatter')">
            使用 JSON 格式化工具
          </el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// JSON 转换功能待实现
</script>