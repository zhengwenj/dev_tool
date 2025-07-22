<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">JSON 转换工具</h1>
        <p class="text-gray-600">将 JSON 转换为其他格式（YAML、XML、CSV等）</p>
      </div>
      
      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">输入</h3>
            <el-select v-model="inputFormat" size="small" style="width: 120px">
              <el-option label="JSON" value="json" />
              <el-option label="YAML" value="yaml" />
              <el-option label="XML" value="xml" />
              <el-option label="CSV" value="csv" />
            </el-select>
          </div>
          
          <div class="relative">
            <el-input
              v-model="inputData"
              type="textarea"
              :rows="20"
              :placeholder="`在此输入 ${inputFormat.toUpperCase()} 数据...`"
              class="font-mono"
              @input="handleConvert"
            />
            
            <!-- 错误提示 -->
            <div v-if="error" class="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 p-2">
              <p class="text-sm text-red-600 flex items-center">
                <el-icon class="mr-1"><WarningFilled /></el-icon>
                {{ error }}
              </p>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex gap-2">
            <el-button size="small" @click="handlePaste">
              <el-icon class="mr-1"><DocumentCopy /></el-icon>
              粘贴
            </el-button>
            <el-button size="small" @click="handleClear">
              <el-icon class="mr-1"><Delete /></el-icon>
              清空
            </el-button>
            <el-button size="small" @click="loadExample">
              <el-icon class="mr-1"><Document /></el-icon>
              加载示例
            </el-button>
          </div>
        </div>
        
        <!-- 输出区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">输出</h3>
            <el-select v-model="outputFormat" size="small" style="width: 120px" @change="handleConvert">
              <el-option label="JSON" value="json" :disabled="inputFormat === 'json'" />
              <el-option label="YAML" value="yaml" :disabled="inputFormat === 'yaml'" />
              <el-option label="XML" value="xml" :disabled="inputFormat === 'xml'" />
              <el-option label="CSV" value="csv" :disabled="inputFormat === 'csv'" />
            </el-select>
          </div>
          
          <div class="relative">
            <el-input
              v-model="outputData"
              type="textarea"
              :rows="20"
              readonly
              :placeholder="`转换后的 ${outputFormat.toUpperCase()} 数据将显示在这里...`"
              class="font-mono"
            />
          </div>
          
          <!-- 操作按钮 -->
          <div class="flex gap-2">
            <el-button size="small" @click="handleCopy" :disabled="!outputData">
              <el-icon class="mr-1"><CopyDocument /></el-icon>
              复制结果
            </el-button>
            <el-button size="small" @click="handleDownload" :disabled="!outputData">
              <el-icon class="mr-1"><Download /></el-icon>
              下载文件
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 转换选项 -->
      <div class="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-3">转换选项</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- JSON 选项 -->
          <div v-if="outputFormat === 'json'" class="space-y-2">
            <el-checkbox v-model="jsonOptions.pretty">格式化输出</el-checkbox>
            <div class="flex items-center gap-2">
              <span class="text-sm">缩进空格：</span>
              <el-input-number v-model="jsonOptions.indent" :min="0" :max="8" size="small" />
            </div>
          </div>
          
          <!-- XML 选项 -->
          <div v-if="outputFormat === 'xml'" class="space-y-2">
            <el-checkbox v-model="xmlOptions.pretty">格式化输出</el-checkbox>
            <div class="flex items-center gap-2">
              <span class="text-sm">根元素名称：</span>
              <el-input v-model="xmlOptions.rootName" size="small" style="width: 150px" />
            </div>
          </div>
          
          <!-- CSV 选项 -->
          <div v-if="outputFormat === 'csv'" class="space-y-2">
            <el-checkbox v-model="csvOptions.header">包含表头</el-checkbox>
            <div class="flex items-center gap-2">
              <span class="text-sm">分隔符：</span>
              <el-select v-model="csvOptions.delimiter" size="small" style="width: 100px">
                <el-option label="逗号 (,)" value="," />
                <el-option label="分号 (;)" value=";" />
                <el-option label="制表符" value="\t" />
              </el-select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 功能说明 -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">支持的转换</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>JSON ↔ YAML</strong> - 保持数据结构完整性
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>JSON ↔ XML</strong> - 智能标签命名和属性处理
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>JSON → CSV</strong> - 扁平化嵌套结构
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>CSV → JSON</strong> - 自动类型推断
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  DocumentCopy,
  Delete,
  Document,
  WarningFilled,
  CopyDocument,
  Download,
  Check
} from '@element-plus/icons-vue'

