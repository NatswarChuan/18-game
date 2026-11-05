import * as fs from 'fs';
import * as THREE from '../apps/client/node_modules/three/build/three.module.js';
import { FBXLoader } from '../apps/client/node_modules/three/examples/jsm/loaders/FBXLoader.js';

const buf = fs.readFileSync('apps/client/public/models/Denia_2.fbx');
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new FBXLoader();
const fbx = loader.parse(ab, '');

const meshes = [];
fbx.traverse(child => {
  if (child.isMesh) {
    meshes.push({
      name: child.name,
      type: child.type,
      geometryGroups: child.geometry.groups?.length ?? 0,
      materialIsArray: Array.isArray(child.material),
      materials: Array.isArray(child.material) ? child.material.map(m => m.name) : child.material?.name
    });
  }
});
console.log('Meshes in FBX:', meshes);
