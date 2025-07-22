<template>
  <div class="p-6">
    <div class="max-w-7xl mx-auto">
      <!-- 工具标题和说明 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Markdown 转 HTML</h1>
        <p class="text-gray-600">在线 Markdown 编辑器，支持实时预览和 HTML 导出</p>
      </div>
      
      <!-- 选项设置 -->
      <div class="mb-6 flex flex-wrap items-center gap-4">
        <el-checkbox v-model="options.breaks" size="small">
          自动换行
        </el-checkbox>
        <el-checkbox v-model="options.linkify" size="small">
          自动识别链接
        </el-checkbox>
        <el-checkbox v-model="options.typographer" size="small">
          智能标点
        </el-checkbox>
        <el-checkbox v-model="options.highlight" size="small">
          代码高亮
        </el-checkbox>
        <el-checkbox v-model="options.sanitize" size="small">
          过滤危险标签
        </el-checkbox>
        
        <div class="ml-auto space-x-2">
          <el-button size="small" @click="insertExample">
            <el-icon class="mr-1"><Document /></el-icon>
            加载示例
          </el-button>
          <el-button size="small" @click="clearAll">
            <el-icon class="mr-1"><Delete /></el-icon>
            清空
          </el-button>
        </div>
      </div>
      
      <!-- 主编辑区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Markdown 输入 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">Markdown 输入</h3>
            <div class="space-x-2">
              <!-- 工具栏 -->
              <el-button-group size="small">
                <el-button @click="insertMarkdown('**', '**')" title="粗体">
                  <strong>B</strong>
                </el-button>
                <el-button @click="insertMarkdown('*', '*')" title="斜体">
                  <em>I</em>
                </el-button>
                <el-button @click="insertMarkdown('~~', '~~')" title="删除线">
                  <s>S</s>
                </el-button>
                <el-button @click="insertMarkdown('`', '`')" title="行内代码">
                  <code>&lt;&gt;</code>
                </el-button>
              </el-button-group>
              
              <el-button-group size="small" class="ml-2">
                <el-button @click="insertHeading(1)" title="标题1">
                  H1
                </el-button>
                <el-button @click="insertHeading(2)" title="标题2">
                  H2
                </el-button>
                <el-button @click="insertHeading(3)" title="标题3">
                  H3
                </el-button>
              </el-button-group>
              
              <el-button-group size="small" class="ml-2">
                <el-button @click="insertList('ul')" title="无序列表">
                  <el-icon><List /></el-icon>
                </el-button>
                <el-button @click="insertList('ol')" title="有序列表">
                  <el-icon><Finished /></el-icon>
                </el-button>
                <el-button @click="insertLink()" title="链接">
                  <el-icon><Link /></el-icon>
                </el-button>
                <el-button @click="insertImage()" title="图片">
                  <el-icon><Picture /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
          
          <el-input
            ref="markdownInput"
            v-model="markdown"
            type="textarea"
            :rows="25"
            placeholder="在此输入 Markdown 内容..."
            class="markdown-input"
            @input="updatePreview"
          />
          
          <!-- 字数统计 -->
          <div class="text-sm text-gray-600">
            字符数: {{ markdown.length }} | 
            字数: {{ wordCount }} | 
            行数: {{ lineCount }}
          </div>
        </div>
        
        <!-- 预览区域 -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">预览</h3>
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button value="preview">预览</el-radio-button>
              <el-radio-button value="html">HTML</el-radio-button>
              <el-radio-button value="both">分屏</el-radio-button>
            </el-radio-group>
          </div>
          
          <!-- 预览内容 -->
          <div v-if="viewMode === 'preview' || viewMode === 'both'" 
               class="markdown-preview border rounded-lg p-6 bg-white overflow-auto"
               :style="{ height: viewMode === 'both' ? '300px' : '600px' }"
               v-html="renderedHtml">
          </div>
          
          <!-- HTML 代码 -->
          <div v-if="viewMode === 'html' || viewMode === 'both'" class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">HTML 代码</span>
              <el-button size="small" @click="copyHtml">
                <el-icon class="mr-1"><CopyDocument /></el-icon>
                复制
              </el-button>
            </div>
            <el-input
              v-model="htmlCode"
              type="textarea"
              :rows="viewMode === 'both' ? 12 : 25"
              readonly
              class="font-mono"
            />
          </div>
        </div>
      </div>
      
      <!-- 快速参考 -->
      <div class="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Markdown 语法快速参考</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <!-- 基础语法 -->
          <div>
            <h4 class="font-medium mb-2">基础语法</h4>
            <div class="space-y-2 font-mono text-xs">
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600"># 标题1</p>
                <p class="text-gray-600">## 标题2</p>
                <p class="text-gray-600">### 标题3</p>
              </div>
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">**粗体文本**</p>
                <p class="text-gray-600">*斜体文本*</p>
                <p class="text-gray-600">~~删除线~~</p>
              </div>
            </div>
          </div>
          
          <!-- 列表 -->
          <div>
            <h4 class="font-medium mb-2">列表</h4>
            <div class="space-y-2 font-mono text-xs">
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">- 无序列表项</p>
                <p class="text-gray-600">- 无序列表项</p>
                <p class="text-gray-600">  - 嵌套项</p>
              </div>
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">1. 有序列表项</p>
                <p class="text-gray-600">2. 有序列表项</p>
                <p class="text-gray-600">   1. 嵌套项</p>
              </div>
            </div>
          </div>
          
          <!-- 链接和图片 -->
          <div>
            <h4 class="font-medium mb-2">链接和图片</h4>
            <div class="space-y-2 font-mono text-xs">
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">[链接文本](URL)</p>
                <p class="text-gray-600">![图片描述](图片URL)</p>
              </div>
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">`行内代码`</p>
                <p class="text-gray-600">```语言</p>
                <p class="text-gray-600">代码块</p>
                <p class="text-gray-600">```</p>
              </div>
            </div>
          </div>
          
          <!-- 引用和分隔线 -->
          <div>
            <h4 class="font-medium mb-2">引用和分隔线</h4>
            <div class="space-y-2 font-mono text-xs">
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">&gt; 引用文本</p>
                <p class="text-gray-600">&gt;&gt; 嵌套引用</p>
              </div>
              <div class="bg-white p-2 rounded border">
                <p class="text-gray-600">---</p>
                <p class="text-gray-600">***</p>
                <p class="text-gray-600">___</p>
              </div>
            </div>
          </div>
          
          <!-- 表格 -->
          <div>
            <h4 class="font-medium mb-2">表格</h4>
            <div class="font-mono text-xs bg-white p-2 rounded border">
              <p class="text-gray-600">| 列1 | 列2 | 列3 |</p>
              <p class="text-gray-600">|-----|-----|-----|</p>
              <p class="text-gray-600">| 值1 | 值2 | 值3 |</p>
              <p class="text-gray-600">| 值4 | 值5 | 值6 |</p>
            </div>
          </div>
          
          <!-- 任务列表 -->
          <div>
            <h4 class="font-medium mb-2">任务列表</h4>
            <div class="font-mono text-xs bg-white p-2 rounded border">
              <p class="text-gray-600">- [x] 已完成任务</p>
              <p class="text-gray-600">- [ ] 待办任务</p>
              <p class="text-gray-600">- [ ] 另一个任务</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 导出选项 -->
      <div class="mt-6 flex justify-center space-x-4">
        <el-button type="primary" size="large" @click="downloadHtml">
          <el-icon class="mr-2"><Download /></el-icon>
          下载 HTML 文件
        </el-button>
        <el-button size="large" @click="downloadMarkdown">
          <el-icon class="mr-2"><Download /></el-icon>
          下载 Markdown 文件
        </el-button>
        <el-button size="large" @click="copyHtml">
          <el-icon class="mr-2"><CopyDocument /></el-icon>
          复制 HTML
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Document,
  Delete,
  List,
  Finished,
  Link,
  Picture,
  CopyDocument,
  Download
} from '@element-plus/icons-vue'

