import * as fs from 'fs';
import * as path from 'path';

const standJsonPath = 'apps/client/public/models/poses/Denia/Stand.json';
const poseDir = path.dirname(standJsonPath);
if (!fs.existsSync(poseDir)) {
  fs.mkdirSync(poseDir, { recursive: true });
}

// Read step 9507 content (Stand.json)
const raw = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity-ide/brain/5aabdc73-27fc-4380-8da6-4aee795ffb13/.system_generated/steps/9507/content.md', 'utf8');
const jsonStart = raw.indexOf('{');
const jsonEnd = raw.lastIndexOf('}') + 1;
const jsonStr = raw.substring(jsonStart, jsonEnd);
const parsed = JSON.parse(jsonStr);

fs.writeFileSync(standJsonPath, JSON.stringify(parsed, null, 2), 'utf8');
console.log('Saved Stand.json successfully! Total bones in pose:', Object.keys(parsed).length);
