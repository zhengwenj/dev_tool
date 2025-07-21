# Dev Tools 开发工具集

一个集成多种开发工具的 Web 应用，提供 JSON 处理、编码解码、格式转换等常用功能。

## 项目结构

```
dev_tool/
├── ui/                     # 前端项目 (Vue 3 + TypeScript + Vite)
│   ├── src/               # 源代码
│   │   ├── views/         # 页面组件
│   │   ├── router/        # 路由配置
│   │   └── api/           # API 接口
│   ├── package.json       # 前端依赖
│   └── vite.config.ts     # Vite 配置
├── web/                   # 后端项目 (预留)
├── .gitignore            # Git 忽略文件
└── README.md             # 项目说明
```

## 功能特性

### JSON 工具
- JSON 格式化
- JSON 验证
- JSON 转换

### 编码/解码工具
- Base64 编码/解码
- URL 编码/解码
- HTML 实体编码/解码

### 格式转换工具
- Markdown 预览与转换
- CSV 数据处理

### 其他工具
- 正则表达式测试
- 时间戳转换

## 技术栈

### 前端
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 组件**: Element Plus
- **样式**: Tailwind CSS
- **代码编辑器**: Monaco Editor
- **路由**: Vue Router
- **状态管理**: Pinia
- **HTTP 客户端**: Axios

## 开发指南

### 前端开发

```bash
# 进入前端目录
cd ui

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

### 项目配置

- **端口**: 开发服务器默认运行在 `http://localhost:5173`
- **代理**: API 请求代理配置在 `ui/vite.config.ts`

## 目录说明

### 前端目录结构

```
ui/src/
├── views/              # 页面组件
│   ├── json/          # JSON 相关工具
│   ├── encode/        # 编码解码工具
│   └── converter/     # 格式转换工具
├── router/            # 路由配置
├── api/               # API 接口定义
├── App.vue            # 根组件
├── main.ts            # 应用入口
└── style.css          # 全局样式
```

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

本项目采用 MIT 许可证。