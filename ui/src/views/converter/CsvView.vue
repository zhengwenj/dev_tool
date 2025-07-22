<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">CSV 转 JSON</h1>
        <p class="text-gray-600">在线 CSV 和 JSON 格式互转工具，支持自定义分隔符和数据类型推断</p>
      </div>
      
      <!-- 转换方向 -->
      <div class="mb-6 flex items-center justify-center space-x-4">
        <span class="text-lg font-medium">CSV</span>
        <el-button 
          :type="direction === 'csv2json' ? 'primary' : 'default'"
          @click="direction = 'csv2json'; convert()"
          circle
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button 
          :type="direction === 'json2csv' ? 'primary' : 'default'"
          @click="direction = 'json2csv'; convert()"
          circle
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <span class="text-lg font-medium">JSON</span>
      </div>
      
      <!-- 选项设置 -->
      <div class="mb-6 bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- CSV 选项 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">分隔符</label>
            <el-select v-model="csvOptions.delimiter" size="small" @change="convert">
              <el-option label="逗号 (,)" value="," />
              <el-option label="分号 (;)" value=";" />
              <el-option label="制表符 (Tab)" value="\t" />
              <el-option label="管道符 (|)" value="|" />
              <el-option label="自定义" value="custom" />
            </el-select>
            <el-input
              v-if="csvOptions.delimiter === 'custom'"
              v-model="csvOptions.customDelimiter"
              size="small"
              placeholder="输入分隔符"
              class="mt-2"
              @input="convert"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">引号字符</label>
            <el-select v-model="csvOptions.quote" size="small" @change="convert">
              <el-option label='双引号 (")' value='"' />
              <el-option label="单引号 (')" value="'" />
              <el-option label="无" value="" />
            </el-select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">换行符</label>
            <el-select v-model="csvOptions.linebreak" size="small" @change="convert">
              <el-option label="LF (\n)" value="\n" />
              <el-option label="CRLF (\r\n)" value="\r\n" />
            </el-select>
          </div>
          
          <div class="space-y-2">
            <el-checkbox v-model="csvOptions.header" size="small" @change="convert">
              首行作为表头
            </el-checkbox>
            <el-checkbox v-model="csvOptions.skipEmptyLines" size="small" @change="convert">
              跳过空行
            </el-checkbox>
          </div>
        </div>
        
        <!-- JSON 选项 -->
        <div class="mt-4 pt-4 border-t">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="space-y-2">
              <el-checkbox v-model="jsonOptions.pretty" size="small" @change="convert">
                格式化输出
              </el-checkbox>
              <el-checkbox v-model="jsonOptions.parseNumbers" size="small" @change="convert">
                解析数字
              </el-checkbox>
            </div>
            
            <div class="space-y-2">
              <el-checkbox v-model="jsonOptions.parseBooleans" size="small" @change="convert">
                解析布尔值
              </el-checkbox>
              <el-checkbox v-model="jsonOptions.parseNulls" size="small" @change="convert">
                解析 null 值
              </el-checkbox>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
              <el-select v-model="jsonOptions.outputFormat" size="small" @change="convert">
                <el-option label="对象数组" value="array" />
                <el-option label="嵌套对象" value="object" />
                <el-option label="二维数组" value="2d-array" />
              </el-select>
            </div>
            
            <div v-if="jsonOptions.outputFormat === 'object'">
              <label class="block text-sm font-medium text-gray-700 mb-1">键字段</label>
              <el-input
                v-model="jsonOptions.keyField"
                size="small"
                placeholder="选择作为键的字段"
                @input="convert"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- 主编辑区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 输入区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">
              {{ direction === 'csv2json' ? 'CSV 输入' : 'JSON 输入' }}
            </h3>
            <div class="space-x-2">
              <el-button size="small" @click="pasteInput">
                <el-icon class="mr-1"><DocumentCopy /></el-icon>
                粘贴
              </el-button>
              <el-button size="small" @click="loadExample">
                <el-icon class="mr-1"><Document /></el-icon>
                示例
              </el-button>
              <el-upload
                v-if="direction === 'csv2json'"
                :show-file-list="false"
                :before-upload="handleFileUpload"
                accept=".csv,.txt"
                class="inline-block"
              >
                <el-button size="small">
                  <el-icon class="mr-1"><Upload /></el-icon>
                  上传文件
                </el-button>
              </el-upload>
            </div>
          </div>
          
          <el-input
            v-model="input"
            type="textarea"
            :rows="20"
            :placeholder="direction === 'csv2json' ? '在此输入 CSV 数据...' : '在此输入 JSON 数据...'"
            class="font-mono"
            @input="convert"
          />
          
          <!-- 输入统计 -->
          <div class="text-sm text-gray-600">
            <span v-if="direction === 'csv2json'">
              行数: {{ csvStats.rows }} | 列数: {{ csvStats.columns }}
            </span>
            <span v-else>
              {{ jsonStats }}
            </span>
          </div>
        </div>
        
        <!-- 输出区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">
              {{ direction === 'csv2json' ? 'JSON 输出' : 'CSV 输出' }}
            </h3>
            <div class="space-x-2">
              <el-button size="small" @click="copyOutput" :disabled="!output">
                <el-icon class="mr-1"><CopyDocument /></el-icon>
                复制
              </el-button>
              <el-button size="small" @click="downloadOutput" :disabled="!output">
                <el-icon class="mr-1"><Download /></el-icon>
                下载
              </el-button>
            </div>
          </div>
          
          <el-input
            v-model="output"
            type="textarea"
            :rows="20"
            placeholder="转换结果将显示在这里..."
            readonly
            class="font-mono"
          />
          
          <!-- 错误信息 -->
          <el-alert
            v-if="error"
            :title="error"
            type="error"
            :closable="false"
          />
        </div>
      </div>
      
      <!-- 数据预览表格 -->
      <div v-if="previewData.length > 0" class="mt-6">
        <h3 class="text-lg font-semibold mb-3">数据预览</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header in previewHeaders" :key="header"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(row, index) in previewData.slice(0, 10)" :key="index">
                <td v-for="header in previewHeaders" :key="header"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ row[header] }}
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="previewData.length > 10" class="text-sm text-gray-600 mt-2">
            显示前 10 行，共 {{ previewData.length }} 行数据
          </p>
        </div>
      </div>
      
      <!-- 功能说明 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">使用说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 class="font-medium mb-2">CSV 格式说明</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• CSV (Comma-Separated Values) 是一种简单的表格数据格式</li>
              <li>• 每行代表一条记录，字段之间用分隔符分隔</li>
              <li>• 包含特殊字符的字段需要用引号包围</li>
              <li>• 支持自定义分隔符、引号字符等选项</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-2">转换选项</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• <strong>数据类型推断:</strong> 自动识别数字、布尔值和 null</li>
              <li>• <strong>输出格式:</strong> 支持对象数组、嵌套对象等多种格式</li>
              <li>• <strong>表头处理:</strong> 可选择首行作为字段名</li>
              <li>• <strong>空行处理:</strong> 可选择跳过空行</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p class="text-yellow-800">
            <strong>提示:</strong> 大文件处理可能需要较长时间，建议文件大小不超过 10MB。
            复杂的嵌套 JSON 结构转换为 CSV 时可能会丢失层级信息。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowRight,
  ArrowLeft,
  DocumentCopy,
  Document,
  Upload,
  CopyDocument,
  Download
} from '@element-plus/icons-vue'

