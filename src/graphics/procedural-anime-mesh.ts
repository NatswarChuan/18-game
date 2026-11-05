import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '../types.js';

export interface ProceduralAnimeOptions {
  valkyrieId: string;
  name: string;
  faction: FactionId;
  tier: ClothDamageTier;
  isEnemy: boolean;
  hpPercent?: number;
  manaPercent?: number;
}

/**
 * Authentic High School DxD Faction Visuals:
 * - NEO_VALHALLA: Rias Gremory (Crimson Ruin Princess, Crimson Red hair, Cyan eyes, Crimson Devil Wings)
 * - ABYSSAL_EDEN: Akeno Himejima (Priestess of Thunder, Raven Violet hair, Amber eyes, Violet Devil Wings)
 * - SOL_DYNASTY: Asia Argento (Golden Silk hair, Emerald eyes, Golden Obsidian Devil Wings)
 */
export function getFactionVisuals(faction: FactionId) {
  switch (faction) {
    case 'NEO_VALHALLA':
      return {
        name: 'Rias Gremory (Crimson Princess)',
        primary: 0xff0044,      // Crimson Demonic Flame
        accent: 0x00d4ff,       // Cyan Sapphire Eyes
        hair: 0xd61338,         // Rias Crimson Red Hair
        hairHighlight: 0xff6688,// Hair Specular Sheen
        skin: 0xffeedd,         // Warm Soft Anime Porcelain
        skinShadow: 0xf5cfb8,   // Anime Cel Skin Shadow
        blouse: 0xfcfdff,       // Kuoh Academy Crisp White Blouse
        vest: 0x161622,         // Kuoh Academy Black Corset Vest
        skirt: 0x181826,        // Kuoh Pleated Dark Skirt
        ribbon: 0xe6005c,       // Magenta Crimson Silk Ribbon Tie
        stocking: 0x141420,     // Sheer Black Thigh-High Stockings
        wingMembrane: 0x770022, // Deep Crimson Bat Wing Membrane
        wingBone: 0x1c0610,     // Obsidian Devil Bone Struts
        magicCircle: 0xff0055,  // Gremory Demonic Magic Crest
        outline: 0x1a0610,      // Crisp Anime Manga Ink Outline
      };
    case 'ABYSSAL_EDEN':
      return {
        name: 'Akeno Himejima (Thunder Priestess)',
        primary: 0x8a2be2,      // Lightning Violet
        accent: 0xffaa00,       // Amber Gold Eyes
        hair: 0x1e1233,         // Deep Midnight Violet Raven Hair
        hairHighlight: 0x6a4099,// Violet Sheen
        skin: 0xffeedd,
        skinShadow: 0xf5cfb8,
        blouse: 0xfcfdff,
        vest: 0x141220,
        skirt: 0x181426,
        ribbon: 0x9933ff,       // Imperial Purple Ribbon
        stocking: 0x12101a,
        wingMembrane: 0x421060, // Deep Violet Devil Wing
        wingBone: 0x160720,
        magicCircle: 0x9d4edd,
        outline: 0x10061e,
      };
    case 'SOL_DYNASTY':
      return {
        name: 'Asia Argento (Holy Bishop)',
        primary: 0xffb700,      // Solar Gold
        accent: 0x00e676,       // Emerald Green Eyes
        hair: 0xffdf66,         // Radiant Golden Silk Hair
        hairHighlight: 0xfff0a6,// Golden Highlight
        skin: 0xffeedd,
        skinShadow: 0xf5cfb8,
        blouse: 0xfcfdff,
        vest: 0x201810,
        skirt: 0x241a12,
        ribbon: 0x00c853,       // Emerald Green Ribbon
        stocking: 0x1a140e,
        wingMembrane: 0x604210, // Golden Obsidian Devil Wing
        wingBone: 0x201607,
        magicCircle: 0xffaa00,
        outline: 0x161008,
      };
    default:
      return {
        name: 'Rias Gremory (Crimson Princess)',
        primary: 0xff0044,
        accent: 0x00d4ff,
        hair: 0xd61338,
        hairHighlight: 0xff6688,
        skin: 0xffeedd,
        skinShadow: 0xf5cfb8,
        blouse: 0xfcfdff,
        vest: 0x161622,
        skirt: 0x181826,
        ribbon: 0xe6005c,
        stocking: 0x141420,
        wingMembrane: 0x770022,
        wingBone: 0x1c0610,
        magicCircle: 0xff0055,
        outline: 0x1a0610,
      };
  }
}

/**
 * Creates a stepped 3-tone gradient ramp texture for Three.js MeshToonMaterial.
 * This produces authentic Japanese anime television cel-shading with crisp shadow cutoff.
 */
let cachedToonRamp: THREE.CanvasTexture | null = null;
export function getAnimeToonRamp(): THREE.CanvasTexture {
  if (cachedToonRamp) return cachedToonRamp;
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  // Stepped ramp: Shadow -> Midtone -> Highlight -> Specular
  const rampColors = ['#888899', '#bbbbcc', '#eeeeff', '#ffffff'];
  rampColors.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.fillRect(i, 0, 1, 1);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  cachedToonRamp = tex;
  return tex;
}

/**
 * Creates an Inverted Hull Manga Outline Mesh:
 * Extrudes vertices along their calculated normals and renders with BackSide.
 * Produces crisp, hand-drawn anime ink contours around characters.
 */
export function createAnimeOutline(geo: THREE.BufferGeometry, thickness = 0.003, color = 0x140810): THREE.Mesh {
  const outlineGeo = geo.clone();
  const pos = outlineGeo.attributes.position;
  let norm = outlineGeo.attributes.normal;
  if (!norm) {
    outlineGeo.computeVertexNormals();
    norm = outlineGeo.attributes.normal;
  }
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      pos.getX(i) + norm.getX(i) * thickness,
      pos.getY(i) + norm.getY(i) * thickness,
      pos.getZ(i) + norm.getZ(i) * thickness
    );
  }
  const outlineMat = new THREE.MeshBasicMaterial({
    color,
    side: THREE.BackSide,
  });
  const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
  outlineMesh.name = 'AnimeOutline';
  return outlineMesh;
}

/**
 * High School DxD Authentic 2048x2048 Face Texture (Miyuki Goto Style):
 * Seductive cyan jewel eyes, double eyelids, delicate nose bridge,
 * smiling cherry lips, and soft blushing cheekbones.
 */
