o<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">JSON 格式化/压缩</h1>
        <p class="text-gray-600">格式化、压缩、验证您的 JSON 数据</p>
      </div>
      
      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">输入 JSON</h3>
            <div class="space-x-2">
              <el-button size="small" @click="handlePaste">
                <el-icon class="mr-1"><DocumentCopy /></el-icon>
                粘贴
              </el-button>
              <el-button size="small" @click="handleClear">
                <el-icon class="mr-1"><Delete /></el-icon>
                清空
              </el-button>
            </div>
          </div>
          
          <div class="relative">
            <el-input
              v-model="inputJson"
              type="textarea"
              :rows="20"
              placeholder="在此粘贴或输入 JSON 数据..."
              class="font-mono"
              @input="handleInput"
            />
            
            <!-- 错误提示 -->
            <div v-if="error" class="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 p-2">
              <p class="text-sm text-red-600 flex items-center">
                <el-icon class="mr-1"><WarningFilled /></el-icon>
                {{ error }}
              </p>
            </div>
          </div>
          
          <!-- 示例数据 -->
          <div class="text-sm text-gray-500">
            <span>需要示例？</span>
            <el-button link type="primary" size="small" @click="loadExample">
              加载示例 JSON
            </el-button>
          </div>
        </div>
        
        <!-- 输出区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">输出结果</h3>
            <div class="space-x-2">
              <el-button size="small" @click="handleFormat" :disabled="!isValidJson">
                <el-icon class="mr-1"><Brush /></el-icon>
                格式化
              </el-button>
              <el-button size="small" @click="handleMinify" :disabled="!isValidJson">
                <el-icon class="mr-1"><Minus /></el-icon>
                压缩
              </el-button>
              <el-button size="small" @click="handleEscape" :disabled="!inputJson.trim()">
                <el-icon class="mr-1"><Lock /></el-icon>
                转义
              </el-button>
              <el-button size="small" @click="handleUnescape" :disabled="!inputJson.trim()">
                <el-icon class="mr-1"><Unlock /></el-icon>
                去转义
              </el-button>
              <el-button size="small" @click="handleCopy" :disabled="!outputJson">
                <el-icon class="mr-1"><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
          </div>
          
          <div class="relative">
            <el-input
              v-model="outputJson"
              type="textarea"
              :rows="20"
              readonly
              placeholder="格式化或压缩后的结果将显示在这里..."
              class="font-mono"
            />
          </div>
          
          <!-- 统计信息 -->
          <div v-if="stats" class="bg-gray-50 rounded p-3 text-sm">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <span class="text-gray-600">字符数：</span>
                <span class="font-medium">{{ stats.characters }}</span>
              </div>
              <div>
                <span class="text-gray-600">大小：</span>
                <span class="font-medium">{{ stats.size }}</span>
              </div>
              <div>
                <span class="text-gray-600">键值对：</span>
                <span class="font-medium">{{ stats.keys }}</span>
              </div>
              <div>
                <span class="text-gray-600">深度：</span>
                <span class="font-medium">{{ stats.depth }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 功能说明 -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">功能特点</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>实时验证</strong> - 输入时自动验证 JSON 格式
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>格式化美化</strong> - 自动缩进，提高可读性
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>压缩优化</strong> - 移除空白字符，减小文件大小
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>转义处理</strong> - 转义和去除转义 JSON 字符串
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>统计分析</strong> - 显示字符数、键值对等信息
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  DocumentCopy,
  Delete,
  WarningFilled,
  Brush,
  Minus,
  CopyDocument,
  Check,
  Lock,
  Unlock
} from '@element-plus/icons-vue'

// 响应式数据
const inputJson = ref('')
const outputJson = ref('')
const error = ref('')
const isValidJson = ref(false)

// 统计信息
interface Stats {
  characters: number
  size: string
  keys: number
  depth: number
}
const stats = ref<Stats | null>(null)

// 验证 JSON
const validateJson = (text: string) => {
  if (!text.trim()) {
    error.value = ''
    isValidJson.value = false
    return null
  }
  
  try {
    const parsed = JSON.parse(text)
    error.value = ''
    isValidJson.value = true
    return parsed
  } catch (e) {
    if (e instanceof Error) {
      // 翻译常见的 JSON 解析错误
      let errorMsg = e.message
      
      // 处理各种错误格式
      if (errorMsg.includes('Unexpected token')) {
        errorMsg = errorMsg.replace('Unexpected token', '意外的字符')
      } else if (errorMsg.includes('Unexpected end of JSON input')) {
        errorMsg = 'JSON 输入意外结束'
      } else if (errorMsg.includes('Bad control character in string literal')) {
        // 匹配 "Bad control character in string literal in JSON at position X (line Y column Z)"
        const match = errorMsg.match(/Bad control character in string literal in JSON at position (\d+) \(line (\d+) column (\d+)\)/)
        if (match) {
          errorMsg = `JSON 字符串中存在非法控制字符，位置：${match[1]} (第 ${match[2]} 行 第 ${match[3]} 列)`
        } else {
          errorMsg = errorMsg.replace('Bad control character in string literal', 'JSON 字符串中存在非法控制字符')
        }
      } else if (errorMsg.includes('JSON.parse')) {
        errorMsg = errorMsg.replace('JSON.parse:', 'JSON 解析错误：')
      } else if (errorMsg.includes('is not valid JSON')) {
        errorMsg = errorMsg.replace('is not valid JSON', '不是有效的 JSON')
      }
      
      error.value = errorMsg
    } else {
      error.value = 'JSON 格式错误'
    }
    isValidJson.value = false
    return null
  }
}

