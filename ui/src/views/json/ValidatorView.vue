<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">JSON Schema 验证</h1>
        <p class="text-gray-600">使用 JSON Schema 验证 JSON 数据的结构和类型</p>
      </div>
      
      <!-- 主要内容区 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- JSON 数据输入 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">JSON 数据</h3>
            <div class="space-x-2">
              <el-button size="small" @click="handlePasteData">
                <el-icon class="mr-1"><DocumentCopy /></el-icon>
                粘贴
              </el-button>
              <el-button size="small" @click="loadDataExample">
                <el-icon class="mr-1"><Document /></el-icon>
                示例
              </el-button>
            </div>
          </div>
          
          <el-input
            v-model="jsonData"
            type="textarea"
            :rows="15"
            placeholder="在此输入要验证的 JSON 数据..."
            class="font-mono"
          />
        </div>
        
        <!-- JSON Schema 输入 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">JSON Schema</h3>
            <div class="space-x-2">
              <el-button size="small" @click="handlePasteSchema">
                <el-icon class="mr-1"><DocumentCopy /></el-icon>
                粘贴
              </el-button>
              <el-button size="small" @click="loadSchemaExample">
                <el-icon class="mr-1"><Document /></el-icon>
                示例
              </el-button>
            </div>
          </div>
          
          <el-input
            v-model="jsonSchema"
            type="textarea"
            :rows="15"
            placeholder="在此输入 JSON Schema..."
            class="font-mono"
          />
        </div>
      </div>
      
      <!-- 验证按钮 -->
      <div class="mt-6 text-center">
        <el-button type="primary" size="large" @click="handleValidate">
          <el-icon class="mr-2"><CircleCheck /></el-icon>
          验证数据
        </el-button>
        <el-button size="large" @click="handleClear">
          <el-icon class="mr-2"><Delete /></el-icon>
          清空全部
        </el-button>
      </div>
      
      <!-- 验证结果 -->
      <div v-if="validationResult" class="mt-6">
        <div v-if="validationResult.valid" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center mb-2">
            <el-icon class="text-green-600 text-2xl mr-2"><SuccessFilled /></el-icon>
            <h3 class="text-lg font-semibold text-green-800">验证通过</h3>
          </div>
          <p class="text-green-700">JSON 数据符合 Schema 定义的结构和类型要求。</p>
        </div>
        
        <div v-else class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-center mb-2">
            <el-icon class="text-red-600 text-2xl mr-2"><CircleCloseFilled /></el-icon>
            <h3 class="text-lg font-semibold text-red-800">验证失败</h3>
          </div>
          <div class="space-y-2">
            <div v-for="(error, index) in validationResult.errors" :key="index" 
                 class="bg-white rounded p-3 border border-red-200">
              <div class="flex items-start">
                <el-icon class="text-red-500 mt-0.5 mr-2"><WarningFilled /></el-icon>
                <div class="flex-1">
                  <p class="font-medium text-red-800">{{ error.message }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                    路径: <code class="bg-gray-100 px-1 rounded">{{ error.path || '/' }}</code>
                  </p>
                  <p v-if="error.schemaPath" class="text-sm text-gray-600">
                    Schema 路径: <code class="bg-gray-100 px-1 rounded">{{ error.schemaPath }}</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Schema 生成器 -->
      <div class="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">快速生成 Schema</h3>
        <p class="text-sm text-gray-600 mb-4">
          从 JSON 数据自动生成基础 Schema，您可以在此基础上进行修改和完善。
        </p>
        <el-button @click="generateSchema" :disabled="!jsonData.trim()">
          <el-icon class="mr-1"><MagicStick /></el-icon>
          从数据生成 Schema
        </el-button>
      </div>
      
      <!-- 常用 Schema 模板 -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-3">常用 Schema 模板</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="template in schemaTemplates" :key="template.name" 
               class="bg-white rounded-lg border p-4 cursor-pointer hover:border-blue-400 transition-colors"
               @click="loadTemplate(template)">
            <h4 class="font-medium mb-1">{{ template.name }}</h4>
            <p class="text-sm text-gray-600">{{ template.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- 功能说明 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-3">JSON Schema 功能</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>类型验证</strong> - 检查数据类型是否正确
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>结构验证</strong> - 验证必需字段和属性
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>格式验证</strong> - 检查日期、邮箱、URL 等格式
            </div>
          </div>
          <div class="flex items-start">
            <el-icon class="text-blue-500 mt-0.5 mr-2"><Check /></el-icon>
            <div>
              <strong>范围验证</strong> - 验证数值范围和字符串长度
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
  Document,
  CircleCheck,
  Delete,
  SuccessFilled,
  CircleCloseFilled,
  WarningFilled,
  Check,
  MagicStick
} from '@element-plus/icons-vue'

// 验证错误接口
interface ValidationError {
  path: string
  schemaPath?: string
  message: string
}

// 验证结果接口
interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

// 响应式数据
const jsonData = ref('')
const jsonSchema = ref('')
const validationResult = ref<ValidationResult | null>(null)

// Schema 模板
const schemaTemplates = [
  {
    name: '用户信息',
    description: '包含姓名、邮箱、年龄等字段',
    schema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "title": "用户信息",
      "required": ["name", "email"],
      "properties": {
        "name": {
          "type": "string",
          "minLength": 2,
          "maxLength": 50
        },
        "email": {
          "type": "string",
          "format": "email"
        },
        "age": {
          "type": "integer",
          "minimum": 0,
          "maximum": 150
        },
        "phone": {
          "type": "string",
          "pattern": "^1[3-9]\\d{9}$"
        }
      }
    },
    data: {
      "name": "张三",
      "email": "zhangsan@example.com",
      "age": 25,
      "phone": "13800138000"
    }
  },
  {
    name: '商品信息',
    description: '包含名称、价格、库存等',
    schema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "title": "商品信息",
      "required": ["id", "name", "price"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[A-Z]{3}-\\d{6}$"
        },
        "name": {
          "type": "string",
          "minLength": 1,
          "maxLength": 100
        },
        "price": {
          "type": "number",
          "minimum": 0,
          "multipleOf": 0.01
        },
        "stock": {
          "type": "integer",
          "minimum": 0
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "uniqueItems": true
        }
      }
    },
    data: {
      "id": "PRD-123456",
      "name": "示例商品",
      "price": 99.99,
      "stock": 100,
      "tags": ["热销", "新品"]
    }
  },
  {
    name: 'API 响应',
    description: '标准 API 响应格式',
    schema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "title": "API 响应",
      "required": ["code", "message"],
      "properties": {
        "code": {
          "type": "integer",
          "enum": [200, 400, 401, 403, 404, 500]
        },
        "message": {
          "type": "string"
        },
        "data": {
          "type": ["object", "array", "null"]
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    data: {
      "code": 200,
      "message": "请求成功",
      "data": {
        "id": 1,
        "name": "测试数据"
      },
      "timestamp": "2024-01-01T12:00:00Z"
    }
  }
]

// JSON Schema 验证器
class JSONSchemaValidator {
  validate(data: any, schema: any): ValidationResult {
    const errors: ValidationError[] = []
    
    try {
      this.validateValue(data, schema, '', '#', errors)
    } catch (e) {
      errors.push({
        path: '/',
        message: e instanceof Error ? e.message : '验证过程出错'
      })
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  private validateValue(value: any, schema: any, path: string, schemaPath: string, errors: ValidationError[]) {
    // 验证类型
    if (schema.type) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type]
      const actualType = this.getType(value)
      
      if (!types.includes(actualType) && !(actualType === 'null' && types.includes('null'))) {
        errors.push({
          path: path || '/',
          schemaPath: `${schemaPath}/type`,
          message: `期望类型为 ${types.join(' 或 ')}，实际为 ${actualType}`
        })
        return
      }
    }
    
    // 验证枚举值
    if (schema.enum && !schema.enum.includes(value)) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/enum`,
        message: `值必须是以下之一: ${schema.enum.join(', ')}`
      })
    }
    
    // 验证 const
    if (schema.const !== undefined && value !== schema.const) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/const`,
        message: `值必须等于 ${JSON.stringify(schema.const)}`
      })
    }
    
    // 根据类型进行特定验证
    const type = this.getType(value)
    
    switch (type) {
      case 'object':
        this.validateObject(value, schema, path, schemaPath, errors)
        break
      case 'array':
        this.validateArray(value, schema, path, schemaPath, errors)
        break
      case 'string':
        this.validateString(value, schema, path, schemaPath, errors)
        break
      case 'number':
        this.validateNumber(value, schema, path, schemaPath, errors)
        break
      case 'integer':
        this.validateNumber(value, schema, path, schemaPath, errors)
        break
      case 'boolean':
        // 布尔值不需要额外验证
        break
    }
  }
  
  private validateObject(obj: any, schema: any, path: string, schemaPath: string, errors: ValidationError[]) {
    // 验证必需属性
    if (schema.required) {
      for (const prop of schema.required) {
        if (!(prop in obj)) {
          errors.push({
            path: path || '/',
            schemaPath: `${schemaPath}/required`,
            message: `缺少必需属性: ${prop}`
          })
        }
      }
    }
    
    // 验证属性
    if (schema.properties) {
      for (const [prop, propSchema] of Object.entries(schema.properties)) {
        if (prop in obj) {
          this.validateValue(
            obj[prop],
            propSchema,
            path ? `${path}.${prop}` : prop,
            `${schemaPath}/properties/${prop}`,
            errors
          )
        }
      }
    }
    
    // 验证额外属性
    if (schema.additionalProperties === false) {
      const definedProps = Object.keys(schema.properties || {})
      for (const prop in obj) {
        if (!definedProps.includes(prop)) {
          errors.push({
            path: path ? `${path}.${prop}` : prop,
            schemaPath: `${schemaPath}/additionalProperties`,
            message: `不允许额外属性: ${prop}`
          })
        }
      }
    }
    
    // 验证属性数量
    if (schema.minProperties !== undefined && Object.keys(obj).length < schema.minProperties) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/minProperties`,
        message: `属性数量不能少于 ${schema.minProperties}`
      })
    }
    
    if (schema.maxProperties !== undefined && Object.keys(obj).length > schema.maxProperties) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/maxProperties`,
        message: `属性数量不能多于 ${schema.maxProperties}`
      })
    }
  }
  
  private validateArray(arr: any[], schema: any, path: string, schemaPath: string, errors: ValidationError[]) {
    // 验证数组项
    if (schema.items) {
      arr.forEach((item, index) => {
        this.validateValue(
          item,
          schema.items,
          path ? `${path}[${index}]` : `[${index}]`,
          `${schemaPath}/items`,
          errors
        )
      })
    }
    
    // 验证数组长度
    if (schema.minItems !== undefined && arr.length < schema.minItems) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/minItems`,
        message: `数组长度不能少于 ${schema.minItems}`
      })
    }
    
    if (schema.maxItems !== undefined && arr.length > schema.maxItems) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/maxItems`,
        message: `数组长度不能多于 ${schema.maxItems}`
      })
    }
    
    // 验证唯一性
    if (schema.uniqueItems) {
      const seen = new Set()
      for (let i = 0; i < arr.length; i++) {
        const itemStr = JSON.stringify(arr[i])
        if (seen.has(itemStr)) {
          errors.push({
            path: path ? `${path}[${i}]` : `[${i}]`,
            schemaPath: `${schemaPath}/uniqueItems`,
            message: `数组项必须唯一`
          })
        }
        seen.add(itemStr)
      }
    }
  }
  
  private validateString(str: string, schema: any, path: string, schemaPath: string, errors: ValidationError[]) {
    // 验证长度
    if (schema.minLength !== undefined && str.length < schema.minLength) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/minLength`,
        message: `字符串长度不能少于 ${schema.minLength}`
      })
    }
    
    if (schema.maxLength !== undefined && str.length > schema.maxLength) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/maxLength`,
        message: `字符串长度不能多于 ${schema.maxLength}`
      })
    }
    
    // 验证模式
    if (schema.pattern) {
      const regex = new RegExp(schema.pattern)
      if (!regex.test(str)) {
        errors.push({
          path: path || '/',
          schemaPath: `${schemaPath}/pattern`,
          message: `字符串不匹配模式: ${schema.pattern}`
        })
      }
    }
    
    // 验证格式
    if (schema.format) {
      switch (schema.format) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
            errors.push({
              path: path || '/',
              schemaPath: `${schemaPath}/format`,
              message: '不是有效的邮箱格式'
            })
          }
          break
        case 'uri':
        case 'url':
          try {
            new URL(str)
          } catch {
            errors.push({
              path: path || '/',
              schemaPath: `${schemaPath}/format`,
              message: '不是有效的 URL 格式'
            })
          }
          break
        case 'date':
          if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            errors.push({
              path: path || '/',
              schemaPath: `${schemaPath}/format`,
              message: '不是有效的日期格式 (YYYY-MM-DD)'
            })
          }
          break
        case 'date-time':
          if (isNaN(Date.parse(str))) {
            errors.push({
              path: path || '/',
              schemaPath: `${schemaPath}/format`,
              message: '不是有效的日期时间格式'
            })
          }
          break
      }
    }
  }
  
  private validateNumber(num: number, schema: any, path: string, schemaPath: string, errors: ValidationError[]) {
    // 验证整数
    if (schema.type === 'integer' && !Number.isInteger(num)) {
      errors.push({
        path: path || '/',
        schemaPath: `${schemaPath}/type`,
        message: '值必须是整数'
      })
    }
    
    // 验证最小值
    if (schema.minimum !== undefined) {
      if (schema.exclusiveMinimum && num <= schema.minimum) {
        errors.push({
          path: path || '/',
          schemaPath: `${schemaPath}/minimum`,
          message: `值必须大于 ${schema.minimum}`
        })
      } else if (num < schema.minimum) {
        errors.push({
          path: path || '/',
          schemaPath: `${schemaPath}/minimum`,
          message: `值不能小于 ${schema.minimum}`
        })
      }
    }
    
    // 验证最大值
    if (schema.maximum !== undefined) {
      if (schema.exclusiveMaximum && num >= schema.maximum) {
        errors.push({
          path: path || '/',
          schemaPath: `${schemaPath}/maximum`,
          message: `值必须小于 ${schema.maximum}`
        })
      } else if (num > schema.maximum) {
        errors.push({
          path: path || '/',
          schemaPath: `${schemaPath}/maximum`,
          message: `值不能大于 ${schema.maximum}`
        })
      }
    }
    
    // 验证倍数
    if (schema.multipleOf !== undefined) {
      if (num % schema.multipleOf !== 0) {
        errors.push({
          path: path || '/',
          schemaPath: `${schemaPath}/multipleOf`,
          message: `值必须是 ${schema.multipleOf} 的倍数`
        })
      }
    }
  }
  
  private getType(value: any): string {
    if (value === null) return 'null'
    if (Array.isArray(value)) return 'array'
    const type = typeof value
    if (type === 'number' && Number.isInteger(value)) return 'integer'
    return type
  }
}

