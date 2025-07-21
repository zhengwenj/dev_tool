# 站点地图快速使用指南

## 🚀 快速开始

### 1. 生成站点地图
```bash
pnpm run sitemap:generate
```

### 2. 提交到搜索引擎
```bash
pnpm run sitemap:submit
```

### 3. 构建并自动提交
```bash
pnpm run deploy
```

## 📊 查看站点地图

- **在线查看**: 访问 https://9852111.xyz/sitemap
- **XML 文件**: https://9852111.xyz/sitemap.xml
- **HTML 文件**: https://9852111.xyz/sitemap.html

## ⚙️ 自动提交管理

```bash
# 启用自动提交（每7天）
node scripts/auto-submit-sitemap.js enable

# 查看状态
node scripts/auto-submit-sitemap.js status

# 立即提交
node scripts/auto-submit-sitemap.js force
```

## 📁 生成的文件

- `dist/sitemap.xml` - 主站点地图
- `dist/sitemap.html` - HTML 版本
- `dist/robots.txt` - 爬虫配置
- `dist/sitemap-index.xml` - 站点地图索引

## 🔍 搜索引擎验证

1. **Google**: https://search.google.com/search-console
2. **Bing**: https://www.bing.com/webmasters
3. **百度**: https://ziyuan.baidu.com/

## 📝 详细文档

查看 `docs/sitemap-guide.md` 了解更多功能和配置选项。