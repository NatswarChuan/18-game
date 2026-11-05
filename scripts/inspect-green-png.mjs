import * as fs from 'fs';
import * as zlib from 'zlib';

const buf = fs.readFileSync('apps/client/public/models/textures/Denia_2/T_R2T1DaniyaMd10011Bangs_D.png');

// Find IHDR
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log('PNG dimensions:', width, 'x', height);

// Collect IDAT chunks
const idatChunks = [];
let offset = 8;
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IDAT') {
    idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
  }
  offset += 12 + len;
}

const idatConcat = Buffer.concat(idatChunks);
const raw = zlib.inflateSync(idatConcat);

// Sample pixels to find green pixels
const stride = width * 4 + 1; // RGBA + filter byte
let greenCount = 0;
const greenSamples = [];

for (let y = 0; y < height; y += 4) {
  const rowStart = y * stride + 1;
  for (let x = 0; x < width; x += 4) {
    const px = rowStart + x * 4;
    const r = raw[px];
    const g = raw[px + 1];
    const b = raw[px + 2];
    const a = raw[px + 3];
    // Check if green is dominant
    if (g > 150 && r < 100 && b < 100) {
      greenCount++;
      if (greenSamples.length < 5) {
        greenSamples.push({ x, y, r, g, b, a });
      }
    }
  }
}

console.log('Found dominant green pixels:', greenCount);
console.log('Sample green pixels:', greenSamples);