// Markdown 解析器（简化版）
class MarkdownParser {
  private options: any
  
  constructor(options: any = {}) {
    this.options = options
  }
  
  parse(markdown: string): string {
    let html = markdown
    
    // 转义 HTML
    if (this.options.sanitize) {
      html = this.escapeHtml(html)
    }
    
    // 代码块（必须在其他规则之前处理）
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const escaped = this.escapeHtml(code.trim())
      return `<pre><code class="language-${lang}">${escaped}</code></pre>`
    })
    
    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // 标题
    html = html.replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    html = html.replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    html = html.replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    html = html.replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^#{1}\s+(.+)$/gm, '<h1>$1</h1>')
    
    // 图片（必须在链接之前处理）
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    
    // 链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // 自动识别链接
    if (this.options.linkify) {
      html = html.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
    }
    
    // 粗体
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')
    
    // 斜体
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>')
    
    // 删除线
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>')
    
    // 引用
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    
    // 水平线
    html = html.replace(/^(---|\*\*\*|___)$/gm, '<hr />')
    
    // 无序列表
    html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
      return `<ul>${match}</ul>`
    })
    
    // 有序列表
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    
    // 任务列表
    html = html.replace(/^- \[x\]\s+(.+)$/gm, '<li><input type="checkbox" checked disabled> $1</li>')
    html = html.replace(/^- \[ \]\s+(.+)$/gm, '<li><input type="checkbox" disabled> $1</li>')
    
    // 表格
    html = this.parseTable(html)
    
    // 段落
    html = html.replace(/\n\n/g, '</p><p>')
    html = '<p>' + html + '</p>'
    
    // 清理多余的标签
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p>(<h[1-6]>)/g, '$1')
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    html = html.replace(/<p>(<pre>)/g, '$1')
    html = html.replace(/(<\/pre>)<\/p>/g, '$1')
    html = html.replace(/<p>(<ul>)/g, '$1')
    html = html.replace(/(<\/ul>)<\/p>/g, '$1')
    html = html.replace(/<p>(<blockquote>)/g, '$1')
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
    html = html.replace(/<p>(<hr \/>)<\/p>/g, '$1')
    
    // 换行
    if (this.options.breaks) {
      html = html.replace(/\n/g, '<br />')
    }
    
    // 智能标点
    if (this.options.typographer) {
      html = html.replace(/--/g, '—')
      html = html.replace(/\.\.\./g, '…')
      html = html.replace(/"/g, '"')
      html = html.replace(/'/g, '&#39;')
    }
    
    return html
  }
  
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }
  
  private parseTable(html: string): string {
    const tableRegex = /\|(.+)\|\n\|[\s\-:|]+\|\n((?:\|.+\|\n?)+)/g
    
    return html.replace(tableRegex, (match, header, body) => {
      const headers = header.split('|').filter((h: string) => h.trim())
      const rows = body.trim().split('\n').map((row: string) => 
        row.split('|').filter((cell: string) => cell.trim())
      )
      
      let table = '<table><thead><tr>'
      headers.forEach((h: string) => {
        table += `<th>${h.trim()}</th>`
      })
      table += '</tr></thead><tbody>'
      
      rows.forEach((row: string[]) => {
        table += '<tr>'
        row.forEach((cell: string) => {
          table += `<td>${cell.trim()}</td>`
        })
        table += '</tr>'
      })
      
      table += '</tbody></table>'
      return table
    })
  }
}

