import * as fs from 'fs';
const code = fs.readFileSync('apps/client/public/models/zane-main.js', 'utf8');

console.log(code.substring(941800, 942600));
