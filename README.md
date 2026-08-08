# Chiaro's Blog

这是 `reychiaro.github.io` 的 Hexo 源码分支。网站仍采用双分支结构：

- `blogs`：文章、页面、主题源码与构建配置；
- `main`：GitHub Pages 直接托管的静态网页，由 GitHub Actions 自动生成。

主题基于 Cactus，并已作为普通目录纳入版本控制，因此可以直接修改
`themes/cactus/`，不再依赖缺失的 submodule 或 gitlink。

## 本地环境

- Node.js 22（见 `.nvmrc`）；
- Pandoc；
- npm。

首次使用：

```bash
npm ci
npm run server
```

完整构建检查：

```bash
npm run check
```

生成结果位于 `public/`，它不会写回源码分支。

## 添加内容

普通文章：

```bash
npx hexo new post "my-post"
```

研究笔记和项目页面：

```bash
npx hexo new note "my-note"
npx hexo new project "my-project"
```

文章 Front Matter 可以直接添加分类、标签和公式开关：

```yaml
---
title: My Post
date: 2026-08-08 12:00:00
categories:
  - Research Notes
tags:
  - diffusion
mathjax: true
toc: true
---
```

行内公式使用 `$...$`，块级公式使用 `$$...$$`。公式由
`hexo-filter-mathjax` 在构建阶段生成，不需要在浏览器中重复加载 MathJax。

## 导航、分类和模板

- 导航栏：编辑 `source/_data/navigation.yml`；
- 分类：在文章的 `categories` 中直接填写新名称，`/categories/` 会自动汇总；
- 页面：放在 `source/<path>/index.md`，并在 Front Matter 中指定 `layout`；
- 页面模板：在 `scaffolds/` 添加内容脚手架，在 `themes/cactus/layout/` 添加对应布局；
- 主题选项：编辑 `_config.cactus.yml`；
- 站点选项：编辑 `_config.yml`。

## 发布

推送到 `blogs` 后，`.github/workflows/deploy.yml` 会安装依赖和 Pandoc、构建
Hexo，并将 `public/` 发布到 `main`。仍可使用 `npm run deploy` 手动发布，但日常
维护推荐只推送源码分支，避免本地生成文件混入提交。

上游主题版本与本地改动范围记录在 `themes/cactus/UPSTREAM.md`。
