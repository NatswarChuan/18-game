import * as fs from 'fs';
const code = fs.readFileSync('apps/client/public/models/zane-main.js', 'utf8');

// Search for `.parts` in zane-main.js
let p = 0;
while ((p = code.indexOf('.parts', p)) !== -1) {
  console.log('--- At position', p, '---');
  console.log(code.substring(p - 100, p + 300));
  p += 6;
}
