# 作品页模板

加一件新作品时：

1. 打开 `works.js`，在 `WORKS` 里增加一条元数据。至少写 `year`、`category`、`slug`、`type`、`title`、`summary`、`link`，并按需要加 `tags`、`facts`、`featured`。
2. 把 `templates/work.html` 复制到 `portfolio/` 根目录，重命名为 `你的-slug.html`。
3. 打开新文件，把其中的 `../style.css`、`../works.js`、`../site.js`、`../index.html`、`../works.html` 路径改成不带 `../` 的本地路径。
4. 替换标题、导语、元信息和正文。访谈作品保留 Q&A 区块，数据分析作品保留方法区块，不需要的区块删掉。
5. 把 `works.js` 里的 `link` 指向新文件名，刷新 `works.html` 检查分类和链接。
6. 如果这是一件精选作品，在 `works.js` 里加 `featured: true`；首页会自动使用它。

模板文件本身不会出现在目录里，也不需要把 `templates` 文件夹从站点里删掉。
