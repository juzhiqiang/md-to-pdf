/**
 * @md-to-pdf/core — 文件读取工具
 * 封装浏览器端 FileReader、拖拽、粘贴等文件读取逻辑
 */

/** 从 File 对象读取文本内容 */
export function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('文件读取失败'))
        reader.readAsText(file)
    })
}

/** 校验文件是否为 Markdown 类型 */
export function isMarkdownFile(file: File): boolean {
    const validExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mdx']
    const fileName = file.name.toLowerCase()
    return validExtensions.some((ext) => fileName.endsWith(ext))
}

/** 从拖拽事件中提取 Markdown 文件 */
export async function readFromDrop(event: DragEvent): Promise<string | null> {
    event.preventDefault()
    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return null

    const file = files[0]
    if (!isMarkdownFile(file)) {
        throw new Error('请上传 .md 格式的 Markdown 文件')
    }

    return readFileAsText(file)
}

/** 从粘贴事件中提取文本 */
export function readFromPaste(event: ClipboardEvent): string | null {
    const text = event.clipboardData?.getData('text/plain')
    return text && text.trim().length > 0 ? text : null
}

/** 触发文件选择对话框（统一使用 isMarkdownFile 校验） */
export function openFileDialog(): Promise<string | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.md,.markdown,.mdown,.mkd,.mdx'

        input.onchange = async () => {
            const file = input.files?.[0]
            if (!file) {
                resolve(null)
                return
            }

            // 二次校验文件格式（与拖拽路径行为一致）
            if (!isMarkdownFile(file)) {
                resolve(null)
                return
            }

            try {
                const text = await readFileAsText(file)
                resolve(text)
            } catch {
                resolve(null)
            }
        }

        input.click()
    })
}
