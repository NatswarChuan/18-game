import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { createFreyjaFaceTexture } from './freyja-face-texture.js';
import { createFreyjaSuitTexture } from './freyja-suit-texture.js';
import { createFreyjaCuirassTexture } from './freyja-cuirass-texture.js';
import { createFreyjaBustTexture } from './freyja-bust-texture.js';
import { createAnimeCelMaterial, createAnimePhysicalMaterial } from '../anime-shader/anime-cel-shader.js';

/**
 * Container of all PBR & Cel-shaded materials for Freyja (VALK-01).
 * Tập hợp toàn bộ vật liệu Cel-shaded Anime cao cấp cho Freyja.
 */
export interface FreyjaMaterials {
  readonly skin: THREE.MeshPhysicalMaterial;
  readonly breastLeft: THREE.MeshPhysicalMaterial;
  readonly breastRight: THREE.MeshPhysicalMaterial;
  readonly face: THREE.MeshToonMaterial;
  readonly skinBlush: THREE.MeshBasicMaterial;
  readonly eyeWhite: THREE.MeshBasicMaterial;
  readonly eyeIris: THREE.MeshBasicMaterial;
  readonly hair: THREE.MeshToonMaterial;
  readonly hairHighlights: THREE.MeshBasicMaterial;
  readonly armorSilver: THREE.MeshToonMaterial;
  readonly armorCrimson: THREE.MeshToonMaterial;
  readonly armorGold: THREE.MeshToonMaterial;
  readonly cyberCyanGlow: THREE.MeshBasicMaterial;
  readonly bodysuitDark: THREE.MeshPhysicalMaterial;
  readonly stockingsDark: THREE.MeshPhysicalMaterial;
  readonly swordCore: THREE.MeshToonMaterial;
  readonly swordPlasmaEdge: THREE.MeshToonMaterial;
  readonly swordPlasmaGlow: THREE.MeshBasicMaterial;
  readonly dispose: () => void;
}

/**
 * Procedurally generates a lustrous 512x512 Anime Hair texture with an iconic Angel Ring (天使の輪) highlight
 * and radiant fiery flame-orange tips matching official VALK-01 Freyja concept art.
 * Tạo texture tóc Anime 512x512 với vòng sáng thiên thần và đuôi tóc ánh lửa cam rực rỡ đặc trưng của Freyja.
 */
