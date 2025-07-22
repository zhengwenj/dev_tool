<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">URL 编码/解码</h1>
        <p class="text-gray-600">在线 URL 编码和解码工具，支持完整 URL 和组件编码</p>
      </div>

      <!-- 编码模式选择 -->
      <div class="mb-6">
        <el-radio-group v-model="encodeMode" size="large">
          <el-radio-button value="component">URL 组件编码</el-radio-button>
          <el-radio-button value="full">完整 URL 编码</el-radio-button>
          <el-radio-button value="params">查询参数编码</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-center space-x-4 mb-6">
        <el-button type="primary" size="large" @click="encode">
          <el-icon class="mr-2">
            <Lock/>
          </el-icon>
          编码
        </el-button>
        <el-button type="success" size="large" @click="decode">
          <el-icon class="mr-2">
            <Unlock/>
          </el-icon>
          解码
        </el-button>
        <el-button size="large" @click="swap">
          <el-icon class="mr-2">
            <Switch/>
          </el-icon>
          交换
        </el-button>
        <el-button size="large" @click="clear">
          <el-icon class="mr-2">
            <Delete/>
          </el-icon>
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
                <el-icon class="mr-1">
                  <DocumentCopy/>
                </el-icon>
                粘贴
              </el-button>
              <el-button size="small" @click="loadExample">
                <el-icon class="mr-1">
                  <Document/>
                </el-icon>
                示例
              </el-button>
            </div>
          </div>

          <el-input
            v-model="input"
            type="textarea"
            :rows="15"
            placeholder="在此输入要编码/解码的内容..."
            class="font-mono"
          />

          <!-- 编码选项 -->
          <div class="space-y-2">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">字符集:</span>
              <el-select v-model="charset" size="small" style="width: 120px">
                <el-option label="UTF-8" value="utf-8"/>
                <el-option label="GBK" value="gbk"/>
                <el-option label="GB2312" value="gb2312"/>
              </el-select>
            </div>
            <el-checkbox v-model="preserveSpecialChars" size="small">
              保留特殊字符（仅组件编码）
            </el-checkbox>
          </div>
        </div>

        <!-- 输出区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">输出</h3>
            <el-button size="small" @click="copyOutput" :disabled="!output">
              <el-icon class="mr-1">
                <CopyDocument/>
              </el-icon>
              复制
            </el-button>
          </div>

          <el-input
            v-model="output"
            type="textarea"
            :rows="15"
            placeholder="处理结果将显示在这里..."
            readonly
            class="font-mono"
          />

          <!-- 输出统计 -->
          <div v-if="stats" class="text-sm text-gray-600 space-y-1">
            <p>输入长度: {{ stats.inputLength }} 字符</p>
            <p>输出长度: {{ stats.outputLength }} 字符</p>
            <p>变化率: {{ stats.changeRate }}%</p>
          </div>
        </div>
      </div>

      <!-- URL 解析器 -->
      <div v-if="encodeMode === 'full' && parsedUrl" class="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">URL 解析结果</h3>
        <div class="space-y-2">
          <div class="grid grid-cols-3 gap-2 text-sm">
            <span class="text-gray-600">协议:</span>
            <span class="col-span-2 font-mono">{{ parsedUrl.protocol || '-' }}</span>

            <span class="text-gray-600">主机:</span>
            <span class="col-span-2 font-mono">{{ parsedUrl.host || '-' }}</span>

            <span class="text-gray-600">端口:</span>
            <span class="col-span-2 font-mono">{{ parsedUrl.port || '默认' }}</span>

            <span class="text-gray-600">路径:</span>
            <span class="col-span-2 font-mono">{{ parsedUrl.pathname || '/' }}</span>

            <span class="text-gray-600">查询参数:</span>
            <span class="col-span-2 font-mono">{{ parsedUrl.search || '-' }}</span>

            <span class="text-gray-600">锚点:</span>
            <span class="col-span-2 font-mono">{{ parsedUrl.hash || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 查询参数编辑器 -->
      <div v-if="encodeMode === 'params'" class="mt-6 bg-green-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">查询参数编辑器</h3>

        <!-- 参数列表 -->
        <div class="space-y-2 mb-4">
          <div v-for="(param, index) in queryParams" :key="index"
               class="flex items-center space-x-2">
            <el-input
              v-model="param.key"
              placeholder="参数名"
              size="small"
              style="width: 200px"
            />
            <span>=</span>
            <el-input
              v-model="param.value"
              placeholder="参数值"
              size="small"
              class="flex-1"
            />
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              circle
              @click="removeParam(index)"
            />
          </div>
        </div>

        <!-- 添加参数按钮 -->
        <el-button size="small" @click="addParam">
          <el-icon class="mr-1">
            <Plus/>
          </el-icon>
          添加参数
        </el-button>

        <!-- 生成查询字符串 -->
        <div class="mt-4">
          <el-button type="primary" size="small" @click="buildQueryString">
            生成查询字符串
          </el-button>
          <el-button size="small" @click="parseQueryString">
            解析查询字符串
          </el-button>
        </div>
      </div>

      <!-- 常用字符编码参考 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">常用字符编码参考</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div v-for="char in commonChars" :key="char.char"
               class="bg-white rounded p-3 border">
            <div class="flex justify-between items-center">
              <span class="font-mono text-lg">{{ char.char }}</span>
              <span class="font-mono text-blue-600">{{ char.encoded }}</span>
            </div>
            <p class="text-xs text-gray-600 mt-1">{{ char.name }}</p>
          </div>
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">URL 编码说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 class="font-medium mb-2">编码模式说明</h4>
            <ul class="space-y-2 text-gray-600">
              <li>
                <strong>URL 组件编码:</strong> 使用 encodeURIComponent()，
                编码所有特殊字符，适用于查询参数值
              </li>
              <li>
                <strong>完整 URL 编码:</strong> 使用 encodeURI()，
                保留 URL 结构字符，适用于完整 URL
              </li>
              <li>
                <strong>查询参数编码:</strong> 专门处理 URL 查询参数，
                支持参数编辑和构建
              </li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-2">使用场景</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• 在 URL 中传递中文或特殊字符</li>
              <li>• 构建 API 请求参数</li>
              <li>• 处理表单提交数据</li>
              <li>• 解析和调试 URL 参数</li>
              <li>• 避免 URL 注入攻击</li>
            </ul>
          </div>
        </div>

        <div class="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p class="text-yellow-800">
            <strong>提示:</strong> URL 编码会将非 ASCII 字符和特殊字符转换为 %XX 格式，
            其中 XX 是字符的十六进制表示。不同的编码模式适用于不同场景。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import {
  Lock,
  Unlock,
  Switch,
  Delete,
  DocumentCopy,
  Document,
  CopyDocument,
  Plus
} from '@element-plus/icons-vue'

// 编码模式
type EncodeMode = 'component' | 'full' | 'params'
const encodeMode = ref<EncodeMode>('component')

// 输入输出
const input = ref('')
const output = ref('')

// 选项
const charset = ref('utf-8')
const preserveSpecialChars = ref(false)

// 统计信息
interface Stats {
  inputLength: number
  outputLength: number
  changeRate: string
}

const stats = ref<Stats | null>(null)

// URL 解析结果
interface ParsedUrl {
  protocol: string
  host: string
  port: string
  pathname: string
  search: string
  hash: string
}

const parsedUrl = ref<ParsedUrl | null>(null)

// 查询参数
interface QueryParam {
  key: string
  value: string
}

const queryParams = ref<QueryParam[]>([
  {key: '', value: ''}
])

// 常用字符编码参考
const commonChars = [
  {char: ' ', encoded: '%20', name: '空格'},
  {char: '!', encoded: '%21', name: '感叹号'},
  {char: '#', encoded: '%23', name: '井号'},
  {char: '$', encoded: '%24', name: '美元符'},
  {char: '&', encoded: '%26', name: '和号'},
  {char: '+', encoded: '%2B', name: '加号'},
  {char: '=', encoded: '%3D', name: '等号'},
  {char: '?', encoded: '%3F', name: '问号'},
  {char: '@', encoded: '%40', name: 'At符号'},
  {char: '/', encoded: '%2F', name: '斜杠'},
  {char: ':', encoded: '%3A', name: '冒号'},
  {char: '中', encoded: '%E4%B8%AD', name: '中文示例'}
]

// 编码
const encode = () => {
  try {
    if (!input.value) {
      ElMessage.warning('请输入要编码的内容')
      return
    }

    let encoded = ''

    switch (encodeMode.value) {
      case 'component':
        // URL 组件编码
        if (preserveSpecialChars.value) {
          // 保留某些特殊字符
          encoded = input.value.replace(/[^a-zA-Z0-9\-_.!~*'()]/g, (char) => {
            return '%' + char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')
          })
        } else {
          encoded = encodeURIComponent(input.value)
        }
        break

      case 'full':
        // 完整 URL 编码
        encoded = encodeURI(input.value)
        // 解析 URL
        try {
          const url = new URL(input.value.startsWith('http') ? input.value : 'http://' + input.value)
          parsedUrl.value = {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash
          }
        } catch {
          parsedUrl.value = null
        }
        break

      case 'params':
        // 查询参数编码
        const params = new URLSearchParams()
        queryParams.value.forEach(param => {
          if (param.key) {
            params.append(param.key, param.value)
          }
        })
        encoded = params.toString()
        break
    }

    output.value = encoded
    updateStats()
    ElMessage.success('编码成功')
  } catch (e) {
    ElMessage.error('编码失败：' + (e instanceof Error ? e.message : '未知错误'))
  }
}

// 解码
const decode = () => {
  try {
    if (!input.value) {
      ElMessage.warning('请输入要解码的内容')
      return
    }

    let decoded = ''

    switch (encodeMode.value) {
      case 'component':
        // URL 组件解码
        decoded = decodeURIComponent(input.value)
        break

      case 'full':
        // 完整 URL 解码
        decoded = decodeURI(input.value)
        // 解析解码后的 URL
        try {
          const url = new URL(decoded.startsWith('http') ? decoded : 'http://' + decoded)
          parsedUrl.value = {
            protocol: url.protocol,
            host: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash
          }
        } catch {
          parsedUrl.value = null
        }
        break

      case 'params':
        // 查询参数解码
        const params = new URLSearchParams(input.value)
        const decodedParams: string[] = []
        params.forEach((value, key) => {
          decodedParams.push(`${key}=${value}`)
        })
        decoded = decodedParams.join('\n')

        // 更新参数列表
        queryParams.value = []
        params.forEach((value, key) => {
          queryParams.value.push({key, value})
        })
        if (queryParams.value.length === 0) {
          queryParams.value.push({key: '', value: ''})
        }
        break
    }

    output.value = decoded
    updateStats()
    ElMessage.success('解码成功')
  } catch (e) {
    ElMessage.error('解码失败：输入的不是有效的编码字符串')
  }
}

// 交换输入输出
const swap = () => {
  const temp = input.value
  input.value = output.value
  output.value = temp
  parsedUrl.value = null
}

// 清空
const clear = () => {
  input.value = ''
  output.value = ''
  stats.value = null
  parsedUrl.value = null
  queryParams.value = [{key: '', value: ''}]
}

// 粘贴输入
const pasteInput = async () => {
  try {
    const text = await navigator.clipboard.readText()
    input.value = text
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 加载示例
const loadExample = () => {
  switch (encodeMode.value) {
    case 'component':
      input.value = 'Hello World! 你好世界！@#$%'
      break
    case 'full':
      input.value = 'https://example.com/path/文件名.html?name=张三&age=20#section'
      break
    case 'params':
      input.value = 'name=张三&age=20&city=北京&email=test@example.com'
      queryParams.value = [
        {key: 'name', value: '张三'},
        {key: 'age', value: '20'},
        {key: 'city', value: '北京'},
        {key: 'email', value: 'test@example.com'}
      ]
      break
  }
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

// 更新统计信息
const updateStats = () => {
  const inputLen = input.value.length
  const outputLen = output.value.length
  const change = outputLen - inputLen
  const changeRate = inputLen > 0 ? ((change / inputLen) * 100).toFixed(1) : '0'

  stats.value = {
    inputLength: inputLen,
    outputLength: outputLen,
    changeRate: change >= 0 ? `+${changeRate}` : changeRate
  }
}

// 添加查询参数
const addParam = () => {
  queryParams.value.push({key: '', value: ''})
}

// 删除查询参数
const removeParam = (index: number) => {
  queryParams.value.splice(index, 1)
  if (queryParams.value.length === 0) {
    queryParams.value.push({key: '', value: ''})
  }
}

// 构建查询字符串
const buildQueryString = () => {
  const params = new URLSearchParams()
  queryParams.value.forEach(param => {
    if (param.key) {
      params.append(param.key, param.value)
    }
  })
  input.value = params.toString()
  encode()
}

// 解析查询字符串
const parseQueryString = () => {
  if (!input.value) {
    ElMessage.warning('请输入查询字符串')
    return
  }

  try {
    const params = new URLSearchParams(input.value)
    queryParams.value = []
    params.forEach((value, key) => {
      queryParams.value.push({key, value})
    })
    if (queryParams.value.length === 0) {
      queryParams.value.push({key: '', value: ''})
    }
    ElMessage.success('解析成功')
  } catch (e) {
    ElMessage.error('解析失败：输入的不是有效的查询字符串')
  }
}

// 监听编码模式变化
watch(encodeMode, () => {
  parsedUrl.value = null
  if (encodeMode.value === 'params' && queryParams.value.length === 0) {
    queryParams.value.push({key: '', value: ''})
  }
})
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

:deep(.el-input__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.font-mono {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>
