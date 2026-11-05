import * as fs from 'fs';
const code = fs.readFileSync('apps/client/public/models/zane-main.js', 'utf8');

// Find all occurrences of "Fx"
let p = 0;
while ((p = code.indexOf('"Fx"', p)) !== -1) {
  console.log('--- At position', p, '---');
  console.log(code.substring(p - 150, p + 250));
  p += 4;
}
