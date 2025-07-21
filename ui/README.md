# 开发工具箱前端 (Vue3 + TypeScript)

这是一个为开发者提供的在线工具集合的前端项目，使用 Vue3 + TypeScript + Element Plus 构建。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Element Plus
- **样式**: Tailwind CSS
- **路由**: Vue Router
- **状态管理**: Pinia
- **HTTP 客户端**: Axios
- **代码编辑器**: Monaco Editor

## 项目结构

```
dev-tools-frontend/
├── src/
│   ├── api/              # API 接口定义
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   │   ├── json/         # JSON 工具页面
│   │   ├── encode/       # 编码解码页面
│   │   ├── converter/    # 格式转换页面
│   │   └── ...
│   ├── App.vue           # 根组件
│   ├── main.ts           # 入口文件
│   └── style.css         # 全局样式
├── public/               # 公共文件
├── index.html            # HTML 模板
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

## 功能模块

### 已实现
- ✅ JSON 格式化/压缩
- ✅ 项目基础架构
- ✅ 路由配置
- ✅ API 服务配置

### 待实现
- ⏳ JSON 转换（JSON to YAML/XML）
- ⏳ JSON Schema 验证
- ⏳ Base64 编码/解码
- ⏳ URL 编码/解码
- ⏳ HTML 实体转换
- ⏳ Markdown 转 HTML
- ⏳ CSV 转 JSON
- ⏳ 正则表达式测试
- ⏳ 时间戳转换

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

默认运行在 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 后端配置

本项目需要配合 Python 后端使用。在开发模式下，所有 `/api` 请求会被代理到 `http://localhost:8000`。

确保后端服务运行在 8000 端口，或在 `vite.config.ts` 中修改代理配置：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',  // 修改为你的后端地址
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## 添加新工具

1. 在 `src/views/` 下创建新的页面组件
2. 在 `src/router/index.ts` 中添加路由
3. 在 `src/App.vue` 中添加菜单项
4. 在 `src/api/index.ts` 中添加对应的 API 接口

## 部署建议

### 前端部署

1. **静态托管**: 可以部署到任何静态文件托管服务
   - Nginx
   - Apache
   - Vercel
   - Netlify
   - GitHub Pages

2. **Docker 部署**:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### 性能优化

1. **代码分割**: 路由级别的懒加载已配置
2. **资源压缩**: Vite 自动处理
3. **缓存策略**: 配置合适的 HTTP 缓存头
4. **CDN**: 静态资源使用 CDN 加速

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License