<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Base64 编码/解码</h1>
        <p class="text-gray-600">在线 Base64 编码和解码工具，支持文本和文件处理</p>
      </div>
      
      <!-- 模式选择 -->
      <div class="mb-6">
        <el-radio-group v-model="mode" size="large">
          <el-radio-button value="text">文本模式</el-radio-button>
          <el-radio-button value="file">文件模式</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 文本模式 -->
      <div v-if="mode === 'text'" class="space-y-6">
        <!-- 操作按钮 -->
        <div class="flex justify-center space-x-4">
          <el-button type="primary" size="large" @click="encodeText">
            <el-icon class="mr-2"><Lock /></el-icon>
            编码 (文本 → Base64)
          </el-button>
          <el-button type="success" size="large" @click="decodeText">
            <el-icon class="mr-2"><Unlock /></el-icon>
            解码 (Base64 → 文本)
          </el-button>
          <el-button size="large" @click="swapText">
            <el-icon class="mr-2"><Switch /></el-icon>
            交换
          </el-button>
          <el-button size="large" @click="clearText">
            <el-icon class="mr-2"><Delete /></el-icon>
            清空
          </el-button>
        </div>
        
        <!-- 输入输出区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 输入区域 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">输入</h3>
              <div class="space-x-2">
                <el-button size="small" @click="pasteInput">
                  <el-icon class="mr-1"><DocumentCopy /></el-icon>
                  粘贴
                </el-button>
                <el-button size="small" @click="loadExample">
                  <el-icon class="mr-1"><Document /></el-icon>
                  示例
                </el-button>
              </div>
            </div>
            
            <el-input
              v-model="textInput"
              type="textarea"
              :rows="15"
              placeholder="在此输入文本或 Base64 字符串..."
              class="font-mono"
            />
            
            <!-- 字符编码选项 -->
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">字符编码:</span>
              <el-select v-model="charset" size="small" style="width: 120px">
                <el-option label="UTF-8" value="utf-8" />
                <el-option label="GBK" value="gbk" />
                <el-option label="GB2312" value="gb2312" />
              </el-select>
            </div>
          </div>
          
          <!-- 输出区域 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">输出</h3>
              <el-button size="small" @click="copyOutput" :disabled="!textOutput">
                <el-icon class="mr-1"><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
            
            <el-input
              v-model="textOutput"
              type="textarea"
              :rows="15"
              placeholder="处理结果将显示在这里..."
              readonly
              class="font-mono"
            />
            
            <!-- 输出选项 -->
            <div class="flex items-center space-x-4">
              <el-checkbox v-model="wrapLines" size="small">
                每76字符换行
              </el-checkbox>
              <el-checkbox v-model="urlSafe" size="small">
                URL 安全模式
              </el-checkbox>
            </div>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div v-if="textStats" class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="text-gray-600">输入长度:</span>
              <span class="font-medium ml-1">{{ textStats.inputLength }}</span>
            </div>
            <div>
              <span class="text-gray-600">输出长度:</span>
              <span class="font-medium ml-1">{{ textStats.outputLength }}</span>
            </div>
            <div>
              <span class="text-gray-600">压缩比:</span>
              <span class="font-medium ml-1">{{ textStats.ratio }}</span>
            </div>
            <div>
              <span class="text-gray-600">处理时间:</span>
              <span class="font-medium ml-1">{{ textStats.time }}ms</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 文件模式 -->
      <div v-else class="space-y-6">
        <!-- 文件上传区域 -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref="fileInput"
            type="file"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div v-if="!selectedFile" class="space-y-4">
            <el-icon class="text-6xl text-gray-400"><UploadFilled /></el-icon>
            <p class="text-gray-600">拖拽文件到此处，或点击选择文件</p>
            <el-button type="primary" @click="selectFile">
              选择文件
            </el-button>
          </div>
          
          <div v-else class="space-y-4">
            <el-icon class="text-6xl text-green-500"><DocumentChecked /></el-icon>
            <div>
              <p class="font-medium">{{ selectedFile.name }}</p>
              <p class="text-sm text-gray-600">
                大小: {{ formatFileSize(selectedFile.size) }}
              </p>
            </div>
            <div class="space-x-2">
              <el-button type="primary" @click="encodeFile">
                <el-icon class="mr-1"><Lock /></el-icon>
                编码文件
              </el-button>
              <el-button @click="clearFile">
                <el-icon class="mr-1"><Delete /></el-icon>
                清除
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- Base64 解码为文件 -->
        <div class="bg-blue-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-3">Base64 解码为文件</h3>
          <div class="space-y-4">
            <el-input
              v-model="base64FileInput"
              type="textarea"
              :rows="6"
              placeholder="粘贴 Base64 字符串以解码为文件..."
              class="font-mono"
            />
            <div class="flex items-center space-x-4">
              <el-input
                v-model="outputFileName"
                placeholder="输出文件名"
                style="width: 200px"
              />
              <el-button type="success" @click="decodeToFile" :disabled="!base64FileInput">
                <el-icon class="mr-1"><Download /></el-icon>
                解码并下载
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 文件编码结果 -->
        <div v-if="fileOutput" class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">编码结果</h3>
            <div class="space-x-2">
              <el-button size="small" @click="copyFileOutput">
                <el-icon class="mr-1"><CopyDocument /></el-icon>
                复制
              </el-button>
              <el-button size="small" @click="downloadAsText">
                <el-icon class="mr-1"><Download /></el-icon>
                下载为文本
              </el-button>
            </div>
          </div>
          
          <el-input
            v-model="fileOutput"
            type="textarea"
            :rows="10"
            readonly
            class="font-mono"
          />
          
          <!-- 数据 URI -->
          <div v-if="dataUri" class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm font-medium mb-2">Data URI:</p>
            <div class="flex items-center space-x-2">
              <el-input
                v-model="dataUri"
                readonly
                class="font-mono text-xs"
              />
              <el-button size="small" @click="copyDataUri">
                复制
              </el-button>
            </div>
            <p class="text-xs text-gray-600 mt-2">
              可直接用于 HTML img 标签或 CSS background-image
            </p>
          </div>
        </div>
      </div>
      
      <!-- 功能说明 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">Base64 编码说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 class="font-medium mb-2">什么是 Base64？</h4>
            <p class="text-gray-600">
              Base64 是一种基于64个可打印字符来表示二进制数据的编码方法。
              常用于在文本协议中传输二进制数据，如电子邮件附件、图片嵌入等。
            </p>
          </div>
          <div>
            <h4 class="font-medium mb-2">使用场景</h4>
            <ul class="text-gray-600 space-y-1">
              <li>• 在 HTML/CSS 中嵌入小图片</li>
              <li>• 传输二进制数据通过文本协议</li>
              <li>• 存储复杂数据在配置文件中</li>
              <li>• API 认证令牌编码</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p class="text-yellow-800">
            <strong>注意:</strong> Base64 编码会增加约 33% 的数据大小，不适合大文件。
            编码不是加密，不提供安全性保护。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Lock,
  Unlock,
  Switch,
  Delete,
  DocumentCopy,
  Document,
  CopyDocument,
  UploadFilled,
  DocumentChecked,
  Download
} from '@element-plus/icons-vue'

