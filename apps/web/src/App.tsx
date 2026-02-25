/**
 * App.tsx — 主应用入口
 * 管理全局状态，协调 DropZone / Editor / Preview / Toolbar
 */
import { createSignal, Show, onMount, onCleanup } from 'solid-js'
import { ToastContainer } from '@md-to-pdf/ui'
import { readFromPaste } from '@md-to-pdf/core'
import { DropZone } from './components/DropZone'
import { Editor } from './components/Editor'
import { Preview } from './components/Preview'
import { Toolbar } from './components/Toolbar'
import { Skeleton } from './components/Skeleton'
import { ExportSheet } from './components/ExportSheet'

export default function App() {
    const [markdown, setMarkdown] = createSignal('')
    const [isEditorOpen, setIsEditorOpen] = createSignal(false)
    const [isLoading, setIsLoading] = createSignal(false)
    const [isExportSheetOpen, setIsExportSheetOpen] = createSignal(false)

    const triggerLoadingTransition = async (callback: () => void) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 400))
        callback()
        setIsLoading(false)
    }

    // 全局粘贴事件监听（仅在 DropZone 状态下生效）
    const handlePaste = async (e: ClipboardEvent) => {
        const target = e.target as HTMLElement
        if (!target) return

        // 如果焦点在可编辑元素中，不拦截原生粘贴行为
        const tag = target.tagName
        if (
            tag === 'TEXTAREA' ||
            tag === 'INPUT' ||
            target.isContentEditable
        ) {
            return
        }

        // 仅在 DropZone 状态（编辑器未打开）时接管粘贴
        if (isEditorOpen()) return

        const text = readFromPaste(e)
        if (text) {
            triggerLoadingTransition(() => {
                setMarkdown(text)
                setIsEditorOpen(true)
            })
        }
    }

    onMount(() => {
        document.addEventListener('paste', handlePaste)
    })

    onCleanup(() => {
        document.removeEventListener('paste', handlePaste)
    })

    const handleContent = (content: string) => {
        triggerLoadingTransition(() => {
            setMarkdown(content)
            setIsEditorOpen(true)
        })
    }

    const handleClear = () => {
        setMarkdown('')
        setIsEditorOpen(false)
    }

    return (
        <div class="h-screen w-full flex flex-col overflow-hidden bg-gray-50">
            <ToastContainer />

            {/* 当处于加载状态时，展示平滑骨架覆盖层 */}
            <Show when={isLoading()}>
                <Skeleton />
            </Show>

            <Show when={isEditorOpen()} fallback={<DropZone onContent={handleContent} />}>
                <Toolbar
                    markdown={markdown()}
                    onClear={handleClear}
                    onContent={handleContent}
                    onExportClick={() => setIsExportSheetOpen(true)}
                />

                {/* 主工作区 */}
                <main class="flex-1 min-h-0 !px-[10px] !py-[10px] mx-auto w-full px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-24 max-w-[2560px] py-6">
                    <div class="grid gap-5 sm:gap-6 h-full grid-cols-1 lg:grid-cols-2">
                        {/* 左栏 — 编辑器 */}
                        <div class="no-print h-full min-h-0">
                            <Editor value={markdown()} onChange={setMarkdown} />
                        </div>

                        {/* 右栏 — 预览 */}
                        <div class="h-full min-h-0">
                            <Preview markdown={markdown()} />
                        </div>
                    </div>
                </main>
            </Show>

            <ExportSheet
                isOpen={isExportSheetOpen()}
                onClose={() => setIsExportSheetOpen(false)}
                markdown={markdown()}
            />
        </div>
    )
}