// 数据
const markdown = ref('')
const renderedHtml = ref('')
const htmlCode = ref('')
const viewMode = ref<'preview' | 'html' | 'both'>('preview')
const markdownInput = ref<any>(null)

// 选项
const options = ref({
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: true,
  sanitize: false
})

// 创建解析器实例
const parser = new MarkdownParser(options.value)

// 计算属性
const wordCount = computed(() => {
  return markdown.value.trim().split(/\s+/).filter(word => word.length > 0).length
})

const lineCount = computed(() => {
  return markdown.value.split('\n').length
})

// 更新预览
const updatePreview = () => {
  renderedHtml.value = parser.parse(markdown.value)
  htmlCode.value = renderedHtml.value
}

// 插入 Markdown 语法
const insertMarkdown = (before: string, after: string) => {
  const textarea = markdownInput.value?.textarea
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = markdown.value.substring(start, end)
  const replacement = before + selectedText + after
  
  markdown.value = markdown.value.substring(0, start) + replacement + markdown.value.substring(end)
  
  // 设置光标位置
  setTimeout(() => {
    textarea.focus()
    if (selectedText) {
      textarea.setSelectionRange(start, start + replacement.length)
    } else {
      textarea.setSelectionRange(start + before.length, start + before.length)
    }
  }, 0)
  
  updatePreview()
}

// 插入标题
const insertHeading = (level: number) => {
  const prefix = '#'.repeat(level) + ' '
  const textarea = markdownInput.value?.textarea
  if (!textarea) return
  
  const start = textarea.selectionStart
  const lineStart = markdown.value.lastIndexOf('\n', start - 1) + 1
  
  markdown.value = markdown.value.substring(0, lineStart) + prefix + markdown.value.substring(lineStart)
  
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)
  }, 0)
  
  updatePreview()
}

// 插入列表
const insertList = (type: 'ul' | 'ol') => {
  const prefix = type === 'ul' ? '- ' : '1. '
  const textarea = markdownInput.value?.textarea
  if (!textarea) return
  
  const start = textarea.selectionStart
  const lineStart = markdown.value.lastIndexOf('\n', start - 1) + 1
  
  markdown.value = markdown.value.substring(0, lineStart) + prefix + markdown.value.substring(lineStart)
  
  setTimeout(() => {
    textarea.focus()
    textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length)
  }, 0)
  
  updatePreview()
}

