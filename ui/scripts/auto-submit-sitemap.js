const { submitSitemaps } = require('./submit-sitemap.js');
const fs = require('fs');
const path = require('path');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, '..', '.sitemap-config.json');

// 默认配置
const DEFAULT_CONFIG = {
  autoSubmit: false,
  lastSubmission: null,
  submissionInterval: 7 * 24 * 60 * 60 * 1000, // 7天
  enabledServices: ['Google', 'Bing', '百度']
};

// 读取配置
function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      return { ...DEFAULT_CONFIG, ...config };
    }
  } catch (error) {
    console.error('读取配置文件失败:', error);
  }
  return DEFAULT_CONFIG;
}

// 保存配置
function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('保存配置文件失败:', error);
  }
}

// 检查是否需要提交
function shouldSubmit(config) {
  if (!config.autoSubmit) {
    console.log('ℹ️  自动提交已禁用');
    return false;
  }
  
  if (!config.lastSubmission) {
    console.log('ℹ️  首次提交站点地图');
    return true;
  }
  
  const lastSubmissionTime = new Date(config.lastSubmission).getTime();
  const currentTime = Date.now();
  const timeSinceLastSubmission = currentTime - lastSubmissionTime;
  
  if (timeSinceLastSubmission >= config.submissionInterval) {
    const days = Math.floor(timeSinceLastSubmission / (24 * 60 * 60 * 1000));
    console.log(`ℹ️  距离上次提交已过 ${days} 天，需要重新提交`);
    return true;
  }
  
  const nextSubmissionDate = new Date(lastSubmissionTime + config.submissionInterval);
  console.log(`ℹ️  下次自动提交时间: ${nextSubmissionDate.toLocaleDateString('zh-CN')}`);
  return false;
}

// 主函数
async function autoSubmitSitemap() {
  console.log('🤖 自动站点地图提交系统\n');
  
  const config = loadConfig();
  
  if (shouldSubmit(config)) {
    try {
      await submitSitemaps();
      
      // 更新配置
      config.lastSubmission = new Date().toISOString();
      saveConfig(config);
      
      console.log('\n✅ 站点地图提交完成，配置已更新');
    } catch (error) {
      console.error('\n❌ 站点地图提交失败:', error);
    }
  }
}

// 启用/禁用自动提交
function setAutoSubmit(enabled) {
  const config = loadConfig();
  config.autoSubmit = enabled;
  saveConfig(config);
  console.log(`✅ 自动提交已${enabled ? '启用' : '禁用'}`);
}

// 设置提交间隔（天数）
function setSubmissionInterval(days) {
  const config = loadConfig();
  config.submissionInterval = days * 24 * 60 * 60 * 1000;
  saveConfig(config);
  console.log(`✅ 提交间隔已设置为 ${days} 天`);
}

// 命令行参数处理
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // 默认执行自动提交
    autoSubmitSitemap().catch(console.error);
  } else {
    const command = args[0];
    
    switch (command) {
      case 'enable':
        setAutoSubmit(true);
        break;
      case 'disable':
        setAutoSubmit(false);
        break;
      case 'interval':
        const days = parseInt(args[1]);
        if (!isNaN(days) && days > 0) {
          setSubmissionInterval(days);
        } else {
          console.error('❌ 请提供有效的天数');
        }
        break;
      case 'status':
        const config = loadConfig();
        console.log('📊 当前配置:');
        console.log(`   自动提交: ${config.autoSubmit ? '已启用' : '已禁用'}`);
        console.log(`   提交间隔: ${config.submissionInterval / (24 * 60 * 60 * 1000)} 天`);
        console.log(`   上次提交: ${config.lastSubmission || '从未提交'}`);
        if (config.lastSubmission) {
          const nextSubmission = new Date(new Date(config.lastSubmission).getTime() + config.submissionInterval);
          console.log(`   下次提交: ${nextSubmission.toLocaleDateString('zh-CN')}`);
        }
        break;
      case 'force':
        console.log('🔄 强制提交站点地图...');
        submitSitemaps().then(() => {
          const config = loadConfig();
          config.lastSubmission = new Date().toISOString();
          saveConfig(config);
        }).catch(console.error);
        break;
      default:
        console.log('📖 使用方法:');
        console.log('   node auto-submit-sitemap.js          # 执行自动提交（如果需要）');
        console.log('   node auto-submit-sitemap.js enable   # 启用自动提交');
        console.log('   node auto-submit-sitemap.js disable  # 禁用自动提交');
        console.log('   node auto-submit-sitemap.js interval <天数>  # 设置提交间隔');
        console.log('   node auto-submit-sitemap.js status   # 查看当前状态');
        console.log('   node auto-submit-sitemap.js force    # 强制立即提交');
    }
  }
}

module.exports = {
  autoSubmitSitemap,
  setAutoSubmit,
  setSubmissionInterval
};