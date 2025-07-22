<template>
  <div class="p-6">
    <div class="max-w-6xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">统一文本处理器</h1>
        <p class="text-gray-600">在同一个文本框中进行多种文本处理操作，所有转换都在原地完成</p>
      </div>
      
      <!-- 主要内容区 -->
      <div class="space-y-4">
        <!-- 操作按钮组 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-start">
            <!-- JSON 操作 -->
            <div class="flex flex-col h-full">
              <div class="text-sm font-medium text-gray-700 mb-2">JSON 操作</div>
              <div class="grid grid-cols-1 gap-2">
                <el-button size="small" @click="formatJson" class="w-full">
                  <el-icon class="mr-1"><Brush /></el-icon>
                  格式化
                </el-button>
                <el-button size="small" @click="minifyJson" class="w-full">
                  <el-icon class="mr-1"><Minus /></el-icon>
                  压缩
                </el-button>
                <el-button size="small" @click="escapeJson" class="w-full">
                  <el-icon class="mr-1"><Lock /></el-icon>
                  转义
                </el-button>
                <el-button size="small" @click="unescapeJson" class="w-full">
                  <el-icon class="mr-1"><Unlock /></el-icon>
                  去转义
                </el-button>
              </div>
            </div>
            
            <!-- 编码操作 -->
            <div class="flex flex-col h-full">
              <div class="text-sm font-medium text-gray-700 mb-2">编码操作</div>
              <div class="grid grid-cols-1 gap-2">
                <el-button size="small" @click="encodeBase64" class="w-full">
                  Base64 编码
                </el-button>
                <el-button size="small" @click="decodeBase64" class="w-full">
                  Base64 解码
                </el-button>
                <el-button size="small" @click="encodeUrl" class="w-full">
                  URL 编码
                </el-button>
                <el-button size="small" @click="decodeUrl" class="w-full">
                  URL 解码
                </el-button>
              </div>
            </div>
            
            <!-- XML 操作 -->
            <div class="flex flex-col h-full">
              <div class="text-sm font-medium text-gray-700 mb-2">XML 操作</div>
              <div class="grid grid-cols-1 gap-2">
                <el-button size="small" @click="formatXml" class="w-full">
                  <el-icon class="mr-1"><Brush /></el-icon>
                  格式化
                </el-button>
                <el-button size="small" @click="minifyXml" class="w-full">
                  <el-icon class="mr-1"><Minus /></el-icon>
                  压缩
                </el-button>
              </div>
            </div>
            
            <!-- HTML 操作 -->
            <div class="flex flex-col h-full">
              <div class="text-sm font-medium text-gray-700 mb-2">HTML 操作</div>
              <div class="grid grid-cols-1 gap-2">
                <el-button size="small" @click="encodeHtml" class="w-full">
                  HTML 编码
                </el-button>
                <el-button size="small" @click="decodeHtml" class="w-full">
                  HTML 解码
                </el-button>
              </div>
            </div>
            
            <!-- 格式转换 -->
            <div class="flex flex-col h-full">
              <div class="text-sm font-medium text-gray-700 mb-2">格式转换</div>
              <div class="grid grid-cols-1 gap-2">
                <el-button size="small" @click="jsonToYaml" class="w-full">
                  JSON → YAML
                </el-button>
                <el-button size="small" @click="yamlToJson" class="w-full">
                  YAML → JSON
                </el-button>
                <el-button size="small" @click="jsonToXml" class="w-full">
                  JSON → XML
                </el-button>
                <el-button size="small" @click="xmlToJson" class="w-full">
                  XML → JSON
                </el-button>
              </div>
            </div>
            
            <!-- 其他操作 -->
            <div class="flex flex-col h-full">
              <div class="text-sm font-medium text-gray-700 mb-2">其他操作</div>
              <div class="grid grid-cols-1 gap-2">
                <el-button size="small" @click="toUpperCase" class="w-full">
                  转大写
                </el-button>
                <el-button size="small" @click="toLowerCase" class="w-full">
                  转小写
                </el-button>
                <el-button size="small" @click="removeSpaces" class="w-full">
                  去空格
                </el-button>
                <el-button size="small" @click="countWords" class="w-full">
                  字数统计
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 快捷操作栏 -->
        <div class="flex items-center justify-between">
          <div class="space-x-2">
            <el-button size="small" @click="handlePaste">
              <el-icon class="mr-1"><DocumentCopy /></el-icon>
              粘贴
            </el-button>
            <el-button size="small" @click="handleCopy">
              <el-icon class="mr-1"><CopyDocument /></el-icon>
              复制
            </el-button>
            <el-button size="small" @click="handleClear">
              <el-icon class="mr-1"><Delete /></el-icon>
              清空
            </el-button>
            <el-button size="small" @click="handleUndo" :disabled="historyIndex <= 0">
              <el-icon class="mr-1"><Back /></el-icon>
              撤销
            </el-button>
            <el-button size="small" @click="handleRedo" :disabled="historyIndex >= history.length - 1">
              <el-icon class="mr-1"><Right /></el-icon>
              重做
            </el-button>
          </div>
          
          <!-- 状态信息 -->
          <div class="text-sm text-gray-600">
            <span v-if="lastOperation">最后操作: {{ lastOperation }}</span>
          </div>
        </div>
        
        <!-- 文本编辑区 -->
        <div class="relative">
          <el-input
            v-model="content"
            type="textarea"
            :rows="20"
            placeholder="在此粘贴或输入文本，然后选择上方的操作按钮进行处理..."
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
        
        <!-- 统计信息 -->
        <div class="bg-gray-50 rounded p-3 text-sm">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <span class="text-gray-600">字符数：</span>
              <span class="font-medium">{{ stats.characters }}</span>
            </div>
            <div>
              <span class="text-gray-600">字数：</span>
              <span class="font-medium">{{ stats.words }}</span>
            </div>
            <div>
              <span class="text-gray-600">行数：</span>
              <span class="font-medium">{{ stats.lines }}</span>
            </div>
            <div>
              <span class="text-gray-600">大小：</span>
              <span class="font-medium">{{ stats.size }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 使用说明 -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">使用说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 class="font-medium mb-2">操作流程</h4>
            <ol class="list-decimal list-inside space-y-1 text-gray-600">
              <li>粘贴或输入要处理的文本</li>
              <li>点击相应的操作按钮</li>
              <li>文本会在原地更新为处理后的结果</li>
              <li>可以继续进行其他操作</li>
              <li>支持撤销和重做操作</li>
            </ol>
          </div>
          <div>
            <h4 class="font-medium mb-2">功能特点</h4>
            <ul class="list-disc list-inside space-y-1 text-gray-600">
              <li>所有操作都在同一个文本框中完成</li>
              <li>支持操作历史记录，可撤销/重做</li>
              <li>实时显示文本统计信息</li>
              <li>智能错误提示</li>
              <li>支持链式操作，流畅处理</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  DocumentCopy,
  Delete,
  WarningFilled,
  CopyDocument,
  Brush,
  Minus,
  Lock,
  Unlock,
  Back,
  Right
} from '@element-plus/icons-vue'

