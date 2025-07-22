<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">时间戳转换</h1>
    
    <el-tabs v-model="activeTab" class="mb-4">
      <el-tab-pane label="时间戳转换" name="converter">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Unix 时间戳转日期 -->
          <el-card>
            <template #header>
              <div class="flex items-center justify-between">
                <span>Unix 时间戳转日期</span>
                <el-button type="primary" size="small" @click="getCurrentTimestamp">
                  获取当前时间戳
                </el-button>
              </div>
            </template>
            
            <el-form label-position="top">
              <el-form-item label="Unix 时间戳">
                <el-input
                  v-model="timestampInput"
                  placeholder="例如：1640995200"
                  @input="convertFromTimestamp"
                >
                  <template #append>
                    <el-select v-model="timestampUnit" @change="handleUnitChange" style="width: 100px">
                      <el-option label="秒" value="seconds" />
                      <el-option label="毫秒" value="milliseconds" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="时区">
                <el-select v-model="selectedTimezone" @change="convertFromTimestamp" filterable>
                  <el-option
                    v-for="tz in timezones"
                    :key="tz.value"
                    :label="tz.label"
                    :value="tz.value"
                  />
                </el-select>
              </el-form-item>
              
              <div v-if="timestampResult" class="mt-4 space-y-2">
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">本地时间</div>
                  <div class="font-mono">{{ timestampResult.local }}</div>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">UTC 时间</div>
                  <div class="font-mono">{{ timestampResult.utc }}</div>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">ISO 8601</div>
                  <div class="font-mono">{{ timestampResult.iso }}</div>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">相对时间</div>
                  <div class="font-mono">{{ timestampResult.relative }}</div>
                </div>
              </div>
            </el-form>
          </el-card>
          
          <!-- 日期转 Unix 时间戳 -->
          <el-card>
            <template #header>
              <div class="flex items-center justify-between">
                <span>日期转 Unix 时间戳</span>
                <el-button type="primary" size="small" @click="setCurrentDateTime">
                  使用当前时间
                </el-button>
              </div>
            </template>
            
            <el-form label-position="top">
              <el-form-item label="日期时间">
                <el-date-picker
                  v-model="dateInput"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  @change="convertFromDate"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item label="或输入日期字符串">
                <el-input
                  v-model="dateStringInput"
                  placeholder="例如：2022-01-01 00:00:00"
                  @input="parseAndConvertDate"
                />
              </el-form-item>
              
              <div v-if="dateResult" class="mt-4 space-y-2">
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">Unix 时间戳（秒）</div>
                  <div class="font-mono text-lg">{{ dateResult.seconds }}</div>
                  <el-button
                    type="text"
                    size="small"
                    @click="copyToClipboard(dateResult.seconds)"
                    class="mt-1"
                  >
                    复制
                  </el-button>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">Unix 时间戳（毫秒）</div>
                  <div class="font-mono text-lg">{{ dateResult.milliseconds }}</div>
                  <el-button
                    type="text"
                    size="small"
                    @click="copyToClipboard(dateResult.milliseconds)"
                    class="mt-1"
                  >
                    复制
                  </el-button>
                </div>
              </div>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="日期格式化" name="formatter">
        <el-card>
          <el-form label-position="top">
            <el-form-item label="输入日期">
              <el-date-picker
                v-model="formatDateInput"
                type="datetime"
                placeholder="选择日期时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="formatDate"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="自定义格式">
              <el-input
                v-model="customFormat"
                placeholder="例如：YYYY-MM-DD HH:mm:ss"
                @input="formatDate"
              >
                <template #append>
                  <el-button @click="showFormatHelp = true">格式说明</el-button>
                </template>
              </el-input>
            </el-form-item>
            
            <div v-if="formatResult" class="mt-4">
              <h3 class="text-lg font-semibold mb-3">格式化结果</h3>
              <div class="space-y-2">
                <div v-for="(value, format) in formatResult" :key="format" class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">{{ format }}</div>
                  <div class="font-mono">{{ value }}</div>
                  <el-button
                    type="text"
                    size="small"
                    @click="copyToClipboard(value)"
                    class="mt-1"
                  >
                    复制
                  </el-button>
                </div>
              </div>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="日期计算" name="calculator">
        <el-card>
          <el-form label-position="top">
            <el-form-item label="起始日期">
              <el-date-picker
                v-model="calcStartDate"
                type="datetime"
                placeholder="选择起始日期"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="calculateDateDiff"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="结束日期">
              <el-date-picker
                v-model="calcEndDate"
                type="datetime"
                placeholder="选择结束日期"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="calculateDateDiff"
                style="width: 100%"
              />
            </el-form-item>
            
            <div v-if="calcResult" class="mt-4">
              <h3 class="text-lg font-semibold mb-3">时间差</h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">总天数</div>
                  <div class="font-mono text-lg">{{ calcResult.days }}</div>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">总小时数</div>
                  <div class="font-mono text-lg">{{ calcResult.hours }}</div>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">总分钟数</div>
                  <div class="font-mono text-lg">{{ calcResult.minutes }}</div>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <div class="text-sm text-gray-600">总秒数</div>
                  <div class="font-mono text-lg">{{ calcResult.seconds }}</div>
                </div>
              </div>
              
              <div class="mt-4 p-3 bg-blue-50 rounded">
                <div class="text-sm text-gray-600 mb-1">详细时间差</div>
                <div class="font-mono">
                  {{ calcResult.years }} 年 {{ calcResult.months }} 月 {{ calcResult.remainingDays }} 天
                  {{ calcResult.remainingHours }} 小时 {{ calcResult.remainingMinutes }} 分钟
                  {{ calcResult.remainingSeconds }} 秒
                </div>
              </div>
            </div>
          </el-form>
          
          <el-divider />
          
          <h3 class="text-lg font-semibold mb-3">日期加减</h3>
          <el-form label-position="top">
            <el-form-item label="基准日期">
              <el-date-picker
                v-model="addBaseDate"
                type="datetime"
                placeholder="选择基准日期"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="calculateAddDate"
                style="width: 100%"
              />
            </el-form-item>
            
            <el-form-item label="加减数值">
              <el-input v-model.number="addValue" @input="calculateAddDate">
                <template #append>
                  <el-select v-model="addUnit" @change="calculateAddDate" style="width: 100px">
                    <el-option label="年" value="years" />
                    <el-option label="月" value="months" />
                    <el-option label="天" value="days" />
                    <el-option label="小时" value="hours" />
                    <el-option label="分钟" value="minutes" />
                    <el-option label="秒" value="seconds" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            
            <div v-if="addResult" class="mt-4 p-3 bg-green-50 rounded">
              <div class="text-sm text-gray-600 mb-1">计算结果</div>
              <div class="font-mono text-lg">{{ addResult }}</div>
            </div>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 格式说明对话框 -->
    <el-dialog v-model="showFormatHelp" title="日期格式说明" width="600px">
      <div class="space-y-2">
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="font-mono bg-gray-100 p-2 rounded">YYYY</div>
          <div class="p-2">4位年份（2024）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">YY</div>
          <div class="p-2">2位年份（24）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">MM</div>
          <div class="p-2">2位月份（01-12）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">M</div>
          <div class="p-2">月份（1-12）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">DD</div>
          <div class="p-2">2位日期（01-31）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">D</div>
          <div class="p-2">日期（1-31）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">HH</div>
          <div class="p-2">2位小时（00-23）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">H</div>
          <div class="p-2">小时（0-23）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">mm</div>
          <div class="p-2">2位分钟（00-59）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">m</div>
          <div class="p-2">分钟（0-59）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">ss</div>
          <div class="p-2">2位秒（00-59）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">s</div>
          <div class="p-2">秒（0-59）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">SSS</div>
          <div class="p-2">3位毫秒（000-999）</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">A</div>
          <div class="p-2">AM/PM</div>
          
          <div class="font-mono bg-gray-100 p-2 rounded">a</div>
          <div class="p-2">am/pm</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 活动标签