// 创建验证器实例
const validator = new JSONSchemaValidator()

// 验证数据
const handleValidate = () => {
  try {
    // 解析 JSON 数据
    const data = JSON.parse(jsonData.value)
    
    // 解析 JSON Schema
    const schema = JSON.parse(jsonSchema.value)
    
    // 执行验证
    validationResult.value = validator.validate(data, schema)
    
    if (validationResult.value.valid) {
      ElMessage.success('验证通过！')
    } else {
      ElMessage.error(`验证失败，发现 ${validationResult.value.errors.length} 个错误`)
    }
  } catch (e) {
    ElMessage.error('JSON 格式错误：' + (e instanceof Error ? e.message : '未知错误'))
    validationResult.value = null
  }
}

// 清空所有内容
const handleClear = () => {
  jsonData.value = ''
  jsonSchema.value = ''
  validationResult.value = null
}

// 粘贴数据
const handlePasteData = async () => {
  try {
    const text = await navigator.clipboard.readText()
    jsonData.value = text
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 粘贴 Schema
const handlePasteSchema = async () => {
  try {
    const text = await navigator.clipboard.readText()
    jsonSchema.value = text
  } catch (e) {
    ElMessage.error('粘贴失败，请手动粘贴')
  }
}

// 加载数据示例
const loadDataExample = () => {
  jsonData.value = JSON.stringify({
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25,
    "phone": "13800138000"
  }, null, 2)
}

// 加载 Schema 示例
const loadSchemaExample = () => {
  jsonSchema.value = JSON.stringify({
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "用户信息",
    "required": ["name", "email"],
    "properties": {
      "name": {
        "type": "string",
        "minLength": 2,
        "maxLength": 50
      },
      "email": {
        "type": "string",
        "format": "email"
      },
      "age": {
        "type": "integer",
        "minimum": 0,
        "maximum": 150
      },
      "phone": {
        "type": "string",
        "pattern": "^1[3-9]\\d{9}$"
      }
    }
  }, null, 2)
}

// 加载模板
const loadTemplate = (template: typeof schemaTemplates[0]) => {
  jsonData.value = JSON.stringify(template.data, null, 2)
  jsonSchema.value = JSON.stringify(template.schema, null, 2)
  validationResult.value = null
}

// 从数据生成 Schema
const generateSchema = () => {
  try {
    const data = JSON.parse(jsonData.value)
    const schema = generateSchemaFromData(data)
    jsonSchema.value = JSON.stringify(schema, null, 2)
    ElMessage.success('Schema 生成成功！')
  } catch (e) {
    ElMessage.error('JSON 格式错误：' + (e instanceof Error ? e.message : '未知错误'))
  }
}

// 从数据生成 Schema 的函数
const generateSchemaFromData = (data: any): any => {
  const schema: any = {
    "$schema": "http://json-schema.org/draft-07/schema#"
  }
  
  const type = getDataType(data)
  schema.type = type
  
  switch (type) {
    case 'object':
      schema.properties = {}
      schema.required = []
      
      for (const [key, value] of Object.entries(data)) {
        schema.properties[key] = generateSchemaFromData(value)
        schema.required.push(key)
      }
      break
      
    case 'array':
      if (data.length > 0) {
        // 简化处理：假设数组中所有元素类型相同
        schema.items = generateSchemaFromData(data[0])
      }
      break
      
    case 'string':
      // 尝试检测格式
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
        schema.format = 'email'
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        schema.format = 'date'
      } else if (/^https?:\/\//.test(data)) {
        schema.format = 'uri'
      }
      break
      
    case 'integer':
    case 'number':
      // 可以添加范围限制
      break
  }
  
  return schema
}

// 获取数据类型
const getDataType = (value: any): string => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  const type = typeof value
  if (type === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number'
  }
  return type
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}
</style>