// 文本内容
const content = ref('')
const error = ref('')
const lastOperation = ref('')

// 历史记录
const history = ref<string[]>([''])
const historyIndex = ref(0)
const maxHistorySize = 50

// 统计信息
const stats = computed(() => {
  const text = content.value
  const bytes = new Blob([text]).size
  
  return {
    characters: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
    size: bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`
  }
})

// 添加到历史记录
const addToHistory = (text: string) => {
  // 如果当前不在历史记录末尾，删除后面的记录
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  
  // 添加新记录
  history.value.push(text)
  
  // 限制历史记录大小
  if (history.value.length > maxHistorySize) {
    history.value = history.value.slice(-maxHistorySize)
  }
  
  historyIndex.value = history.value.length - 1
}

// 执行操作
const executeOperation = (operation: () => void, operationName: string) => {
  try {
    error.value = ''
    const beforeContent = content.value
    operation()
    
    // 如果内容有变化，添加到历史记录
    if (content.value !== beforeContent) {
      addToHistory(content.value)
      lastOperation.value = operationName
      ElMessage.success(`${operationName}成功`)
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : `${operationName}失败`
    ElMessage.error(error.value)
  }
}

// JSON 操作
const formatJson = () => {
  executeOperation(() => {
    const parsed = JSON.parse(content.value)
    content.value = JSON.stringify(parsed, null, 2)
  }, 'JSON 格式化')
}

const minifyJson = () => {
  executeOperation(() => {
    const parsed = JSON.parse(content.value)
    content.value = JSON.stringify(parsed)
  }, 'JSON 压缩')
}

const escapeJson = () => {
  executeOperation(() => {
    const escaped = JSON.stringify(content.value)
    content.value = escaped.slice(1, -1)
  }, 'JSON 转义')
}

const unescapeJson = () => {
  executeOperation(() => {
    const jsonString = `"${content.value}"`
    content.value = JSON.parse(jsonString)
  }, 'JSON 去转义')
}

// Base64 操作
const encodeBase64 = () => {
  executeOperation(() => {
    content.value = btoa(unescape(encodeURIComponent(content.value)))
  }, 'Base64 编码')
}

const decodeBase64 = () => {
  executeOperation(() => {
    content.value = decodeURIComponent(escape(atob(content.value)))
  }, 'Base64 解码')
}

// URL 操作
const encodeUrl = () => {
  executeOperation(() => {
    content.value = encodeURIComponent(content.value)
  }, 'URL 编码')
}

const decodeUrl = () => {
  executeOperation(() => {
    content.value = decodeURIComponent(content.value)
  }, 'URL 解码')
}

// XML 操作
const formatXml = () => {
  executeOperation(() => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(content.value, 'text/xml')
    
    // 检查解析错误
    const parseError = xmlDoc.querySelector('parsererror')
    if (parseError) {
      throw new Error('无效的 XML 格式')
    }
    
    // 格式化 XML
    const serializer = new XMLSerializer()
    const xmlString = serializer.serializeToString(xmlDoc)
    
    // 简单的格式化
    let formatted = xmlString
      .replace(/></g, '>\n<')
      .split('\n')
      .map((line, index) => {
        const indent = line.match(/^(\s*)<\//) ? -1 : 0
        const depth = (line.match(/<[^/][^>]*[^/]>/g) || []).length - 
                     (line.match(/<\/[^>]+>/g) || []).length
        return '  '.repeat(Math.max(0, index + indent)) + line.trim()
      })
      .join('\n')
    
    content.value = formatted
  }, 'XML 格式化')
}

const minifyXml = () => {
  executeOperation(() => {
    content.value = content.value
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim()
  }, 'XML 压缩')
}

// HTML 操作
const encodeHtml = () => {
  executeOperation(() => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    content.value = content.value.replace(/[&<>"']/g, m => map[m])
  }, 'HTML 编码')
}

const decodeHtml = () => {
  executeOperation(() => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = content.value
    content.value = textarea.value
  }, 'HTML 解码')
}

// 格式转换
const jsonToYaml = () => {
  executeOperation(() => {
    const parsed = JSON.parse(content.value)
    content.value = convertJsonToYaml(parsed)
  }, 'JSON 转 YAML')
}

const yamlToJson = () => {
  executeOperation(() => {
    // 简单的 YAML 转 JSON（实际项目中应使用专门的库）
    const parsed = parseSimpleYaml(content.value)
    content.value = JSON.stringify(parsed, null, 2)
  }, 'YAML 转 JSON')
}

const jsonToXml = () => {
  executeOperation(() => {
    const parsed = JSON.parse(content.value)
    content.value = convertJsonToXml(parsed, 'root')
  }, 'JSON 转 XML')
}

const xmlToJson = () => {
  executeOperation(() => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(content.value, 'text/xml')
    const json = convertXmlToJson(xmlDoc.documentElement)
    content.value = JSON.stringify(json, null, 2)
  }, 'XML 转 JSON')
}

// 文本操作
const toUpperCase = () => {
  executeOperation(() => {
    content.value = content.value.toUpperCase()
  }, '转大写')
}

const toLowerCase = () => {
  executeOperation(() => {
    content.value = content.value.toLowerCase()
  }, '转小写')
}

const removeSpaces = () => {
  executeOperation(() => {
    content.value = content.value.replace(/\s+/g, '')
  }, '去空格')
}

const countWords = () => {
  const count = stats.value
  ElMessage.info(`字符数: ${count.characters}, 字数: ${count.words}, 行数: ${count.lines}`)
  lastOperation.value = '字数统计'
}

// 辅助函数
const convertJsonToYaml = (obj: any, level = 0): string => {
  const indent = '  '.repeat(level)
  
  if (obj === null) return 'null'
  if (typeof obj !== 'object') return String(obj)
  
  if (Array.isArray(obj)) {
    return obj.map(item => 
      `${indent}- ${typeof item === 'object' ? '\n' + convertJsonToYaml(item, level + 1) : item}`
    ).join('\n')
  }
  
  return Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return `${indent}${key}:\n${convertJsonToYaml(value, level + 1)}`
    }
    return `${indent}${key}: ${value}`
  }).join('\n')
}

const parseSimpleYaml = (yaml: string): any => {
  // 这是一个非常简单的 YAML 解析器，仅用于演示
  // 实际项目中应使用 js-yaml 等专门的库
  const lines = yaml.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))
  const result: any = {}
  
  // 简单处理，仅支持基本的键值对
  lines.forEach(line => {
    const match = line.match(/^(\s*)([^:]+):\s*(.*)$/)
    if (match) {
      const [, , key, value] = match
      result[key.trim()] = value.trim() || null
    }
  })
  
  return result
}

const convertJsonToXml = (obj: any, rootName: string): string => {
  const convert = (data: any, name: string, level = 0): string => {
    const indent = '  '.repeat(level)
    
    if (data === null || data === undefined) {
      return `${indent}<${name}/>\n`
    }
    
    if (Array.isArray(data)) {
      return data.map(item => convert(item, name, level)).join('')
    }
    
    if (typeof data === 'object') {
      const children = Object.entries(data)
        .map(([k, v]) => convert(v, k, level + 1))
        .join('')
      return `${indent}<${name}>\n${children}${indent}</${name}>\n`
    }
    
    return `${indent}<${name}>${data}</${name}>\n`
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(obj, rootName)}`
}

const convertXmlToJson = (node: Element): any => {
  const children = Array.from(node.children)
  
  if (children.length === 0) {
    const text = node.textContent || ''
    if (text === 'true') return true
    if (text === 'false') return false
    const num = Number(text)
    if (!isNaN(num) && text === String(num)) return num
    return text
  }
  
  const result: any = {}
  children.forEach(child => {
    const tagName = child.tagName
    const value = convertXmlToJson(child)
    
    if (result[tagName] !== undefined) {
      if (!Array.isArray(result[tagName])) {
        result[tagName] = [result[tagName]]
      }
      result[tagName].push(value)
    } else {
      result[tagName] = value
    }
  })
  
  return result
}

// 基础操作
const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    content.value = text
    addToHistory(text)
    lastOperation.value = '粘贴'
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(content.value)
    ElMessage.success('已复制到剪贴板')
    lastOperation.value = '复制'
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

const handleClear = () => {
  content.value = ''
  addToHistory('')
  error.value = ''
  lastOperation.value = '清空'
}

const handleUndo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    content.value = history.value[historyIndex.value]
    lastOperation.value = '撤销'
  }
}

const handleRedo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    content.value = history.value[historyIndex.value]
    lastOperation.value = '重做'
  }
}

const handleInput = () => {
  error.value = ''
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

:deep(.el-button) {
  justify-content: flex-start;
}
</style>