/**
 * SEO Meta 标签配置
 * 
 * 标题长度：50-60 字符
 * 描述长度：150-160 字符
 * 
 * 每个页面都有独特的标题和描述，包含相关关键词，
 * 提供清晰的价值主张，并在适当时包含行动号召。
 */

export interface MetaInfo {
  title: string;
  description: string;
  keywords?: string[];
}

export const seoMeta: Record<string, MetaInfo> = {
  // 首页
  '/': {
    title: '开发工具箱 - 免费在线JSON格式化|Base64编码|正则测试工具',
    description: '专业的在线开发工具集，提供JSON格式化验证、Base64编码解码、URL编码、HTML实体转换、正则表达式测试、时间戳转换等20+实用工具。无需安装，即开即用，助力高效编程开发。',
    keywords: ['开发工具', 'JSON格式化', '编码转换', '在线工具', '开发者工具箱', 'developer tools', 'online tools']
  },

  // JSON 工具
  '/json/formatter': {
    title: 'JSON格式化工具 - 在线JSON美化压缩验证器 | 免费开发工具',
    description: '强大的在线JSON格式化工具，支持JSON美化、压缩、语法高亮和错误检测。实时格式化验证，支持大文件处理，精确定位语法错误。让JSON数据更易读，提升开发效率。完全免费使用！',
    keywords: ['JSON格式化', 'JSON美化', 'JSON压缩', 'JSON工具', 'JSON验证', 'JSON formatter', 'JSON beautifier']
  },

  '/json/converter': {
    title: 'JSON转换器 - JSON与YAML/XML/CSV格式互转 | 在线免费工具',
    description: '专业的JSON数据格式转换工具，支持JSON与YAML、XML、CSV等格式双向转换。一键转换，保持数据完整性，支持批量处理和自定义配置。免费使用，无需注册，数据本地处理安全可靠。',
    keywords: ['JSON转换', 'JSON to YAML', 'JSON to XML', 'JSON to CSV', '数据格式转换', 'JSON converter']
  },

  '/json/validator': {
    title: 'JSON验证器 - 在线JSON语法检查Schema验证 | 开发调试工具',
    description: '快速准确的JSON验证工具，实时检测JSON语法错误，精确定位问题行号。支持JSON Schema验证，确保数据格式规范。提供详细错误提示和修复建议，是API开发和调试的必备工具。',
    keywords: ['JSON验证', 'JSON校验', 'JSON语法检查', 'JSON Schema', 'JSON错误检测', 'JSON validator']
  },

  // 编码工具
  '/encode/base64': {
    title: 'Base64编码解码 - 在线文本图片Base64转换器 | 数据加密工具',
    description: '安全可靠的Base64编码解码工具，支持文本、图片、文件的双向转换。采用UTF-8编码，实时预览结果，本地处理保护隐私。支持批量转换和拖拽上传，免费在线使用，无文件大小限制。',
    keywords: ['Base64编码', 'Base64解码', 'Base64转换', '编码工具', '图片Base64', 'Base64 encoder']
  },

  '/encode/url': {
    title: 'URL编码解码工具 - 在线URL转码器 | encodeURI转换工具',
    description: '专业的URL编码解码工具，支持完整URL和查询参数编解码。智能处理特殊字符，确保URL安全传输。同时支持encodeURI和encodeURIComponent两种模式，批量处理提高效率。',
    keywords: ['URL编码', 'URL解码', 'URL转码', 'encodeURI', 'decodeURI', 'URL encoder']
  },

  '/encode/html': {
    title: 'HTML实体编码 - 在线HTML转义工具 | XSS攻击防护 | 特殊字符转换',
    description: '便捷的HTML实体编码解码工具，有效防止XSS攻击，确保网页内容安全。支持所有HTML实体和特殊符号转换，提供实时预览。Web开发必备的安全工具，保护您的网站免受注入攻击。',
    keywords: ['HTML编码', 'HTML实体', 'HTML转义', 'XSS防护', 'HTML特殊字符', 'HTML encoder']
  },

  // 转换工具
  '/converter/markdown': {
    title: 'Markdown转HTML - 在线MD编辑器预览 | 支持GFM语法高亮',
    description: '实时Markdown转HTML工具，完整支持GitHub风格Markdown语法。即时预览渲染效果，支持代码高亮、表格、任务列表、数学公式。写作、文档编写、博客创作的理想工具。',
    keywords: ['Markdown转换', 'Markdown预览', 'Markdown to HTML', 'GFM', 'Markdown编辑器', 'Markdown converter']
  },

  '/converter/csv': {
    title: 'CSV转JSON工具 - 在线CSV与JSON数据格式互转 | Excel处理',
    description: '高效的CSV与JSON双向转换工具，智能识别分隔符，完美保持数据结构。支持自定义列名映射、批量处理、编码自动检测。Excel数据导入导出、数据分析处理的得力助手。',
    keywords: ['CSV转JSON', 'JSON转CSV', 'CSV转换', '数据转换', 'CSV处理', 'CSV converter']
  },

  // 其他工具
  '/regex': {
    title: '正则表达式测试 - 在线Regex调试工具 | 实时匹配高亮显示',
    description: '功能强大的正则表达式测试工具，实时匹配结果高亮显示。支持全局、多行、忽略大小写等所有模式。提供常用正则模板库和语法说明，帮助快速编写调试正则表达式，提升开发效率。',
    keywords: ['正则表达式', 'Regex测试', '正则调试', '正则匹配', 'RegExp', 'regex tester']
  },

  '/timestamp': {
    title: '时间戳转换器 - Unix时间戳与日期在线转换 | 多时区支持',
    description: '精确的时间戳转换工具，支持秒级和毫秒级Unix时间戳双向转换。覆盖全球时区，实时显示当前时间戳，支持自定义日期格式和批量转换。时间处理、跨时区协作的必备工具。',
    keywords: ['时间戳转换', 'Unix时间戳', '时间转换', 'timestamp', '日期转换', 'timestamp converter']
  },

  '/sitemap': {
    title: '网站地图 - 开发工具箱全站导航 | 20+在线开发工具集合',
    description: '浏览开发工具箱完整站点地图，快速访问20+在线开发工具。包含JSON处理、编码转换、数据格式化、正则测试等多类实用工具，一站式解决日常开发需求，提升编程效率。',
    keywords: ['站点地图', '网站导航', '工具列表', '开发工具导航', 'sitemap', 'developer tools directory']
  }
};

