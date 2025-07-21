import { execSync } from 'child_process'
import { resolve } from 'path'
import type { Plugin } from 'vite'

export function sitemapPlugin(): Plugin {
  return {
    name: 'vite-plugin-sitemap',
    
    // 在构建结束时生成站点地图
    closeBundle() {
      console.log('\n📍 生成站点地图...')
      
      try {
        // 执行站点地图生成脚本
        execSync('node scripts/generate-sitemap-simple.js', {
          cwd: resolve(__dirname),
          stdio: 'inherit'
        })
        
        console.log('✅ 站点地图生成完成\n')
      } catch (error) {
        console.error('❌ 站点地图生成失败:', error)
        // 不中断构建过程
      }
    }
  }
}