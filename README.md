# MD-to-PDF 预览与导出工具 🍎

一个基于 **SolidJS** 与 **Tailwind CSS v4** 构建的纯前端、零后端依赖的 Markdown 解析与高质量 PDF 导出工具。

## 🌟 核心特性

- **纯客户端架构**：无需服务器，所有解析与生成均在浏览器端完成，保证数据隐私与极速响应。
- **现代化技术栈**：使用 `pnpm workspace` 与 `Turborepo` 搭建企业级 Monorepo。
- **苹果级设计系统**：深入植入了 🍎 品牌设计系统 v1.0。包含平滑动画、细腻的阴影层级与毛玻璃特效。
- **全功能 Markdown**：内置 GitHub Flavored Markdown (GFM) 支持，完美渲染代码高亮、表格、引用等。
- **无缝文件互动**：支持拖拽上传 `.md` 文件、点击选取，以及全局 `Ctrl+V` 直接粘贴内容。
- **原生高清导出**：利用浏览器原生渲染管道（`window.print()`）结合专业的 `@media print` 打印防分页优化，导出的 PDF 具备像素级清晰度。

---

## 🏗 项目架构 (Monorepo)

```text
md-to-pdf/
├── apps/web/          # Vite + SolidJS 主应用 (双栏编辑器与预览视图)
├── packages/core/     # 业务逻辑核 (文件读取、Markdown AST 解析、PDF 生成)
├── packages/ui/       # 遵循 Apple 设计规范的基础组件库 (Button, Card, Toast)
├── biome.json         # BiomeJS 全局代码规约
└── turbo.json         # 任务编排与缓存策略
```

---

## 🚀 快速启动

1. **安装依赖**
   ```bash
   pnpm install
   # 如果提示需要 approve builds，请运行：
   pnpm approve-builds
   ```

2. **启动开发服务器**
   ```bash
   pnpm --filter @md-to-pdf/web dev
   ```
   或者直接进入 Web 目录：
   ```bash
   cd apps/web && npx vite --port 3000
   ```

3. **构建生产版本**
   ```bash
   pnpm build
   ```

---

## 🎨 下一代苹果级 UI 重塑计划 (Roadmap)

我们正致力于将该工具体验推向更极致的苹果生态水准。**8 个关键屏幕的重塑设计规范**已在设计案中确立：

1. **初始落地页 (DropZone)**：毛玻璃顶栏与超大平滑吸附动画。
2. **文件解析过渡态**：无缝的微光骨架屏。
3. **双栏沉浸式工作区**：带有精准同步滚动与弹性物理阻尼的反馈。
4. **纯粹专注模式 (Zen Mode)**：极致排版，隐藏一切无关干扰。
5. **导出设置拟物层 (Modal Sheet)**：类似 iOS Share Sheet 的底部弹出配置。
6. **动态岛通知 (Haptic Toast)**：导出成功的仿震动微互动。
7. **优雅的异常处理**：细腻的横向报错抖动动画。
8. **原生移动端适配**：底层运用抽屉式分段控制。

详细的设计组件清单、交互规格及无障碍合规细节，见设计规范文档。

---

*Built with passion for typography and deep appreciation for Apple Design Guidelines.*
