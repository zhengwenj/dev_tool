#!/usr/bin/env node

/**
 * 搜索引擎验证设置向导
 * 自动化处理验证文件的创建和配置
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// 路径配置
const paths = {
  public: path.join(__dirname, '..', 'public'),
  indexHtml: path.join(__dirname, '..', 'index.html'),
  env: path.join(__dirname, '..', '.env.local')
};

// 验证文件配置
const verificationConfig = {
  google: {
    name: 'Google Search Console',
    filePattern: /^google[a-f0-9]+\.html$/,
    createFile: (filename) => ({
      path: path.join(paths.public, filename),
      content: `google-site-verification: ${filename}`
    }),
    instructions: `
1. 访问 https://search.google.com/search-console
2. 添加属性，输入：https://9852111.xyz
3. 选择"HTML 文件"验证方法
4. 下载验证文件（类似 google1234567890abcdef.html）
5. 记下文件名
    `
  },
  baidu: {
    name: '百度站长平台',
    filePattern: /^baidu_verify_[A-Za-z0-9-]+\.html$/,
    createFile: (filename, code) => ({
      path: path.join(paths.public, filename),
      content: code
    }),
    instructions: `
1. 访问 https://ziyuan.baidu.com
2. 添加网站：https://9852111.xyz
3. 选择"文件验证"
4. 下载验证文件（类似 baidu_verify_code-1234567890.html）
5. 记下文件名和文件内容
    `
  },
  bing: {
    name: 'Bing Webmaster Tools',
    metaTag: true,
    instructions: `
1. 访问 https://www.bing.com/webmasters
2. 添加站点：https://9852111.xyz
3. 选择"HTML Meta 标记"验证方法
4. 复制 content 值（不包括引号）
    `
  }
};

// 确保目录存在
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// 读取现有验证文件
async function listExistingFiles() {
  try {
    const files = await fs.readdir(paths.public);
    const verificationFiles = files.filter(file => 
      file.match(/^google[a-f0-9]+\.html$/) ||
      file.match(/^baidu_verify_[A-Za-z0-9-]+\.html$/) ||
      file === 'BingSiteAuth.xml'
    );
    
    if (verificationFiles.length > 0) {
      log.info('现有验证文件：');
      verificationFiles.forEach(file => console.log(`  - ${file}`));
      return verificationFiles;
    }
    return [];
  } catch {
    return [];
  }
}

// 创建验证文件
async function createVerificationFile(filepath, content) {
  try {
    await fs.writeFile(filepath, content, 'utf8');
    log.success(`创建文件：${path.basename(filepath)}`);
    return true;
  } catch (error) {
    log.error(`创建文件失败：${error.message}`);
    return false;
  }
}

// 更新 index.html 添加 meta 标签
async function addMetaTag(name, content) {
  try {
    let html = await fs.readFile(paths.indexHtml, 'utf8');
    
    // 检查是否已存在
    if (html.includes(`name="${name}"`)) {
      log.warning(`Meta 标签 ${name} 已存在`);
      return;
    }
    
    // 在 </head> 前添加 meta 标签
    const metaTag = `    <meta name="${name}" content="${content}" />`;
    html = html.replace('</head>', `${metaTag}\n  </head>`);
    
    await fs.writeFile(paths.indexHtml, html, 'utf8');
    log.success(`已添加 meta 标签：${name}`);
  } catch (error) {
    log.error(`更新 index.html 失败：${error.message}`);
  }
}

// 交互式设置
async function interactiveSetup() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (query) => new Promise((resolve) => rl.question(query, resolve));
  
  log.title('🚀 搜索引擎验证设置向导');
  
  // 确保 public 目录存在
  await ensureDir(paths.public);
  
  // 显示现有文件
  const existingFiles = await listExistingFiles();
  
  // Google 设置
  log.title('1️⃣ Google Search Console');
  console.log(verificationConfig.google.instructions);
  
  const setupGoogle = await question('是否设置 Google 验证？(y/n): ');
  if (setupGoogle.toLowerCase() === 'y') {
    const filename = await question('请输入下载的文件名（如 google1234567890abcdef.html）: ');
    if (filename.match(verificationConfig.google.filePattern)) {
      const file = verificationConfig.google.createFile(filename);
      await createVerificationFile(file.path, file.content);
    } else {
      log.error('文件名格式不正确');
    }
  }
  
  // 百度设置
  log.title('2️⃣ 百度站长平台');
  console.log(verificationConfig.baidu.instructions);
  
  const setupBaidu = await question('是否设置百度验证？(y/n): ');
  if (setupBaidu.toLowerCase() === 'y') {
    const filename = await question('请输入下载的文件名（如 baidu_verify_code-1234567890.html）: ');
    const code = await question('请输入文件内容（验证码）: ');
    if (filename.match(verificationConfig.baidu.filePattern)) {
      const file = verificationConfig.baidu.createFile(filename, code);
      await createVerificationFile(file.path, file.content);
      
      // 询问是否保存 token
      const token = await question('请输入百度推送 token（可选，用于自动提交）: ');
      if (token) {
        await saveEnvVariable('VITE_BAIDU_TOKEN', token);
      }
    } else {
      log.error('文件名格式不正确');
    }
  }
  
  // Bing 设置
  log.title('3️⃣ Bing Webmaster Tools');
  console.log(verificationConfig.bing.instructions);
  
  const setupBing = await question('是否设置 Bing 验证？(y/n): ');
  if (setupBing.toLowerCase() === 'y') {
    const content = await question('请输入 content 值: ');
    if (content) {
      await addMetaTag('msvalidate.01', content);
    }
  }
  
  // 其他搜索引擎
  log.title('4️⃣ 其他搜索引擎（可选）');
  
  const setupYandex = await question('是否设置 Yandex 验证？(y/n): ');
  if (setupYandex.toLowerCase() === 'y') {
    const content = await question('请输入 Yandex 验证码: ');
    if (content) {
      await addMetaTag('yandex-verification', content);
    }
  }
  
  rl.close();
  
  // 完成提示
  log.title('✅ 设置完成！');
  console.log('\n下一步：');
  console.log('1. 运行 npm run build 构建项目');
  console.log('2. 运行 npm run deploy:full 部署到 GitHub Pages');
  console.log('3. 在各搜索引擎平台完成验证');
  console.log('4. 提交站点地图：npm run sitemap:submit');
}

// 保存环境变量
async function saveEnvVariable(key, value) {
  try {
    let envContent = '';
    try {
      envContent = await fs.readFile(paths.env, 'utf8');
    } catch {
      // 文件不存在，创建新文件
    }
    
    // 检查是否已存在
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
    
    await fs.writeFile(paths.env, envContent.trim() + '\n', 'utf8');
    log.success(`已保存环境变量：${key}`);
  } catch (error) {
    log.error(`保存环境变量失败：${error.message}`);
  }
}

// 快速设置（使用命令行参数）
async function quickSetup(args) {
  await ensureDir(paths.public);
  
  // 解析参数
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    options[key] = value;
  }
  
  // Google 验证
  if (options.google) {
    const file = verificationConfig.google.createFile(options.google);
    await createVerificationFile(file.path, file.content);
  }
  
  // 百度验证
  if (options.baidu && options['baidu-code']) {
    const file = verificationConfig.baidu.createFile(options.baidu, options['baidu-code']);
    await createVerificationFile(file.path, file.content);
  }
  
  // Bing 验证
  if (options.bing) {
    await addMetaTag('msvalidate.01', options.bing);
  }
  
  // Yandex 验证
  if (options.yandex) {
    await addMetaTag('yandex-verification', options.yandex);
  }
  
  // 百度 token
  if (options['baidu-token']) {
    await saveEnvVariable('VITE_BAIDU_TOKEN', options['baidu-token']);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] !== '--interactive') {
    // 快速设置模式
    await quickSetup(args);
  } else {
    // 交互式设置
    await interactiveSetup();
  }
}

// 显示帮助信息
if (process.argv.includes('--help')) {
  console.log(`
搜索引擎验证设置工具

交互式模式：
  node setup-verification.js

快速设置模式：
  node setup-verification.js [options]

选项：
  --google <filename>           设置 Google 验证文件
  --baidu <filename>            设置百度验证文件
  --baidu-code <code>           百度验证码内容
  --baidu-token <token>         百度推送 token
  --bing <code>                 设置 Bing meta 标签
  --yandex <code>               设置 Yandex meta 标签

示例：
  node setup-verification.js --google google1234567890abcdef.html
  node setup-verification.js --baidu baidu_verify_code-123.html --baidu-code "验证码内容"
  node setup-verification.js --bing "ABCD1234" --yandex "1234567890abcdef"
  `);
  process.exit(0);
}

// 运行
main().catch(console.error);