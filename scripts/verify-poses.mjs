import * as fs from 'fs';

const standData = JSON.parse(fs.readFileSync('apps/client/public/models/poses/Denia/Stand.json', 'utf8'));
const armsData = JSON.parse(fs.readFileSync('apps/client/public/models/poses/Denia_2/Arms-Crossed.json', 'utf8'));

console.log('Stand bones count:', Object.keys(standData).length);
console.log('Stand bone sample:', Object.keys(standData).slice(0, 10));
console.log('Arms-Crossed bones count:', Object.keys(armsData).length);
console.log('Arms-Crossed bone sample:', Object.keys(armsData).slice(0, 10));

// Check if Bip001Pelvis or similar root bones exist
console.log('Stand Pelvis:', standData['Bip001Pelvis'] || standData['Bip001 Pelvis']);
console.log('Arms Pelvis:', armsData['Bip001Pelvis'] || armsData['Bip001 Pelvis']);
