#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 导入 SEO 配置
const seoConfigPath = path.join(__dirname, '..', 'src', 'config', 'seo-meta.ts');
const seoConfigContent = fs.readFileSync(seoConfigPath, 'utf8');

// 提取 SEO 配置
const seoMetaMatch = seoConfigContent.match(/export const seoMeta[^{]*{([\s\S]*?)^};/m);
if (!seoMetaMatch) {
  console.error('❌ 无法解析 SEO 配置文件');
  process.exit(1);
}

// 简单解析路由和 meta 信息
const routes = [];
const routeRegex = /'([^']+)':\s*{[\s\S]*?title:\s*'([^']+)'[\s\S]*?description:\s*'([^']+)'/g;
let match;

while ((match = routeRegex.exec(seoConfigContent)) !== null) {
  routes.push({
    path: match[1],
    title: match[2],
    description: match[3]
  });
}

console.log('🔍 SEO Meta 标签检查报告\n');
console.log('=' .repeat(80));

// 检查规则
const checkTitle = (title) => {
  const length = title.length;
  const status = length >= 50 && length <= 60 ? '✅' : '⚠️';
  const color = status === '✅' ? '\x1b[32m' : '\x1b[33m';
  return {
    status,
    message: `${color}${status} 标题长度: ${length} 字符 (推荐: 50-60)${'\x1b[0m'}`
  };
};

const checkDescription = (description) => {
  const length = description.length;
  const status = length >= 150 && length <= 160 ? '✅' : '⚠️';
  const color = status === '✅' ? '\x1b[32m' : '\x1b[33m';
  return {
    status,
    message: `${color}${status} 描述长度: ${length} 字符 (推荐: 150-160)${'\x1b[0m'}`
  };
};

const checkKeywords = (text) => {
  const keywords = ['工具', 'JSON', '编码', '转换', '在线', '格式化', '开发'];
  const foundKeywords = keywords.filter(kw => text.includes(kw));
  const status = foundKeywords.length >= 2 ? '✅' : '⚠️';
  const color = status === '✅' ? '\x1b[32m' : '\x1b[33m';
  return {
    status,
    message: `${color}${status} 关键词密度: 包含 ${foundKeywords.length} 个核心关键词${'\x1b[0m'}`
  };
};

const checkUniqueness = (routes) => {
  const titles = routes.map(r => r.title);
  const descriptions = routes.map(r => r.description);
  
  const uniqueTitles = new Set(titles).size === titles.length;
  const uniqueDescriptions = new Set(descriptions).size === descriptions.length;
  
  return {
    titles: uniqueTitles,
    descriptions: uniqueDescriptions
  };
};

// 执行检查
let totalScore = 0;
let maxScore = 0;

routes.forEach((route, index) => {
  console.log(`\n${index + 1}. 页面: ${route.path}`);
  console.log('-'.repeat(60));
  console.log(`标题: "${route.title}"`);
  console.log(`描述: "${route.description}"`);
  console.log('\n检查结果:');
  
  const titleCheck = checkTitle(route.title);
  const descCheck = checkDescription(route.description);
  const keywordCheck = checkKeywords(route.title + ' ' + route.description);
  
  console.log(`  ${titleCheck.message}`);
  console.log(`  ${descCheck.message}`);
  console.log(`  ${keywordCheck.message}`);
  
  // 计算得分
  const score = [titleCheck, descCheck, keywordCheck].filter(c => c.status === '✅').length;
  totalScore += score;
  maxScore += 3;
  
  console.log(`\n  得分: ${score}/3`);
});

// 唯一性检查
console.log('\n' + '='.repeat(80));
console.log('📊 整体分析\n');

const uniqueness = checkUniqueness(routes);
console.log(`✅ 标题唯一性: ${uniqueness.titles ? '所有标题都是唯一的' : '❌ 存在重复标题'}`);
console.log(`✅ 描述唯一性: ${uniqueness.descriptions ? '所有描述都是唯一的' : '❌ 存在重复描述'}`);

// 总体得分
const percentage = Math.round((totalScore / maxScore) * 100);
console.log(`\n📈 SEO 优化得分: ${totalScore}/${maxScore} (${percentage}%)`);

// 建议
console.log('\n💡 优化建议:');
if (percentage < 80) {
  console.log('- 调整标题长度到 50-60 字符范围');
  console.log('- 调整描述长度到 150-160 字符范围');
  console.log('- 确保每个页面包含相关关键词');
}
console.log('- 定期更新内容保持新鲜度');
console.log('- 监控搜索引擎索引状态');
console.log('- 建立高质量的外部链接');

// 生成 SEO 报告
const report = {
  timestamp: new Date().toISOString(),
  totalPages: routes.length,
  score: percentage,
  pages: routes.map(route => ({
    path: route.path,
    title: {
      content: route.title,
      length: route.title.length,
      optimal: route.title.length >= 50 && route.title.length <= 60
    },
    description: {
      content: route.description,
      length: route.description.length,
      optimal: route.description.length >= 150 && route.description.length <= 160
    }
  }))
};

// 保存报告
const reportPath = path.join(__dirname, '..', 'seo-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n📄 详细报告已保存到: ${reportPath}`);

console.log('\n✨ SEO 检查完成！');