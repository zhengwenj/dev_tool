import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import type { RouteRecordRaw } from 'vue-router';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 站点地图配置接口
interface SitemapConfig {
  baseUrl: string;
  defaultPriority?: number;
  defaultChangefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  excludePaths?: string[];
  additionalPaths?: SitemapRoute[];
}

// 站点地图路由接口
interface SitemapRoute {
  path: string;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
  images?: Array<{
    loc: string;
    caption?: string;
    title?: string;
  }>;
}

// 站点地图生成器类
export class SitemapGenerator {
  private config: Required<SitemapConfig>;
  private routes: SitemapRoute[] = [];

  constructor(config: SitemapConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ''), // 移除末尾斜杠
      defaultPriority: config.defaultPriority || 0.5,
      defaultChangefreq: config.defaultChangefreq || 'weekly',
      excludePaths: config.excludePaths || [],
      additionalPaths: config.additionalPaths || []
    };
  }

  // 从 Vue Router 路由中提取路径
  extractRoutesFromVueRouter(routes: RouteRecordRaw[], parentPath = ''): void {
    routes.forEach(route => {
      if (route.path) {
        const fullPath = this.normalizePath(parentPath + '/' + route.path);
        
        // 检查是否应该排除此路径
        if (!this.shouldExcludePath(fullPath)) {
          // 根据路由层级和名称计算优先级
          const priority = this.calculatePriority(fullPath, route.name as string);
          
          this.routes.push({
            path: fullPath,
            priority,
            changefreq: this.determineChangefreq(fullPath)
          });
        }
      }

      // 递归处理子路由
      if (route.children) {
        this.extractRoutesFromVueRouter(
          route.children,
          route.path ? parentPath + '/' + route.path : parentPath
        );
      }
    });
  }

  // 规范化路径
  private normalizePath(path: string): string {
    // 移除多余的斜杠并确保以斜杠开头
    return ('/' + path).replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  // 检查是否应该排除路径
  private shouldExcludePath(path: string): boolean {
    return this.config.excludePaths.some(excludePath => {
      if (excludePath.includes('*')) {
        const regex = new RegExp('^' + excludePath.replace(/\*/g, '.*') + '$');
        return regex.test(path);
      }
      return path === excludePath;
    });
  }

  // 计算优先级
  private calculatePriority(path: string, routeName?: string): number {
    // 首页最高优先级
    if (path === '/' || path === '') return 1.0;
    
    // 根据路径深度降低优先级
    const depth = path.split('/').filter(Boolean).length;
    let priority = 1.0 - (depth * 0.1);
    
    // 特定页面的优先级调整
    if (routeName) {
      if (routeName.includes('json') || routeName.includes('formatter')) priority += 0.1;
      if (routeName.includes('converter') || routeName.includes('encode')) priority += 0.05;
    }
    
    return Math.max(0.1, Math.min(1.0, priority));
  }

  // 确定更新频率
  private determineChangefreq(path: string): SitemapConfig['defaultChangefreq'] {
    if (path === '/') return 'daily';
    if (path.includes('/json')) return 'weekly';
    if (path.includes('/encode') || path.includes('/converter')) return 'monthly';
    return this.config.defaultChangefreq;
  }

  // 添加额外的路径
  addAdditionalPaths(paths: SitemapRoute[]): void {
    this.routes.push(...paths);
  }

  // 生成 XML 站点地图
  generateXML(): string {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // 合并路由并去重
    const allRoutes = [...this.routes, ...this.config.additionalPaths];
    const uniqueRoutes = this.removeDuplicates(allRoutes);
    
    const urlEntries = uniqueRoutes.map(route => {
      const priority = route.priority || this.config.defaultPriority;
      const changefreq = route.changefreq || this.config.defaultChangefreq;
      const lastmod = route.lastmod || currentDate;
      
      let urlEntry = `  <url>
    <loc>${this.config.baseUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>`;
      
      // 添加图片信息（如果有）
      if (route.images && route.images.length > 0) {
        route.images.forEach(image => {
          urlEntry += `
    <image:image>
      <image:loc>${image.loc}</image:loc>`;
          if (image.caption) {
            urlEntry += `
      <image:caption>${this.escapeXml(image.caption)}</image:caption>`;
          }
          if (image.title) {
            urlEntry += `
      <image:title>${this.escapeXml(image.title)}</image:title>`;
          }
          urlEntry += `
    </image:image>`;
        });
      }
      
      urlEntry += `
  </url>`;
      
      return urlEntry;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>`;
  }

  // 生成站点地图索引（用于大型网站）
  generateSitemapIndex(sitemaps: Array<{ loc: string; lastmod?: string }>): string {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const sitemapEntries = sitemaps.map(sitemap => {
      const lastmod = sitemap.lastmod || currentDate;
      return `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
  }

  // 生成 robots.txt
  generateRobotsTxt(additionalRules?: string[]): string {
    const rules = [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${this.config.baseUrl}/sitemap.xml`,
      ...(additionalRules || [])
    ];
    
    return rules.join('\n');
  }

  // 去除重复路径
  private removeDuplicates(routes: SitemapRoute[]): SitemapRoute[] {
    const seen = new Set<string>();
    return routes.filter(route => {
      if (seen.has(route.path)) {
        return false;
      }
      seen.add(route.path);
      return true;
    });
  }

  // 转义 XML 特殊字符
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // 保存文件
  saveToFile(outputDir: string): void {
    // 确保输出目录存在
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // 生成并保存站点地图
    const sitemap = this.generateXML();
    const sitemapPath = join(outputDir, 'sitemap.xml');
    writeFileSync(sitemapPath, sitemap, 'utf-8');
    console.log(`✅ 站点地图已生成: ${sitemapPath}`);

    // 生成并保存 robots.txt
    const robotsTxt = this.generateRobotsTxt();
    const robotsPath = join(outputDir, 'robots.txt');
    writeFileSync(robotsPath, robotsTxt, 'utf-8');
    console.log(`✅ robots.txt 已生成: ${robotsPath}`);

    // 输出统计信息
    console.log(`\n📊 统计信息:`);
    console.log(`   - 总 URL 数: ${this.routes.length}`);
    console.log(`   - 基础 URL: ${this.config.baseUrl}`);
    console.log(`   - 生成时间: ${new Date().toISOString()}`);
  }

  // 获取所有路由（用于调试）
  getRoutes(): SitemapRoute[] {
    return this.routes;
  }
}

// 导出便捷函数
export function createSitemapGenerator(config: SitemapConfig): SitemapGenerator {
  return new SitemapGenerator(config);
}