// 插入链接
const insertLink = () => {
  insertMarkdown('[', '](url)')
}

// 插入图片
const insertImage = () => {
  insertMarkdown('![', '](image-url)')
}

// 插入示例
const insertExample = () => {
  markdown.value = `# Markdown 示例文档

这是一个展示 **Markdown** 语法的示例文档。

## 基础语法

### 文本格式

- **粗体文本** 使用 \`**text**\`
- *斜体文本* 使用 \`*text*\`
- ~~删除线~~ 使用 \`~~text~~\`
- \`行内代码\` 使用反引号

### 列表

#### 无序列表
- 项目 1
- 项目 2
  - 子项目 2.1
  - 子项目 2.2
- 项目 3

#### 有序列表
1. 第一步
2. 第二步
3. 第三步

#### 任务列表
- [x] 已完成的任务
- [ ] 待办任务 1
- [ ] 待办任务 2

## 链接和图片

[访问 GitHub](https://github.com)

![示例图片](https://via.placeholder.com/150)

## 引用

> 这是一段引用文本。
> 可以有多行。

## 代码块

\`\`\`javascript
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}

hello('World');
\`\`\`

## 表格

| 姓名 | 年龄 | 城市 |
|------|------|------|
| 张三 | 25   | 北京 |
| 李四 | 30   | 上海 |
| 王五 | 28   | 广州 |

## 分隔线

---

## 数学公式（需要额外支持）

行内公式：$E = mc^2$

块级公式：
$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

## 脚注（需要额外支持）

这里有一个脚注[^1]。

[^1]: 这是脚注的内容。

---

*创建于 ${new Date().toLocaleDateString()}*`
  
  updatePreview()
}

// 清空所有
const clearAll = () => {
  markdown.value = ''
  renderedHtml.value = ''
  htmlCode.value = ''
}

// 复制 HTML
const copyHtml = async () => {
  try {
    await navigator.clipboard.writeText(htmlCode.value)
    ElMessage.success('HTML 已复制到剪贴板')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

// 下载 HTML
const downloadHtml = () => {
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown 导出</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1em; }
    h5 { font-size: 0.875em; }
    h6 { font-size: 0.85em; color: #6a737d; }
    p { margin-bottom: 16px; }
    blockquote {
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
      margin: 0 0 16px 0;
    }
    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27,31,35,0.05);
      border-radius: 3px;
      font-family: Consolas, Monaco, 'Courier New', monospace;
    }
    pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 3px;
    }
    pre code {
      padding: 0;
      background-color: transparent;
    }
    ul, ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }
    li { margin-bottom: 0.25em; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    table th, table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    table th {
      font-weight: 600;
      background-color: #f6f8fa;
    }
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    del {
      text-decoration: line-through;
    }
  </style>
</head>
<body>
${htmlCode.value}
</body>
</html>`
  
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'markdown-export.html'
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('HTML 文件已下载')
}

// 下载 Markdown
const downloadMarkdown = () => {
  const blob = new Blob([markdown.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.md'
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('Markdown 文件已下载')
}

// 监听选项变化
watch(options, () => {
  updatePreview()
}, { deep: true })

// 初始化
onMounted(() => {
  if (!markdown.value) {
    insertExample()
  }
})
</script>

<style scoped>
.markdown-input :deep(.el-textarea__inner) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.5;
}

.font-mono {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* Markdown 预览样式 */
.markdown-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3),
.markdown-preview :deep(h4),
.markdown-preview :deep(h5),
.markdown-preview :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-preview :deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

.markdown-preview :deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

.markdown-preview :deep(h3) { font-size: 1.25em; }
.markdown-preview :deep(h4) { font-size: 1em; }
.markdown-preview :deep(h5) { font-size: 0.875em; }
.markdown-preview :deep(h6) { font-size: 0.85em; color: #6a737d; }

.markdown-preview :deep(p) {
  margin-bottom: 16px;
}

.markdown-preview :deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

.markdown-preview :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
  font-family: Consolas, Monaco, 'Courier New', monospace;
}

.markdown-preview :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-preview :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-preview :deep(li) {
  margin-bottom: 0.25em;
}

.markdown-preview :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

.markdown-preview :deep(table th),
.markdown-preview :deep(table td) {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-preview :deep(table th) {
  font-weight: 600;
  background-color: #f6f8fa;
}

.markdown-preview :deep(table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

.markdown-preview :deep(hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

.markdown-preview :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
}

.markdown-preview :deep(del) {
  text-decoration: line-through;
}

.markdown-preview :deep(input[type="checkbox"]) {
  margin-right: 0.5em;
}
</style>
  