// 数据格式类型
type DataFormat = 'json' | 'yaml' | 'xml' | 'csv'

// 响应式数据
const inputFormat = ref<DataFormat>('json')
const outputFormat = ref<DataFormat>('yaml')
const inputData = ref('')
const outputData = ref('')
const error = ref('')

// 转换选项
const jsonOptions = ref({
  pretty: true,
  indent: 2
})

const xmlOptions = ref({
  pretty: true,
  rootName: 'root'
})

const csvOptions = ref({
  header: true,
  delimiter: ','
})

// JSON 转 YAML
const jsonToYaml = (data: any): string => {
  const indent = (level: number) => '  '.repeat(level)
  
  const convertValue = (value: any, level: number = 0): string => {
    if (value === null) return 'null'
    if (value === undefined) return 'null'
    if (typeof value === 'boolean') return value.toString()
    if (typeof value === 'number') return value.toString()
    if (typeof value === 'string') {
      // 检查是否需要引号
      if (value.includes(':') || value.includes('#') || value.includes('\n') || 
          value.startsWith(' ') || value.endsWith(' ')) {
        return `"${value.replace(/"/g, '\\"')}"`
      }
      return value
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]'
      return '\n' + value.map(item => 
        indent(level) + '- ' + convertValue(item, level + 1).trimStart()
      ).join('\n')
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value)
      if (entries.length === 0) return '{}'
      return '\n' + entries.map(([key, val]) => 
        indent(level) + key + ': ' + convertValue(val, level + 1).trimStart()
      ).join('\n')
    }
    
    return String(value)
  }
  
  return convertValue(data).trimStart()
}

// YAML 转 JSON
const yamlToJson = (yaml: string): any => {
  // 简单的 YAML 解析器（处理基本情况）
  const lines = yaml.split('\n')
  const stack: any[] = [{}]
  const indentStack: number[] = [-1]
  
  for (let line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    
    const indent = line.length - line.trimStart().length
    
    // 处理数组项
    if (trimmed.startsWith('- ')) {
      const value = trimmed.substring(2).trim()
      while (indentStack[indentStack.length - 1] >= indent) {
        stack.pop()
        indentStack.pop()
      }
      
      const parent = stack[stack.length - 1]
      if (!Array.isArray(parent)) {
        throw new Error('无效的 YAML：数组项缺少数组上下文')
      }
      
      if (value.includes(':') && !value.startsWith('"') && !value.startsWith("'")) {
        const obj = {}
        parent.push(obj)
        stack.push(obj)
        indentStack.push(indent)
        // 重新处理这一行作为对象属性
        line = ' '.repeat(indent + 2) + value
        continue
      } else {
        parent.push(parseValue(value))
      }
      continue
    }
    
    // 处理键值对
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      while (indentStack[indentStack.length - 1] >= indent) {
        stack.pop()
        indentStack.pop()
      }
      
      const parent = stack[stack.length - 1]
      
      if (!value) {
        // 值在下一行
        const nextIndent = indent
        const container = guessNextType(lines, lines.indexOf(line))
        parent[key] = container
        stack.push(container)
        indentStack.push(nextIndent)
      } else {
        parent[key] = parseValue(value)
      }
    }
  }
  
  return stack[0]
}

// 解析 YAML 值
const parseValue = (value: string): any => {
  if (value === 'null' || value === '~') return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (value === '[]') return []
  if (value === '{}') return {}
  
  // 处理引号字符串
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  
  // 尝试解析数字
  const num = Number(value)
  if (!isNaN(num) && value === String(num)) return num
  
  return value
}

