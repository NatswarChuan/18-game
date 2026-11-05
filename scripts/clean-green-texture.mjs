import * as fs from 'fs';
import * as zlib from 'zlib';

function cleanPng(filePath) {
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log(`Processing ${filePath}: ${width}x${height}`);

  const idatChunks = [];
  let offset = 8;
  const preChunks = [];
  const postChunks = [];
  let foundIdat = false;
  let doneIdat = false;

  while (offset < buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const fullChunk = buf.subarray(offset, offset + 12 + len);

    if (type === 'IDAT') {
      foundIdat = true;
      idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
    } else {
      if (!foundIdat) {
        preChunks.push(fullChunk);
      } else {
        doneIdat = true;
        postChunks.push(fullChunk);
      }
    }
    offset += 12 + len;
  }

  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const stride = width * 4 + 1;
  let modifiedPixels = 0;

  for (let y = 0; y < height; y++) {
    const rowStart = y * stride + 1;
    for (let x = 0; x < width; x++) {
      const px = rowStart + x * 4;
      const r = raw[px];
      const g = raw[px + 1];
      const b = raw[px + 2];

      // Pure or dominant green chroma key
      if (g > 160 && r < 80 && b < 80) {
        raw[px] = 0;
        raw[px + 1] = 0;
        raw[px + 2] = 0;
        raw[px + 3] = 0; // Alpha 0
        modifiedPixels++;
      }
    }
  }

  console.log(`Modified ${modifiedPixels} green pixels in ${filePath}`);

  // Re-compress IDAT
  const compressed = zlib.deflateSync(raw, { level: 9 });

  // Create new IDAT chunk
  const newIdat = Buffer.alloc(12 + compressed.length);
  newIdat.writeUInt32BE(compressed.length, 0);
  newIdat.write('IDAT', 4);
  compressed.copy(newIdat, 8);

  // Calculate CRC32 for IDAT (using standard crc table)
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 4; i < 8 + compressed.length; i++) {
    crc = crcTable[(crc ^ newIdat[i]) & 0xff] ^ (crc >>> 8);
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  newIdat.writeUInt32BE(crc, 8 + compressed.length);

  // Write new PNG
  const magic = buf.subarray(0, 8);
  const finalBuf = Buffer.concat([magic, ...preChunks, newIdat, ...postChunks]);
  fs.writeFileSync(filePath, finalBuf);
  console.log(`Saved cleaned ${filePath} (${finalBuf.length} bytes)`);
}

cleanPng('apps/client/public/models/textures/Denia_2/T_R2T1DaniyaMd10011Bangs_D.png');
cleanPng('apps/client/public/models/textures/Denia_2/T_R2T1DaniyaMd10011Up_D.png');