// 模式
const mode = ref<'text' | 'file'>('text')

// 文本模式数据
const textInput = ref('')
const textOutput = ref('')
const charset = ref('utf-8')
const wrapLines = ref(false)
const urlSafe = ref(false)

// 文件模式数据
const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const fileOutput = ref('')
const base64FileInput = ref('')
const outputFileName = ref('decoded-file')
const dataUri = ref('')

// 统计信息
interface TextStats {
  inputLength: number
  outputLength: number
  ratio: string
  time: number
}

const textStats = ref<TextStats | null>(null)

// Base64 编码文本
const encodeText = () => {
  const startTime = performance.now()
  
  try {
    if (!textInput.value) {
      ElMessage.warning('请输入要编码的文本')
      return
    }
    
    // 将文本转换为 Base64
    let encoded = btoa(unescape(encodeURIComponent(textInput.value)))
    
    // URL 安全模式
    if (urlSafe.value) {
      encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }
    
    // 换行处理
    if (wrapLines.value && !urlSafe.value) {
      encoded = encoded.match(/.{1,76}/g)?.join('\n') || encoded
    }
    
    textOutput.value = encoded
    
    // 更新统计信息
    const endTime = performance.now()
    textStats.value = {
      inputLength: textInput.value.length,
      outputLength: encoded.length,
      ratio: `1:${(encoded.length / textInput.value.length).toFixed(2)}`,
      time: Math.round(endTime - startTime)
    }
    
    ElMessage.success('编码成功')
  } catch (e) {
    ElMessage.error('编码失败：' + (e instanceof Error ? e.message : '未知错误'))
  }
}