export function createAnimeHairTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Rich vertical hair gradient: wine roots -> ruby crimson mid -> fiery scarlet tips
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.00, '#3a050e'); // Deep wine shadow at roots/crown
  grad.addColorStop(0.25, '#820e1e'); // Deep crimson
  grad.addColorStop(0.50, '#ba1a30'); // Radiant ruby
  grad.addColorStop(0.75, '#d62438'); // Mid fiery scarlet
  grad.addColorStop(0.92, '#e63226'); // Dynamic flame transition
  grad.addColorStop(1.00, '#eb421e'); // Fiery sunlit tips (Signature VALK-01 match)
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // 2. Fine vertical anisotropic hair strands for silky depth
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  for (let x = 0; x < 512; x += 6) {
    const strandW = (x % 12 === 0) ? 2 : 1;
    ctx.fillRect(x, 0, strandW, 512);
  }
  ctx.fillStyle = 'rgba(255, 120, 160, 0.12)';
  for (let x = 3; x < 512; x += 8) {
    ctx.fillRect(x, 0, 1, 512);
  }

  // 3. Subtle Anime Crown Sheen (High at crown Y ≈ 40-110, soft ruby luster)
  const ringGrad = ctx.createLinearGradient(0, 40, 0, 110);
  ringGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
  ringGrad.addColorStop(0.3, 'rgba(255, 160, 185, 0.25)');
  ringGrad.addColorStop(0.5, 'rgba(255, 220, 235, 0.45)'); // Soft luster, no harsh white band
  ringGrad.addColorStop(0.7, 'rgba(255, 160, 185, 0.25)');
  ringGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = ringGrad;
  ctx.fillRect(0, 40, 512, 70);

  // Subtle anime notches
  ctx.fillStyle = '#820e1e';
  const notchX = [48, 112, 186, 260, 334, 408, 476];
  notchX.forEach((nx) => {
    ctx.beginPath();
    ctx.moveTo(nx, 55);
    ctx.lineTo(nx + 6, 75);
    ctx.lineTo(nx, 95);
    ctx.lineTo(nx - 6, 75);
    ctx.closePath();
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates and tunes all Anime Cel-Shading materials for Freyja's 3D humanoid model.
 * Khởi tạo và tinh chỉnh vật liệu Cel-Shading Anime cho mô hình 3D hình người của Freyja.
 *
 * @param isEnemy - True if this unit is an opponent entity.
 * @returns FreyjaMaterials bundle with safe dispose lifecycle.
 */
export function createFreyjaMaterials(isEnemy: boolean): FreyjaMaterials {
  const primaryGlow = isEnemy ? 0xff2244 : 0x00f0ff;
  const plasmaColor = isEnemy ? 0xff1133 : 0xff0055;

  // 1. Authentic Soft Matte Anime Porcelain Skin with subtle peach sheen & Fresnel Rim Light
  const skin = createAnimePhysicalMaterial({
    color: 0xffdfd0,
    roughness: 0.64,
    metalness: 0.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.20,
    sheen: 0.60,
    sheenColor: 0xffb5c8,
    sheenRoughness: 0.35,
    rimColor: 0xffb5c8,
    rimIntensity: 0.65,
    rimPower: 2.8
  });

  // Dedicated Voluptuous G-Cup Anime Bust Materials with soft velvety peach sheen & sensual rim
  const breastLeftTex = createFreyjaBustTexture(1, false);
  const breastLeft = createAnimePhysicalMaterial({
    map: breastLeftTex,
    color: 0xffffff,
    roughness: 0.62,
    metalness: 0.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.20,
    sheen: 0.65,
    sheenColor: 0xffa5be,
    sheenRoughness: 0.30,
    rimColor: 0xffadc6,
    rimIntensity: 0.70,
    rimPower: 2.6,
    side: THREE.DoubleSide
  });

  const breastRightTex = createFreyjaBustTexture(1, true);
  const breastRight = createAnimePhysicalMaterial({
    map: breastRightTex,
    color: 0xffffff,
    roughness: 0.62,
    metalness: 0.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.20,
    sheen: 0.65,
    sheenColor: 0xffa5be,
    sheenRoughness: 0.30,
    rimColor: 0xffadc6,
    rimIntensity: 0.70,
    rimPower: 2.6,
    side: THREE.DoubleSide
  });

  const faceTexture = createFreyjaFaceTexture(1);
  const face = createAnimeCelMaterial({
    color: 0xffffff,
    map: faceTexture,
    isSkin: true,
    transparent: false,
    side: THREE.DoubleSide
  });
  face.depthWrite = true;
  face.polygonOffset = true;
  face.polygonOffsetFactor = -2;
  face.polygonOffsetUnits = -2;

  // Ultra-Glossy Midnight Obsidian Latex Bodysuit with Electric Cyan Rim Glow
  const suitTexture = createFreyjaSuitTexture(1);
  const bodysuitDark = createAnimePhysicalMaterial({
    map: suitTexture,
    color: 0xffffff,
    roughness: 0.12,
    metalness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.07,
    sheen: 0.70,
    sheenColor: 0x4488bb,
    rimColor: 0x00f0ff,
    rimIntensity: 1.45,
    rimPower: 2.2
  });

  const stockingsDark = createAnimePhysicalMaterial({
    color: 0x141828,
    roughness: 0.22,
    metalness: 0.06,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    sheen: 0.80,
    sheenColor: 0x5065a0,
    rimColor: 0x00d4ff,
    rimIntensity: 1.25,
    rimPower: 2.3
  });

  const skinBlush = new THREE.MeshBasicMaterial({
    color: 0xff7088,
    transparent: true,
    opacity: 0.45
  });

  const eyeWhite = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });

  const eyeIris = new THREE.MeshBasicMaterial({
    color: 0xffaa00
  });

  // 2. Crimson Anime Hair with Angel Ring texture map and Rich Ruby Sheen
  const hairTexture = createAnimeHairTexture();
  const hair = createAnimeCelMaterial({
    color: 0xffffff,
    map: hairTexture,
    isHair: true,
    rimColor: 0xd92638,
    rimIntensity: 0.55,
    rimPower: 2.6,
    side: THREE.DoubleSide
  });

  const hairHighlights = new THREE.MeshBasicMaterial({
    color: 0xff88aa,
    transparent: true,
    opacity: 0.75
  });

  // 3. Cyber Armor Anime Shading with Brushed Titanium & Neon Cyan mapping
  const cuirassTexture = createFreyjaCuirassTexture(1);
  const armorSilver = createAnimeCelMaterial({
    color: 0xffffff,
    map: cuirassTexture,
    rimColor: 0x00f0ff,
    rimIntensity: 0.40,
    rimPower: 3.2,
    side: THREE.DoubleSide
  });

  const armorCrimson = createAnimeCelMaterial({
    color: 0xa80f2d,
    rimColor: 0xff1855,
    rimIntensity: 1.25,
    rimPower: 2.2
  });

  const armorGold = createAnimeCelMaterial({
    color: 0xffd700,
    emissive: 0x443300,
    emissiveIntensity: 0.25,
    rimColor: 0xffe066,
    rimIntensity: 1.20,
    rimPower: 2.2
  });

  const cyberCyanGlow = new THREE.MeshBasicMaterial({
    color: primaryGlow
  });

  const swordCore = createAnimeCelMaterial({
    color: 0x222838,
    rimColor: 0x00f0ff,
    rimIntensity: 0.90
  });

  const swordPlasmaEdge = createAnimeCelMaterial({
    color: plasmaColor,
    emissive: plasmaColor,
    emissiveIntensity: 2.5,
    rimColor: 0xff0066,
    rimIntensity: 1.60,
    rimPower: 1.8
  });

  const swordPlasmaGlow = new THREE.MeshBasicMaterial({
    color: plasmaColor,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const dispose = (): void => {
    skin.dispose();
    breastLeftTex.dispose();
    breastLeft.dispose();
    breastRightTex.dispose();
    breastRight.dispose();
    faceTexture.dispose();
    face.dispose();
    suitTexture.dispose();
    skinBlush.dispose();
    eyeWhite.dispose();
    eyeIris.dispose();
    hairTexture.dispose();
    hair.dispose();
    hairHighlights.dispose();
    armorSilver.map?.dispose();
    armorSilver.dispose();
    armorCrimson.dispose();
    armorGold.dispose();
    cyberCyanGlow.dispose();
    bodysuitDark.dispose();
    stockingsDark.dispose();
    swordCore.dispose();
    swordPlasmaEdge.dispose();
    swordPlasmaGlow.dispose();
  };

  return {
    skin,
    breastLeft,
    breastRight,
    face,
    skinBlush,
    eyeWhite,
    eyeIris,
    hair,
    hairHighlights,
    armorSilver,
    armorCrimson,
    armorGold,
    cyberCyanGlow,
    bodysuitDark,
    stockingsDark,
    swordCore,
    swordPlasmaEdge,
    swordPlasmaGlow,
    dispose
  };
}

export interface FreyjaVisualHierarchy {
  readonly breastplateGroup: THREE.Group;
  readonly breastLeft?: THREE.Mesh;
  readonly breastRight?: THREE.Mesh;
}

/**
 * Updates Freyja's materials and visual hierarchy based on current cloth damage tier.
 * Cập nhật độ hiển thị vật liệu và trang phục của Freyja theo cấp độ rách giáp:
 * - Tier 1: Giáp Thánh Titan Bạc & Đỏ thẫm bóng bẩy, nguyên bản oai phong
 * - Tier 2: Giáp nứt vỡ, mờ đục 65% để lộ vết rách vải và làn da đẫm mồ hôi
 * - Tier 3: Giáp ngực vỡ nát hoàn toàn (blown away), để lộ trọn vẹn đôi gò bồng đảo cúp G ửng hồng.
 *
 * @param materials - Freyja materials set.
 * @param tier - Current cloth damage tier (1: Pristine, 2: Torn, 3: Climax).
 * @param visualHierarchy - Optional 3D visual hierarchy for toggling armor pieces.
 */
export function applyFreyjaClothTier(
  materials: FreyjaMaterials,
  tier: ClothDamageTier,
  visualHierarchy?: FreyjaVisualHierarchy
): void {
  // Update face, suit, and cuirass textures with tier-specific damage details
  const oldFaceTex = materials.face.map;
  materials.face.map = createFreyjaFaceTexture(tier);
  materials.face.needsUpdate = true;
  oldFaceTex?.dispose();

  const oldSuitTex = materials.bodysuitDark.map;
  materials.bodysuitDark.map = createFreyjaSuitTexture(tier);
  materials.bodysuitDark.needsUpdate = true;
  oldSuitTex?.dispose();

  const oldCuirassTex = materials.armorSilver.map;
  materials.armorSilver.map = createFreyjaCuirassTexture(tier);
  materials.armorSilver.needsUpdate = true;
  oldCuirassTex?.dispose();

  // Update bust textures with tier-specific push-up demi-cup or sheer micro-harness lingerie
  const oldBustLeftTex = materials.breastLeft.map;
  materials.breastLeft.map = createFreyjaBustTexture(tier, false);
  materials.breastLeft.needsUpdate = true;
  oldBustLeftTex?.dispose();

  const oldBustRightTex = materials.breastRight.map;
  materials.breastRight.map = createFreyjaBustTexture(tier, true);
  materials.breastRight.needsUpdate = true;
  oldBustRightTex?.dispose();

  // Control armored cuirass breastplate and bare breasts visibility
  if (visualHierarchy?.breastplateGroup) {
    if (tier === 3) {
      // Armor completely shattered in Climax Extreme: bare bust in micro-harness lingerie
      visualHierarchy.breastplateGroup.visible = false;
      if (visualHierarchy.breastLeft) visualHierarchy.breastLeft.visible = true;
      if (visualHierarchy.breastRight) visualHierarchy.breastRight.visible = true;
    } else if (tier === 2) {
      // Torn armor: semi-translucent cracked cuirass reveals soft skin and perspiration underneath
      visualHierarchy.breastplateGroup.visible = true;
      if (visualHierarchy.breastLeft) visualHierarchy.breastLeft.visible = true;
      if (visualHierarchy.breastRight) visualHierarchy.breastRight.visible = true;
    } else {
      // Pristine Tier 1: Plunging sweetheart push-up cuirass supporting voluptuous bare bust and cleavage
      visualHierarchy.breastplateGroup.visible = true;
      if (visualHierarchy.breastLeft) visualHierarchy.breastLeft.visible = true;
      if (visualHierarchy.breastRight) visualHierarchy.breastRight.visible = true;
    }
  }

  if (tier === 3) {
    materials.armorSilver.opacity = 1.0;
    materials.armorSilver.transparent = false;
    materials.armorCrimson.opacity = 1.0;
    materials.armorCrimson.transparent = false;
    materials.swordPlasmaEdge.emissiveIntensity = 3.8;
    materials.skin.color.setHex(0xffdad0); // Flushed sensual erotic skin
    materials.skin.clearcoat = 0.08;
    materials.skin.clearcoatRoughness = 0.20;
    materials.skin.roughness = 0.48;
    materials.breastLeft.color.setHex(0xffdad0);
    materials.breastLeft.clearcoat = 0.08;
    materials.breastLeft.clearcoatRoughness = 0.20;
    materials.breastLeft.roughness = 0.46;
    materials.breastRight.color.setHex(0xffdad0);
    materials.breastRight.clearcoat = 0.08;
    materials.breastRight.clearcoatRoughness = 0.20;
    materials.breastRight.roughness = 0.46;
  } else if (tier === 2) {
    materials.armorSilver.opacity = 1.0;
    materials.armorSilver.transparent = false;
    materials.armorCrimson.opacity = 1.0;
    materials.armorCrimson.transparent = false;
    materials.swordPlasmaEdge.emissiveIntensity = 2.8;
    materials.skin.color.setHex(0xffdfd0);
    materials.skin.clearcoat = 0.04;
    materials.skin.clearcoatRoughness = 0.20;
    materials.skin.roughness = 0.56;
    materials.breastLeft.clearcoat = 0.04;
    materials.breastLeft.clearcoatRoughness = 0.20;
    materials.breastLeft.roughness = 0.54;
    materials.breastRight.clearcoat = 0.04;
    materials.breastRight.clearcoatRoughness = 0.20;
    materials.breastRight.roughness = 0.54;
  } else {
    materials.armorSilver.opacity = 1.0;
    materials.armorSilver.transparent = false;
    materials.armorCrimson.opacity = 1.0;
    materials.armorCrimson.transparent = false;
    materials.swordPlasmaEdge.emissiveIntensity = 2.5;
    materials.skin.color.setHex(0xffdfd0);
    materials.skin.clearcoat = 0.0;
    materials.skin.clearcoatRoughness = 0.20;
    materials.skin.roughness = 0.64;
    materials.breastLeft.clearcoat = 0.0;
    materials.breastLeft.clearcoatRoughness = 0.20;
    materials.breastLeft.roughness = 0.62;
    materials.breastRight.clearcoat = 0.0;
    materials.breastRight.clearcoatRoughness = 0.20;
    materials.breastRight.roughness = 0.62;
  }
}
