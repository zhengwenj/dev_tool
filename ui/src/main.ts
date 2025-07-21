import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import SeoMetaPlugin from './plugins/seo-meta'
import './style.css'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(SeoMetaPlugin, {
  titleTemplate: '%s - 开发工具箱',
  defaultTitle: '在线开发工具箱',
  defaultDescription: '免费在线开发工具集合，提供JSON格式化、编码转换、正则测试等实用工具'
})

app.mount('#app')