// 转换方向
type Direction = 'csv2json' | 'json2csv'
const direction = ref<Direction>('csv2json')

// 输入输出
const input = ref('')
const output = ref('')
const error = ref('')

// CSV 选项
const csvOptions = ref({
  delimiter: ',',
  customDelimiter: '',
  quote: '"',
  linebreak: '\n',
  header: true,
  skipEmptyLines: true
})

// JSON 选项
const jsonOptions = ref({
  pretty: true,
  parseNumbers: true,
  parseBooleans: true,
  parseNulls: true,
  outputFormat: 'array' as 'array' | 'object' | '2d-array',
  keyField: ''
})

// 预览数据
const previewData = ref<any[]>([])
const previewHeaders = ref<string[]>([])

// CSV 统计
const csvStats = computed(() => {
  if (direction.value !== 'csv2json' || !input.value) {
    return { rows: 0, columns: 0 }
  }
  
  const lines = input.value.trim().split(/\r?\n/)
  const rows = lines.length
  const columns = lines[0] ? lines[0].split(getDelimiter()).length : 0
  
  return { rows, columns }
})

// JSON 统计
const jsonStats = computed(() => {
  if (direction.value !== 'json2csv' || !input.value) {
    return '无数据'
  }
  
  try {
    const data = JSON.parse(input.value)
    if (Array.isArray(data)) {
      return `数组长度: ${data.length}`
    } else if (typeof data === 'object') {
      return `对象属性: ${Object.keys(data).length}`
    }
    return '有效 JSON'
  } catch {
    return '无效 JSON'
  }
})