// 获取页面 Meta 信息
export function getPageMeta(path: string): MetaInfo {
  return seoMeta[path] || seoMeta['/'];
}

// 生成 Meta 标签
export function generateMetaTags(path: string): Record<string, string> {
  const meta = getPageMeta(path);
  
  return {
    title: meta.title,
    'og:title': meta.title,
    'twitter:title': meta.title,
    
    description: meta.description,
    'og:description': meta.description,
    'twitter:description': meta.description,
    
    keywords: meta.keywords?.join(', ') || '',
    
    'og:type': 'website',
    'og:url': `https://9852111.xyz${path}`,
    'og:site_name': '开发工具箱',
    
    'twitter:card': 'summary',
    'twitter:site': '@devtools',
    
    'robots': 'index, follow',
    'author': '开发工具箱',
    'viewport': 'width=device-width, initial-scale=1.0',
    'theme-color': '#409EFF'
  };
}

// Vue Router Meta 配置
export function getRouteMeta(path: string) {
  const meta = getPageMeta(path);
  
  return {
    title: meta.title,
    meta: [
      { name: 'description', content: meta.description },
      { name: 'keywords', content: meta.keywords?.join(', ') || '' },
      
      // Open Graph
      { property: 'og:title', content: meta.title },
      { property: 'og:description', content: meta.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: `https://9852111.xyz${path}` },
      { property: 'og:site_name', content: '开发工具箱' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: meta.title },
      { name: 'twitter:description', content: meta.description },
      
      // 其他
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: '开发工具箱' }
    ]
  };
}