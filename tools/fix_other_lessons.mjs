import fs from 'fs';

for (const file of ['./data/lessons-6-10.js', './data/lessons-11-14.js']) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replaceAll('<ruby>昨<rt>きのう</rt></ruby><ruby>日<rt></rt></ruby>', '<ruby>昨日<rt>きのう</rt></ruby>');
  content = content.replaceAll('<ruby>今<rt>きょう</rt></ruby><ruby>日<rt></rt></ruby>', '<ruby>今日<rt>きょう</rt></ruby>');
  content = content.replaceAll('<ruby>明<rt>あした</rt></ruby><ruby>日<rt></rt></ruby>', '<ruby>明日<rt>あした</rt></ruby>');
  content = content.replaceAll('<ruby>今<rt>け</rt></ruby><ruby>朝<rt>さ</rt></ruby>', '<ruby>今朝<rt>けさ</rt></ruby>');
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
}
