<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">正则表达式测试器</h1>
        <p class="text-gray-600">在线测试和调试正则表达式，支持实时匹配、替换和可视化</p>
      </div>
      
      <!-- 正则表达式输入 -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-medium">正则表达式</h3>
          <div class="space-x-2">
            <el-button size="small" @click="loadExample">
              <el-icon class="mr-1"><Document /></el-icon>
              加载示例
            </el-button>
            <el-button size="small" @click="clearAll">
              <el-icon class="mr-1"><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>
        
        <div class="flex space-x-4">
          <el-input
            v-model="pattern"
            placeholder="输入正则表达式，例如: \d{3}-\d{4}"
            class="flex-1 font-mono"
            @input="testRegex"
          >
            <template #prepend>/</template>
            <template #append>/{{ flags }}</template>
          </el-input>
          
          <!-- 标志选项 -->
          <el-popover placement="bottom" :width="300" trigger="click">
            <template #reference>
              <el-button>
                标志: {{ flags || '无' }}
                <el-icon class="ml-1"><ArrowDown /></el-icon>
              </el-button>
            </template>
            <div class="space-y-2">
              <el-checkbox v-model="flagOptions.g" @change="updateFlags">
                <strong>g</strong> - 全局匹配 (global)
              </el-checkbox>
              <el-checkbox v-model="flagOptions.i" @change="updateFlags">
                <strong>i</strong> - 忽略大小写 (ignoreCase)
              </el-checkbox>
              <el-checkbox v-model="flagOptions.m" @change="updateFlags">
                <strong>m</strong> - 多行模式 (multiline)
              </el-checkbox>
              <el-checkbox v-model="flagOptions.s" @change="updateFlags">
                <strong>s</strong> - 点号匹配换行 (dotAll)
              </el-checkbox>
              <el-checkbox v-model="flagOptions.u" @change="updateFlags">
                <strong>u</strong> - Unicode 模式
              </el-checkbox>
              <el-checkbox v-model="flagOptions.y" @change="updateFlags">
                <strong>y</strong> - 粘性匹配 (sticky)
              </el-checkbox>
            </div>
          </el-popover>
        </div>
        
        <!-- 错误提示 -->
        <el-alert
          v-if="regexError"
          :title="regexError"
          type="error"
          :closable="false"
          class="mt-2"
        />
      </div>
      
      <!-- 功能选项卡 -->
      <el-tabs v-model="activeTab" class="mb-6">
        <el-tab-pane label="匹配测试" name="match">
          <!-- 测试文本输入 -->
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium mb-2">测试文本</h4>
              <el-input
                v-model="testText"
                type="textarea"
                :rows="10"
                placeholder="在此输入要测试的文本..."
                @input="testRegex"
              />
            </div>
            
            <!-- 匹配结果 -->
            <div v-if="matches.length > 0">
              <h4 class="text-sm font-medium mb-2">
                匹配结果 ({{ matches.length }} 个匹配)
              </h4>
              
              <!-- 高亮显示 -->
              <div class="bg-gray-50 rounded p-4 mb-4 whitespace-pre-wrap font-mono text-sm"
                   v-html="highlightedText">
              </div>
              
              <!-- 匹配详情 -->
              <div class="space-y-2">
                <div v-for="(match, index) in matches" :key="index"
                     class="bg-white rounded border p-3">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="text-sm font-medium">匹配 {{ index + 1 }}</span>
                        <code class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">
                          {{ match.value }}
                        </code>
                      </div>
                      <div class="text-xs text-gray-600">
                        位置: {{ match.index }} - {{ match.index + match.value.length }}
                        (长度: {{ match.value.length }})
                      </div>
                    </div>
                    
                    <!-- 捕获组 -->
                    <div v-if="match.groups && match.groups.length > 0" class="ml-4">
                      <div class="text-xs font-medium mb-1">捕获组:</div>
                      <div v-for="(group, gIndex) in match.groups" :key="gIndex"
                           class="text-xs">
                        <span class="text-gray-600">组{{ gIndex + 1 }}:</span>
                        <code class="bg-gray-100 px-1 rounded">{{ group || '(空)' }}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="testText && pattern && !regexError" 
                 class="text-center text-gray-500 py-8">
              没有找到匹配项
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="替换" name="replace">
          <div class="space-y-4">
            <!-- 替换模式 -->
            <div>
              <h4 class="text-sm font-medium mb-2">替换模式</h4>
              <el-input
                v-model="replacePattern"
                placeholder="输入替换文本，可以使用 $1, $2 等引用捕获组"
                class="font-mono"
                @input="doReplace"
              />
              <div class="mt-2 text-xs text-gray-600">
                提示: $& = 完整匹配, $1-$9 = 捕获组, $` = 匹配前文本, $' = 匹配后文本
              </div>
            </div>
            
            <!-- 替换结果 -->
            <div v-if="replaceResult !== null">
              <h4 class="text-sm font-medium mb-2">替换结果</h4>
              <el-input
                v-model="replaceResult"
                type="textarea"
                :rows="10"
                readonly
                class="font-mono"
              />
              
              <!-- 替换统计 -->
              <div class="mt-2 text-sm text-gray-600">
                共替换 {{ replaceCount }} 处
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="分割" name="split">
          <div class="space-y-4">
            <!-- 分割选项 -->
            <div class="flex items-center space-x-4">
              <el-input-number
                v-model="splitLimit"
                :min="0"
                :max="1000"
                label="限制数量"
                @change="doSplit"
              />
              <span class="text-sm text-gray-600">
                (0 表示不限制)
              </span>
            </div>
            
            <!-- 分割结果 -->
            <div v-if="splitResult.length > 0">
              <h4 class="text-sm font-medium mb-2">
                分割结果 ({{ splitResult.length }} 部分)
              </h4>
              <div class="space-y-2">
                <div v-for="(part, index) in splitResult" :key="index"
                     class="bg-gray-50 rounded p-3 flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-600">
                    [{{ index }}]
                  </span>
                  <code class="flex-1 text-sm">{{ part || '(空字符串)' }}</code>
                  <span class="text-xs text-gray-500">
                    长度: {{ part.length }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <!-- 常用正则表达式 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">常用正则表达式</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="example in commonPatterns" :key="example.name"
               class="bg-white rounded border p-3 cursor-pointer hover:border-blue-400 transition-colors"
               @click="usePattern(example)">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="font-medium text-sm mb-1">{{ example.name }}</h4>
                <code class="text-xs text-gray-600 break-all">{{ example.pattern }}</code>
              </div>
              <el-button size="small" text>
                使用
              </el-button>
            </div>
            <p class="text-xs text-gray-500 mt-2">{{ example.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- 正则表达式语法参考 -->
      <div class="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">正则表达式语法参考</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <!-- 字符类 -->
          <div>
            <h4 class="font-medium mb-2">字符类</h4>
            <div class="space-y-1 font-mono text-xs">
              <div><code>.</code> - 任意字符（除换行符）</div>
              <div><code>\d</code> - 数字 [0-9]</div>
              <div><code>\D</code> - 非数字</div>
              <div><code>\w</code> - 单词字符 [a-zA-Z0-9_]</div>
              <div><code>\W</code> - 非单词字符</div>
              <div><code>\s</code> - 空白字符</div>
              <div><code>\S</code> - 非空白字符</div>
              <div><code>[abc]</code> - 字符集合</div>
              <div><code>[^abc]</code> - 否定字符集</div>
              <div><code>[a-z]</code> - 字符范围</div>
            </div>
          </div>
          
          <!-- 量词 -->
          <div>
            <h4 class="font-medium mb-2">量词</h4>
            <div class="space-y-1 font-mono text-xs">
              <div><code>*</code> - 0 或多个</div>
              <div><code>+</code> - 1 或多个</div>
              <div><code>?</code> - 0 或 1 个</div>
              <div><code>{n}</code> - 恰好 n 个</div>
              <div><code>{n,}</code> - 至少 n 个</div>
              <div><code>{n,m}</code> - n 到 m 个</div>
              <div><code>*?</code> - 非贪婪匹配</div>
              <div><code>+?</code> - 非贪婪匹配</div>
            </div>
          </div>
          
          <!-- 位置和边界 -->
          <div>
            <h4 class="font-medium mb-2">位置和边界</h4>
            <div class="space-y-1 font-mono text-xs">
              <div><code>^</code> - 行首</div>
              <div><code>$</code> - 行尾</div>
              <div><code>\b</code> - 单词边界</div>
              <div><code>\B</code> - 非单词边界</div>
              <div><code>(?=...)</code> - 正向预查</div>
              <div><code>(?!...)</code> - 负向预查</div>
              <div><code>(?&lt;=...)</code> - 正向后查</div>
              <div><code>(?&lt;!...)</code> - 负向后查</div>
            </div>
          </div>
          
          <!-- 分组和引用 -->
          <div>
            <h4 class="font-medium mb-2">分组和引用</h4>
            <div class="space-y-1 font-mono text-xs">
              <div><code>(...)</code> - 捕获组</div>
              <div><code>(?:...)</code> - 非捕获组</div>
              <div><code>(?&lt;name&gt;...)</code> - 命名捕获组</div>
              <div><code>\1, \2</code> - 反向引用</div>
              <div><code>\k&lt;name&gt;</code> - 命名反向引用</div>
            </div>
          </div>
          
          <!-- 特殊字符 -->
          <div>
            <h4 class="font-medium mb-2">特殊字符</h4>
            <div class="space-y-1 font-mono text-xs">
              <div><code>\n</code> - 换行符</div>
              <div><code>\r</code> - 回车符</div>
              <div><code>\t</code> - 制表符</div>
              <div><code>\v</code> - 垂直制表符</div>
              <div><code>\0</code> - null 字符</div>
              <div><code>\xhh</code> - 十六进制字符</div>
              <div><code>\uhhhh</code> - Unicode 字符</div>
            </div>
          </div>
          
          <!-- 转义字符 -->
          <div>
            <h4 class="font-medium mb-2">需要转义的字符</h4>
            <div class="space-y-1 font-mono text-xs">
              <div><code>\ ^ $ . * + ? ( ) [ ] { } |</code></div>
              <div>使用反斜杠 <code>\</code> 转义</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  Document,
  Delete,
  ArrowDown
} from '@element-plus/icons-vue'

// 活动标签
const activeTab = ref('match')

// 正则表达式相关
const pattern = ref('')
const flags = ref('')
const flagOptions = ref({
  g: false,
  i: false,
  m: false,
  s: false,
  u: false,
  y: false
})
const regexError = ref('')

// 测试文本
const testText = ref('')

// 匹配结果
interface Match {
  value: string
  index: number
  groups?: string[]
}
const matches = ref<Match[]>([])
const highlightedText = ref('')

// 替换相关
const replacePattern = ref('')
const replaceResult = ref<string | null>(null)
const replaceCount = ref(0)

// 分割相关
const splitLimit = ref(0)
const splitResult = ref<string[]>([])

// 常用正则表达式
const commonPatterns = [
  {
    name: '邮箱地址',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    description: '匹配标准邮箱格式',
    testText: 'user@example.com'
  },
  {
    name: '手机号码',
    pattern: '^1[3-9]\\d{9}$',
    description: '匹配中国大陆手机号',
    testText: '13812345678'
  },
  {
    name: 'URL 地址',
    pattern: 'https?://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?',
    description: '匹配 HTTP/HTTPS URL',
    testText: 'https://www.example.com/path?query=value'
  },
  {
    name: '身份证号',
    pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]$',
    description: '匹配18位身份证号',
    testText: '110101199001011234'
  },
  {
    name: 'IP 地址',
    pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
    description: '匹配 IPv4 地址',
    testText: '192.168.1.1'
  },
  {
    name: '日期格式',
    pattern: '^\\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\\d|3[01])$',
    description: '匹配 YYYY-MM-DD 格式',
    testText: '2024-01-01'
  },
  {
    name: '时间格式',
    pattern: '^([01]\\d|2[0-3]):[0-5]\\d(:[0-5]\\d)?$',
    description: '匹配 HH:MM 或 HH:MM:SS',
    testText: '12:30:45'
  },
  {
    name: '中文字符',
    pattern: '[\\u4e00-\\u9fa5]+',
    description: '匹配中文字符',
    testText: '你好世界'
  },
  {
    name: '邮政编码',
    pattern: '^[1-9]\\d{5}$',
    description: '匹配6位邮政编码',
    testText: '100000'
  },
  {
    name: '用户名',
    pattern: '^[a-zA-Z][a-zA-Z0-9_]{3,15}$',
    description: '字母开头，4-16位字母数字下划线',
    testText: 'user_name123'
  },
  {
    name: '密码强度',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
    description: '至少8位，包含大小写字母和数字',
    testText: 'Password123'
  },
  {
    name: 'HTML 标签',
    pattern: '<([a-zA-Z]+)([^>]*)>.*?</\\1>',
    description: '匹配成对的 HTML 标签',
    testText: '<div class="test">content</div>'
  }
]

// 更新标志
const updateFlags = () => {
  const flagArray: string[] = []
  if (flagOptions.value.g) flagArray.push('g')
  if (flagOptions.value.i) flagArray.push('i')
  if (flagOptions.value.m) flagArray.push('m')
  if (flagOptions.value.s) flagArray.push('s')
  if (flagOptions.value.u) flagArray.push('u')
  if (flagOptions.value.y) flagArray.push('y')
  flags.value = flagArray.join('')
  testRegex()
}

// 测试正则表达式
const testRegex = () => {
  matches.value = []
  highlightedText.value = ''
  regexError.value = ''
  
  if (!pattern.value || !testText.value) {
    return
  }
  
  try {
    const regex = new RegExp(pattern.value, flags.value)
    const allMatches: Match[] = []
    
    if (flags.value.includes('g')) {
      // 全局匹配
      let match
      while ((match = regex.exec(testText.value)) !== null) {
        allMatches.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1)
        })
      }
    } else {
      // 单次匹配
      const match = regex.exec(testText.value)
      if (match) {
        allMatches.push({
          value: match[0],
          index: match.index,
          groups: match.slice(1)
        })
      }
    }
    
    matches.value = allMatches
    
    // 生成高亮文本
    if (allMatches.length > 0) {
      let highlighted = testText.value
      const replacements: Array<{ start: number; end: number; text: string }> = []
      
      allMatches.forEach((match, index) => {
        const start = match.index
        const end = match.index + match.value.length
        replacements.push({
          start,
          end,
          text: `<span class="bg-yellow-200 px-1 rounded" title="匹配 ${index + 1}">${escapeHtml(match.value)}</span>`
        })
      })
      
      // 从后往前替换，避免位置偏移
      replacements.sort((a, b) => b.start - a.start)
      replacements.forEach(({ start, end, text }) => {
        highlighted = highlighted.substring(0, start) + text + highlighted.substring(end)
      })
      
      highlightedText.value = highlighted
    }
    
    // 如果在替换标签页，执行替换
    if (activeTab.value === 'replace') {
      doReplace()
    }
    
    // 如果在分割标签页，执行分割
    if (activeTab.value === 'split') {
      doSplit()
    }
  } catch (e) {
    regexError.value = e instanceof Error ? e.message : '无效的正则表达式'
  }
}

// 执行替换
const doReplace = () => {
  if (!pattern.value || !testText.value) {
    replaceResult.value = null
    return
  }
  
  try {
    const regex = new RegExp(pattern.value, flags.value)
    let count = 0
    
    const result = testText.value.replace(regex, (_match, ..._args) => {
      count++
      return replacePattern.value
    })
    
    replaceResult.value = result
    replaceCount.value = count
  } catch (e) {
    replaceResult.value = null
    replaceCount.value = 0
  }
}

// 执行分割
const doSplit = () => {
  if (!pattern.value || !testText.value) {
    splitResult.value = []
    return
  }
  
  try {
    const regex = new RegExp(pattern.value, flags.value)
    const parts = testText.value.split(regex)
    
    if (splitLimit.value > 0) {
      splitResult.value = parts.slice(0, splitLimit.value)
    } else {
      splitResult.value = parts
    }
  } catch (e) {
    splitResult.value = []
  }
}

// 使用示例模式
const usePattern = (example: typeof commonPatterns[0]) => {
  pattern.value = example.pattern
  testText.value = example.testText
  
  // 根据模式设置合适的标志
  if (example.name === 'HTML 标签') {
    flagOptions.value.g = true
    flagOptions.value.s = true
  } else if (example.name === '中文字符') {
    flagOptions.value.g = true
  } else {
    flagOptions.value.g = false
  }
  
  updateFlags()
}

// 加载示例
const loadExample = () => {
  const example = commonPatterns[0]
  usePattern(example)
}

// 清空所有
const clearAll = () => {
  pattern.value = ''
  testText.value = ''
  replacePattern.value = ''
  replaceResult.value = null
  splitResult.value = []
  matches.value = []
  highlightedText.value = ''
  regexError.value = ''
  
  // 重置标志
  flagOptions.value = {
    g: false,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false
  }
  flags.value = ''
}

// HTML 转义
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// 监听标签切换
watch(activeTab, () => {
  if (activeTab.value === 'replace') {
    doReplace()
  } else if (activeTab.value === 'split') {
    doSplit()
  }
})
</script>

<style scoped>
:deep(.el-input__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

.font-mono {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>