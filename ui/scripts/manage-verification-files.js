#!/usr/bin/env node

/**
 * 搜索引擎验证文件管理脚本
 * 用于自动化处理验证文件的下载和放置
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// 验证文件模板
const verificationTemplates = {
  google: {
    pattern: /^google[a-f0-9]+\.html$/,
    example: 'google1234567890abcdef.html',
    content: (code) => `google-site-verification: ${code}`,
    instruction: '请从 Google Search Console 下载验证文件，然后将文件名粘贴在这里：'
  },
  baidu: {
    pattern: /^baidu_verify_[A-Za-z0-9]+\.html$/,
    example: 'baidu_verify_code-1234567890.html',
    content: (code) => code,
    instruction: '请从百度站长平台下载验证文件，然后将文件名和验证码粘贴在这里：'
  },
  bing: {
    pattern: /^BingSiteAuth\.xml$/,
    example: 'BingSiteAuth.xml',
    contentType: 'xml',
    instruction: '请从 Bing Webmaster Tools 下载验证文件内容，然后粘贴在这里：'
  }
};

// 公共目录路径
const publicDir = path.join(__dirname, '..', 'public');

// 确保 public 目录存在
async function ensurePublicDir() {
  try {
    await fs.access(publicDir);
  } catch {
    await fs.mkdir(publicDir, { recursive: true });
  }
}

// 列出现有的验证文件
async function listVerificationFiles() {
  try {
    const files = await fs.readdir(publicDir);
    const verificationFiles = files.filter(file => 
      file.match(/^google[a-f0-9]+\.html$/) ||
      file.match(/^baidu_verify_[A-Za-z0-9]+\.html$/) ||
      file === 'BingSiteAuth.xml'
    );
    
    if (verificationFiles.length > 0) {
      console.log('\n📁 现有验证文件：');
      verificationFiles.forEach(file => console.log(`   - ${file}`));
    } else {
      console.log('\n📁 当前没有验证文件');
    }
  } catch (error) {
    console.error('读取目录失败:', error);
  }
}

// 添加 Google 验证文件
async function addGoogleVerification() {
  console.log('\n🔍 Google Search Console 验证');
  console.log('示例文件名：google1234567890abcdef.html');
  
  const filename = await question('请输入验证文件名（或输入 skip 跳过）：');
  
  if (filename.toLowerCase() === 'skip') {
    return;
  }
  
  if (!filename.match(verificationTemplates.google.pattern)) {
    console.log('❌ 文件名格式不正确，应该类似：google1234567890abcdef.html');
    return;
  }
  
  const content = verificationTemplates.google.content(filename);
  const filepath = path.join(publicDir, filename);
  
  try {
    await fs.writeFile(filepath, content);
    console.log(`✅ 已创建 Google 验证文件：${filename}`);
  } catch (error) {
    console.error('❌ 创建文件失败:', error);
  }
}

// 添加百度验证文件
async function addBaiduVerification() {
  console.log('\n🔍 百度站长平台验证');
  console.log('示例文件名：baidu_verify_code-1234567890.html');
  
  const filename = await question('请输入验证文件名（或输入 skip 跳过）：');
  
  if (filename.toLowerCase() === 'skip') {
    return;
  }
  
  if (!filename.match(verificationTemplates.baidu.pattern)) {
    console.log('❌ 文件名格式不正确，应该类似：baidu_verify_code-1234567890.html');
    return;
  }
  
  const code = await question('请输入验证码内容：');
  
  const filepath = path.join(publicDir, filename);
  
  try {
    await fs.writeFile(filepath, code);
    console.log(`✅ 已创建百度验证文件：${filename}`);
  } catch (error) {
    console.error('❌ 创建文件失败:', error);
  }
}

// 添加 Bing 验证文件
async function addBingVerification() {
  console.log('\n🔍 Bing Webmaster Tools 验证');
  console.log('如果选择 XML 文件验证，文件名应该是：BingSiteAuth.xml');
  
  const useXml = await question('是否使用 XML 文件验证？(y/n，或输入 skip 跳过)：');
  
  if (useXml.toLowerCase() === 'skip') {
    return;
  }
  
  if (useXml.toLowerCase() === 'y') {
    console.log('请粘贴 XML 内容（输入 END 结束）：');
    
    let xmlContent = '';
    let line;
    while ((line = await question('')) !== 'END') {
      xmlContent += line + '\n';
    }
    
    const filepath = path.join(publicDir, 'BingSiteAuth.xml');
    
    try {
      await fs.writeFile(filepath, xmlContent.trim());
      console.log('✅ 已创建 Bing 验证文件：BingSiteAuth.xml');
    } catch (error) {
      console.error('❌ 创建文件失败:', error);
    }
  } else {
    console.log('💡 提示：您也可以使用 HTML meta 标签验证，将以下标签添加到 index.html：');
    console.log('   <meta name="msvalidate.01" content="您的验证码" />');
  }
}

// 生成 meta 标签配置
async function generateMetaTags() {
  console.log('\n📝 生成 Meta 标签配置');
  
  const bingCode = await question('Bing 验证码（可选，直接回车跳过）：');
  const yandexCode = await question('Yandex 验证码（可选，直接回车跳过）：');
  
  console.log('\n将以下 meta 标签添加到 ui/index.html 的 <head> 部分：\n');
  
  if (bingCode) {
    console.log(`<meta name="msvalidate.01" content="${bingCode}" />`);
  }
  if (yandexCode) {
    console.log(`<meta name="yandex-verification" content="${yandexCode}" />`);
  }
  
  if (!bingCode && !yandexCode) {
    console.log('没有生成任何 meta 标签');
  }
}

// 主函数
async function main() {
  console.log('🚀 搜索引擎验证文件管理工具\n');
  
  await ensurePublicDir();
  await listVerificationFiles();
  
  while (true) {
    console.log('\n请选择操作：');
    console.log('1. 添加 Google 验证文件');
    console.log('2. 添加百度验证文件');
    console.log('3. 添加 Bing 验证文件');
    console.log('4. 生成 Meta 标签');
    console.log('5. 列出现有验证文件');
    console.log('0. 退出');
    
    const choice = await question('\n请输入选项 (0-5)：');
    
    switch (choice) {
      case '1':
        await addGoogleVerification();
        break;
      case '2':
        await addBaiduVerification();
        break;
      case '3':
        await addBingVerification();
        break;
      case '4':
        await generateMetaTags();
        break;
      case '5':
        await listVerificationFiles();
        break;
      case '0':
        console.log('\n👋 再见！');
        rl.close();
        return;
      default:
        console.log('❌ 无效选项，请重试');
    }
  }
}

// 运行主函数
main().catch(console.error);