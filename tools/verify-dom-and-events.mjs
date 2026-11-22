import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const checkedIds = new Set();
let missingCount = 0;

while ((match = idRegex.exec(appCode)) !== null) {
  const id = match[1];
  if (checkedIds.has(id)) continue;
  checkedIds.add(id);
  const exists = html.includes(`id="${id}"`) || html.includes(`id='${id}'`);
  if (!exists) {
    console.error('❌ Missing element ID in index.html:', id);
    missingCount++;
  } else {
    console.log('✅ Found element ID:', id);
  }
}

console.log('\n--- Checking Query Selectors ---');
const classRegex = /document\.querySelectorAll\(['"]([^'"]+)['"]\)/g;
while ((match = classRegex.exec(appCode)) !== null) {
  const selector = match[1];
  console.log('Selector:', selector);
}

if (missingCount === 0) {
  console.log(`\n🎉 All ${checkedIds.size} cached DOM IDs exist in index.html!`);
} else {
  console.error(`\n❌ ${missingCount} IDs missing!`);
  process.exit(1);
}
