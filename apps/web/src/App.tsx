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

    // 使用可取消的 loading 计数器，避免并发竞态
    let loadingTimer: ReturnType<typeof setTimeout> | null = null

    const triggerLoadingTransition = (callback: () => void) => {
        // 取消上一次尚未完成的 loading
        if (loadingTimer) {
            clearTimeout(loadingTimer)
            loadingTimer = null
        }
        setIsLoading(true)
        loadingTimer = setTimeout(() => {
            loadingTimer = null
            callback()
            setIsLoading(false)
        }, 400)
    }

    // 全局粘贴事件监听（仅在 DropZone 状态下生效）
    const handlePaste = (e: ClipboardEvent) => {
        const target = e.target as HTMLElement
        if (!target) return

        const tag = target.tagName
        if (tag === 'TEXTAREA' || tag === 'INPUT' || target.isContentEditable) {
            return
        }

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
        // 清理未完成的 loading 定时器
        if (loadingTimer) {
            clearTimeout(loadingTimer)
            loadingTimer = null
        }
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

                <main class="flex-1 min-h-0 !px-2.5 !py-2.5 mx-auto w-full max-w-[2560px]">
                    <div class="grid gap-5 sm:gap-6 h-full grid-cols-1 lg:grid-cols-2">
                        <div class="no-print h-full min-h-0">
                            <Editor value={markdown()} onChange={setMarkdown} />
                        </div>
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