function createDxDAnimeFaceTexture(faction: FactionId, tier: ClothDamageTier): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  const visuals = getFactionVisuals(faction);
  const eyeColorHex = '#' + visuals.accent.toString(16).padStart(6, '0');
  const eyeDarkHex = '#' + visuals.primary.toString(16).padStart(6, '0');

  // 1. Warm Soft Porcelain Subsurface Peach Skin Base
  const bgGrad = ctx.createRadialGradient(1024, 1024, 100, 1024, 1024, 980);
  bgGrad.addColorStop(0, '#fffbf7');
  bgGrad.addColorStop(0.65, '#fdeae0');
  bgGrad.addColorStop(1, '#f8d4c4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 2048);

  // 2. High School DxD Blushing Cheeks
  const blushAlpha = tier === 3 ? 0.90 : tier === 2 ? 0.65 : 0.45;
  const drawBlush = (cx: number, cy: number) => {
    const bGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 210);
    bGrad.addColorStop(0, `rgba(255, 60, 120, ${blushAlpha})`);
    bGrad.addColorStop(0.5, `rgba(255, 90, 140, ${blushAlpha * 0.5})`);
    bGrad.addColorStop(1, 'rgba(255, 90, 140, 0)');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 210, 0, Math.PI * 2);
    ctx.fill();

    // Cute blush hatching lines
    ctx.strokeStyle = `rgba(255, 40, 100, ${blushAlpha * 0.85})`;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    for (let o = -50; o <= 50; o += 25) {
      ctx.beginPath();
      ctx.moveTo(cx + o - 18, cy - 20);
      ctx.lineTo(cx + o + 18, cy + 20);
      ctx.stroke();
    }
  };
  drawBlush(640, 1220);
  drawBlush(1408, 1220);

  // 3. High School DxD Signature Eyes (Rias Gremory Cyan Jewel Eyes)
  const drawDxDEye = (cx: number, cy: number, isRight: boolean) => {
    ctx.save();
    ctx.translate(cx, cy);
    if (isRight) ctx.scale(-1, 1);

    // Eye White (Sclera) with Soft Eyelid Shadow
    ctx.beginPath();
    ctx.ellipse(0, 0, 210, 260, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    const topShadow = ctx.createLinearGradient(0, -260, 0, -50);
    topShadow.addColorStop(0, 'rgba(180, 195, 220, 0.55)');
    topShadow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = topShadow;
    ctx.fill();

    // Iris (Jewel Gradient with Rich Saturated Depth)
    const irisGrad = ctx.createLinearGradient(0, -230, 0, 230);
    irisGrad.addColorStop(0, '#060a16');
    irisGrad.addColorStop(0.2, eyeDarkHex);
    irisGrad.addColorStop(0.6, eyeColorHex);
    irisGrad.addColorStop(0.85, '#e0f7ff');
    irisGrad.addColorStop(1, '#ffffff');

    ctx.beginPath();
    ctx.ellipse(0, 15, 165, 225, 0, 0, Math.PI * 2);
    ctx.fillStyle = irisGrad;
    ctx.fill();

    // Iris Pattern Rays / Starlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 45, Math.sin(a) * 55 + 15);
      ctx.lineTo(Math.cos(a) * 150, Math.sin(a) * 195 + 15);
      ctx.stroke();
    }

    // Pupil
    ctx.beginPath();
    ctx.ellipse(0, 12, 70, 95, 0, 0, Math.PI * 2);
    ctx.fillStyle = tier === 3 ? '#ff0055' : '#040710';
    ctx.fill();

    // Star / Heart highlight for Climax tier
    if (tier === 3) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 12, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Specular Catchlights (Large Oval Highlight + Secondary Dot)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-56, -80, 52, 72, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(58, 80, 32, 0, Math.PI * 2);
    ctx.fill();

    // Heavy Upper Eyelash Line (Signature Winged Eyeliner)
    ctx.beginPath();
    ctx.moveTo(-230, -95);
    ctx.bezierCurveTo(-110, -290, 150, -280, 260, -135);
    ctx.bezierCurveTo(175, -225, -65, -215, -230, -95);
    ctx.fillStyle = '#140c1a';
    ctx.fill();

    // Wing Extension
    ctx.beginPath();
    ctx.moveTo(230, -155);
    ctx.lineTo(295, -215);
    ctx.lineTo(255, -125);
    ctx.fillStyle = '#140c1a';
    ctx.fill();

    // Lower Eyelashes
    ctx.beginPath();
    ctx.arc(0, 200, 100, 0.25 * Math.PI, 0.75 * Math.PI);
    ctx.strokeStyle = '#140c1a';
    ctx.lineWidth = 7;
    ctx.stroke();

    // Double Eyelid Crease
    ctx.beginPath();
    ctx.arc(0, -265, 200, 0.28, Math.PI - 0.28);
    ctx.strokeStyle = '#b88575';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Expressive Eyebrow
    ctx.beginPath();
    ctx.moveTo(-185, -390);
    ctx.quadraticCurveTo(0, -450, 225, -360);
    ctx.strokeStyle = '#' + visuals.hair.toString(16).padStart(6, '0');
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.restore();
  };

  drawDxDEye(670, 950, false);
  drawDxDEye(1378, 950, true);

  // 4. Petite Cute Anime Nose
  ctx.fillStyle = '#b87c67';
  ctx.beginPath();
  ctx.arc(1024, 1340, 11, 0, Math.PI * 2);
  ctx.fill();

  // 5. Glossy Anime Lips (Rias Seductive Cherry Smile)
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#852438';
  ctx.fillStyle = '#e63962';

  if (tier === 3) {
    ctx.beginPath();
    ctx.ellipse(1024, 1560, 80, 48, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(998, 1525, 52, 18);
  } else {
    ctx.beginPath();
    ctx.arc(1024, 1470, 90, 0.22 * Math.PI, 0.78 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = 'rgba(230, 57, 98, 0.7)';
    ctx.beginPath();
    ctx.ellipse(1024, 1540, 36, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * 1. Dedicated Curved Frontal Face Plate:
 * Maps the 2048x2048 DxD face texture onto a smooth curved frontal plane that perfectly
 * conforms to the front of the bishoujo head, with 100% distortion-free UV mapping.
 */
function createDxDCurvedFacePlate(subX = 48, subY = 48): THREE.BufferGeometry {
  const numVertices = (subX + 1) * (subY + 1);
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(subX * subY * 6);

  let pIdx = 0;
  let uvIdx = 0;

  for (let yStep = 0; yStep <= subY; yStep++) {
    const v = yStep / subY;
    // Map vertical span from chin (y = 0.02) to upper forehead (y = 0.28)
    const y = 0.02 + v * 0.26;

    // Face width profile: slender at chin, widening at cheekbones, tapering at temples
    const widthFactor = Math.sin(v * Math.PI * 0.85 + 0.15);
    const halfWidth = 0.115 * widthFactor;

    for (let xStep = 0; xStep <= subX; xStep++) {
      const u = xStep / subX;
      // Normalized horizontal coordinate from -1 to 1 across face
      const nx = (u - 0.5) * 2.0;
      const x = nx * halfWidth;

      // Gentle cylindrical curvature conforming to anime facial contour
      const zCurve = Math.cos(nx * Math.PI * 0.45) * 0.052;
      // Protrusion profile along height (chin forward, nose peak, forehead gentle curve)
      const zHeightProfile = 0.095 + Math.sin(v * Math.PI) * 0.038;
      const z = zHeightProfile + zCurve;

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;

      // Perfectly aligned UV coordinates
      uvs[uvIdx++] = u;
      uvs[uvIdx++] = v;
    }
  }

  let iIdx = 0;
  const stride = subX + 1;
  for (let yStep = 0; yStep < subY; yStep++) {
    for (let xStep = 0; xStep < subX; xStep++) {
      const p00 = yStep * stride + xStep;
      const p01 = yStep * stride + (xStep + 1);
      const p10 = (yStep + 1) * stride + xStep;
      const p11 = (yStep + 1) * stride + (xStep + 1);

      indices[iIdx++] = p00;
      indices[iIdx++] = p10;
      indices[iIdx++] = p01;

      indices[iIdx++] = p01;
      indices[iIdx++] = p10;
      indices[iIdx++] = p11;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * 2. Smooth Cranium & Head Base Mesh:
 * Continuous manifold bishoujo head skull that wraps behind and supports the face plate.
 */
function createDxDHeadGeometry(subY = 80, subRadial = 80): THREE.BufferGeometry {
  const numVertices = (subY + 1) * (subRadial + 1);
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(subY * subRadial * 6);

  const headRings = [
    { y: 0.00, cx: 0, cz: 0.000, rx: 0.048, rz: 0.048 }, // Neck seam connection
    { y: 0.03, cx: 0, cz: 0.030, rx: 0.058, rz: 0.065 }, // Feminine V-line chin
    { y: 0.06, cx: 0, cz: 0.035, rx: 0.082, rz: 0.088 }, // Lower jaw
    { y: 0.09, cx: 0, cz: 0.038, rx: 0.106, rz: 0.110 }, // Cheeks & mouth level
    { y: 0.13, cx: 0, cz: 0.032, rx: 0.122, rz: 0.124 }, // Cheekbones
    { y: 0.17, cx: 0, cz: 0.018, rx: 0.132, rz: 0.134 }, // Eye & temple level
    { y: 0.21, cx: 0, cz: 0.005, rx: 0.136, rz: 0.138 }, // Brow & forehead
    { y: 0.26, cx: 0, cz: -0.010, rx: 0.130, rz: 0.134 }, // Upper cranium
    { y: 0.30, cx: 0, cz: -0.018, rx: 0.102, rz: 0.108 }, // Crown
    { y: 0.33, cx: 0, cz: -0.022, rx: 0.020, rz: 0.022 }, // Apex
  ];

  let pIdx = 0;
  let uvIdx = 0;

  for (let ry = 0; ry <= subY; ry++) {
    const t = ry / subY;
    const rawPos = t * (headRings.length - 1);
    const i0 = Math.floor(rawPos);
    const i1 = Math.min(headRings.length - 1, i0 + 1);
    const blend = (1 - Math.cos((rawPos - i0) * Math.PI)) * 0.5;

    const r0 = headRings[i0];
    const r1 = headRings[i1];

    const y = r0.y + (r1.y - r0.y) * blend;
    const cx = (r0.cx ?? 0) + ((r1.cx ?? 0) - (r0.cx ?? 0)) * blend;
    const cz = (r0.cz ?? 0) + ((r1.cz ?? 0) - (r0.cz ?? 0)) * blend;
    const rx = r0.rx + (r1.rx - r0.rx) * blend;
    const rz = r0.rz + (r1.rz - r0.rz) * blend;

    for (let s = 0; s <= subRadial; s++) {
      const uFrac = s / subRadial;
      const theta = uFrac * Math.PI * 2;

      const x = cx + Math.cos(theta) * rx;
      const z = cz + Math.sin(theta) * rz;

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;

      uvs[uvIdx++] = uFrac;
      uvs[uvIdx++] = t;
    }
  }

  let iIdx = 0;
  const stride = subRadial + 1;
  for (let ry = 0; ry < subY; ry++) {
    for (let s = 0; s < subRadial; s++) {
      const p00 = ry * stride + s;
      const p01 = ry * stride + (s + 1);
      const p10 = (ry + 1) * stride + s;
      const p11 = (ry + 1) * stride + (s + 1);

      indices[iIdx++] = p00;
      indices[iIdx++] = p10;
      indices[iIdx++] = p01;

      indices[iIdx++] = p01;
      indices[iIdx++] = p10;
      indices[iIdx++] = p11;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * 3. High School DxD Voluptuous Torso & Kuoh Academy Uniform:
 * Generates continuous anatomical curves:
 * - Natural teardrop bust lobes (Bishoujo proportions).
 * - Hourglass waist cinched by black corset vest.
 * - Collarbone hollows and delicate throat.
 */
function createDxDTorsoGeometry(subY = 120, subRadial = 120, tier: ClothDamageTier = 1): THREE.BufferGeometry {
  const numVertices = (subY + 1) * (subRadial + 1);
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(subY * subRadial * 6);

  const bustScale = tier === 3 ? 0.098 : 0.090;

  const torsoRings = [
    { y: 0.32, rx: 0.148, rz: 0.118 }, // Hip base & skirt junction
    { y: 0.38, rx: 0.158, rz: 0.128 }, // Curvaceous feminine hips
    { y: 0.44, rx: 0.136, rz: 0.106 }, // Navel & lower midriff
    { y: 0.51, rx: 0.110, rz: 0.084 }, // Slender cinched hourglass waist (Kuoh Corset Vest)
    { y: 0.58, rx: 0.124, rz: 0.094 }, // Lower ribcage
    {
      y: 0.655,
      rx: 0.142,
      rz: 0.102,
      // High School DxD Voluptuous Teardrop Bust Expansion with Cleavage Valley
      mod: (theta: number) => {
        const leftAngle = Math.PI * 0.35;
        const rightAngle = Math.PI * 0.65;
        const dL = theta - leftAngle;
        const dR = theta - rightAngle;
        const dz = Math.exp(-(dL * dL) * 16) * bustScale + Math.exp(-(dR * dR) * 16) * bustScale;
        return { dx: 0, dz };
      },
    }, // Iconic High School DxD Bust
    { y: 0.73, rx: 0.136, rz: 0.092 }, // Clavicles & white blouse collarline
    { y: 0.79, rx: 0.090, rz: 0.074 }, // Base of neck & sailor capelet
    { y: 0.86, rx: 0.050, rz: 0.050 }, // Slender bishoujo neck
    { y: 0.95, rx: 0.048, rz: 0.048 }, // Head connection seam
  ];

  let pIdx = 0;
  let uvIdx = 0;

  for (let ry = 0; ry <= subY; ry++) {
    const t = ry / subY;
    const rawPos = t * (torsoRings.length - 1);
    const i0 = Math.floor(rawPos);
    const i1 = Math.min(torsoRings.length - 1, i0 + 1);
    const blend = (1 - Math.cos((rawPos - i0) * Math.PI)) * 0.5;

    const r0 = torsoRings[i0];
    const r1 = torsoRings[i1];

    const y = r0.y + (r1.y - r0.y) * blend;
    const rx = r0.rx + (r1.rx - r0.rx) * blend;
    const rz = r0.rz + (r1.rz - r0.rz) * blend;

    for (let s = 0; s <= subRadial; s++) {
      const uFrac = s / subRadial;
      const theta = uFrac * Math.PI * 2;

      let x = Math.cos(theta) * rx;
      let z = Math.sin(theta) * rz;

      if (r0.mod || r1.mod) {
        const m0 = r0.mod ? r0.mod(theta) : { dx: 0, dz: 0 };
        const m1 = r1.mod ? r1.mod(theta) : { dx: 0, dz: 0 };
        x += m0.dx + (m1.dx - m0.dx) * blend;
        z += m0.dz + (m1.dz - m0.dz) * blend;
      }

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;

      uvs[uvIdx++] = uFrac;
      uvs[uvIdx++] = t;
    }
  }

  let iIdx = 0;
  const stride = subRadial + 1;
  for (let ry = 0; ry < subY; ry++) {
    for (let s = 0; s < subRadial; s++) {
      const p00 = ry * stride + s;
      const p01 = ry * stride + (s + 1);
      const p10 = (ry + 1) * stride + s;
      const p11 = (ry + 1) * stride + (s + 1);

      indices[iIdx++] = p00;
      indices[iIdx++] = p10;
      indices[iIdx++] = p01;

      indices[iIdx++] = p01;
      indices[iIdx++] = p10;
      indices[iIdx++] = p11;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * 4. Kuoh Academy Pleated Miniskirt with 24 Wavy Pleats & White Lace Hem:
 */
function createDxDSkirtGeometry(subY = 48, subRadial = 96): THREE.BufferGeometry {
  const numVertices = (subY + 1) * (subRadial + 1);
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(subY * subRadial * 6);

  const skirtRings = [
    { y: 0.38, rx: 0.158, rz: 0.128, pleatAmp: 0.000 },
    { y: 0.33, rx: 0.185, rz: 0.155, pleatAmp: 0.008 },
    { y: 0.28, rx: 0.225, rz: 0.185, pleatAmp: 0.016 },
    { y: 0.25, rx: 0.245, rz: 0.205, pleatAmp: 0.022 },
  ];

  let pIdx = 0;
  let uvIdx = 0;

  for (let ry = 0; ry <= subY; ry++) {
    const t = ry / subY;
    const rawPos = t * (skirtRings.length - 1);
    const i0 = Math.floor(rawPos);
    const i1 = Math.min(skirtRings.length - 1, i0 + 1);
    const blend = (1 - Math.cos((rawPos - i0) * Math.PI)) * 0.5;

    const r0 = skirtRings[i0];
    const r1 = skirtRings[i1];

    const y = r0.y + (r1.y - r0.y) * blend;
    const rx = r0.rx + (r1.rx - r0.rx) * blend;
    const rz = r0.rz + (r1.rz - r0.rz) * blend;
    const pleatAmp = r0.pleatAmp + (r1.pleatAmp - r0.pleatAmp) * blend;

    for (let s = 0; s <= subRadial; s++) {
      const uFrac = s / subRadial;
      const theta = uFrac * Math.PI * 2;

      // 24 sinusoidal pleats
      const wave = Math.sin(theta * 24) * pleatAmp;
      const x = Math.cos(theta) * (rx + wave);
      const z = Math.sin(theta) * (rz + wave);

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;

      uvs[uvIdx++] = uFrac;
      uvs[uvIdx++] = t;
    }
  }

  let iIdx = 0;
  const stride = subRadial + 1;
  for (let ry = 0; ry < subY; ry++) {
    for (let s = 0; s < subRadial; s++) {
      const p00 = ry * stride + s;
      const p01 = ry * stride + (s + 1);
      const p10 = (ry + 1) * stride + s;
      const p11 = (ry + 1) * stride + (s + 1);

      indices[iIdx++] = p00;
      indices[iIdx++] = p10;
      indices[iIdx++] = p01;

      indices[iIdx++] = p01;
      indices[iIdx++] = p10;
      indices[iIdx++] = p11;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * 5. High School DxD Thighs, Black Sheer Stockings & Mary Jane High-Heel Stiletto Shoes:
 */
function createDxDLegGeometry(subY = 80, subRadial = 80): THREE.BufferGeometry {
  const numVertices = (subY + 1) * (subRadial + 1);
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(subY * subRadial * 6);

  const legRings = [
    { y: 0.34, rx: 0.074, rz: 0.074 }, // Upper thigh crease
    { y: 0.28, rx: 0.068, rz: 0.068 }, // Mid-thigh
    { y: 0.22, rx: 0.058, rz: 0.060 }, // Stocking rim (Zettai Ryouiki)
    { y: 0.17, cx: 0, cz: 0.006, rx: 0.048, rz: 0.050 }, // Kneecap
    { y: 0.12, rx: 0.052, rz: 0.055 }, // Calf curve
    { y: 0.06, rx: 0.038, rz: 0.042 }, // Slender ankle
    { y: 0.03, cx: 0, cz: 0.028, rx: 0.036, rz: 0.078 }, // Shoe arch
    { y: 0.00, cx: 0, cz: 0.038, rx: 0.034, rz: 0.088 }, // Sole
  ];

  let pIdx = 0;
  let uvIdx = 0;

  for (let ry = 0; ry <= subY; ry++) {
    const t = ry / subY;
    const rawPos = t * (legRings.length - 1);
    const i0 = Math.floor(rawPos);
    const i1 = Math.min(legRings.length - 1, i0 + 1);
    const blend = (1 - Math.cos((rawPos - i0) * Math.PI)) * 0.5;

    const r0 = legRings[i0];
    const r1 = legRings[i1];

    const y = r0.y + (r1.y - r0.y) * blend;
    const cx = (r0.cx ?? 0) + ((r1.cx ?? 0) - (r0.cx ?? 0)) * blend;
    const cz = (r0.cz ?? 0) + ((r1.cz ?? 0) - (r0.cz ?? 0)) * blend;
    const rx = r0.rx + (r1.rx - r0.rx) * blend;
    const rz = r0.rz + (r1.rz - r0.rz) * blend;

    for (let s = 0; s <= subRadial; s++) {
      const uFrac = s / subRadial;
      const theta = uFrac * Math.PI * 2;

      positions[pIdx++] = cx + Math.cos(theta) * rx;
      positions[pIdx++] = y;
      positions[pIdx++] = cz + Math.sin(theta) * rz;

      uvs[uvIdx++] = uFrac;
      uvs[uvIdx++] = t;
    }
  }

  let iIdx = 0;
  const stride = subRadial + 1;
  for (let ry = 0; ry < subY; ry++) {
    for (let s = 0; s < subRadial; s++) {
      const p00 = ry * stride + s;
      const p01 = ry * stride + (s + 1);
      const p10 = (ry + 1) * stride + s;
      const p11 = (ry + 1) * stride + (s + 1);

      indices[iIdx++] = p00;
      indices[iIdx++] = p10;
      indices[iIdx++] = p01;

      indices[iIdx++] = p01;
      indices[iIdx++] = p10;
      indices[iIdx++] = p11;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * 6. High School DxD Authentic Devil Wings (Akuma Wings):
 * Curved skeletal bone arm with sharp claw, plus scalloped bat-wing leathery membrane.
 */
function createDxDSingleDevilWing(isRight: boolean, boneMat: THREE.Material, membraneMat: THREE.Material): { group: THREE.Group; vertexCount: number } {
  const wing = new THREE.Group();
  const sign = isRight ? 1 : -1;
  let vertexCount = 0;

  // Upper Skeletal Bone Arm
  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(sign * 0.16, 0.14, -0.04),
    new THREE.Vector3(sign * 0.40, 0.35, -0.08),
    new THREE.Vector3(sign * 0.62, 0.30, -0.12),
  ]);
  const armGeo = new THREE.TubeGeometry(armCurve, 40, 0.014, 16, false);
  const armMesh = new THREE.Mesh(armGeo, boneMat);
  wing.add(armMesh);
  vertexCount += armGeo.attributes.position.count;

  // Joint Claw
  const clawGeo = new THREE.ConeGeometry(0.016, 0.08, 16, 16);
  const claw = new THREE.Mesh(clawGeo, boneMat);
  claw.position.set(sign * 0.62, 0.32, -0.12);
  claw.rotation.z = sign * -Math.PI / 3;
  wing.add(claw);
  vertexCount += clawGeo.attributes.position.count;

  // 3 Extended Finger Struts
  const fingerEnds = [
    new THREE.Vector3(sign * 0.70, 0.05, -0.10),
    new THREE.Vector3(sign * 0.55, -0.18, -0.08),
    new THREE.Vector3(sign * 0.35, -0.30, -0.05),
  ];
  for (let f = 0; f < 3; f++) {
    const fCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sign * 0.62, 0.30, -0.12),
      fingerEnds[f],
    ]);
    const fGeo = new THREE.TubeGeometry(fCurve, 32, 0.008, 12, false);
    const fMesh = new THREE.Mesh(fGeo, boneMat);
    wing.add(fMesh);
    vertexCount += fGeo.attributes.position.count;
  }

  // Scalloped Bat Wing Membrane
  const membraneGeo = new THREE.PlaneGeometry(0.68, 0.62, 48, 48);
  const pos = membraneGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i);
    const py = pos.getY(i);
    const scallop = Math.sin(px * 16) * 0.035;
    pos.setZ(i, -Math.sin(px * 2.2) * 0.07 + scallop);
  }
  membraneGeo.computeVertexNormals();

  const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
  membraneMesh.position.set(sign * 0.36, 0.05, -0.08);
  wing.add(membraneMesh);
  vertexCount += membraneGeo.attributes.position.count;

  wing.rotation.y = sign * 0.25;
  return { group: wing, vertexCount };
}

/**
 * 7. Parametric Tapered Anime Hair Strand:
 * Constructs authentic anime locks that taper smoothly from a voluminous base to a sharp needle tip:
 * r(t) = radiusBase * sin(pi * t^0.65) * (1 - 0.7 * t)
 */
function createDxDTaperedHairStrand(
  points: THREE.Vector3[],
  radiusBase: number,
  steps = 32,
  radialSegments = 12
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points);
  const curvePoints = curve.getPoints(steps);
  const frenetFrames = curve.computeFrenetFrames(steps, false);

  const numVertices = (steps + 1) * (radialSegments + 1);
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(steps * radialSegments * 6);

  let pIdx = 0;
  let uvIdx = 0;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pt = curvePoints[i];
    const N = frenetFrames.normals[i];
    const B = frenetFrames.binormals[i];

    // Sharp anime taper formula: wide at start/mid, tapering down to a sharp needle tip!
    const taper = Math.sin(Math.pow(t, 0.65) * Math.PI) * (1.0 - 0.75 * t) + 0.05 * (1.0 - t);
    const rad = Math.max(0.002, radiusBase * taper);

    for (let j = 0; j <= radialSegments; j++) {
      const uFrac = j / radialSegments;
      const theta = uFrac * Math.PI * 2;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      // Offset point around Frenet frame
      const x = pt.x + (cosTheta * N.x + sinTheta * B.x) * rad;
      const y = pt.y + (cosTheta * N.y + sinTheta * B.y) * rad;
      const z = pt.z + (cosTheta * N.z + sinTheta * B.z) * rad;

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;

      uvs[uvIdx++] = uFrac;
      uvs[uvIdx++] = t;
    }
  }

  let iIdx = 0;
  const stride = radialSegments + 1;
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const p00 = i * stride + j;
      const p01 = i * stride + (j + 1);
      const p10 = (i + 1) * stride + j;
      const p11 = (i + 1) * stride + (j + 1);

      indices[iIdx++] = p00;
      indices[iIdx++] = p10;
      indices[iIdx++] = p01;

      indices[iIdx++] = p01;
      indices[iIdx++] = p10;
      indices[iIdx++] = p11;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * 8. Cranial Hair Cap:
 * Smooth volume covering only the back and crown of the head, leaving the face completely open.
 */
function createDxDHairCapGeometry(subY = 48, subRadial = 48): THREE.BufferGeometry {
  const numVertices = (subY + 1) * (subRadial + 1);
  const positions = new Float32Array(numVertices * 3);
  const uvs = new Float32Array(numVertices * 2);
  const indices = new Uint32Array(subY * subRadial * 6);

  let pIdx = 0;
  let uvIdx = 0;

  for (let ry = 0; ry <= subY; ry++) {
    const t = ry / subY;
    const theta = t * 2.2;
    const r = 0.150;
    const yCenter = 1.12;

    for (let s = 0; s <= subRadial; s++) {
      const uFrac = s / subRadial;
      // Phi only covers the sides and back: from Math.PI * 0.45 to Math.PI * 1.55!
      const phi = Math.PI * 0.45 + uFrac * Math.PI * 1.10;

      const x = Math.sin(theta) * Math.cos(phi) * r;
      const y = yCenter + Math.cos(theta) * r;
      const z = Math.sin(theta) * Math.sin(phi) * r;

      positions[pIdx++] = x;
      positions[pIdx++] = y;
      positions[pIdx++] = z;

      uvs[uvIdx++] = uFrac;
      uvs[uvIdx++] = t;
    }
  }

  let iIdx = 0;
  const stride = subRadial + 1;
  for (let ry = 0; ry < subY; ry++) {
    for (let s = 0; s < subRadial; s++) {
      const p00 = ry * stride + s;
      const p01 = ry * stride + (s + 1);
      const p10 = (ry + 1) * stride + s;
      const p11 = (ry + 1) * stride + (s + 1);

      indices[iIdx++] = p00;
      indices[iIdx++] = p10;
      indices[iIdx++] = p01;

      indices[iIdx++] = p01;
      indices[iIdx++] = p10;
      indices[iIdx++] = p11;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(new THREE.Uint32BufferAttribute(indices, 1));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates the Complete Authentic High School DxD 3D Anime Model (Rias Gremory Archetype):
 * - Dedicated Face Plate + 2048x2048 DxD Texture: Crisp, clear, zero distortion.
 * - Smooth Cranium & Slender Neck.
 * - Kuoh Academy Blouse & Voluptuous Bust with Teardrop Cleavage.
 * - Black Corset Vest & Magenta Ribbon Tie.
 * - 24-Pleat Kuoh Micro-Skirt & White Lace Frills.
 * - Dual Legs, Sheer Stockings & Mary Jane Stilettos.
 * - Dual Arms & 10 Articulated Fingers.
 * - Tapered Cascading Crimson Rias Gremory Hair, Sidelocks & Ahoge.
 * - Dual DxD Devil Bat Wings (Akuma Wings).
 * - Gremory Demonic Summoning Magic Circle Pedestal.
 * - Cel-Shading via Three.js MeshToonMaterial + Stepped Toon Ramp.
 * - Crisp Manga Inverted Hull Outlines!
 */
export function createValkyrieAnime3DModel(options: ProceduralAnimeOptions): THREE.Group {
  const model = new THREE.Group();
  model.name = `Valkyrie_DxD_${options.valkyrieId}`;

  const visuals = getFactionVisuals(options.faction);
  const toonRamp = getAnimeToonRamp();
  let totalModelVertices = 0;

  // 1. Gremory Clan Magic Summoning Floor Circle & Pedestal
  const pedestalGroup = new THREE.Group();
  pedestalGroup.name = 'Pedestal';

  const floorGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.04, 48, 16);
  const floorMat = new THREE.MeshToonMaterial({
    color: 0x120c18,
    gradientMap: toonRamp,
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.y = 0.02;
  pedestalGroup.add(floorMesh);
  pedestalGroup.add(createAnimeOutline(floorGeo, 0.003, visuals.outline));
  totalModelVertices += floorGeo.attributes.position.count * 2;

  const magicRingGeo = new THREE.RingGeometry(0.28, 0.45, 64, 8);
  const magicRingMat = new THREE.MeshBasicMaterial({
    color: visuals.magicCircle,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const magicRing = new THREE.Mesh(magicRingGeo, magicRingMat);
  magicRing.rotation.x = -Math.PI / 2;
  magicRing.position.y = 0.045;
  pedestalGroup.add(magicRing);
  totalModelVertices += magicRingGeo.attributes.position.count;

  // Floating Demonic Flame Nodes
  const pylonGroup = new THREE.Group();
  pylonGroup.name = 'OrbitNodes';
  for (let i = 0; i < 3; i++) {
    const angle = (i * 2 * Math.PI) / 3;
    const flameGeo = new THREE.OctahedronGeometry(0.032, 2);
    const flameMat = new THREE.MeshBasicMaterial({ color: visuals.magicCircle, wireframe: true });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(Math.cos(angle) * 0.44, 0.14, Math.sin(angle) * 0.44);
    pylonGroup.add(flame);
    totalModelVertices += flameGeo.attributes.position.count;
  }
  pedestalGroup.add(pylonGroup);
  model.add(pedestalGroup);

  // 2. Main Humanoid Body Hierarchy
  const humanoid = new THREE.Group();
  humanoid.name = 'HumanoidBody';

  // Materials with Anime Cel-Shading (Toon Ramp)
  const skinMat = new THREE.MeshToonMaterial({
    color: visuals.skin,
    gradientMap: toonRamp,
  });
  const blouseMat = new THREE.MeshToonMaterial({
    color: visuals.blouse,
    gradientMap: toonRamp,
  });
  const vestMat = new THREE.MeshToonMaterial({
    color: visuals.vest,
    gradientMap: toonRamp,
  });
  const skirtMat = new THREE.MeshToonMaterial({
    color: visuals.skirt,
    gradientMap: toonRamp,
    side: THREE.DoubleSide,
  });
  const stockingMat = new THREE.MeshToonMaterial({
    color: visuals.stocking,
    gradientMap: toonRamp,
  });
  const ribbonMat = new THREE.MeshToonMaterial({
    color: visuals.ribbon,
    gradientMap: toonRamp,
  });
  const hairMat = new THREE.MeshToonMaterial({
    color: visuals.hair,
    gradientMap: toonRamp,
  });

  // A. Legs, Black Stockings & Mary Jane Shoes
  const legGeo = createDxDLegGeometry(80, 80);
  const leftLeg = new THREE.Mesh(legGeo, stockingMat);
  leftLeg.position.x = -0.088;
  humanoid.add(leftLeg);
  humanoid.add(createAnimeOutline(legGeo, 0.003, visuals.outline));
  leftLeg.add(createAnimeOutline(legGeo, 0.0025, visuals.outline));

  const rightLeg = new THREE.Mesh(legGeo, stockingMat);
  rightLeg.position.x = 0.088;
  humanoid.add(rightLeg);
  rightLeg.add(createAnimeOutline(legGeo, 0.0025, visuals.outline));
  totalModelVertices += legGeo.attributes.position.count * 4;

  // Mary Jane Stiletto Heel Spikes
  for (const s of [-0.088, 0.088]) {
    const heelGeo = new THREE.CylinderGeometry(0.004, 0.002, 0.038, 16, 16);
    const heel = new THREE.Mesh(heelGeo, ribbonMat);
    heel.position.set(s, 0.016, -0.015);
    humanoid.add(heel);
    totalModelVertices += heelGeo.attributes.position.count;
  }

  // B. Kuoh Academy Pleated Miniskirt & Lace Hem
  if (options.tier !== 3) {
    const skirtGeo = createDxDSkirtGeometry(48, 96);
    const skirt = new THREE.Mesh(skirtGeo, skirtMat);
    humanoid.add(skirt);
    skirt.add(createAnimeOutline(skirtGeo, 0.003, visuals.outline));
    totalModelVertices += skirtGeo.attributes.position.count * 2;

    // White Lace Underskirt Frill
    const laceGeo = new THREE.CylinderGeometry(0.23, 0.25, 0.03, 64, 16, true);
    const laceMat = new THREE.MeshToonMaterial({
      color: 0xffffff,
      gradientMap: toonRamp,
      side: THREE.DoubleSide,
    });
    const lace = new THREE.Mesh(laceGeo, laceMat);
    lace.position.set(0, 0.24, 0);
    humanoid.add(lace);
    totalModelVertices += laceGeo.attributes.position.count;
  }

  // C. Voluptuous Torso with Kuoh White Blouse & Cleavage
  const torsoGeo = createDxDTorsoGeometry(120, 120, options.tier);
  const torsoMesh = new THREE.Mesh(torsoGeo, options.tier === 3 ? skinMat : blouseMat);
  torsoMesh.name = 'Torso';
  humanoid.add(torsoMesh);
  torsoMesh.add(createAnimeOutline(torsoGeo, 0.003, visuals.outline));
  totalModelVertices += torsoGeo.attributes.position.count * 2;

  // Kuoh Academy Corset Vest (Cinched Hourglass Waist)
  if (options.tier !== 3) {
    const vestGeo = new THREE.CylinderGeometry(0.126, 0.142, 0.15, 32, 32, true);
    const vest = new THREE.Mesh(vestGeo, vestMat);
    vest.position.set(0, 0.49, 0);
    humanoid.add(vest);
    vest.add(createAnimeOutline(vestGeo, 0.0028, visuals.outline));
    totalModelVertices += vestGeo.attributes.position.count * 2;
  }

  // Kuoh Academy Crimson Silk Ribbon Tie (Folded loop nestled in cleavage)
  const ribbonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.73, 0.105),
    new THREE.Vector3(0, 0.67, 0.138),
    new THREE.Vector3(-0.025, 0.61, 0.145),
    new THREE.Vector3(0, 0.58, 0.125),
  ]);
  const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 24, 0.009, 12, false);
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  humanoid.add(ribbon);
  totalModelVertices += ribbonGeo.attributes.position.count;

  // Sailor Capelet Collar
  const collarGeo = new THREE.ConeGeometry(0.16, 0.08, 32, 16, true);
  const collar = new THREE.Mesh(collarGeo, vestMat);
  collar.position.set(0, 0.76, 0);
  humanoid.add(collar);
  totalModelVertices += collarGeo.attributes.position.count;

  // D. Sculpted Head & Frontal Orthographic UV Projected Face
  const headGroup = new THREE.Group();
  headGroup.name = 'HeadGroup';
  headGroup.position.set(0, 0.95, 0);

  // 1. Smooth Head Cranium / Base
  const headCraniumGeo = createDxDHeadGeometry(80, 80);
  const craniumMesh = new THREE.Mesh(headCraniumGeo, skinMat);
  craniumMesh.name = 'HeadCranium';
  headGroup.add(craniumMesh);
  craniumMesh.add(createAnimeOutline(headCraniumGeo, 0.0025, visuals.outline));
  totalModelVertices += headCraniumGeo.attributes.position.count * 2;

  // 2. Dedicated Distortion-Free Frontal Face Plate
  const faceTexture = createDxDAnimeFaceTexture(options.faction, options.tier);
  const facePlateGeo = createDxDCurvedFacePlate(48, 48);
  const facePlateMat = new THREE.MeshBasicMaterial({
    map: faceTexture,
    transparent: true,
  });
  const facePlateMesh = new THREE.Mesh(facePlateGeo, facePlateMat);
  facePlateMesh.name = 'AnimeFacePlate';
  // Positioned slightly in front of head base contour
  facePlateMesh.position.set(0, 0.005, 0.008);
  headGroup.add(facePlateMesh);
  totalModelVertices += facePlateGeo.attributes.position.count;

  humanoid.add(headGroup);

  // E. Dual Arms & 10 Articulated Fingers
  for (const s of [-1, 1]) {
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(s * 0.19, 0.70, 0),
      new THREE.Vector3(s * 0.21, 0.58, 0.012),
      new THREE.Vector3(s * 0.22, 0.46, 0.032),
      new THREE.Vector3(s * 0.23, 0.36, 0.052),
    ]);
    const armGeo = new THREE.TubeGeometry(armCurve, 40, 0.026, 20, false);
    const armMesh = new THREE.Mesh(armGeo, options.tier >= 2 ? skinMat : blouseMat);
    humanoid.add(armMesh);
    armMesh.add(createAnimeOutline(armGeo, 0.0025, visuals.outline));
    totalModelVertices += armGeo.attributes.position.count * 2;

    // Hand & 5 Fingers
    const handGroup = new THREE.Group();
    handGroup.position.set(s * 0.23, 0.35, 0.052);

    const palmGeo = new THREE.BoxGeometry(0.032, 0.042, 0.016, 8, 8, 4);
    const palm = new THREE.Mesh(palmGeo, skinMat);
    handGroup.add(palm);
    totalModelVertices += palmGeo.attributes.position.count;

    const fingerOffsets = [
      { x: s * -0.016, y: -0.010, z: 0.008, len: 0.025, rad: 0.0045 }, // Thumb
      { x: s * -0.009, y: -0.028, z: 0.002, len: 0.032, rad: 0.0040 }, // Index
      { x: s * 0.000, y: -0.030, z: 0.000, len: 0.034, rad: 0.0042 },  // Middle
      { x: s * 0.009, y: -0.028, z: -0.001, len: 0.030, rad: 0.0038 }, // Ring
      { x: s * 0.016, y: -0.024, z: -0.003, len: 0.024, rad: 0.0032 }, // Pinky
    ];
    for (const f of fingerOffsets) {
      const fCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(f.x, f.y, f.z),
        new THREE.Vector3(f.x, f.y - f.len * 0.5, f.z + 0.003),
        new THREE.Vector3(f.x, f.y - f.len, f.z + 0.002),
      ]);
      const fGeo = new THREE.TubeGeometry(fCurve, 12, f.rad, 8, false);
      const fMesh = new THREE.Mesh(fGeo, skinMat);
      handGroup.add(fMesh);
      totalModelVertices += fGeo.attributes.position.count;
    }
    humanoid.add(handGroup);
  }

  // F. Cascading Crimson Rias Gremory Hair & Ahoge (Leaves front face completely open!)
  const hairGroup = new THREE.Group();
  hairGroup.name = 'AnimeHairGroup';

  // Cranial Hair Cap (Excludes Front Face completely!)
  const hairDomeGeo = createDxDHairCapGeometry(48, 48);
  const hairDome = new THREE.Mesh(hairDomeGeo, hairMat);
  hairGroup.add(hairDome);
  hairDome.add(createAnimeOutline(hairDomeGeo, 0.003, visuals.outline));
  totalModelVertices += hairDomeGeo.attributes.position.count * 2;

  const addTaperedLock = (points: THREE.Vector3[], baseRadius: number, steps: number, radial: number, name?: string) => {
    const geo = createDxDTaperedHairStrand(points, baseRadius, steps, radial);
    const mesh = new THREE.Mesh(geo, hairMat);
    if (name) mesh.name = name;
    mesh.add(createAnimeOutline(geo, 0.0025, visuals.outline));
    hairGroup.add(mesh);
    totalModelVertices += geo.attributes.position.count * 2;
  };

  // 1. Rias Feathered Front Bangs (Positioned on forehead, framing brows)
  for (const bx of [-0.09, -0.05, -0.02, 0.02, 0.05, 0.09]) {
    addTaperedLock([
      new THREE.Vector3(bx * 0.7, 1.22, 0.14),
      new THREE.Vector3(bx * 1.05, 1.16, 0.165),
      new THREE.Vector3(bx * 1.25, 1.11, 0.160),
    ], 0.018 - Math.abs(bx) * 0.04, 24, 10);
  }

  // 2. Sidelocks Draping Beside Cheeks & Over Bosom
  for (const s of [-1, 1]) {
    addTaperedLock([
      new THREE.Vector3(s * 0.13, 1.19, 0.07),
      new THREE.Vector3(s * 0.16, 1.05, 0.10),
      new THREE.Vector3(s * 0.15, 0.88, 0.12), // Curls gently beside the bust
      new THREE.Vector3(s * 0.12, 0.70, 0.09),
    ], 0.025, 36, 12);
  }

  // 3. Cascading Crimson Back Hair Mantle (Down past waist)
  for (const s of [-1, 1]) {
    const tailName = s === 1 ? 'RightTwintail' : 'LeftTwintail';
    addTaperedLock([
      new THREE.Vector3(s * 0.11, 1.16, -0.10),
      new THREE.Vector3(s * 0.18, 1.02, -0.16),
      new THREE.Vector3(s * 0.22, 0.82, -0.18),
      new THREE.Vector3(s * 0.19, 0.58, -0.15),
      new THREE.Vector3(s * 0.15, 0.35, -0.10),
    ], 0.032, 48, 14, tailName);

    addTaperedLock([
      new THREE.Vector3(s * 0.05, 1.14, -0.13),
      new THREE.Vector3(s * 0.09, 0.95, -0.18),
      new THREE.Vector3(s * 0.12, 0.72, -0.18),
      new THREE.Vector3(s * 0.08, 0.45, -0.14),
    ], 0.024, 40, 12);
  }

  // 4. Iconic Rias Ahoge (Antenna Curl)
  addTaperedLock([
    new THREE.Vector3(0, 1.25, 0.02),
    new THREE.Vector3(0.04, 1.35, 0.05),
    new THREE.Vector3(0.08, 1.32, 0.02),
    new THREE.Vector3(0.03, 1.28, -0.01),
  ], 0.014, 24, 10);

  humanoid.add(hairGroup);
  model.add(humanoid);

  // 3. High School DxD Authentic Devil Wings (Akuma Wings)
  const wingsGroup = new THREE.Group();
  wingsGroup.name = 'CyberWings';
  wingsGroup.position.set(0, 0.72, -0.08);

  const boneMat = new THREE.MeshToonMaterial({
    color: visuals.wingBone,
    gradientMap: toonRamp,
  });
  const membraneMat = new THREE.MeshToonMaterial({
    color: visuals.wingMembrane,
    gradientMap: toonRamp,
    side: THREE.DoubleSide,
  });

  const leftWingData = createDxDSingleDevilWing(false, boneMat, membraneMat);
  wingsGroup.add(leftWingData.group);
  totalModelVertices += leftWingData.vertexCount;

  const rightWingData = createDxDSingleDevilWing(true, boneMat, membraneMat);
  wingsGroup.add(rightWingData.group);
  totalModelVertices += rightWingData.vertexCount;

  model.add(wingsGroup);

  // 4. Demonic Summoning Halo & Signature Weapon
  const halo = new THREE.Group();
  halo.name = 'Halo';
  halo.position.set(0, 1.05, -0.08);
  halo.rotation.x = Math.PI / 9;

  const outerGeo = new THREE.TorusGeometry(0.28, 0.008, 24, 48);
  const outerMat = new THREE.MeshBasicMaterial({
    color: visuals.magicCircle,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
  });
  halo.add(new THREE.Mesh(outerGeo, outerMat));
  totalModelVertices += outerGeo.attributes.position.count;
  model.add(halo);

  const weapon = new THREE.Group();
  weapon.name = 'SignatureWeapon';
  weapon.position.set(0.38, 0.55, 0.08);
  weapon.rotation.z = -Math.PI / 10;
  weapon.rotation.y = -Math.PI / 12;

  const bladeGeo = new THREE.BoxGeometry(0.040, 0.95, 0.016, 16, 48, 4);
  const bladeMat = new THREE.MeshToonMaterial({
    color: visuals.primary,
    gradientMap: toonRamp,
  });
  const blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.y = 0.32;
  blade.add(createAnimeOutline(bladeGeo, 0.003, visuals.outline));
  weapon.add(blade);
  totalModelVertices += bladeGeo.attributes.position.count * 2;
  model.add(weapon);

  // Runtime Wireframe Inspection
  model.userData.totalVertices = totalModelVertices;
  model.userData.setWireframe = (enabled: boolean) => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = enabled));
        } else {
          child.material.wireframe = enabled;
        }
      }
    });
  };

  console.log(`[High School DxD Anime Model] ${options.name} (${options.valkyrieId}) generated with ${totalModelVertices.toLocaleString()} vertices!`);

  return model;
}
