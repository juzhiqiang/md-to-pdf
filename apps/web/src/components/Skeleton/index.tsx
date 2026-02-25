import { JSX } from 'solid-js'

export function Skeleton() {
    return (
        <div class="fixed inset-0 bg-gray-50/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center animate-fade-in">
            {/* SF Spinner (Apple原生风格菊花动画) */}
            <div class="mb-8 relative w-12 h-12 flex items-center justify-center">
                <div class="absolute w-full h-full animate-[spin_1s_steps(12)_infinite]">
                    {[...Array(12)].map((_, i) => (
                        <div
                            class="absolute top-[10%] left-1/2 w-[10%] h-[25%] -ml-[5%] bg-gray-400 rounded-full"
                            style={{
                                transform: `rotate(${i * 30}deg)`,
                                'transform-origin': '50% 160%',
                                opacity: Math.max(0.1, 1 - (12 - i) * 0.08),
                            }}
                        />
                    ))}
                </div>
            </div>

            <div class="text-sm font-medium text-gray-500 mb-10 tracking-wide animate-pulse">正在解析文档...</div>

            {/* 骨架屏 (Mac OS UI Shimmer) */}
            <div class="w-full max-w-4xl px-8 flex gap-8 opacity-50">
                {/* Editor Skeleton */}
                <div class="flex-1 space-y-4">
                    <div class="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
                {/* Preview Skeleton */}
                <div class="flex-1 space-y-4">
                    <div class="h-8 bg-gray-200 rounded animate-pulse w-2/3 mb-6"></div>
                    <div class="h-16 bg-gray-200 rounded animate-pulse w-full mb-4"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-11/12"></div>
                    <div class="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                </div>
            </div>
        </div>
    )
}
