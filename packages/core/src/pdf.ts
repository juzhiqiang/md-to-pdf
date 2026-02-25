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
    // 打印完成后恢复原来的标题
    if (filename) {
        document.title = originalTitle
    }
}

/** 复制文本到剪贴板 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        // Fallback: 使用旧版 execCommand
        try {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            return true
        } catch {
            return false
        }
    }
}