// 猜测下一个类型
const guessNextType = (lines: string[], currentIndex: number): any => {
  for (let i = currentIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('#')) continue
    if (line.startsWith('- ')) return []
    return {}
  }
  return {}
}

// JSON 转 XML
const jsonToXml = (data: any, rootName: string = 'root', pretty: boolean = true): string => {
  const indent = pretty ? '  ' : ''
  const newline = pretty ? '\n' : ''
  
  const convertValue = (value: any, key: string, level: number = 0): string => {
    const padding = pretty ? indent.repeat(level) : ''
    
    if (value === null || value === undefined) {
      return `${padding}<${key}/>${newline}`
    }
    
    if (Array.isArray(value)) {
      return value.map(item => convertValue(item, key, level)).join('')
    }
    
    if (typeof value === 'object') {
      const children = Object.entries(value)
        .map(([k, v]) => convertValue(v, k, level + 1))
        .join('')
      return `${padding}<${key}>${newline}${children}${padding}</${key}>${newline}`
    }
    
    // 转义特殊字符
    const escaped = String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
    
    return `${padding}<${key}>${escaped}</${key}>${newline}`
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>${newline}${convertValue(data, rootName)}`
}

// XML 转 JSON
const xmlToJson = (xml: string): any => {
  // 简单的 XML 解析器
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')
  
  const parseNode = (node: Element): any => {
    // 检查是否有子元素
    const children = Array.from(node.children)
    
    if (children.length === 0) {
      // 叶子节点
      const text = node.textContent || ''
      // 尝试解析为合适的类型
      if (text === 'true') return true
      if (text === 'false') return false
      if (text === 'null') return null
      const num = Number(text)
      if (!isNaN(num) && text === String(num)) return num
      return text
    }
    
    // 有子元素
    const result: any = {}
    const groups: { [key: string]: any[] } = {}
    
    children.forEach(child => {
      const tagName = child.tagName
      const value = parseNode(child)
      
      if (groups[tagName]) {
        groups[tagName].push(value)
      } else if (result[tagName]) {
        groups[tagName] = [result[tagName], value]
        delete result[tagName]
      } else {
        result[tagName] = value
      }
    })
    
    // 将分组的元素作为数组添加
    Object.entries(groups).forEach(([key, values]) => {
      result[key] = values
    })
    
    return result
  }
  
  const root = doc.documentElement
  return { [root.tagName]: parseNode(root) }
}

// JSON 转 CSV
const jsonToCsv = (data: any, options: typeof csvOptions.value): string => {
  // 扁平化 JSON 数据
  const flatten = (obj: any, prefix = ''): any => {
    const result: any = {}
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (value === null || value === undefined) {
        result[newKey] = ''
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, flatten(value, newKey))
      } else if (Array.isArray(value)) {
        result[newKey] = value.join('; ')
      } else {
        result[newKey] = value
      }
    }
    
    return result
  }
  
  // 处理数组数据
  let rows: any[]
  if (Array.isArray(data)) {
    rows = data.map(item => flatten(item))
  } else {
    rows = [flatten(data)]
  }
  
  if (rows.length === 0) return ''
  
  // 获取所有列
  const columns = Array.from(new Set(rows.flatMap(row => Object.keys(row))))
  
  // 生成 CSV
  const lines: string[] = []
  
  if (options.header) {
    lines.push(columns.map(col => `"${col}"`).join(options.delimiter))
  }
  
  rows.forEach(row => {
    const values = columns.map(col => {
      const value = row[col] ?? ''
      const strValue = String(value)
      // 如果包含特殊字符，需要用引号包裹
      if (strValue.includes(options.delimiter) || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`
      }
      return strValue
    })
    lines.push(values.join(options.delimiter))
  })
  
  return lines.join('\n')
}