// Base64 解码文本
const decodeText = () => {
  const startTime = performance.now()
  
  try {
    if (!textInput.value) {
      ElMessage.warning('请输入要解码的 Base64 字符串')
      return
    }
    
    let input = textInput.value
    
    // 移除换行和空格
    input = input.replace(/[\s\n]/g, '')
    
    // URL 安全模式转换
    if (input.includes('-') || input.includes('_')) {
      input = input.replace(/-/g, '+').replace(/_/g, '/')
      // 补充 padding
      const padding = 4 - (input.length % 4)
      if (padding !== 4) {
        input += '='.repeat(padding)
      }
    }
    
    // 解码
    const decoded = decodeURIComponent(escape(atob(input)))
    textOutput.value = decoded
    
    // 更新统计信息
    const endTime = performance.now()
    textStats.value = {
      inputLength: textInput.value.length,
      outputLength: decoded.length,
      ratio: `${(textInput.value.length / decoded.length).toFixed(2)}:1`,
      time: Math.round(endTime - startTime)
    }
    
    ElMessage.success('解码成功')
  } catch (e) {
    ElMessage.error('解码失败：输入的不是有效的 Base64 字符串')
  }
}

// 交换输入输出
const swapText = () => {
  const temp = textInput.value
  textInput.value = textOutput.value
  textOutput.value = temp
}

// 清空文本
const clearText = () => {
  textInput.value = ''
  textOutput.value = ''
  textStats.value = null
}

// 粘贴输入
const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    textInput.value = text
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 加载示例
const loadExample = () => {
  textInput.value = 'Hello, World! 你好，世界！'
}

// 复制输出
const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(textOutput.value)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

// 选择文件
const selectFile = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 限制文件大小（10MB）
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过 10MB')
      return
    }
    
    selectedFile.value = file
    fileOutput.value = ''
    dataUri.value = ''
  }
}

// 编码文件
const encodeFile = () => {
  if (!selectedFile.value) return
  
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const bytes = new Uint8Array(arrayBuffer)
      let binary = ''
      
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      
      const base64 = btoa(binary)
      fileOutput.value = base64
      
      // 生成 Data URI
      const mimeType = selectedFile.value?.type || 'application/octet-stream'
      dataUri.value = `data:${mimeType};base64,${base64}`
      
      ElMessage.success('文件编码成功')
    } catch (e) {
      ElMessage.error('文件编码失败')
    }
  }
  
  reader.onerror = () => {
    ElMessage.error('文件读取失败')
  }
  
  reader.readAsArrayBuffer(selectedFile.value)
}

// 清除文件
const clearFile = () => {
  selectedFile.value = null
  fileOutput.value = ''
  dataUri.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 解码为文件
const decodeToFile = () => {
  try {
    if (!base64FileInput.value) {
      ElMessage.warning('请输入 Base64 字符串')
      return
    }
    
    // 移除可能的 Data URI 前缀
    let base64 = base64FileInput.value
    const dataUriMatch = base64.match(/^data:([^;]+);base64,(.+)$/)
    if (dataUriMatch) {
      base64 = dataUriMatch[2]
    }
    
    // 移除空白字符
    base64 = base64.replace(/[\s\n]/g, '')
    
    // 解码
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    
    // 创建 Blob 并下载
    const blob = new Blob([bytes])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = outputFileName.value || 'decoded-file'
    a.click()
    URL.revokeObjectURL(url)
    
    ElMessage.success('文件解码成功，开始下载')
  } catch (e) {
    ElMessage.error('解码失败：输入的不是有效的 Base64 字符串')
  }
}

// 复制文件输出
const copyFileOutput = async () => {
  try {
    await navigator.clipboard.writeText(fileOutput.value)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

// 复制 Data URI
const copyDataUri = async () => {
  try {
    await navigator.clipboard.writeText(dataUri.value)
    ElMessage.success('Data URI 已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

// 下载为文本文件
const downloadAsText = () => {
  const blob = new Blob([fileOutput.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${selectedFile.value?.name || 'file'}.base64.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 拖拽支持
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  const file = e.dataTransfer?.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      ElMessage.error('文件大小不能超过 10MB')
      return
    }
    
    selectedFile.value = file
    fileOutput.value = ''
    dataUri.value = ''
  }
}

// 添加拖拽事件监听
if (typeof window !== 'undefined') {
  document.addEventListener('dragover', handleDragOver)
  document.addEventListener('drop', handleDrop)
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

:deep(.el-input__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>