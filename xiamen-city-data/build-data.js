// 把 data/ 里的两个 CSV 转成 web/data.js，页面双击就能打开（不需要本地服务器）。
// 用法：node build-data.js

const fs = require('fs');
const path = require('path');

const root = __dirname;

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    header.forEach((key, i) => { row[key] = cells[i]; });
    return row;
  });
}

// 空单元格转成 null，而不是 0——0 会被当成真实数据画进图里。
function num(raw) {
  const s = (raw === undefined || raw === null) ? '' : String(raw).trim();
  return s === '' ? null : Number(s);
}

const cities = parseCsv(fs.readFileSync(path.join(root, 'data', 'fujian-cities.csv'), 'utf8'))
  .map((r) => ({
    year: Number(r.year),
    region: r.region,
    population: num(r.population_wan),
    urbanPop: num(r.urban_pop_wan),
    ruralPop: num(r.rural_pop_wan),
    urbanization: num(r.urbanization_pct),
    gdp: num(r.gdp_100m_yuan),
    gdpPerCapita: num(r.gdp_per_capita_yuan),
    primary: num(r.primary_100m),
    secondary: num(r.secondary_100m),
    tertiary: num(r.tertiary_100m),
    urbanIncome: num(r.urban_income_yuan),
    ruralIncome: num(r.rural_income_yuan),
  }));

const districts = parseCsv(fs.readFileSync(path.join(root, 'data', 'xiamen-districts.csv'), 'utf8'))
  .map((r) => ({
    year: Number(r.year),
    district: r.district,
    island: r.island,
    population: num(r.population_wan),
    gdp: num(r.gdp_100m_yuan),
  }));

fs.writeFileSync(
  path.join(root, 'web', 'data.js'),
  'window.DATA = ' + JSON.stringify({ cities, districts }, null, 2) + ';\n',
  'utf8'
);

console.log('web/data.js 已生成：' + cities.length + ' 条城市记录，' + districts.length + ' 条区级记录');
