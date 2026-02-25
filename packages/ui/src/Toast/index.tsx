/**
 * @md-to-pdf/ui — Toast 轻提示组件
 * 遵循 🍎 品牌设计系统 v1.0 通知规范 (Dynamic Island 风格)
 */
import { createSignal, Show } from 'solid-js'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface ToastMessage {
    id: number
    type: ToastType
    title: string
    description?: string
    duration?: number
}

const getIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return (
                <svg class="w-4 h-4 text-success-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            )
        case 'error':
            return (
                <svg class="w-4 h-4 text-error-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            )
        case 'warning':
            return (
                <svg class="w-4 h-4 text-warning-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        case 'info':
        default:
            return (
                <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
            )
    }
}

// 全局 Toast 状态
const [toasts, setToasts] = createSignal<ToastMessage[]>([])
let toastId = 0

/** 显示一条 Toast 通知 */
export function showToast(
    type: ToastType,
    title: string,
    description?: string,
    duration = 3000,
) {
    const id = ++toastId
    const toast: ToastMessage = { id, type, title, description, duration }

    setToasts((prev) => [...prev.slice(-2), toast])

    if (duration > 0) {
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
    }

    return id
}

/** 手动关闭 Toast */
export function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
}

/** Toast 容器组件 — 放置在 App 根节点 */
export function ToastContainer() {
    return (
        <div class="fixed top-6 left-0 right-0 z-[60] flex flex-col items-center gap-3 print:hidden pointer-events-none" role="alert">
            <style>
                {`
            @keyframes islandIn {
                0% { transform: translateY(-150%) scale(0.8); opacity: 0; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            .animate-island-in {
                animation: islandIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            `}
            </style>
            {toasts().map((toast) => {
                return (
                    <div
                        class={`pointer-events-auto bg-[#1a1a1b]/90 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.3)] pl-4 pr-5 py-3 
                        flex items-center gap-3 transition-all duration-[400ms] animate-island-in`}
                    >
                        <div class="flex-shrink-0 flex items-center justify-center bg-white/10 rounded-full w-8 h-8">
                            {getIcon(toast.type)}
                        </div>
                        <div class="flex flex-col min-w-0 max-w-[320px]">
                            <p class="text-[14px] font-semibold text-white tracking-wide leading-tight truncate">{toast.title}</p>
                            <Show when={toast.description}>
                                <p class="text-[12px] text-gray-300 mt-0.5 leading-[1.3] truncate">{toast.description}</p>
                            </Show>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
