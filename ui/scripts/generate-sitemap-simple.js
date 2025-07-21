const fs = require('fs');
const path = require('path');

// 网站配置
const SITE_CONFIG = {
  baseUrl: process.env.VITE_SITE_URL || 'https://9852111.xyz',
  defaultPriority: 0.5,
  defaultChangefreq: 'weekly'
};

// 手动定义路由（避免导入问题）
const routes = [
  {
    path: '/',
    name: 'home',
    priority: 1.0,
    changefreq: 'daily',
    title: '首页'
  },
  {
    path: '/json/formatter',
    name: 'json-formatter',
    priority: 0.8,
    changefreq: 'weekly',
    title: 'JSON 格式化/压缩'
  },
  {
    path: '/json/converter',
    name: 'json-converter',
    priority: 0.8,
    changefreq: 'weekly',
    title: 'JSON 转换'
  },
  {
    path: '/json/validator',
    name: 'json-validator',
    priority: 0.8,
    changefreq: 'weekly',
    title: 'JSON 验证'
  },
  {
    path: '/encode/base64',
    name: 'base64',
    priority: 0.7,
    changefreq: 'weekly',
    title: 'Base64 编码/解码'
  },
  {
    path: '/encode/url',
    name: 'url-encode',
    priority: 0.7,
    changefreq: 'weekly',
    title: 'URL 编码/解码'
  },
  {
    path: '/encode/html',
    name: 'html-entity',
    priority: 0.7,
    changefreq: 'weekly',
    title: 'HTML 实体转换'
  },
  {
    path: '/converter/markdown',
    name: 'markdown',
    priority: 0.7,
    changefreq: 'weekly',
    title: 'Markdown 转 HTML'
  },
  {
    path: '/converter/csv',
    name: 'csv',
    priority: 0.7,
    changefreq: 'weekly',
    title: 'CSV 转 JSON'
  },
  {
    path: '/regex',
    name: 'regex',
    priority: 0.8,
    changefreq: 'weekly',
    title: '正则表达式测试'
  },
  {
    path: '/timestamp',
    name: 'timestamp',
    priority: 0.8,
    changefreq: 'weekly',
    title: '时间戳转换'
  },
  {
    path: '/sitemap',
    name: 'sitemap',
    priority: 0.6,
    changefreq: 'monthly',
    title: '网站地图'
  }
];

// 生成 XML 站点地图
function generateSitemap(routes) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urlEntries = routes.map(route => {
    const priority = route.priority || SITE_CONFIG.defaultPriority;
    const changefreq = route.changefreq || SITE_CONFIG.defaultChangefreq;
    
    return `  <url>
    <loc>${SITE_CONFIG.baseUrl}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
}

// 生成 robots.txt
function generateRobotsTxt() {
  return `# Robots.txt for ${SITE_CONFIG.baseUrl}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_CONFIG.baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin or private paths (if any)
# Disallow: /admin/
# Disallow: /private/`;
}

// 生成站点地图索引（用于多语言或大型网站）
function generateSitemapIndex() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_CONFIG.baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// 生成 HTML 站点地图页面
function generateHtmlSitemap(routes) {
  const groupedRoutes = {};
  
  // 按类别分组路由
  routes.forEach(route => {
    let category = '其他工具';
    if (route.path.includes('/json')) category = 'JSON 工具';
    else if (route.path.includes('/encode')) category = '编码/解码工具';
    else if (route.path.includes('/converter')) category = '格式转换工具';
    else if (route.path === '/') category = '首页';
    
    if (!groupedRoutes[category]) {
      groupedRoutes[category] = [];
    }
    groupedRoutes[category].push(route);
  });

  const categoriesHtml = Object.entries(groupedRoutes).map(([category, routes]) => {
    const linksHtml = routes.map(route => 
      `        <li><a href="${route.path}" class="text-blue-600 hover:text-blue-800">${route.title}</a></li>`
    ).join('\n');
    
    return `    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-3">${category}</h2>
      <ul class="list-disc list-inside space-y-2">
${linksHtml}
      </ul>
    </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>网站地图 - 开发工具箱</title>
  <meta name="description" content="开发工具箱网站地图，包含所有工具页面的链接">
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">网站地图</h1>
    
${categoriesHtml}
    
    <div class="mt-12 pt-8 border-t border-gray-200">
      <p class="text-sm text-gray-600">
        最后更新：${new Date().toLocaleDateString('zh-CN')} | 
        <a href="/sitemap.xml" class="text-blue-600 hover:text-blue-800">XML 站点地图</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// 主函数
function main() {
  try {
    console.log('🚀 开始生成站点地图...\n');
    
    // 确保 public 目录存在
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 生成 XML 站点地图
    const sitemap = generateSitemap(routes);
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
    console.log(`✅ XML 站点地图已生成: ${sitemapPath}`);
    
    // 生成 robots.txt
    const robotsTxt = generateRobotsTxt();
    const robotsPath = path.join(publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
    console.log(`✅ robots.txt 已生成: ${robotsPath}`);
    
    // 生成站点地图索引
    const sitemapIndex = generateSitemapIndex();
    const sitemapIndexPath = path.join(publicDir, 'sitemap-index.xml');
    fs.writeFileSync(sitemapIndexPath, sitemapIndex, 'utf-8');
    console.log(`✅ 站点地图索引已生成: ${sitemapIndexPath}`);
    
    // 生成 HTML 站点地图
    const htmlSitemap = generateHtmlSitemap(routes);
    const htmlSitemapPath = path.join(publicDir, 'sitemap.html');
    fs.writeFileSync(htmlSitemapPath, htmlSitemap, 'utf-8');
    console.log(`✅ HTML 站点地图已生成: ${htmlSitemapPath}`);
    
    // 输出统计信息
    console.log(`\n📊 统计信息:`);
    console.log(`   - 总页面数: ${routes.length}`);
    console.log(`   - 基础 URL: ${SITE_CONFIG.baseUrl}`);
    console.log(`   - 生成时间: ${new Date().toISOString()}`);
    console.log(`\n✨ 所有站点地图文件已成功生成！`);
    
  } catch (error) {
    console.error('❌ 生成站点地图时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main();