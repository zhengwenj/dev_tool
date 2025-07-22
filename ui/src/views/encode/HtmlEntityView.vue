<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">HTML 实体转换</h1>
        <p class="text-gray-600">在线 HTML 实体编码和解码工具，支持命名实体和数字实体</p>
      </div>
      
      <!-- 转换模式选择 -->
      <div class="mb-6">
        <el-radio-group v-model="entityMode" size="large">
          <el-radio-button value="named">命名实体</el-radio-button>
          <el-radio-button value="numeric">数字实体</el-radio-button>
          <el-radio-button value="hex">十六进制实体</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex justify-center space-x-4 mb-6">
        <el-button type="primary" size="large" @click="encode">
          <el-icon class="mr-2"><Lock /></el-icon>
          编码 (文本 → HTML实体)
        </el-button>
        <el-button type="success" size="large" @click="decode">
          <el-icon class="mr-2"><Unlock /></el-icon>
          解码 (HTML实体 → 文本)
        </el-button>
        <el-button size="large" @click="swap">
          <el-icon class="mr-2"><Switch /></el-icon>
          交换
        </el-button>
        <el-button size="large" @click="clear">
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
            v-model="input"
            type="textarea"
            :rows="15"
            placeholder="在此输入要转换的内容..."
            class="font-mono"
          />
          
          <!-- 编码选项 -->
          <div class="space-y-2">
            <el-checkbox v-model="encodeQuotes" size="small">
              编码引号 (" 和 ')
            </el-checkbox>
            <el-checkbox v-model="encodeNonAscii" size="small">
              编码所有非 ASCII 字符
            </el-checkbox>
            <el-checkbox v-model="preserveNewlines" size="small">
              保留换行符
            </el-checkbox>
          </div>
        </div>
        
        <!-- 输出区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">输出</h3>
            <el-button size="small" @click="copyOutput" :disabled="!output">
              <el-icon class="mr-1"><CopyDocument /></el-icon>
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
          
          <!-- 预览 -->
          <div v-if="output" class="mt-4">
            <h4 class="text-sm font-medium mb-2">HTML 预览:</h4>
            <div class="bg-gray-50 rounded p-4 border" v-html="output"></div>
          </div>
        </div>
      </div>
      
      <!-- 常用 HTML 实体参考 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">常用 HTML 实体参考</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="entity in commonEntities" :key="entity.char" 
               class="bg-white rounded p-3 border">
            <div class="flex items-center justify-between mb-2">
              <span class="text-2xl">{{ entity.char }}</span>
              <el-button size="small" text @click="insertEntity(entity)">
                插入
              </el-button>
            </div>
            <div class="text-sm space-y-1">
              <p class="font-mono text-blue-600">{{ entity.named }}</p>
              <p class="font-mono text-green-600">{{ entity.numeric }}</p>
              <p class="text-xs text-gray-600">{{ entity.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 特殊字符集 -->
      <div class="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">特殊字符集</h3>
        <div class="space-y-4">
          <!-- 数学符号 -->
          <div>
            <h4 class="font-medium mb-2">数学符号</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="char in mathSymbols" :key="char.char"
                    class="bg-white px-3 py-1 rounded border cursor-pointer hover:bg-gray-50"
                    @click="insertChar(char.char)"
                    :title="char.name">
                {{ char.char }}
              </span>
            </div>
          </div>
          
          <!-- 货币符号 -->
          <div>
            <h4 class="font-medium mb-2">货币符号</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="char in currencySymbols" :key="char.char"
                    class="bg-white px-3 py-1 rounded border cursor-pointer hover:bg-gray-50"
                    @click="insertChar(char.char)"
                    :title="char.name">
                {{ char.char }}
              </span>
            </div>
          </div>
          
          <!-- 箭头符号 -->
          <div>
            <h4 class="font-medium mb-2">箭头符号</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="char in arrowSymbols" :key="char.char"
                    class="bg-white px-3 py-1 rounded border cursor-pointer hover:bg-gray-50"
                    @click="insertChar(char.char)"
                    :title="char.name">
                {{ char.char }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 功能说明 -->
      <div class="mt-6 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">HTML 实体说明</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 class="font-medium mb-2">什么是 HTML 实体？</h4>
            <p class="text-gray-600 mb-3">
              HTML 实体是用于在 HTML 中表示特殊字符的编码方式。
              它们以 & 开始，以 ; 结束，用于显示保留字符或不可见字符。
            </p>
            <h4 class="font-medium mb-2">实体类型</h4>
            <ul class="space-y-1 text-gray-600">
              <li><strong>命名实体:</strong> 如 &amp;lt; 表示 &lt;</li>
              <li><strong>数字实体:</strong> 如 &amp;#60; 表示 &lt;</li>
              <li><strong>十六进制实体:</strong> 如 &amp;#x3C; 表示 &lt;</li>
            </ul>
          </div>
          <div>
            <h4 class="font-medium mb-2">使用场景</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• 在 HTML 中显示 &lt;、&gt;、&amp; 等保留字符</li>
              <li>• 显示版权符号、商标符号等特殊字符</li>
              <li>• 在属性值中使用引号</li>
              <li>• 显示不可见字符或空白字符</li>
              <li>• 确保特殊字符在所有浏览器中正确显示</li>
            </ul>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-yellow-50 rounded text-sm">
          <p class="text-yellow-800">
            <strong>提示:</strong> 在 HTML5 中，除了 &lt;、&gt;、&amp; 和引号外，
            大多数字符可以直接使用而无需编码。但使用实体可以确保更好的兼容性。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Lock,
  Unlock,
  Switch,
  Delete,
  DocumentCopy,
  Document,
  CopyDocument
} from '@element-plus/icons-vue'

// 实体模式
type EntityMode = 'named' | 'numeric' | 'hex'
const entityMode = ref<EntityMode>('named')

// 输入输出
const input = ref('')
const output = ref('')

// 选项
const encodeQuotes = ref(true)
const encodeNonAscii = ref(false)
const preserveNewlines = ref(true)

// HTML 实体映射表
const namedEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
  ' ': '&nbsp;',
  '¡': '&iexcl;',
  '¢': '&cent;',
  '£': '&pound;',
  '¤': '&curren;',
  '¥': '&yen;',
  '¦': '&brvbar;',
  '§': '&sect;',
  '¨': '&uml;',
  '©': '&copy;',
  'ª': '&ordf;',
  '«': '&laquo;',
  '¬': '&not;',
  '­': '&shy;',
  '®': '&reg;',
  '¯': '&macr;',
  '°': '&deg;',
  '±': '&plusmn;',
  '²': '&sup2;',
  '³': '&sup3;',
  '´': '&acute;',
  'µ': '&micro;',
  '¶': '&para;',
  '·': '&middot;',
  '¸': '&cedil;',
  '¹': '&sup1;',
  'º': '&ordm;',
  '»': '&raquo;',
  '¼': '&frac14;',
  '½': '&frac12;',
  '¾': '&frac34;',
  '¿': '&iquest;',
  '×': '&times;',
  '÷': '&divide;',
  '–': '&ndash;',
  '—': '&mdash;',
  // 使用 Unicode 转义序列避免解析错误
  '\u2018': '&lsquo;', // '
  '\u2019': '&rsquo;', // '
  '\u201C': '&ldquo;', // "
  '\u201D': '&rdquo;', // "
  '•': '&bull;',
  '…': '&hellip;',
  '€': '&euro;',
  '™': '&trade;',
  '←': '&larr;',
  '↑': '&uarr;',
  '→': '&rarr;',
  '↓': '&darr;',
  '↔': '&harr;',
  '⇐': '&lArr;',
  '⇑': '&uArr;',
  '⇒': '&rArr;',
  '⇓': '&dArr;',
  '⇔': '&hArr;',
  '∀': '&forall;',
  '∂': '&part;',
  '∃': '&exist;',
  '∅': '&empty;',
  '∇': '&nabla;',
  '∈': '&isin;',
  '∉': '&notin;',
  '∋': '&ni;',
  '∏': '&prod;',
  '∑': '&sum;',
  '−': '&minus;',
  '∗': '&lowast;',
  '√': '&radic;',
  '∝': '&prop;',
  '∞': '&infin;',
  '∠': '&ang;',
  '∧': '&and;',
  '∨': '&or;',
  '∩': '&cap;',
  '∪': '&cup;',
  '∫': '&int;',
  '∴': '&there4;',
  '∼': '&sim;',
  '≅': '&cong;',
  '≈': '&asymp;',
  '≠': '&ne;',
  '≡': '&equiv;',
  '≤': '&le;',
  '≥': '&ge;',
  '⊂': '&sub;',
  '⊃': '&sup;',
  '⊄': '&nsub;',
  '⊆': '&sube;',
  '⊇': '&supe;',
  '⊕': '&oplus;',
  '⊗': '&otimes;',
  '⊥': '&perp;',
  '⋅': '&sdot;'
}

// 反向映射表（用于解码）
const reverseNamedEntities: Record<string, string> = Object.entries(namedEntities)
  .reduce((acc, [char, entity]) => {
    acc[entity] = char
    return acc
  }, {} as Record<string, string>)

// 常用实体
const commonEntities = [
  { char: '<', named: '&lt;', numeric: '&#60;', description: '小于号' },
  { char: '>', named: '&gt;', numeric: '&#62;', description: '大于号' },
  { char: '&', named: '&amp;', numeric: '&#38;', description: '和号' },
  { char: '"', named: '&quot;', numeric: '&#34;', description: '双引号' },
  { char: "'", named: '&apos;', numeric: '&#39;', description: '单引号' },
  { char: ' ', named: '&nbsp;', numeric: '&#160;', description: '不换行空格' },
  { char: '©', named: '&copy;', numeric: '&#169;', description: '版权符号' },
  { char: '®', named: '&reg;', numeric: '&#174;', description: '注册商标' },
  { char: '™', named: '&trade;', numeric: '&#8482;', description: '商标' },
  { char: '€', named: '&euro;', numeric: '&#8364;', description: '欧元' },
  { char: '¥', named: '&yen;', numeric: '&#165;', description: '日元/人民币' },
  { char: '°', named: '&deg;', numeric: '&#176;', description: '度' }
]

// 数学符号
const mathSymbols = [
  { char: '±', name: '正负号' },
  { char: '×', name: '乘号' },
  { char: '÷', name: '除号' },
  { char: '≠', name: '不等于' },
  { char: '≤', name: '小于等于' },
  { char: '≥', name: '大于等于' },
  { char: '∞', name: '无穷' },
  { char: '√', name: '平方根' },
  { char: '∑', name: '求和' },
  { char: '∏', name: '求积' },
  { char: '∫', name: '积分' },
  { char: '∂', name: '偏导数' }
]

// 货币符号
const currencySymbols = [
  { char: '$', name: '美元' },
  { char: '€', name: '欧元' },
  { char: '£', name: '英镑' },
  { char: '¥', name: '日元/人民币' },
  { char: '₹', name: '印度卢比' },
  { char: '₽', name: '俄罗斯卢布' },
  { char: '₩', name: '韩元' },
  { char: '¢', name: '美分' }
]

// 箭头符号
const arrowSymbols = [
  { char: '←', name: '左箭头' },
  { char: '→', name: '右箭头' },
  { char: '↑', name: '上箭头' },
  { char: '↓', name: '下箭头' },
  { char: '↔', name: '左右箭头' },
  { char: '⇐', name: '双线左箭头' },
  { char: '⇒', name: '双线右箭头' },
  { char: '⇔', name: '双线左右箭头' }
]

// 编码
const encode = () => {
  try {
    if (!input.value) {
      ElMessage.warning('请输入要编码的内容')
      return
    }
    
    let result = ''
    
    for (const char of input.value) {
      const charCode = char.charCodeAt(0)
      
      // 处理换行符
      if (preserveNewlines.value && (char === '\n' || char === '\r')) {
        result += char
        continue
      }
      
      // 必须编码的字符
      if (char === '&' || char === '<' || char === '>') {
        if (entityMode.value === 'named' && namedEntities[char]) {
          result += namedEntities[char]
        } else if (entityMode.value === 'numeric') {
          result += `&#${charCode};`
        } else {
          result += `&#x${charCode.toString(16).toUpperCase()};`
        }
        continue
      }
      
      // 引号
      if (encodeQuotes.value && (char === '"' || char === "'")) {
        if (entityMode.value === 'named' && namedEntities[char]) {
          result += namedEntities[char]
        } else if (entityMode.value === 'numeric') {
          result += `&#${charCode};`
        } else {
          result += `&#x${charCode.toString(16).toUpperCase()};`
        }
        continue
      }
      
      // 非 ASCII 字符
      if (encodeNonAscii.value && charCode > 127) {
        if (entityMode.value === 'named' && namedEntities[char]) {
          result += namedEntities[char]
        } else if (entityMode.value === 'numeric') {
          result += `&#${charCode};`
        } else {
          result += `&#x${charCode.toString(16).toUpperCase()};`
        }
        continue
      }
      
      // 其他在映射表中的字符
      if (entityMode.value === 'named' && namedEntities[char]) {
        result += namedEntities[char]
      } else if (charCode > 127 || (charCode < 32 && char !== '\n' && char !== '\r' && char !== '\t')) {
        // 特殊字符和控制字符
        if (entityMode.value === 'numeric') {
          result += `&#${charCode};`
        } else if (entityMode.value === 'hex') {
          result += `&#x${charCode.toString(16).toUpperCase()};`
        } else {
          result += char
        }
      } else {
        result += char
      }
    }
    
    output.value = result
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
    
    let result = input.value
    
    // 解码命名实体
    result = result.replace(/&[a-zA-Z]+;/g, (match) => {
      return reverseNamedEntities[match] || match
    })
    
    // 解码数字实体
    result = result.replace(/&#(\d+);/g, (_match, code) => {
      return String.fromCharCode(parseInt(code, 10))
    })
    
    // 解码十六进制实体
    result = result.replace(/&#x([0-9a-fA-F]+);/g, (_match, code) => {
      return String.fromCharCode(parseInt(code, 16))
    })
    
    output.value = result
    ElMessage.success('解码成功')
  } catch (e) {
    ElMessage.error('解码失败：' + (e instanceof Error ? e.message : '未知错误'))
  }
}

// 交换输入输出
const swap = () => {
  const temp = input.value
  input.value = output.value
  output.value = temp
}

// 清空
const clear = () => {
  input.value = ''
  output.value = ''
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
  input.value = `<h1>HTML 实体示例</h1>
<p>特殊字符: < > & " '</p>
<p>版权所有 © 2024 • 保留所有权利 ®</p>
<p>数学公式: x² + y² = r²</p>
<p>货币: $100 = €85 = ¥700</p>
<p>箭头: ← → ↑ ↓</p>`
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

// 插入实体
const insertEntity = (entity: typeof commonEntities[0]) => {
  let entityStr = ''
  switch (entityMode.value) {
    case 'named':
      entityStr = entity.named
      break
    case 'numeric':
      entityStr = entity.numeric
      break
    case 'hex':
      entityStr = `&#x${entity.char.charCodeAt(0).toString(16).toUpperCase()};`
      break
  }
  input.value += entityStr
}

// 插入字符
const insertChar = (char: string) => {
  input.value += char
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

.font-mono {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>