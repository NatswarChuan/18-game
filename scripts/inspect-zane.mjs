import * as fs from 'fs';

const code = fs.readFileSync('apps/client/public/models/zane-main.js', 'utf8');

const idx = code.indexOf('async setupModel');
if (idx !== -1) {
  console.log(code.substring(idx, idx + 2500));
}
