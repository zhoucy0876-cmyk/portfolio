# 周成宇 · 作品集

一个没有构建步骤的静态作品集：首页做自我介绍和目录预览，`works.html` 按内容分类展示全部作品，每件作品有独立详情页。视觉上是浅色 Apple-like 目录 + 少量暗色数据章节。

## 页面

    index.html          首页：自我介绍、目录预览、精选作品、关于、联系
    works.html          完整目录：分类索引、筛选、分组作品
    work-xiamen.html    厦门数据故事（第一件作品）
    work-sleep-earlier.html 早睡一小时海报
    templates/work.html 新作品模板

## 怎么看

直接双击 `index.html` 也能看；但目录里的作品链接和数据页需要相对路径，建议用本地服务器：

    node serve.js
    # 打开 http://localhost:5174/portfolio/

`xiamen-city-data/` 是随作品一并发布的交互数据页镜像。原始数据工程仍位于上一级目录；更新数据后，把改动同步到 `portfolio/xiamen-city-data/` 再发布。

独立预览数据项目：

    node xiamen-city-data/serve.js
    # 打开 http://localhost:5173/

## 分类

分类定义在 `works.js` 顶部的 `CATEGORIES`：

    data       数据分析
    interview  访谈
    research   社会调查
    design     设计
    visual     影像
    writing    文字

目录页会显示所有分类和数量；没有作品的分类显示「还没有作品」。首页只显示已有作品的分类。

## 加一件新作品

1. 打开 `works.js`，在 `WORKS` 里增加一条：

       {
         year: 2026,
         category: 'interview',
         slug: 'my-interview',
         type: '深度访谈',
         title: '作品标题',
         summary: '两到三句话说清楚做了什么、发现了什么。',
         link: 'my-interview.html',
         label: '读作品',
         facts: [],
         tags: ['访谈', '人物'],
         image: '',
         featured: false
       }

2. 复制 `templates/work.html` 到 `portfolio/` 根目录，改名为 `my-interview.html`。
3. 把模板里的 `../` 路径去掉（例如 `../style.css` 改成 `style.css`）。
4. 填写标题、元信息和正文；访谈保留 Q&A 区块，数据分析保留方法区块，不需要的区块删掉。
5. 刷新 `works.html`，目录会自动出现。

`category` 必须对应 `CATEGORIES` 里的 `id`；`slug` 用于稳定标识；`featured: true` 会让首页优先展示这一件。没有 `link` 的作品也可以先放进目录，之后再补详情页。

`tile` 只用于需要自定义数据卡的作品；普通作品填 `image` 即可，没有 `tile` 时会自动使用封面图。

## 当前内容口径

目录目前有两件作品：厦门数据故事和「早睡一小时」海报。

厦门项目的数据事实已经按数据页修订记录统一：

- 2024 年末厦门常住人口 535 万，全省第三。
- 2024 年城镇化率 91.0%，全省第一。
- 2024 年人均 GDP 160,888 元，全省第二；福州 167,787 元。
- 厦门人均 GDP 只在 2022 年全省第一，2023 年起低于福州。
- 2025 年泉州数据未发布，人口和城镇化率排名只在八个市中成立。

说明页里的三处错误修正值保持不变：全省 GDP 57,761.02 亿元、福州 GDP 14,236.76 亿元、福州人均 GDP 167,787 元。

## 设计与动效

- 浅灰白背景、无衬线大标题、长文衬线正文、信号红强调；作品卡用细线分隔，不使用阴影或厚重容器。
- 首页精选作品和厦门数据故事使用少量暗色章节。
- 首屏文字和作品卡进入视口时轻微显现；作品图悬停放大并浮现查看标签，数据排名条响应鼠标，分类筛选和页面转场都有明确反馈。
- 桌面端只保留两个 sticky 数据图表章节；移动端改为指标按钮和静态图表。
- 所有动效尊重 `prefers-reduced-motion: reduce`；不支持 View Transitions 的浏览器会正常跳转。

## 关于手机号

联系方式保留了手机号，手机上点一下就能拨。网站挂到公网后手机号可能被爬虫抓走、进营销名单；如果以后不想公开，删掉 `index.html` 里的 `tel:` 一行即可。

## 发布上线

静态站免费发布在 GitHub Pages。本目录本身就是发布仓库根目录：

1. 新建公开仓库 `portfolio`，把本目录提交到 `main`。
2. 在 **Settings → Pages** 中选择 **Deploy from a branch**、`main` 和 `/ (root)`。
3. 访问 `https://用户名.github.io/portfolio/`。

GitHub Pages 是公开的，联系方式也会随之公开。

## 说明

厦门页附录中的截图来自真实数据页，不是 AI 生成图。作品集里的图应该是自己的作品。