const activeTab = ref('converter')

// 时间戳转换相关
const timestampInput = ref('')
const timestampUnit = ref('seconds')
const selectedTimezone = ref('local')
const timestampResult = ref<any>(null)

// 日期转时间戳相关
const dateInput = ref('')
const dateStringInput = ref('')
const dateResult = ref<any>(null)

// 日期格式化相关
const formatDateInput = ref('')
const customFormat = ref('YYYY-MM-DD HH:mm:ss')
const formatResult = ref<any>(null)
const showFormatHelp = ref(false)

// 日期计算相关
const calcStartDate = ref('')
const calcEndDate = ref('')
const calcResult = ref<any>(null)

// 日期加减相关
const addBaseDate = ref('')
const addValue = ref(0)
const addUnit = ref('days')
const addResult = ref('')

// 时区列表
const timezones = [
  { label: '本地时区', value: 'local' },
  { label: 'UTC', value: 'UTC' },
  { label: '北京时间 (UTC+8)', value: 'Asia/Shanghai' },
  { label: '东京时间 (UTC+9)', value: 'Asia/Tokyo' },
  { label: '纽约时间 (UTC-5)', value: 'America/New_York' },
  { label: '伦敦时间 (UTC+0)', value: 'Europe/London' },
  { label: '巴黎时间 (UTC+1)', value: 'Europe/Paris' },
  { label: '悉尼时间 (UTC+10)', value: 'Australia/Sydney' },
]

