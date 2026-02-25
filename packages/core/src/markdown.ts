/**
 * @md-to-pdf/core — Markdown 解析引擎
 * 使用 marked 将 Markdown 文本转换为 HTML
 */

import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'

/** 创建带有代码高亮支持的 Marked 实例 */
const marked = new Marked(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code: string, lang: string) {
            // 使用简单的 HTML 转义作为代码高亮的基础
            // 在应用端可以通过引入 highlight.js CSS 主题来实现语法高亮
            return escapeHtml(code)
        },
    }),
)

// 自定义渲染器：为代码块添加 data-lang 属性
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }: { text: string; lang?: string; escaped?: boolean }) => {
    const langLabel = lang || ''
    const langClass = lang ? `hljs language-${lang}` : 'hljs'
    return `<pre data-lang="${langLabel}"><code class="${langClass}">${text}</code></pre>`
}

// 配置 marked 选项
marked.setOptions({
    gfm: true, // 支持 GitHub Flavored Markdown
    breaks: true, // 支持换行符
    renderer,
})

/** HTML 特殊字符转义 */
function escapeHtml(text: string): string {
    const htmlEntities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }
    return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char)
}

/** 将 Markdown 文本转换为 HTML 字符串 */
export function parseMarkdown(markdown: string): string {
    if (!markdown || markdown.trim().length === 0) {
        return ''
    }

    try {
        const result = marked.parse(markdown)
        // marked.parse 在同步模式下返回 string
        return result as string
    } catch (error) {
        console.error('Markdown 解析失败:', error)
        return `<p style="color: red;">Markdown 解析出错</p>`
    }
}

/** 获取 Markdown 纯文本（去除所有标记） */
export function getPlainText(markdown: string): string {
    const html = parseMarkdown(markdown)
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
}
