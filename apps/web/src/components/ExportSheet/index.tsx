import { createSignal, Show, createEffect, onCleanup } from 'solid-js'
import { exportToPdf } from '@md-to-pdf/core'
import { showToast } from '@md-to-pdf/ui'

interface ExportSheetProps {
    isOpen: boolean
    onClose: () => void
    markdown: string
}

export function ExportSheet(props: ExportSheetProps) {
    const [fileName, setFileName] = createSignal('document')
    const [isExporting, setIsExporting] = createSignal(false)
    const [isVisible, setIsVisible] = createSignal(false)
    const [inputError, setInputError] = createSignal(false)
    const [exportDone, setExportDone] = createSignal(false)

    // 统一管理所有定时器，组件卸载或重新打开时清理
    const timers = new Set<ReturnType<typeof setTimeout>>()

    const safeTimeout = (fn: () => void, ms: number) => {
        const id = setTimeout(() => {
            timers.delete(id)
            fn()
        }, ms)
        timers.add(id)
        return id
    }

    const clearAllTimers = () => {
        for (const id of timers) clearTimeout(id)
        timers.clear()
    }

    createEffect(() => {
        if (props.isOpen) {
            clearAllTimers() // 重新打开时清理残留定时器
            setExportDone(false)
            setIsExporting(false)
            setInputError(false)
            safeTimeout(() => setIsVisible(true), 10)
        } else {
            setIsVisible(false)
        }
    })

    onCleanup(() => {
        clearAllTimers()
        document.removeEventListener('keydown', handleKeyDown)
    })

    const handleClose = () => {
        if (isExporting()) return // 导出中禁止关闭
        setIsVisible(false)
        safeTimeout(props.onClose, 400)
    }

    const handleExport = async () => {
        if (!fileName().trim()) {
            setInputError(true)
            showToast('warning', '提示', '请输入文件名')
            safeTimeout(() => setInputError(false), 500)
            return
        }

        setIsExporting(true)
        try {
            await new Promise<void>(r => safeTimeout(() => r(), 600))
            exportToPdf(fileName().trim() || 'document')
            setExportDone(true)
            showToast('success', '成功', 'PDF 导出成功')
            safeTimeout(handleClose, 800)
        } catch (error) {
            showToast('error', '错误', '导出失败，请重试')
        } finally {
            setIsExporting(false)
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && props.isOpen) {
            handleClose()
        }
    }

    createEffect(() => {
        if (props.isOpen) {
            document.addEventListener('keydown', handleKeyDown)
        } else {
            document.removeEventListener('keydown', handleKeyDown)
        }
    })

    const estimatedPages = () => {
        const len = props.markdown.length
        if (len === 0) return 1
        return Math.max(1, Math.ceil(len / 2000))
    }

    const wordCount = () => {
        const text = props.markdown.trim()
        if (!text) return 0
        const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length
        const englishWords = text.replace(/[\u4e00-\u9fff]/g, ' ').split(/\s+/).filter(w => w.length > 0).length
        return chineseChars + englishWords
    }

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none no-print" role="dialog" aria-modal="true" aria-label="导出 PDF">
                <style>{`
                    @keyframes es-shake {
                        10%, 90% { transform: translate3d(-1px, 0, 0); }
                        20%, 80% { transform: translate3d(2px, 0, 0); }
                        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                        40%, 60% { transform: translate3d(4px, 0, 0); }
                    }
                    .es-shake { animation: es-shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
                    @keyframes es-pulse {
                        0% { transform: scale(0.96); }
                        50% { transform: scale(1.04); }
                        100% { transform: scale(0.96); }
                    }
                    .es-pulse { animation: es-pulse 1.8s ease-in-out infinite; }
                `}</style>

                {/* 遮罩 */}
                <div
                    class={`absolute inset-0 bg-black/50 backdrop-blur-[6px] pointer-events-auto transition-opacity duration-300
                        ${isVisible() ? 'opacity-100' : 'opacity-0'}`}
                    onClick={handleClose}
                    onKeyDown={(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClose() } }}
                    role="button"
                    tabIndex={0}
                    aria-label="关闭导出面板"
                />

                {/* 弹窗 */}
                <div
                    class={`relative w-[420px] mx-4 !p-[20px] bg-[#f2f3f7] rounded-[28px] overflow-hidden flex flex-col items-center
                        transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-auto
                        shadow-[0_24px_80px_-16px_rgba(0,0,0,0.4)]
                        ${isVisible()
                            ? 'translate-y-0 scale-100 opacity-100'
                            : 'translate-y-6 scale-95 opacity-0'}`}
                >
                    {/* ===== 上半区：图标 + 标题 ===== */}
                    <div class="w-full flex flex-col items-center pt-[35px] pb-5 px-[35px]">
                        <div class={`w-16 h-16 rounded-[20px] flex items-center justify-center mb-4
                            ${exportDone() ? 'bg-[#34c759]' : 'bg-[#5856d6]'}
                            ${isExporting() ? 'es-pulse' : ''}
                            transition-colors duration-500`}
                        >
                            <Show when={exportDone()} fallback={
                                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            }>
                                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            </Show>
                        </div>

                        <h2 class="text-[19px] font-bold text-[#1c1c1e] tracking-tight">导出为 PDF</h2>
                        <p class="text-[13px] text-[#8e8e93] mt-1">配置导出选项并生成文档</p>
                    </div>

                    {/* ===== 中间区：文档信息卡 ===== */}
                    <div class="w-full  !px-[10px] !py-[5px]  bg-white rounded-2xl p-3.5 flex items-center">
                        <div class="w-11 !mr-[10px] h-11 bg-[#ffebee] rounded-xl flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5 text-[#ef5350]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z" />
                                <path d="M8 15h8v1.5H8zm0-3h8v1.5H8z" />
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0 ml-3">
                            <p class="text-[14px] font-semibold text-[#1c1c1e] truncate">
                                {fileName().trim() || 'document'}.pdf
                            </p>
                            <p class="text-[12px] text-[#8e8e93] mt-0.5">
                                约 {wordCount()} 字 · {estimatedPages()} 页
                            </p>
                        </div>
                        <span class="text-[11px] font-semibold text-[#8e8e93] bg-[#f2f2f7] px-2.5 py-1 rounded-full shrink-0">
                            A4
                        </span>
                    </div>

                    {/* ===== 中间区：设置项卡 ===== */}
                    <div class="w-full px-[35px] !my-3">
                        <div class="w-full   !px-[10px] !py-[5px]  bg-white rounded-2xl overflow-hidden">
                            {/* 文件名 */}
                            <div class={`flex items-center h-[52px] px-4 transition-colors
                                ${inputError() ? 'bg-red-50 es-shake' : ''}`}
                            >
                                <div class="w-8 h-8 bg-[#eef0ff] rounded-lg flex items-center justify-center shrink-0">
                                    <svg class="w-[14px] h-[14px] text-[#5856d6]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                                    </svg>
                                </div>
                                <span class="text-[14px] font-medium text-[#1c1c1e] ml-2.5 shrink-0">文件名</span>
                                <div class="flex-1 flex justify-end items-center ml-2">
                                    <input
                                        type="text"
                                        class={`w-full max-w-[120px] text-right bg-transparent border-none outline-none text-[14px] transition-colors
                                            ${inputError() ? 'text-[#ff3b30] placeholder-[#ff3b30]/40' : 'text-[#8e8e93] placeholder-[#c7c7cc]'}`}
                                        placeholder="document"
                                        value={fileName()}
                                        onInput={(e) => {
                                            setFileName(e.currentTarget.value)
                                            if (inputError()) setInputError(false)
                                        }}
                                        spellcheck={false}
                                    />
                                    <span class={`text-[14px] transition-colors shrink-0
                                        ${inputError() ? 'text-[#ff3b30]/40' : 'text-[#c7c7cc]'}`}>.pdf</span>
                                </div>
                            </div>

                            <div class="mx-4 h-px bg-[#f2f2f7]" />

                            {/* 纸张尺寸 */}
                            <div class="flex items-center h-[52px] px-4">
                                <div class="w-8 h-8 bg-[#f2f2f7] rounded-lg flex items-center justify-center shrink-0">
                                    <svg class="w-[14px] h-[14px] text-[#8e8e93]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <span class="text-[14px] font-medium text-[#1c1c1e] ml-2.5">纸张尺寸</span>
                                <div class="flex-1 flex justify-end items-center gap-1.5">
                                    <span class="text-[14px] text-[#8e8e93]">A4</span>
                                    <span class="text-[10px] text-[#aeaeb2] bg-[#f2f2f7] px-1.5 py-[2px] rounded font-medium">自动</span>
                                </div>
                            </div>

                            <div class="mx-4 h-px bg-[#f2f2f7]" />

                            {/* 主题样式 */}
                            <div class="flex items-center h-[52px] px-4">
                                <div class="w-8 h-8 bg-[#f2f2f7] rounded-lg flex items-center justify-center shrink-0">
                                    <svg class="w-[14px] h-[14px] text-[#8e8e93]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                                    </svg>
                                </div>
                                <span class="text-[14px] font-medium text-[#1c1c1e] ml-2.5">主题样式</span>
                                <div class="flex-1 flex justify-end items-center gap-1.5">
                                    <span class="text-[14px] text-[#8e8e93]">默认</span>
                                    <span class="text-[10px] text-[#aeaeb2] bg-[#f2f2f7] px-1.5 py-[2px] rounded font-medium">自动</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== 底部：按钮区 ===== */}
                    <div class="w-full px-[35px] pt-5 pb-[35px] flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={handleExport}
                            disabled={isExporting() || exportDone()}
                            class={`w-full h-[50px] rounded-2xl font-semibold text-[15px] flex justify-center items-center gap-2 transition-all duration-300
                                ${exportDone()
                                    ? 'bg-[#34c759] text-white'
                                    : isExporting()
                                        ? 'bg-[#5856d6]/80 text-white/90 cursor-wait'
                                        : 'bg-[#5856d6] text-white active:bg-[#4b49c4] active:scale-[0.98] shadow-[0_4px_16px_rgba(88,86,214,0.35)]'
                                }`}
                        >
                            <Show when={exportDone()} fallback={
                                <Show when={isExporting()} fallback={
                                    <>
                                        <svg class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        确认导出
                                    </>
                                }>
                                    <svg class="animate-spin h-[17px] w-[17px] text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" />
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    正在生成...
                                </Show>
                            }>
                                <svg class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                导出成功
                            </Show>
                        </button>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isExporting()}
                            class="w-full h-[50px] rounded-2xl font-medium text-[15px] text-[#3c3c43]/60 bg-white active:bg-[#f2f2f7] transition-colors duration-150 active:scale-[0.98]"
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    )
}
