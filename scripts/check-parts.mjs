import * as fs from 'fs';
const code = fs.readFileSync('apps/client/public/models/zane-main.js', 'utf8');

// Find the string array
const startArr = code.indexOf('["00", "01"');
// Let's search for "Bangs" or "Up" in the string table
const strArrMatch = code.match(/const [a-zA-Z0-9_]+ = \[(?:"[^"]*",?)+\];/);
// Alternatively, let's search for how r(x) is defined or where parts is initialized
const partsPos = code.indexOf('Denia_2: {');
console.log(code.substring(partsPos, partsPos + 300));
