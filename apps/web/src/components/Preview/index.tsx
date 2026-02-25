/**
 * Preview — Markdown 富文本预览区
 * 右侧白纸效果的实时渲染面板，同时也是 PDF 打印区域
 */
import { createMemo } from 'solid-js'
import { parseMarkdown } from '@md-to-pdf/core'

interface PreviewProps {
    markdown: string
}

export function Preview(props: PreviewProps) {
    const html = createMemo(() => parseMarkdown(props.markdown))

    return (
        <div class="flex flex-col h-full rounded-2xl overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-gray-200/60 bg-white transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            {/* 预览头部 */}
            <div class="flex items-center h-12 !px-5 bg-gradient-to-b from-gray-50/90 to-white/90 backdrop-blur-xl border-b border-gray-100 no-print">
                <svg class="w-4 h-4 text-primary-500 mr-2 drop-shadow-sm" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span class="text-[12px] font-semibold text-gray-500 tracking-wider uppercase">Live Preview</span>
            </div>

            {/* 预览内容区 — 真白纸浸入效果 */}
            <div class="flex-1 bg-white overflow-auto print-area custom-scrollbar relative">
                {/* 顶部极简渐变遮罩 (可选，增加层级感) */}
                <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/[0.02] to-transparent pointer-events-none no-print"></div>
                <article
                    class="markdown-body !px-5 !py-0 max-w-[1100px] mx-auto min-h-full"
                    innerHTML={html()}
                />
            </div>
        </div>
    )
}