// 获取分隔符
const getDelimiter = () => {
  return csvOptions.value.delimiter === 'custom' 
    ? csvOptions.value.customDelimiter 
    : csvOptions.value.delimiter
}

// CSV 解析器
const parseCSV = (csv: string): any[] => {
  const delimiter = getDelimiter()
  const quote = csvOptions.value.quote
  const lines = csv.split(/\r?\n/)
  const result: any[] = []
  
  // 跳过空行
  const validLines = csvOptions.value.skipEmptyLines 
    ? lines.filter(line => line.trim()) 
    : lines
  
  if (validLines.length === 0) return []
  
  // 解析表头
  const headers = csvOptions.value.header 
    ? parseCSVLine(validLines[0], delimiter, quote)
    : validLines[0].split(delimiter).map((_, i) => `column${i + 1}`)
  
  previewHeaders.value = headers
  
  // 解析数据行
  const startIndex = csvOptions.value.header ? 1 : 0
  for (let i = startIndex; i < validLines.length; i++) {
    const values = parseCSVLine(validLines[i], delimiter, quote)
    const row: any = {}
    
    headers.forEach((header, index) => {
      let value = values[index] || ''
      
      // 类型推断
      if (jsonOptions.value.parseNumbers && /^-?\d+(\.\d+)?$/.test(value)) {
        value = parseFloat(value)
      } else if (jsonOptions.value.parseBooleans && /^(true|false)$/i.test(value)) {
        value = value.toLowerCase() === 'true'
      } else if (jsonOptions.value.parseNulls && /^(null|NULL)$/i.test(value)) {
        value = null
      }
      
      row[header] = value
    })
    
    result.push(row)
  }
  
  return result
}

// 解析 CSV 行（处理引号）
const parseCSVLine = (line: string, delimiter: string, quote: string): string[] => {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (quote && char === quote) {
      if (inQuotes && nextChar === quote) {
        // 转义的引号
        current += quote
        i++
      } else {
        // 切换引号状态
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      // 字段分隔符
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  // 添加最后一个字段
  result.push(current)
  
  return result
}

// JSON 转 CSV
const jsonToCSV = (data: any): string => {
  if (!Array.isArray(data)) {
    // 尝试将对象转换为数组
    if (typeof data === 'object' && data !== null) {
      data = [data]
    } else {
      throw new Error('输入必须是数组或对象')
    }
  }
  
  if (data.length === 0) return ''
  
  // 获取所有字段
  const headers = new Set<string>()
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => headers.add(key))
    }
  })
  
  const headerArray = Array.from(headers)
  const delimiter = getDelimiter()
  const quote = csvOptions.value.quote
  const linebreak = csvOptions.value.linebreak
  
  // 构建 CSV
  const lines: string[] = []
  
  // 添加表头
  if (csvOptions.value.header) {
    lines.push(headerArray.map(h => formatCSVValue(h, delimiter, quote)).join(delimiter))
  }
  
  // 添加数据行
  data.forEach(item => {
    const values = headerArray.map(header => {
      const value = item[header]
      return formatCSVValue(value, delimiter, quote)
    })
    lines.push(values.join(delimiter))
  })
  
  return lines.join(linebreak)
}

