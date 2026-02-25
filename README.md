# MD-to-PDF

一个基于 **SolidJS + Tailwind CSS v4** 的纯前端 Markdown 预览与 PDF 导出工具。

无需后端，所有解析和导出在浏览器端完成。

## ✨ 功能

- **实时预览** — 左侧编辑 Markdown，右侧实时渲染 HTML 预览
- **PDF 导出** — 利用浏览器原生渲染 + `@media print` 优化，导出高清 PDF
- **GFM 支持** — 完整支持 GitHub Flavored Markdown（表格、代码块、任务列表等）
- **代码块语言标签** — 代码块右上角自动显示语言类型
- **文件操作** — 支持拖拽上传 `.md` 文件、点击选取、`Ctrl+V` 粘贴
- **零后端** — 纯客户端，数据不出浏览器

## 📦 项目结构

```
md-to-pdf/
├── apps/web/          # Vite + SolidJS 主应用
├── packages/core/     # Markdown 解析、文件读取、PDF 导出
├── packages/ui/       # 基础 UI 组件（Button, Card, Toast）
├── biome.json         # BiomeJS 代码规范
└── turbo.json         # Turborepo 任务编排
```

采用 `pnpm workspace` + `Turborepo` 的 Monorepo 结构。

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev --filter @md-to-pdf/web

# 构建生产版本
pnpm build
```

## 🛠 技术栈

| 模块 | 技术 |
|------|------|
| 框架 | SolidJS |
| 样式 | Tailwind CSS v4 |
| 构建 | Vite |
| Markdown 解析 | marked + marked-highlight |
| 代码编辑 | CodeMirror 6 |
| 代码规范 | BiomeJS |
| 包管理 | pnpm workspace + Turborepo |

## 📄 License

MIT
