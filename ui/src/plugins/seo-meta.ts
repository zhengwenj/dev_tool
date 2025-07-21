import { App } from 'vue';
import { Router } from 'vue-router';
import { getPageMeta } from '@/config/seo-meta';

export interface SeoMetaOptions {
  defaultTitle?: string;
  titleTemplate?: string;
  defaultDescription?: string;
}

export default {
  install(app: App, options: SeoMetaOptions = {}) {
    const {
      defaultTitle = '开发工具箱',
      titleTemplate = '%s',
      defaultDescription = '免费在线开发工具集合'
    } = options;

    // 获取路由实例
    const router = app.config.globalProperties.$router as Router;

    // 更新页面 Meta 标签
    const updateMetaTags = (path: string) => {
      const meta = getPageMeta(path);
      
      // 更新标题
      document.title = titleTemplate.replace('%s', meta.title || defaultTitle);
      
      // 更新或创建 meta 标签
      const updateOrCreateMeta = (name: string, content: string, isProperty = false) => {
        const attrName = isProperty ? 'property' : 'name';
        let element = document.querySelector(`meta[${attrName}="${name}"]`) as HTMLMetaElement;
        
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attrName, name);
          document.head.appendChild(element);
        }
        
        element.content = content;
      };
      
      // 基础 Meta 标签
      updateOrCreateMeta('description', meta.description || defaultDescription);
      if (meta.keywords && meta.keywords.length > 0) {
        updateOrCreateMeta('keywords', meta.keywords.join(', '));
      }
      
      // Open Graph 标签
      updateOrCreateMeta('og:title', meta.title || defaultTitle, true);
      updateOrCreateMeta('og:description', meta.description || defaultDescription, true);
      updateOrCreateMeta('og:type', 'website', true);
      updateOrCreateMeta('og:url', `https://9852111.xyz${path}`, true);
      updateOrCreateMeta('og:site_name', '开发工具箱', true);
      
      // Twitter Card 标签
      updateOrCreateMeta('twitter:card', 'summary');
      updateOrCreateMeta('twitter:title', meta.title || defaultTitle);
      updateOrCreateMeta('twitter:description', meta.description || defaultDescription);
      
      // 其他重要标签
      updateOrCreateMeta('robots', 'index, follow');
      updateOrCreateMeta('author', '开发工具箱');
      
      // 更新 canonical URL
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `https://9852111.xyz${path}`;
    };

    // 监听路由变化
    router.afterEach((to) => {
      // 使用 nextTick 确保 DOM 更新后再更新 meta 标签
      app.config.globalProperties.$nextTick(() => {
        updateMetaTags(to.path);
      });
    });

    // 初始化时更新
    if (router.currentRoute.value) {
      updateMetaTags(router.currentRoute.value.path);
    }

    // 提供全局方法
    app.config.globalProperties.$updateSeoMeta = updateMetaTags;
  }
};

// TypeScript 类型声明
declare module 'vue' {
  interface ComponentCustomProperties {
    $updateSeoMeta: (path: string) => void;
  }
}