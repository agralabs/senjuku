import fs from 'fs';

let l1 = fs.readFileSync('./data/lessons-1-5.js', 'utf8');

// Fix compound kanji ruby tags
l1 = l1.replaceAll('<ruby>昨<rt>きのう</rt></ruby><ruby>日<rt></rt></ruby>', '<ruby>昨日<rt>きのう</rt></ruby>');
l1 = l1.replaceAll('<ruby>今<rt>きょう</rt></ruby><ruby>日<rt></rt></ruby>', '<ruby>今日<rt>きょう</rt></ruby>');
l1 = l1.replaceAll('<ruby>明<rt>あした</rt></ruby><ruby>日<rt></rt></ruby>', '<ruby>明日<rt>あした</rt></ruby>');
l1 = l1.replaceAll('<ruby>今<rt>け</rt></ruby><ruby>朝<rt>さ</rt></ruby>', '<ruby>今朝<rt>けさ</rt></ruby>');

fs.writeFileSync('./data/lessons-1-5.js', l1, 'utf8');
console.log('Fixed ruby tags in lessons-1-5.js');
