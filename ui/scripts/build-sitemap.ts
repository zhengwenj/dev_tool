import { createSitemapGenerator } from './sitemap-generator';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { RouteRecordRaw } from 'vue-router';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 站点配置
const SITE_CONFIG = {
  
  baseUrl: process.env.VITE_SITE_URL || 'https://9852111.xyz',
  defaultPriority: 0.5,
  defaultChangefreq: 'weekly' as const,
  // 排除的路径（支持通配符）
  excludePaths: [
    '/test/*',
    '/admin/*',
    '/:pathMatch(.*)*' // 排除 404 页面
  ],
  // 额外添加的路径（不在路由中的静态页面）
  additionalPaths: [
    {
      path: '/api-docs',
      priority: 0.3,
      changefreq: 'monthly' as const
    }
  ]
};

// 主函数
async function buildSitemap() {
  try {
    console.log('🚀 开始生成站点地图...\n');
    
    // 创建站点地图生成器
    const generator = createSitemapGenerator(SITE_CONFIG);
    
    // 从 Vue Router 配置中提取路由
    console.log('📍 提取路由信息...');
    generator.extractRoutesFromVueRouter(routes);
    
    // 获取所有路由用于调试
    const allRoutes = generator.getRoutes();
    console.log(`✅ 找到 ${allRoutes.length} 个路由\n`);
    
    // 显示路由详情
    console.log('📋 路由列表:');
    allRoutes.forEach(route => {
      console.log(`   ${route.path} - 优先级: ${route.priority}, 更新频率: ${route.changefreq}`);
    });
    console.log('');
    
    // 保存到 public 目录
    const outputDir = join(__dirname, '..', 'public');
    generator.saveToFile(outputDir);
    
    console.log('\n✨ 站点地图生成完成！');
    
  } catch (error) {
    console.error('❌ 生成站点地图时出错:', error);
    process.exit(1);
  }
}

// 执行
buildSitemap();