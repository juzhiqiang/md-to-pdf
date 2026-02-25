/**
 * Editor — Markdown 编辑区
 * 左侧代码/文本编辑面板，带行号与实时更新
 * 
 * 优化：仅按需加载常用语言，而非全量导入 @codemirror/language-data
 */
import { createEffect, onCleanup, onMount } from 'solid-js'
import { EditorState } from "@codemirror/state"
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine, ViewUpdate } from "@codemirror/view"
import { markdown } from "@codemirror/lang-markdown"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { oneDark } from "@codemirror/theme-one-dark"
import { LanguageDescription } from "@codemirror/language"

interface EditorProps {
    value: string
    onChange: (value: string) => void
}

/**
 * 按需懒加载常用语言，替代全量导入 `languages` from `@codemirror/language-data`
 * 每种语言仅在代码块首次使用时才会 import，减少主包体积
 */
const commonLanguages: LanguageDescription[] = [
    LanguageDescription.of({ name: "JavaScript", alias: ["js", "jsx"], extensions: ["js", "jsx", "mjs"], load: () => import("@codemirror/lang-javascript").then(m => m.javascript({ jsx: true })) }),
    LanguageDescription.of({ name: "TypeScript", alias: ["ts", "tsx"], extensions: ["ts", "tsx", "mts"], load: () => import("@codemirror/lang-javascript").then(m => m.javascript({ jsx: true, typescript: true })) }),
    LanguageDescription.of({ name: "HTML", alias: ["htm"], extensions: ["html", "htm"], load: () => import("@codemirror/lang-html").then(m => m.html()) }),
    LanguageDescription.of({ name: "CSS", alias: ["less", "scss", "sass"], extensions: ["css", "less", "scss"], load: () => import("@codemirror/lang-css").then(m => m.css()) }),
    LanguageDescription.of({ name: "JSON", extensions: ["json"], load: () => import("@codemirror/lang-json").then(m => m.json()) }),
    LanguageDescription.of({ name: "Python", alias: ["py"], extensions: ["py"], load: () => import("@codemirror/lang-python").then(m => m.python()) }),
]

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
        outline: "none"
    },
    ".cm-gutters": {
        backgroundColor: "transparent",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        color: "#4b5563",
        fontFamily: "inherit"
    },
    ".cm-activeLineGutter": {
        backgroundColor: "transparent",
        color: "#9ca3af"
    },
    ".cm-activeLine": {
        backgroundColor: "rgba(255, 255, 255, 0.03)"
    },
    ".cm-cursor": {
        borderLeftColor: "#60a5fa",
        borderLeftWidth: "2px"
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
        backgroundColor: "rgba(96, 165, 250, 0.2) !important"
    },
    ".cm-scroller": {
        overflow: "auto",
    }
})

export function Editor(props: EditorProps) {
    let editorContainerRef: HTMLDivElement
    let view: EditorView | undefined

    onMount(() => {
        const state = EditorState.create({
            doc: props.value,
            extensions: [
                keymap.of([...defaultKeymap, ...historyKeymap]),
                history(),
                lineNumbers(),
                highlightActiveLineGutter(),
                highlightActiveLine(),
                markdown({ codeLanguages: commonLanguages }),
                oneDark,
                appleTheme,
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
        <div class="flex flex-col no-print overflow-hidden bg-[#1e1e1e] h-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-800/50 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            {/* Mac 风格编辑器头部 */}
            <div class="flex items-center !px-5 h-12 bg-[#252526] border-b border-[#333333]">
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
            <div class="flex-1 overflow-hidden relative group">
                <div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]"></div>
                <div
                    ref={editorContainerRef!}
                    class="w-full h-full custom-scrollbar text-[15px] leading-relaxed"
                />
            </div>
        </div>
    )
}
