# Berry Chen 的个人主页

[berrychen0w0.github.io](https://berrychen0w0.github.io) 使用 Astro 构建，由 GitHub Pages 发布。

## 写作和发布

- 草稿存放在公开仓库之外，或者放在 Git 已忽略的 `_drafts-local/`。原仓库的草稿已在当前工作区移到这个目录，本地草稿请另行备份。
- 准备发布时，将 Markdown 放进 `content/notes/`（笔记）或 `content/journal/`（随笔）。文件名不需要日期或固定格式，正文的首个一级标题可用作文章标题。没有一级标题时使用文件名。
- `content/notes/` 下的子目录会自动显示在笔记分类树中，例如 `content/notes/零知识证明/电路与约束/`。目录名用作分类名。
- 配图可以和文章放在同一目录，用 `![图片说明](./picture.jpg)` 引用。笔记支持行内 `$…$`、独立 `$$` 数学块、表格和脚注。
- 新文章的展示日期取 Git 中第一次提交该文件的日期，之后的内容变更可显示更新日期。首次提交前的本地预览可省略日期。文章目录和文件名决定网址，已经分享的文章改名时需要同时保留原网址。
- 历史文章保存在 `_posts/`，保留旧网址和原文。已有的日期优先用于显示。这也是唯一仍需解析 Jekyll 写法的目录。

## 本地预览

使用 Node 24（例如 `nvm use`）。

```sh
npm ci
npm run dev
npm run build
```

在仓库的 **Settings → Pages** 中选择 **GitHub Actions** 作为发布来源。推送到 `main` 后，工作流会构建并发布 `dist/`。

## 访问统计

1. 在 [Cloudflare Web Analytics](https://dash.cloudflare.com/?to=/:account/web-analytics) 中添加 `berrychen0w0.github.io`，打开 **Manage site**，复制统计脚本里 `token` 的值。
2. 在 [GitHub 仓库的 Actions Variables](https://github.com/BerryChen0w0/BerryChen0w0.github.io/settings/variables/actions) 新建仓库变量 `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN`，填入该值。它是公开的站点标识，会写入发布后的 HTML。
3. 推送到 `main`，或在 Actions 中手动运行 **Build and Deploy**。部署后可在 Cloudflare 仪表盘查看访问数据。

变量留空时，构建会省略统计脚本。开发预览、PR 构建和 404 页面也会省略脚本。

## 站点语言

默认网址显示中文界面，`/en/` 下的对应网址显示英文界面。导航栏里的语言入口会打开当前页面的另一语言版本。同一篇笔记、随笔仍使用同一份 Markdown，两个界面都展示原文。研究页正文随界面语言切换。
