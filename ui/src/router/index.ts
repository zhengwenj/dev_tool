import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/json/formatter',
    name: 'json-formatter',
    component: () => import('@/views/json/FormatterView.vue'),
    meta: { title: 'JSON 格式化/压缩' }
  },
  {
    path: '/json/converter',
    name: 'json-converter',
    component: () => import('@/views/json/ConverterView.vue'),
    meta: { title: 'JSON 转换' }
  },
  {
    path: '/json/validator',
    name: 'json-validator',
    component: () => import('@/views/json/ValidatorView.vue'),
    meta: { title: 'JSON 验证' }
  },
  {
    path: '/encode/base64',
    name: 'base64',
    component: () => import('@/views/encode/Base64View.vue'),
    meta: { title: 'Base64 编码/解码' }
  },
  {
    path: '/encode/url',
    name: 'url-encode',
    component: () => import('@/views/encode/UrlEncodeView.vue'),
    meta: { title: 'URL 编码/解码' }
  },
  {
    path: '/encode/html',
    name: 'html-entity',
    component: () => import('@/views/encode/HtmlEntityView.vue'),
    meta: { title: 'HTML 实体转换' }
  },
  {
    path: '/converter/markdown',
    name: 'markdown',
    component: () => import('@/views/converter/MarkdownView.vue'),
    meta: { title: 'Markdown 转 HTML' }
  },
  {
    path: '/converter/csv',
    name: 'csv',
    component: () => import('@/views/converter/CsvView.vue'),
    meta: { title: 'CSV 转 JSON' }
  },
  {
    path: '/regex',
    name: 'regex',
    component: () => import('@/views/RegexView.vue'),
    meta: { title: '正则表达式测试' }
  },
  {
    path: '/timestamp',
    name: 'timestamp',
    component: () => import('@/views/TimestampView.vue'),
    meta: { title: '时间戳转换' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router