// CSV 转 JSON
const csvToJson = (csv: string, options: typeof csvOptions.value): any => {
  const lines = csv.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  // 解析 CSV 行
  const parseRow = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === options.delimiter && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }
  
  // 解析数据
  const rows = lines.map(line => parseRow(line))
  
  if (!options.header) {
    // 没有表头，返回数组的数组
    return rows
  }
  
  // 有表头，返回对象数组
  const headers = rows[0]
  const data = rows.slice(1)
  
  return data.map(row => {
    const obj: any = {}
    headers.forEach((header, index) => {
      const value = row[index] || ''
      
      // 尝试恢复嵌套结构
      if (header.includes('.')) {
        const keys = header.split('.')
        let current = obj
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {}
          }
          current = current[keys[i]]
        }
        
        current[keys[keys.length - 1]] = parseValue(value)
      } else {
        obj[header] = parseValue(value)
      }
    })
    return obj
  })
  
  function parseValue(value: string): any {
    if (value === '') return null
    if (value === 'true') return true
    if (value === 'false') return false
    const num = Number(value)
    if (!isNaN(num) && value === String(num)) return num
    return value
  }
}

// 转换函数
const convert = (from: DataFormat, to: DataFormat, data: string): string => {
  // 首先解析输入数据
  let parsed: any
  
  switch (from) {
    case 'json':
      parsed = JSON.parse(data)
      break
    case 'yaml':
      parsed = yamlToJson(data)
      break
    case 'xml':
      parsed = xmlToJson(data)
      break
    case 'csv':
      parsed = csvToJson(data, csvOptions.value)
      break
  }
  
  // 然后转换为目标格式
  switch (to) {
    case 'json':
      return jsonOptions.value.pretty 
        ? JSON.stringify(parsed, null, jsonOptions.value.indent)
        : JSON.stringify(parsed)
    case 'yaml':
      return jsonToYaml(parsed)
    case 'xml':
      return jsonToXml(parsed, xmlOptions.value.rootName, xmlOptions.value.pretty)
    case 'csv':
      return jsonToCsv(parsed, csvOptions.value)
    default:
      throw new Error(`不支持的格式: ${to}`)
  }
}

// 处理转换
const handleConvert = () => {
  if (!inputData.value.trim()) {
    outputData.value = ''
    error.value = ''
    return
  }
  
  try {
    outputData.value = convert(inputFormat.value, outputFormat.value, inputData.value)
    error.value = ''
  } catch (e) {
    if (e instanceof Error) {
      // 翻译常见的错误消息
      let errorMsg = e.message
      
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
      error.value = '转换失败'
    }
    outputData.value = ''
  }
}

// 监听选项变化
watch([jsonOptions, xmlOptions, csvOptions], () => {
  if (inputData.value && !error.value) {
    handleConvert()
  }
}, { deep: true })

// 粘贴
const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputData.value = text
    handleConvert()
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 清空
const handleClear = () => {
  inputData.value = ''
  outputData.value = ''
  error.value = ''
}

// 复制
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(outputData.value)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

// 下载
const handleDownload = () => {
  const blob = new Blob([outputData.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `converted.${outputFormat.value}`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('下载成功')
}

// 加载示例
const loadExample = () => {
  const examples: Record<DataFormat, string> = {
    json: JSON.stringify({
      "name": "开发工具箱",
      "version": "1.0.0",
      "features": ["JSON 格式化", "编码解码", "格式转换"],
      "author": {
        "name": "Developer",
        "email": "dev@example.com"
      }
    }, null, 2),
    yaml: `name: 开发工具箱
version: 1.0.0
features:
  - JSON 格式化
  - 编码解码
  - 格式转换
author:
  name: Developer
  email: dev@example.com`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>开发工具箱</name>
  <version>1.0.0</version>
  <features>JSON 格式化</features>
  <features>编码解码</features>
  <features>格式转换</features>
  <author>
    <name>Developer</name>
    <email>dev@example.com</email>
  </author>
</root>`,
    csv: `name,version,features,author.name,author.email
开发工具箱,1.0.0,"JSON 格式化; 编码解码; 格式转换",Developer,dev@example.com`
  }
  
  inputData.value = examples[inputFormat.value]
  handleConvert()
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}
</style>