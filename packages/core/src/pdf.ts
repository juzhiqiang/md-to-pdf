/**
 * @md-to-pdf/core — PDF 导出工具
 * 利用浏览器原生 window.print() 实现高质量矢量 PDF 导出
 */

/** 使用浏览器原生打印功能导出 PDF */
export function exportToPdf(filename?: string): void {
    const originalTitle = document.title
    if (filename) {
        document.title = filename
    }
    window.print()
    if (filename) {
        document.title = originalTitle
    }
}

/** 复制文本到剪贴板 */
export async function copyToClipboard(text: string): Promise<boolean> {
    // 优先使用现代 Clipboard API
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch {
            // 降级到 execCommand
        }
    }

    // Fallback: 使用 textarea + execCommand 并检查返回值
    try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0'
        document.body.appendChild(textarea)
        textarea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textarea)
        return success // 之前硬编码 true，现在检查实际返回值
    } catch {
        return false
    }
}
