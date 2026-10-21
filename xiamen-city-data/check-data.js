// 数据体检：改完 data/ 里的 CSV 后跑一下，确认没有填错。
// 用法：node check-data.js

global.window = {};
require('./web/data.js');
const { cities, districts } = global.window.DATA;

let problems = 0;
let checked = 0;

// 1. 城镇人口 + 乡村人口 必须等于常住人口
for (const d of cities) {
  if (d.population === null || d.urbanPop === null || d.ruralPop === null) continue;
  checked++;
  const sum = Number((d.urbanPop + d.ruralPop).toFixed(2));
  if (Math.abs(sum - d.population) > 0.011) {
    console.log(`✗ ${d.year} ${d.region}：城镇 ${d.urbanPop} + 乡村 ${d.ruralPop} = ${sum}，但常住为 ${d.population}`);
    problems++;
  }
}
console.log(problems === 0 ? `✓ 城镇人口＋乡村人口＝常住人口（${checked}/${checked} 通过）` : '');

// 2. 厦门六区 GDP 合计 与 全市 的差额
for (const year of [2022, 2023, 2024]) {
  const rows = districts.filter((d) => d.year === year);
  const city = cities.find((c) => c.year === year && c.region === '厦门');
  const sum = rows.reduce((a, d) => a + d.gdp, 0);
  const diff = Number((sum - city.gdp).toFixed(2));
  console.log(`  ${year} 六区 GDP 合计 ${sum.toFixed(2)} vs 全市 ${city.gdp.toFixed(2)}，差 ${diff.toFixed(2)} 亿元`);
}

// 3. 城镇化率 必须等于 城镇人口 / 常住人口
//    容差取 0.15 个百分点：年鉴会把 64.1497% 印成 64.2%（先舍入到 64.15 再舍入到 64.2），
//    这种「双重舍入」会带来约 0.1 个百分点的正常偏差。
for (const d of cities) {
  if (d.urbanization === null || d.population === null || d.urbanPop === null) continue;
  const calc = Number(((d.urbanPop / d.population) * 100).toFixed(1));
  if (Math.abs(calc - d.urbanization) > 0.15) {
    console.log(`✗ ${d.year} ${d.region}：城镇化率 ${d.urbanization}%，但城镇/常住 = ${calc}%`);
    problems++;
  }
}
console.log(problems === 0 ? '✓ 城镇化率与人口数自洽' : `\n共 ${problems} 处问题`);

// 4. 人均 GDP 应约等于 GDP ÷ 年末常住人口。
//    年鉴用的是年平均人口，所以会有小额偏差；偏差超过 1.5% 说明数字读错了。
for (const d of cities) {
  if (d.gdp === null || d.population === null || d.gdpPerCapita === null) continue;
  const calc = (d.gdp * 1e8) / (d.population * 1e4);
  const dev = ((calc - d.gdpPerCapita) / d.gdpPerCapita) * 100;
  // 全省那行的分母是全省人口，口径一致，同样适用；容差收紧到 0.8%。
  // 实测：正常的"年平均人口 vs 年末人口"偏差在 0.2% 上下，给到 0.7% 已经宽松。
  // 早先设 1.5% 漏掉过一处 GDP 转录错误，所以这里收紧。
  const limit = 0.7;
  if (Math.abs(dev) > limit) {
    console.log(
      `✗ ${d.year} ${d.region}：人均 GDP 标 ${d.gdpPerCapita}，` +
      `但 GDP ÷ 人口 = ${Math.round(calc)}（偏差 ${dev.toFixed(1)}%）`
    );
    problems++;
  }
}
console.log(problems === 0 ? '✓ 人均 GDP 与 GDP、人口自洽' : `\n共 ${problems} 处问题`);

// 5. 三次产业合计 ≈ GDP（容差 0.1 亿元，公报四舍五入会带来 ±0.01~0.02）
let industryChecked = 0;
for (const d of cities) {
  if (d.primary === null || d.secondary === null || d.tertiary === null || d.gdp === null) continue;
  industryChecked++;
  const sum = d.primary + d.secondary + d.tertiary;
  if (Math.abs(sum - d.gdp) > 0.1) {
    console.log(`✗ ${d.year} ${d.region}：三次产业合计 ${sum.toFixed(2)}，但 GDP 为 ${d.gdp.toFixed(2)}`);
    problems++;
  }
}
console.log(problems === 0 ? `✓ 三次产业合计＝GDP（${industryChecked}/${industryChecked} 通过）` : '');

// 6. 城镇收入必须高于农村收入
for (const d of cities) {
  if (d.urbanIncome === null || d.ruralIncome === null) continue;
  if (d.urbanIncome <= d.ruralIncome) {
    console.log(`✗ ${d.year} ${d.region}：城镇收入 ${d.urbanIncome} 未高于农村收入 ${d.ruralIncome}`);
    problems++;
  }
}
console.log(problems === 0 ? '✓ 城镇收入 > 农村收入' : `\n共 ${problems} 处问题`);
