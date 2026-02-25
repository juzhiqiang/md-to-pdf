/**
 * Toolbar — 悬浮操作栏
 * 顶部毛玻璃效果工具栏，包含导出、复制、清空等操作
 */
import { Button, showToast } from '@md-to-pdf/ui'
import { copyToClipboard, openFileDialog } from '@md-to-pdf/core'

interface ToolbarProps {
    markdown: string
    onClear: () => void
    onContent: (content: string) => void
    onExportClick?: () => void
}

export function Toolbar(props: ToolbarProps) {
    const handleCopyMarkdown = async () => {
        if (!props.markdown.trim()) {
            showToast('warning', '内容为空', '没有可复制的内容')
            return
        }
        const success = await copyToClipboard(props.markdown)
        if (success) {
            showToast('success', '复制成功', 'Markdown 原文已复制到剪贴板')
        } else {
            showToast('error', '复制失败', '请手动选择文本复制')
        }
    }

    const handleFileOpen = async () => {
        const content = await openFileDialog()
        if (content) {
            props.onContent(content)
            showToast('success', '文件已加载', 'Markdown 文件内容已填入编辑器')
        }
    }

    const handleClear = () => {
        if (!props.markdown.trim()) return
        props.onClear()
        showToast('info', '已清空', '编辑器内容已清除')
    }

    return (
        <header class="w-full shrink-0 !mb-6 !px-[15px] z-40 no-print backdrop-blur-xl border-b bg-white/80 border-gray-200/60">
            <div class="w-full h-14 mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-24 max-w-[2560px]">
                <div class="w-full h-full flex items-center justify-between px-5">
                    {/* 左侧 Logo */}
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-inner">
                            <span class="text-white text-sm font-bold font-display">M</span>
                        </div>
                        <div>
                            <h1 class="text-sm font-semibold leading-tight tracking-tight text-gray-800">MD-to-PDF</h1>
                            <p class="text-[10px] leading-tight font-medium text-gray-500">预览与导出</p>
                        </div>
                    </div>

                    {/* 右侧操作按钮 */}
                    <div class="flex items-center gap-1.5">
                        <Button variant="ghost" size="sm" onClick={handleFileOpen} class="!rounded-full px-3 inline-flex items-center justify-center flex-row whitespace-nowrap text-gray-600 hover:text-gray-900 hover:bg-gray-100/80">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
                            </svg>
                            <span class="font-medium text-[13px]">打开</span>
                        </Button>

                        <Button variant="ghost" size="sm" onClick={handleCopyMarkdown} class="!rounded-full px-3 inline-flex items-center justify-center flex-row whitespace-nowrap text-gray-600 hover:text-gray-900 hover:bg-gray-100/80">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                            <span class="font-medium text-[13px]">复制</span>
                        </Button>

                        <Button variant="ghost" size="sm" onClick={handleClear} class="!rounded-full px-3 inline-flex items-center justify-center flex-row whitespace-nowrap text-gray-600 hover:text-error-600 hover:bg-error-50/80">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            <span class="font-medium text-[13px]">清空</span>
                        </Button>

                        <div class="w-[1px] h-5 mx-1.5 bg-gray-200/80" />

                        <Button variant="primary" size="sm" onClick={() => props.onExportClick?.()} class="!rounded-full px-5 inline-flex items-center justify-center whitespace-nowrap flex-row shadow-sm hover:shadow-md transition-all active:scale-95 ml-1">
                            <svg class="w-4 h-4 !ml-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span class="font-semibold text-[13px] !mr-3">导出 PDF</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
