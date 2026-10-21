// 作品目录数据。页面会自动读取，不需要手工维护分类列表。
//
// 分类字段：
//   id      稳定标识，用于 works.html#data 这类链接
//   label   显示名称
//   note    一句话说明
//
// 作品字段：
//   year       年份（数字）
//   category   分类 id，必须对应 CATEGORIES 中的一项
//   slug       稳定标识，用于目录锚点
//   type       作品形态，比如 数据可视化 / 深度报道 / 摄影
//   title      标题
//   summary    两到三句话：做了什么、发现了什么
//   link       作品详情页或外部网址；没有就写 ''
//   label      链接文字，默认「查看作品」
//   facts      数据事实条，数组，每项 { value, label }；没有就不显示
//   tile       可选：作品卡自定义视觉，目前支持 { type: 'ranks', items: [...] }
//   tags       关键词数组
//   image      可选缩略图路径
//   imageAlt   缩略图替代文字
//   featured   可选；首页优先展示这一件

window.CATEGORIES = [
  { id: 'data', label: '数据分析', note: '统计、可视化与数据核对' },
  { id: 'interview', label: '访谈', note: '人物、口述与对话' },
  { id: 'research', label: '社会调查', note: '现场、问卷与观察' },
  { id: 'design', label: '设计', note: '海报、信息图与视觉设计' },
  { id: 'visual', label: '影像', note: '摄影与视频' },
  { id: 'writing', label: '文字', note: '评论、报道与随笔' },
];

window.WORKS = [
  {
    year: 2026,
    category: 'data',
    slug: 'xiamen',
    type: '数据可视化',
    title: '厦门：人口第三，城镇化率第一',
    summary:
      '2024 年末，厦门人口 535 万，全省第三；城镇化率 91.0%，全省第一；' +
      '人均 GDP 160,888 元，全省第二。同一座城市，换一把尺子，' +
      '排名就从第三变成第一，再变成第二。',
    link: 'work-xiamen.html',
    label: '进入数据故事',
    facts: [
      { value: '535 万', label: '2024 年末常住人口 · 全省第 3' },
      { value: '91.0%', label: '2024 年城镇化率 · 全省第 1' },
      { value: '160,888 元', label: '2024 年人均 GDP · 全省第 2' },
    ],
    tile: {
      type: 'ranks',
      items: [
        { label: '人口', value: '第 3', width: 60 },
        { label: '城镇化率', value: '第 1', width: 100 },
        { label: '人均 GDP', value: '第 2', width: 80 },
      ],
    },
    tags: ['数据新闻', 'ECharts', '数据核对'],
    image: 'assets/xiamen-chart.png',
    imageAlt: '2025 年福建九市城镇化率对比图，厦门以 91.3% 居首',
    featured: true,
  },
  {
    year: 2026,
    category: 'design',
    slug: 'sleep-earlier',
    type: '海报 / 健康科普',
    title: '早睡一小时，今晚放下手机',
    summary:
      '一张面向大学生的青春健康科普海报。画面用夜间卧室、23:00 的时钟和床边的手机，' +
      '把「早睡」落到一个具体的今晚动作。',
    link: 'work-sleep-earlier.html',
    label: '查看海报',
    facts: [],
    tags: ['健康传播', '海报设计', '数据引用'],
    image: 'assets/sleep-earlier-poster-thumb.webp',
    imageAlt: '早睡一小时健康科普海报，夜晚卧室中显示 23:00 的时钟和床边的手机',
    featured: false,
  },
];
