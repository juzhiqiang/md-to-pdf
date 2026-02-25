/**
 * @md-to-pdf/core — Markdown 解析引擎
 * 使用 marked 将 Markdown 文本转换为 HTML
 * 输出经过 DOMPurify 消毒，防止 XSS 注入
 */

import DOMPurify from 'dompurify'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'

/** 允许的语言标识符白名单（字母、数字、+、#、- 组成） */
const LANG_RE = /^[a-zA-Z0-9+#._-]{0,30}$/

/** 对语言名做安全过滤：只允许白名单字符，否则置空 */
function safeLang(raw?: string): string {
    if (!raw) return ''
    const trimmed = raw.trim()
    return LANG_RE.test(trimmed) ? trimmed : ''
}

/** 创建带有代码高亮支持的 Marked 实例 */
const marked = new Marked(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code: string, lang: string) {
            return escapeHtml(code)
        },
    }),
)

// 自定义渲染器：为代码块添加 data-lang 属性（lang 经过白名单过滤）
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }: { text: string; lang?: string; escaped?: boolean }) => {
    const langLabel = safeLang(lang)
    const langClass = langLabel ? `hljs language-${langLabel}` : 'hljs'
    return `<pre data-lang="${escapeHtml(langLabel)}"><code class="${langClass}">${text}</code></pre>`
}

marked.setOptions({
    gfm: true,
    breaks: true,
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

/**
 * DOMPurify 配置：允许 markdown 渲染需要的标签和属性
 * data-lang 用于代码块语言标签显示
 */
const PURIFY_CONFIG = {
    ADD_ATTR: ['data-lang', 'class', 'target', 'rel'],
    ADD_TAGS: ['pre', 'code'],
    ALLOW_DATA_ATTR: true,
}

/** 将 Markdown 文本转换为安全的 HTML 字符串 */
export function parseMarkdown(markdown: string): string {
    if (!markdown || markdown.trim().length === 0) {
        return ''
    }

    try {
        const rawHtml = marked.parse(markdown) as string
        // 通过 DOMPurify 消毒，移除潜在的 XSS 载荷
        return DOMPurify.sanitize(rawHtml, PURIFY_CONFIG) as string
    } catch (error) {
        console.error('Markdown 解析失败:', error)
        return '<p style="color: red;">Markdown 解析出错</p>'
    }
}

/** 获取 Markdown 纯文本（去除所有标记） */
export function getPlainText(markdown: string): string {
    const html = parseMarkdown(markdown)
    const temp = document.createElement('div')
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ''
}
