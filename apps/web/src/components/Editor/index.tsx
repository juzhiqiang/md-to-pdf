/**
 * Editor — Markdown 编辑区
 * 左侧代码/文本编辑面板，带行号与实时更新
 */
import { createEffect, onCleanup, onMount } from 'solid-js'
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine, ViewUpdate } from "@codemirror/view"
import { markdown } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { oneDark } from "@codemirror/theme-one-dark"

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

const appleTheme = EditorView.theme({
    "&": {
        color: "#e5e7eb",
        backgroundColor: "transparent !important",
        height: "100%",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    },
    ".cm-content": {
        paddingTop: "24px",
        paddingBottom: "24px",
        fontFamily: "inherit"
    },
    "&.cm-focused": {
        outline: "none !important" // clear default focus outline
    },
    "&.cm-focused .cm-cursor": {
        borderLeftColor: "#0A84FF",
        borderLeftWidth: "2px"
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "rgba(10, 132, 255, 0.3) !important"
    },
    ".cm-gutters": {
        backgroundColor: "transparent !important",
        color: "#6b7280",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "inherit",
        minWidth: "40px",
        display: "flex",
        justifyContent: "flex-end"
    },
    ".cm-lineNumbers .cm-gutterElement": {
        paddingRight: "12px",
        fontSize: "13px"
    },
    ".cm-activeLineGutter": {
        backgroundColor: "rgba(255, 255, 255, 0.05) !important",
        color: "#e5e7eb"
    },
    ".cm-activeLine": {
        backgroundColor: "rgba(255, 255, 255, 0.05) !important"
    },
    ".cm-scroller": {
        fontFamily: "inherit"
    },
    ".cm-lineWrapping": {
        wordBreak: "break-word"
    }
}, { dark: true })

export function Editor(props: EditorProps & { isZenMode?: boolean }) {
    let editorContainerRef: HTMLDivElement | undefined
    let view: EditorView | undefined

    onMount(() => {
        if (!editorContainerRef) return

        const state = EditorState.create({
            doc: props.value,
            extensions: [
                keymap.of([...defaultKeymap, ...historyKeymap]),
                history(),
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightActiveLine(),
                markdown({ codeLanguages: languages }),
                oneDark, // base syntax highlighting
                appleTheme, // overrides
                EditorView.lineWrapping,
                EditorView.updateListener.of((update: ViewUpdate) => {
                    if (update.docChanged) {
                        props.onChange(update.state.doc.toString())
                    }
                })
            ]
        })

        view = new EditorView({
            state,
            parent: editorContainerRef
        })
    })

    createEffect(() => {
        if (view && view.state.doc.toString() !== props.value) {
            view.dispatch({
                changes: { from: 0, to: view.state.doc.length, insert: props.value }
            })
        }
    })

    onCleanup(() => {
        if (view) {
            view.destroy()
        }
    })

    return (
        <div class={`flex flex-col no-print overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
            ${props.isZenMode
                ? 'bg-[#000000] h-full border-0 rounded-none w-full max-w-4xl mx-auto'
                : 'bg-[#1e1e1e] h-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-800/50 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'}`}
        >
            {/* Mac 风格编辑器头部 */}
            <div class={`flex items-center !px-5 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden origin-top
                ${props.isZenMode ? 'h-0 opacity-0 border-transparent' : 'h-12 bg-[#252526] border-b border-[#333333]'}`}>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:bg-[#ff5f56]/80 transition-colors"></div>
                    <div class="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:bg-[#ffbd2e]/80 transition-colors"></div>
                    <div class="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:bg-[#27c93f]/80 transition-colors"></div>
                </div>
                <div class="flex-1 flex justify-center">
                    <span class="text-[11px] font-semibold text-gray-400 tracking-wider uppercase whitespace-nowrap">Markdown Editor</span>
                </div>
                <div class="w-12"></div>{/* Spacer for centering */}
            </div>

            {/* 编辑区域 */}
            <div class={`flex-1 overflow-hidden relative group transition-all duration-700
                ${props.isZenMode ? 'py-12' : ''}`}>
                {/* 内部微弱光晕 (仅非专注模式) */}
                {!props.isZenMode && (
                    <div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] transition-opacity duration-300"></div>
                )}

                {/* CodeMirror 容器 */}
                <div
                    ref={editorContainerRef!}
                    class={`w-full h-full custom-scrollbar transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${props.isZenMode ? 'text-[18px] leading-[1.8] max-w-3xl mx-auto' : 'text-[15px] leading-relaxed'}`}
                />
            </div>
        </div>
    )
}
