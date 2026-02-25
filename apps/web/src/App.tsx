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
    const [isZenMode, setIsZenMode] = createSignal(false)
    const [isExportSheetOpen, setIsExportSheetOpen] = createSignal(false)

    const triggerLoadingTransition = async (callback: () => void) => {
        setIsLoading(true)
        // 模拟文件解析的极速白屏过渡，维持苹果式的平滑感知 (约 400ms)
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

    // ESC 退出专注模式
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isZenMode()) {
            setIsZenMode(false)
        }
    }

    onMount(() => {
        document.addEventListener('paste', handlePaste)
        document.addEventListener('keydown', handleKeyDown)
    })

    onCleanup(() => {
        document.removeEventListener('paste', handlePaste)
        document.removeEventListener('keydown', handleKeyDown)
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
        setIsZenMode(false)
    }

    return (
        <div class={`h-screen w-full flex flex-col overflow-hidden transition-colors duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isZenMode() ? 'bg-black' : 'bg-gray-50'}`}>
            <ToastContainer />

            {/* 当处于加载状态时，无论当前在哪，都展示平滑骨架覆盖层 */}
            <Show when={isLoading()}>
                <Skeleton />
            </Show>

            <Show when={isEditorOpen()} fallback={<DropZone onContent={handleContent} />}>
                <Toolbar
                    markdown={markdown()}
                    onClear={handleClear}
                    onContent={handleContent}
                    isZenMode={isZenMode()}
                    onToggleZen={() => setIsZenMode(!isZenMode())}
                    onExportClick={() => setIsExportSheetOpen(true)}
                />

                {/* 主工作区 */}
                <main class={`flex-1 min-h-0 !px-[10px] !py-[10px] mx-auto w-full transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                 
                 ${isZenMode() ? 'px-6 sm:px-8 max-w-4xl py-6' : 'px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-24 max-w-[2560px] py-6'}`}>

                    <div class={`grid gap-5 sm:gap-6 h-full transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${isZenMode() ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>

                        {/* 左栏 — 编辑器 */}
                        <div class="no-print h-full min-h-0 ease-[cubic-bezier(0.16,1,0.3,1)]">
                            <Editor value={markdown()} onChange={setMarkdown} isZenMode={isZenMode()} />
                        </div>

                        {/* 右栏 — 预览 (专注模式下平滑隐藏) */}
                        <div class={`h-full min-h-0 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-left
                            ${isZenMode() ? 'opacity-0 scale-x-95 w-0 overflow-hidden' : 'opacity-100 scale-100 w-full'}`}>
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

