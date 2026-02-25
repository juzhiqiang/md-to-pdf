/**
 * @md-to-pdf/ui — Card 卡片组件
 * 遵循 🍎 品牌设计系统 v1.0 卡片规范
 */
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type CardVariant = 'elevated' | 'outlined' | 'filled'

export interface CardProps extends ParentProps {
    variant?: CardVariant
    interactive?: boolean
    class?: string
    onClick?: () => void
}

const variantClasses: Record<CardVariant, string> = {
    elevated: 'bg-white shadow-sm',
    outlined: 'bg-white border border-gray-200',
    filled: 'bg-gray-50',
}

const interactiveClasses =
    'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 focus:ring-2 focus:ring-primary-300 transition-all duration-200'

export function Card(props: CardProps) {
    const [local, rest] = splitProps(props, [
        'variant',
        'interactive',
        'class',
        'onClick',
        'children',
    ])

    const variant = () => local.variant || 'elevated'

    return (
        <div
            class={`rounded-xl p-5 ${variantClasses[variant()]} ${local.interactive ? interactiveClasses : ''} ${local.class || ''}`}
            onClick={() => local.onClick?.()}
            role={local.interactive ? 'button' : undefined}
            tabIndex={local.interactive ? 0 : undefined}
        >
            {local.children}
        </div>
    )
}