// 获取当前时间戳
const getCurrentTimestamp = () => {
  const now = Date.now()
  timestampInput.value = timestampUnit.value === 'seconds' 
    ? Math.floor(now / 1000).toString()
    : now.toString()
  convertFromTimestamp()
}

// 处理单位切换
const handleUnitChange = () => {
  if (!timestampInput.value) {
    convertFromTimestamp()
    return
  }
  
  const currentValue = parseInt(timestampInput.value)
  if (isNaN(currentValue)) {
    convertFromTimestamp()
    return
  }
  
  // 判断当前值的单位并转换
  if (timestampUnit.value === 'seconds') {
    // 切换到秒，需要将毫秒转换为秒
    timestampInput.value = Math.floor(currentValue / 1000).toString()
  } else {
    // 切换到毫秒，需要将秒转换为毫秒
    timestampInput.value = (currentValue * 1000).toString()
  }
  
  convertFromTimestamp()
}

// 设置当前日期时间
const setCurrentDateTime = () => {
  const now = new Date()
  dateInput.value = formatDateTime(now, 'YYYY-MM-DD HH:mm:ss')
  convertFromDate()
}

// 从时间戳转换
const convertFromTimestamp = () => {
  if (!timestampInput.value) {
    timestampResult.value = null
    return
  }
  
  try {
    const timestamp = parseInt(timestampInput.value)
    if (isNaN(timestamp)) {
      throw new Error('无效的时间戳')
    }
    
    const date = new Date(timestampUnit.value === 'seconds' ? timestamp * 1000 : timestamp)
    
    if (isNaN(date.getTime())) {
      throw new Error('无效的时间戳')
    }
    
    timestampResult.value = {
      local: date.toLocaleString('zh-CN', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: getRelativeTime(date)
    }
  } catch (error: any) {
    ElMessage.error(error.message)
    timestampResult.value = null
  }
}

// 从日期转换
const convertFromDate = () => {
  if (!dateInput.value) {
    dateResult.value = null
    return
  }
  
  try {
    const date = new Date(dateInput.value)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期')
    }
    
    dateResult.value = {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime()
    }
  } catch (error: any) {
    ElMessage.error(error.message)
    dateResult.value = null
  }
}

// 解析并转换日期字符串
const parseAndConvertDate = () => {
  if (!dateStringInput.value) {
    dateResult.value = null
    return
  }
  
  try {
    const date = new Date(dateStringInput.value)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }
    
    dateInput.value = formatDateTime(date, 'YYYY-MM-DD HH:mm:ss')
    dateResult.value = {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime()
    }
  } catch (error: any) {
    ElMessage.error(error.message)
    dateResult.value = null
  }
}

