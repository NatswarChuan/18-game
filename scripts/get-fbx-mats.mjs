import * as fs from 'fs';

const buf = fs.readFileSync('apps/client/public/models/Denia_2.fbx');
// Search for MI_ strings (Material Instance names in Unreal/WuWa)
const miMatches = [];
for (let i = 0; i < buf.length - 30; i++) {
  if (buf[i] === 0x4D && buf[i+1] === 0x49 && buf[i+2] === 0x5F) { // 'MI_'
    let str = '';
    for (let j = i; j < i + 40; j++) {
      if (buf[j] < 32 || buf[j] > 126) break;
      str += String.fromCharCode(buf[j]);
    }
    miMatches.push(str);
  }
}
console.log('Unique MI_ names:', [...new Set(miMatches)]);
