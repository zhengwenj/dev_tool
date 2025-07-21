import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 网站配置
const SITE_CONFIG = {
  baseUrl: 'https://your-domain.com', // 替换为你的域名
  defaultPriority: 0.5,
  defaultChangefreq: 'weekly'
};

// 路由配置 - 从你的路由文件中提取
const routes = [
  {
    path: '/',
    name: 'home',
    priority: 1.0,
    changefreq: 'daily'
  },
  {
    path: '/json/formatter',
    name: 'json-formatter',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    path: '/json/validator',
    name: 'json-validator',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    path: '/json/converter',
    name: 'json-converter',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    path: '/encode/base64',
    name: 'base64',
    priority: 0.7,
    changefreq: 'weekly'
  },
  {
    path: '/encode/url',
    name: 'url-encode',
    priority: 0.7,
    changefreq: 'weekly'
  },
  {
    path: '/encode/html-entity',
    name: 'html-entity',
    priority: 0.7,
    changefreq: 'weekly'
  },
  {
    path: '/converter/markdown',
    name: 'markdown',
    priority: 0.7,
    changefreq: 'weekly'
  },
  {
    path: '/converter/csv',
    name: 'csv',
    priority: 0.7,
    changefreq: 'weekly'
  },
  {
    path: '/regex',
    name: 'regex',
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    path: '/timestamp',
    name: 'timestamp',
    priority: 0.8,
    changefreq: 'weekly'
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
    <priority>${priority}</priority>
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
  return `User-agent: *
Allow: /

Sitemap: ${SITE_CONFIG.baseUrl}/sitemap.xml`;
}

// 主函数
function main() {
  try {
    // 确保 public 目录存在
    const publicDir = join(__dirname, '..', 'public');
    mkdirSync(publicDir, { recursive: true });
    
    // 生成站点地图
    const sitemap = generateSitemap(routes);
    const sitemapPath = join(publicDir, 'sitemap.xml');
    writeFileSync(sitemapPath, sitemap, 'utf-8');
    console.log(`✅ 站点地图已生成: ${sitemapPath}`);
    
    // 生成 robots.txt
    const robotsTxt = generateRobotsTxt();
    const robotsPath = join(publicDir, 'robots.txt');
    writeFileSync(robotsPath, robotsTxt, 'utf-8');
    console.log(`✅ robots.txt 已生成: ${robotsPath}`);
    
    // 输出统计信息
    console.log(`\n📊 统计信息:`);
    console.log(`   - 总页面数: ${routes.length}`);
    console.log(`   - 基础 URL: ${SITE_CONFIG.baseUrl}`);
    console.log(`   - 最后更新: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('❌ 生成站点地图时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
main();