// 格式化日期
const formatDate = () => {
  if (!formatDateInput.value) {
    formatResult.value = null
    return
  }
  
  try {
    const date = new Date(formatDateInput.value)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期')
    }
    
    formatResult.value = {
      'ISO 8601': date.toISOString(),
      'UTC': date.toUTCString(),
      '本地时间': date.toLocaleString('zh-CN'),
      '日期': date.toLocaleDateString('zh-CN'),
      '时间': date.toLocaleTimeString('zh-CN'),
      'Unix 时间戳（秒）': Math.floor(date.getTime() / 1000),
      'Unix 时间戳（毫秒）': date.getTime(),
      '自定义格式': formatDateTime(date, customFormat.value)
    }
  } catch (error: any) {
    ElMessage.error(error.message)
    formatResult.value = null
  }
}

// 计算日期差
const calculateDateDiff = () => {
  if (!calcStartDate.value || !calcEndDate.value) {
    calcResult.value = null
    return
  }
  
  try {
    const start = new Date(calcStartDate.value)
    const end = new Date(calcEndDate.value)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('无效的日期')
    }
    
    const diff = end.getTime() - start.getTime()
    const absDiff = Math.abs(diff)
    
    const seconds = Math.floor(absDiff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    // 计算详细的年月日时分秒
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    const remainingDays = days % 30
    const remainingHours = hours % 24
    const remainingMinutes = minutes % 60
    const remainingSeconds = seconds % 60
    
    calcResult.value = {
      days: diff < 0 ? -days : days,
      hours: diff < 0 ? -hours : hours,
      minutes: diff < 0 ? -minutes : minutes,
      seconds: diff < 0 ? -seconds : seconds,
      years,
      months,
      remainingDays,
      remainingHours,
      remainingMinutes,
      remainingSeconds
    }
  } catch (error: any) {
    ElMessage.error(error.message)
    calcResult.value = null
  }
}

// 计算日期加减
const calculateAddDate = () => {
  if (!addBaseDate.value || addValue.value === null) {
    addResult.value = ''
    return
  }
  
  try {
    const date = new Date(addBaseDate.value)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期')
    }
    
    const result = new Date(date)
    
    switch (addUnit.value) {
      case 'years':
        result.setFullYear(result.getFullYear() + addValue.value)
        break
      case 'months':
        result.setMonth(result.getMonth() + addValue.value)
        break
      case 'days':
        result.setDate(result.getDate() + addValue.value)
        break
      case 'hours':
        result.setHours(result.getHours() + addValue.value)
        break
      case 'minutes':
        result.setMinutes(result.getMinutes() + addValue.value)
        break
      case 'seconds':
        result.setSeconds(result.getSeconds() + addValue.value)
        break
    }
    
    addResult.value = formatDateTime(result, 'YYYY-MM-DD HH:mm:ss')
  } catch (error: any) {
    ElMessage.error(error.message)
    addResult.value = ''
  }
}

// 格式化日期时间
const formatDateTime = (date: Date, format: string): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  
  const replacements: Record<string, string> = {
    'YYYY': year.toString(),
    'YY': year.toString().slice(-2),
    'MM': month.toString().padStart(2, '0'),
    'M': month.toString(),
    'DD': day.toString().padStart(2, '0'),
    'D': day.toString(),
    'HH': hours.toString().padStart(2, '0'),
    'H': hours.toString(),
    'mm': minutes.toString().padStart(2, '0'),
    'm': minutes.toString(),
    'ss': seconds.toString().padStart(2, '0'),
    's': seconds.toString(),
    'SSS': milliseconds.toString().padStart(3, '0'),
    'A': hours >= 12 ? 'PM' : 'AM',
    'a': hours >= 12 ? 'pm' : 'am'
  }
  
  let result = format
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, 'g'), value)
  }
  
  return result
}

// 获取相对时间
const getRelativeTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const absDiff = Math.abs(diff)
  
  const seconds = Math.floor(absDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  let result = ''
  
  if (years > 0) {
    result = `${years} 年`
  } else if (months > 0) {
    result = `${months} 个月`
  } else if (days > 0) {
    result = `${days} 天`
  } else if (hours > 0) {
    result = `${hours} 小时`
  } else if (minutes > 0) {
    result = `${minutes} 分钟`
  } else {
    result = `${seconds} 秒`
  }
  
  return diff < 0 ? `${result}后` : `${result}前`
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text.toString())
    ElMessage.success('已复制到剪贴板')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 16px;
}

.el-card {
  margin-bottom: 20px;
}
</style>