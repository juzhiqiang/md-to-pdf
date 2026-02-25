/**
 * DropZone — 初始拖拽/上传/粘贴区域
 * 当编辑器为空时显示，引导用户输入 Markdown 内容
 */
import { createSignal } from 'solid-js'
import { Button } from '@md-to-pdf/ui'
import { readFromDrop, openFileDialog } from '@md-to-pdf/core'

interface DropZoneProps {
    onContent: (content: string) => void
}

export function DropZone(props: DropZoneProps) {
    const [isDragging, setIsDragging] = createSignal(false)

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = async (e: DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        try {
            const content = await readFromDrop(e)
            if (content) props.onContent(content)
        } catch (err) {
            console.error(err)
        }
    }

    const handleFileSelect = async () => {
        const content = await openFileDialog()
        if (content) props.onContent(content)
    }

    return (
        <div
            class="relative w-full h-[100vh] flex flex-col pt-12 overflow-hidden bg-gray-50/50"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* 深层光晕特效 (仅作为背景点缀) */}
            <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-400/20 blur-[100px] rounded-full mix-blend-multiply opacity-60"></div>

            {/* Mac-like Titlebar (局部伪装) */}
            <div class="absolute top-0 left-0 right-0 h-10 bg-white/40 backdrop-blur-xl border-b border-white/20 flex items-center px-4 z-50">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-400"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div class="flex-1 text-center text-xs font-semibold text-gray-500 tracking-wide">MD-to-PDF</div>
                <div class="w-16"></div>{/* Spacer */}
            </div>

            {/* 核心内容区 */}
            <div
                class={`flex-1 flex flex-col items-center justify-center z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isDragging() ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}
            >
                {/* 巨大平滑渐变的文档图标 */}
                <div class={`relative mb-8 transition-transform duration-500 ${isDragging() ? 'rotate-[-6deg] scale-110' : ''}`}>
                    <svg class="w-40 h-40 drop-shadow-2xl" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="doc-gradient" x1="0" y1="0" x2="100" y2="130" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="#818CF8" />
                                <stop offset="100%" stop-color="#4F46E5" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="8" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <path d="M10 10C10 4.47715 14.4772 0 20 0H65L100 35V110C100 115.523 95.5228 120 90 120H20C14.4772 120 10 115.523 10 110V10Z" fill="url(#doc-gradient)" />
                        <path d="M65 0V25C65 30.5228 69.4772 35 75 35H100" fill="#fff" fill-opacity="0.3" />
                        <text x="55" y="75" font-family="'Inter', sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">MD</text>
                    </svg>
                    {/* 拖拽时的外侧发光涟漪 */}
                    {isDragging() && (
                        <div class="absolute inset-0 z-[-1] animate-ping opacity-30 bg-primary-400 rounded-3xl scale-125"></div>
                    )}
                </div>

                <h1 class="text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight drop-shadow-sm">释放您的 Markdown 灵感</h1>
                <p class="text-lg text-gray-500 mb-10 text-center max-w-md">
                    拖拽文件至此，或者点击下方按钮浏览。
                </p>

                {/* Pill 按键区 */}
                <div class="flex items-center gap-4">
                    <button
                        onClick={handleFileSelect}
                        class="group relative overflow-hidden rounded-full bg-white/70 backdrop-blur-xl border border-white/50 px-8 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                        <div class="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors"></div>
                        <span class="relative text-primary-600 font-semibold text-sm flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            浏览文件
                        </span>
                    </button>

                    <button
                        onClick={() => props.onContent('')}
                        class="rounded-full bg-transparent border-2 border-transparent px-8 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors duration-200 active:scale-95"
                    >
                        新建空白文档
                    </button>
                </div>
            </div>

            {/* Apple 风格边界效果 */}
            <div class={`absolute inset-4 rounded-[2rem] border-2 pointer-events-none transition-all duration-500 ${isDragging() ? 'border-primary-400/50 scale-[0.98]' : 'border-transparent'
                }`}></div>
        </div>
    )
}
