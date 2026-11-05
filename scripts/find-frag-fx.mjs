import * as fs from 'fs';
const code = fs.readFileSync('apps/client/public/models/shaders/fragmentShader.glsl', 'utf8');

let p = 0;
while ((p = code.indexOf('FX', p)) !== -1) {
  console.log('--- At position', p, '---');
  console.log(code.substring(p - 100, p + 200));
  p += 2;
}