// 计算统计信息
const calculateStats = (obj: any): Stats => {
  const jsonStr = JSON.stringify(obj)
  const bytes = new Blob([jsonStr]).size
  
  const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0
    let count = 0
    for (const key in obj) {
      count++
      count += countKeys(obj[key])
    }
    return count
  }
  
  const getDepth = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0
    let maxDepth = 0
    for (const key in obj) {
      const depth = getDepth(obj[key])
      maxDepth = Math.max(maxDepth, depth)
    }
    return maxDepth + 1
  }
  
  return {
    characters: jsonStr.length,
    size: bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`,
    keys: countKeys(obj),
    depth: getDepth(obj)
  }
}

// 处理输入
const handleInput = () => {
  const parsed = validateJson(inputJson.value)
  if (parsed) {
    stats.value = calculateStats(parsed)
  } else {
    stats.value = null
    outputJson.value = ''
  }
}

// 格式化 JSON
const handleFormat = () => {
  const parsed = validateJson(inputJson.value)
  if (parsed) {
    outputJson.value = JSON.stringify(parsed, null, 2)
    ElMessage.success('格式化成功')
  }
}

// 压缩 JSON
const handleMinify = () => {
  const parsed = validateJson(inputJson.value)
  if (parsed) {
    outputJson.value = JSON.stringify(parsed)
    ElMessage.success('压缩成功')
  }
}

// 转义 JSON 字符串
const handleEscape = () => {
  try {
    const text = inputJson.value.trim()
    if (!text) return
    
    // 如果输入是有效的 JSON，先转换为字符串
    let stringToEscape = text
    const parsed = validateJson(text)
    if (parsed) {
      stringToEscape = JSON.stringify(parsed)
    }
    
    // 执行转义
    const escaped = JSON.stringify(stringToEscape)
    // 去掉外层的引号，显示在输出框
    outputJson.value = escaped.slice(1, -1)
    
    // 清空错误
    error.value = ''
    isValidJson.value = false
    stats.value = null
    
    ElMessage.success('转义成功')
  } catch (e) {
    ElMessage.error('转义失败：' + (e instanceof Error ? e.message : '未知错误'))
  }
}

// 去除转义
const handleUnescape = () => {
  try {
    const text = inputJson.value.trim()
    if (!text) return
    
    // 添加外层引号以构成有效的 JSON 字符串
    const jsonString = `"${text}"`
    
    // 解析 JSON 字符串以去除转义
    const unescaped = JSON.parse(jsonString)
    
    // 显示在输出框
    outputJson.value = unescaped
    
    // 尝试解析结果是否为有效的 JSON
    try {
      const parsed = JSON.parse(unescaped)
      // 如果是有效的 JSON，更新统计信息
      stats.value = calculateStats(parsed)
      isValidJson.value = true
      error.value = ''
    } catch {
      // 如果不是有效的 JSON，清空统计
      error.value = ''
      isValidJson.value = false
      stats.value = null
    }
    
    ElMessage.success('去转义成功')
  } catch (e) {
    ElMessage.error('去转义失败：' + (e instanceof Error ? e.message : '未知错误'))
  }
}

// 粘贴
const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputJson.value = text
    handleInput()
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 清空
const handleClear = () => {
  inputJson.value = ''
  outputJson.value = ''
  error.value = ''
  stats.value = null
  isValidJson.value = false
}

// 复制
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(outputJson.value)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

// 加载示例
const loadExample = () => {
  inputJson.value = JSON.stringify({
    "name": "开发工具箱",
    "version": "1.0.0",
    "description": "为开发者提供的在线工具集合",
    "features": [
      "JSON 格式化",
      "编码解码",
      "格式转换"
    ],
    "author": {
      "name": "Developer",
      "email": "dev@example.com"
    },
    "settings": {
      "theme": "light",
      "language": "zh-CN",
      "autoSave": true
    }
  }, null, 2)
  handleInput()
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}
</style>