// 格式化 CSV 值
const formatCSVValue = (value: any, delimiter: string, quote: string): string => {
  if (value === null || value === undefined) {
    return ''
  }
  
  const stringValue = String(value)
  
  // 检查是否需要引号
  if (quote && (
    stringValue.includes(delimiter) ||
    stringValue.includes(quote) ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  )) {
    // 转义引号
    const escaped = stringValue.replace(new RegExp(quote, 'g'), quote + quote)
    return quote + escaped + quote
  }
  
  return stringValue
}

// 转换函数
const convert = () => {
  error.value = ''
  previewData.value = []
  
  try {
    if (!input.value.trim()) {
      output.value = ''
      return
    }
    
    if (direction.value === 'csv2json') {
      // CSV 转 JSON
      const data = parseCSV(input.value)
      previewData.value = data
      
      let result: any
      switch (jsonOptions.value.outputFormat) {
        case 'array':
          result = data
          break
        case 'object':
          if (!jsonOptions.value.keyField) {
            throw new Error('请指定键字段')
          }
          result = {}
          data.forEach(item => {
            const key = item[jsonOptions.value.keyField]
            if (key !== undefined) {
              result[key] = item
            }
          })
          break
        case '2d-array':
          result = [previewHeaders.value]
          data.forEach(item => {
            result.push(previewHeaders.value.map(h => item[h]))
          })
          break
      }
      
      output.value = jsonOptions.value.pretty 
        ? JSON.stringify(result, null, 2)
        : JSON.stringify(result)
    } else {
      // JSON 转 CSV
      const data = JSON.parse(input.value)
      output.value = jsonToCSV(data)
      
      // 预览
      if (Array.isArray(data)) {
        previewData.value = data.slice(0, 10)
        if (data.length > 0 && typeof data[0] === 'object') {
          previewHeaders.value = Object.keys(data[0])
        }
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '转换失败'
    output.value = ''
  }
}

// 粘贴输入
const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    input.value = text
    convert()
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 加载示例
const loadExample = () => {
  if (direction.value === 'csv2json') {
    input.value = `姓名,年龄,城市,邮箱,是否会员
张三,25,北京,zhangsan@example.com,true
李四,30,上海,lisi@example.com,false
王五,28,广州,wangwu@example.com,true
赵六,35,深圳,zhaoliu@example.com,false
钱七,22,杭州,qianqi@example.com,true`
  } else {
    input.value = JSON.stringify([
      {
        "姓名": "张三",
        "年龄": 25,
        "城市": "北京",
        "邮箱": "zhangsan@example.com",
        "是否会员": true
      },
      {
        "姓名": "李四",
        "年龄": 30,
        "城市": "上海",
        "邮箱": "lisi@example.com",
        "是否会员": false
      },
      {
        "姓名": "王五",
        "年龄": 28,
        "城市": "广州",
        "邮箱": "wangwu@example.com",
        "是否会员": true
      }
    ], null, 2)
  }
  convert()
}

// 处理文件上传
const handleFileUpload = (file: File) => {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    input.value = e.target?.result as string
    convert()
  }
  
  reader.onerror = () => {
    ElMessage.error('文件读取失败')
  }
  
  reader.readAsText(file)
  return false // 阻止默认上传
}

// 复制输出
const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    ElMessage.success('已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

// 下载输出
const downloadOutput = () => {
  const extension = direction.value === 'csv2json' ? 'json' : 'csv'
  const mimeType = direction.value === 'csv2json' ? 'application/json' : 'text/csv'
  
  const blob = new Blob([output.value], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `output.${extension}`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('文件已下载')
}

// 监听输入变化
watch([input, direction], () => {
  if (input.value) {
    convert()
  }
})
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

.font-mono {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

table {
  font-size: 0.875rem;
}
</style>