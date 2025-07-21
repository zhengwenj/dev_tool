#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, 'green');
  } else {
    log(`❌ ${description}`, 'red');
  }
  return exists;
}

function testCommand(command, description) {
  try {
    log(`\n🔄 测试: ${description}`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} 成功`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} 失败`, 'red');
    console.error(error.message);
    return false;
  }
}

async function runTests() {
  log('\n🧪 站点地图功能测试\n', 'yellow');
  
  // 1. 测试脚本文件是否存在
  log('📁 检查脚本文件:', 'blue');
  const scriptsDir = path.join(__dirname);
  testExists(path.join(scriptsDir, 'generate-sitemap-simple.js'), '站点地图生成脚本');
  testExists(path.join(scriptsDir, 'submit-sitemap.js'), '站点地图提交脚本');
  testExists(path.join(scriptsDir, 'auto-submit-sitemap.js'), '自动提交管理脚本');
  
  // 2. 测试 Vite 插件
  log('\n📁 检查 Vite 插件:', 'blue');
  testExists(path.join(__dirname, '..', 'vite-plugin-sitemap.ts'), 'Vite 站点地图插件');
  
  // 3. 测试视图组件
  log('\n📁 检查视图组件:', 'blue');
  testExists(path.join(__dirname, '..', 'src', 'views', 'SitemapView.vue'), '站点地图查看组件');
  
  // 4. 测试站点地图生成
  testCommand('node scripts/generate-sitemap-simple.js', '生成站点地图');
  
  // 5. 检查生成的文件
  log('\n📁 检查生成的文件:', 'blue');
  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    testExists(path.join(distDir, 'sitemap.xml'), 'XML 站点地图');
    testExists(path.join(distDir, 'sitemap.html'), 'HTML 站点地图');
    testExists(path.join(distDir, 'robots.txt'), 'robots.txt 文件');
    testExists(path.join(distDir, 'sitemap-index.xml'), '站点地图索引');
    
    // 检查 XML 内容
    const xmlPath = path.join(distDir, 'sitemap.xml');
    if (fs.existsSync(xmlPath)) {
      const xmlContent = fs.readFileSync(xmlPath, 'utf8');
      if (xmlContent.includes('https://9852111.xyz')) {
        log('✅ XML 包含正确的域名', 'green');
      } else {
        log('❌ XML 域名不正确', 'red');
      }
    }
  } else {
    log('⚠️  dist 目录不存在，请先运行构建', 'yellow');
  }
  
  // 6. 测试自动提交状态
  log('\n📊 自动提交状态:', 'blue');
  testCommand('node scripts/auto-submit-sitemap.js status', '查看自动提交状态');
  
  // 7. 测试包脚本
  log('\n📦 测试 package.json 脚本:', 'blue');
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const scripts = packageJson.scripts || {};
    
    if (scripts['sitemap:generate']) {
      log('✅ sitemap:generate 脚本已配置', 'green');
    } else {
      log('❌ sitemap:generate 脚本未配置', 'red');
    }
    
    if (scripts['sitemap:submit']) {
      log('✅ sitemap:submit 脚本已配置', 'green');
    } else {
      log('❌ sitemap:submit 脚本未配置', 'red');
    }
    
    if (scripts['deploy']) {
      log('✅ deploy 脚本已配置', 'green');
    } else {
      log('❌ deploy 脚本未配置', 'red');
    }
  } catch (error) {
    log('❌ 无法读取 package.json', 'red');
  }
  
  // 8. 测试文档
  log('\n📚 检查文档:', 'blue');
  testExists(path.join(__dirname, '..', 'docs', 'sitemap-guide.md'), '站点地图使用指南');
  
  // 总结
  log('\n📊 测试完成！', 'yellow');
  log('\n💡 提示:', 'blue');
  log('1. 使用 "pnpm run sitemap:generate" 生成站点地图');
  log('2. 使用 "pnpm run sitemap:submit" 提交到搜索引擎');
  log('3. 使用 "pnpm run deploy" 构建并自动提交');
  log('4. 访问 /sitemap 查看可视化站点地图');
  log('5. 查看 docs/sitemap-guide.md 了解详细使用方法');
}

// 运行测试
runTests().catch(console.error);