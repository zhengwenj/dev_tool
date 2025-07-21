const https = require('https');
const http = require('http');
const { URL } = require('url');

// 配置
const SITE_URL = 'https://9852111.xyz';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// 搜索引擎 Ping 服务
const PING_SERVICES = [
  {
    name: 'Google',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'GET'
  },
  {
    name: 'Bing',
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    method: 'GET'
  },
  {
    name: '百度',
    url: `http://ping.baidu.com/ping/RPC2`,
    method: 'POST',
    contentType: 'text/xml',
    body: `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>weblogUpdates.extendedPing</methodName>
  <params>
    <param>
      <value><string>开发工具箱</string></value>
    </param>
    <param>
      <value><string>${SITE_URL}</string></value>
    </param>
    <param>
      <value><string>${SITE_URL}</string></value>
    </param>
    <param>
      <value><string>${SITE_URL}/rss</string></value>
    </param>
  </params>
</methodCall>`
  }
];

// 发送 HTTP 请求
function sendRequest(service) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(service.url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: service.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Sitemap Submitter/1.0)'
      }
    };
    
    if (service.method === 'POST' && service.body) {
      options.headers['Content-Type'] = service.contentType || 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = Buffer.byteLength(service.body);
    }
    
    console.log(`📤 正在提交到 ${service.name}...`);
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✅ ${service.name}: 提交成功 (状态码: ${res.statusCode})`);
          resolve({ service: service.name, success: true, statusCode: res.statusCode });
        } else {
          console.log(`⚠️  ${service.name}: 提交可能失败 (状态码: ${res.statusCode})`);
          resolve({ service: service.name, success: false, statusCode: res.statusCode });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ ${service.name}: 提交失败 - ${error.message}`);
      resolve({ service: service.name, success: false, error: error.message });
    });
    
    if (service.method === 'POST' && service.body) {
      req.write(service.body);
    }
    
    req.end();
  });
}

// 主函数
async function submitSitemaps() {
  console.log('🚀 开始提交站点地图到搜索引擎...\n');
  console.log(`📍 站点地图 URL: ${SITEMAP_URL}\n`);
  
  const results = [];
  
  for (const service of PING_SERVICES) {
    try {
      const result = await sendRequest(service);
      results.push(result);
      // 延迟一秒，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`处理 ${service.name} 时出错:`, error);
    }
  }
  
  // 总结
  console.log('\n📊 提交结果总结:');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ 成功: ${successful}`);
  console.log(`❌ 失败: ${failed}`);
  
  console.log('\n💡 提示:');
  console.log('1. 某些搜索引擎可能需要先验证网站所有权才能接受提交');
  console.log('2. 建议手动在以下平台添加和验证网站:');
  console.log('   - Google Search Console: https://search.google.com/search-console');
  console.log('   - Bing Webmaster Tools: https://www.bing.com/webmasters');
  console.log('   - 百度站长平台: https://ziyuan.baidu.com');
  console.log('3. 验证后可以在平台内直接提交站点地图 URL');
  
  // 生成提交记录
  const fs = require('fs');
  const path = require('path');
  const logDir = path.join(__dirname, '..', 'logs');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, 'sitemap-submissions.log');
  const logEntry = {
    timestamp: new Date().toISOString(),
    sitemapUrl: SITEMAP_URL,
    results: results
  };
  
  // 追加到日志文件
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
  console.log(`\n📝 提交记录已保存到: ${logFile}`);
}

// 检查是否应该自动提交
function shouldAutoSubmit() {
  // 可以根据环境变量或其他条件判断
  return process.env.AUTO_SUBMIT_SITEMAP === 'true';
}

// 执行
if (require.main === module) {
  submitSitemaps().catch(console.error);
} else {
  // 作为模块导出
  module.exports = {
    submitSitemaps,
    shouldAutoSubmit,
    SITEMAP_URL
  };
}