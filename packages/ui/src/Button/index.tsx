/**
 * @md-to-pdf/ui — Button 按钮组件
 * 遵循 🍎 品牌设计系统 v1.0 按钮规范
 */
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ParentProps {
    variant?: ButtonVariant
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    icon?: JSX.Element
    onClick?: () => void
    class?: string
    [key: string]: unknown // 允许任意 aria-*/data-* 原生属性透传
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 active:scale-[0.98]',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 active:scale-[0.98]',
    outline:
        'bg-transparent text-primary-500 border border-primary-500 hover:bg-primary-50 active:bg-primary-100 active:scale-[0.98]',
    ghost:
        'bg-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100 active:scale-[0.98]',
    destructive:
        'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 active:scale-[0.98]',
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
    md: 'h-10 px-4 text-sm font-semibold rounded-lg gap-2',
    lg: 'h-12 px-6 text-base font-semibold rounded-lg gap-2',
}

export function Button(props: ButtonProps) {
    const [local, rest] = splitProps(props, [
        'variant',
        'size',
        'disabled',
        'loading',
        'icon',
        'onClick',
        'class',
        'children',
    ])

    const variant = () => local.variant || 'primary'
    const size = () => local.size || 'md'
    const isDisabled = () => local.disabled || local.loading

    return (
        <button
            type="button"
            class={`inline-flex items-center justify-center transition-all duration-200 ease-out cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClasses[variant()]} ${sizeClasses[size()]} ${local.class || ''}`}
            disabled={isDisabled()}
            onClick={() => local.onClick?.()}
            {...rest}
        >
            {local.loading ? (
                <svg
                    class="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            ) : (
                local.icon
            )}
            {local.children}
        </button>
    )
}
