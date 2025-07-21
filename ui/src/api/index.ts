import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 通过 vite 代理到后端
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加 token 等认证信息
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    const message = error.response?.data?.message || '请求失败'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// API 接口定义
export const api = {
  // JSON 相关接口
  json: {
    validate: (data: string) => 
      request.post('/tools/json/validate', { data }),
    
    convert: (data: string, targetFormat: string) =>
      request.post('/tools/json/convert', { data, targetFormat }),
      
    schema: (data: string) =>
      request.post('/tools/json/schema', { data })
  },
  
  // 编码解码接口
  encode: {
    base64: (data: string, action: 'encode' | 'decode') =>
      request.post('/tools/encode/base64', { data, action }),
      
    url: (data: string, action: 'encode' | 'decode') =>
      request.post('/tools/encode/url', { data, action }),
      
    html: (data: string, action: 'encode' | 'decode') =>
      request.post('/tools/encode/html', { data, action })
  },
  
  // 转换接口
  converter: {
    markdown: (data: string) =>
      request.post('/tools/converter/markdown', { data }),
      
    csv: (data: string, options?: any) =>
      request.post('/tools/converter/csv', { data, options })
  },
  
  // 正则表达式接口
  regex: {
    test: (pattern: string, text: string, flags?: string) =>
      request.post('/tools/regex/test', { pattern, text, flags })
  },
  
  // 时间戳接口
  timestamp: {
    convert: (timestamp: number | string, targetFormat?: string) =>
      request.post('/tools/timestamp/convert', { timestamp, targetFormat })
  }
}

export default request