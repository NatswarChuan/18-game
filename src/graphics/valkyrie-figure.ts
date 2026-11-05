import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '../types.js';

export function getFactionHexColor(faction: FactionId): number {
  switch (faction) {
    case 'NEO_VALHALLA':
      return 0x00f0ff; // Cyber Cyan
    case 'ABYSSAL_EDEN':
      return 0x00ff88; // Emerald Lagoon
    case 'SOL_DYNASTY':
      return 0xffb700; // Solar Gold
    default:
      return 0x00f0ff;
  }
}

/**
 * Creates a floating 3D Faction Energy Halo behind the Valkyrie's head.
 */
export function createValkyrie3DHalo(factionColor: number, tier: ClothDamageTier): THREE.Group {
  const haloGroup = new THREE.Group();
  haloGroup.position.set(0, 0.95, -0.06);
  haloGroup.rotation.x = Math.PI / 8;

  const color = tier === 3 ? 0xff2a85 : factionColor;

  // Outer Torus Ring
  const outerGeo = new THREE.TorusGeometry(0.18, 0.01, 12, 32);
  const outerMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: tier === 3 ? 0.95 : 0.75,
    blending: THREE.AdditiveBlending,
  });
  haloGroup.add(new THREE.Mesh(outerGeo, outerMat));

  // Inner Rune Ring
  const innerGeo = new THREE.RingGeometry(0.10, 0.13, 24);
  const innerMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    wireframe: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  haloGroup.add(new THREE.Mesh(innerGeo, innerMat));

  return haloGroup;
}

/**
 * Creates 3D Cyber Weapon floating alongside the Valkyrie.
 */
export function createValkyrie3DWeapon(valkyrieId: string, primaryColor: number): THREE.Group {
  const weaponGroup = new THREE.Group();
  weaponGroup.position.set(0.35, 0.45, 0.04);
  weaponGroup.rotation.z = -Math.PI / 10;

  // Blade / Energy Core
  const bladeGeo = new THREE.BoxGeometry(0.04, 0.65, 0.02);
  const bladeMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    emissive: primaryColor,
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.2,
  });
  const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
  bladeMesh.position.y = 0.15;
  weaponGroup.add(bladeMesh);

  // Crossguard
  const guardGeo = new THREE.BoxGeometry(0.14, 0.03, 0.04);
  const guardMat = new THREE.MeshStandardMaterial({
    color: 0x1f2438,
    metalness: 0.9,
    roughness: 0.3,
  });
  const guardMesh = new THREE.Mesh(guardGeo, guardMat);
  guardMesh.position.y = -0.16;
  weaponGroup.add(guardMesh);

  // Handle
  const hiltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.18, 12);
  const hiltMesh = new THREE.Mesh(hiltGeo, guardMat);
  hiltMesh.position.y = -0.27;
  weaponGroup.add(hiltMesh);

  return weaponGroup;
}

/**
 * Creates dynamic 3D Sci-Fi Battle Armor Plating overlay that strips across Tiers.
 */
function createDynamic3DArmorLayer(primaryColor: number, tier: ClothDamageTier): THREE.Group {
  const armorGroup = new THREE.Group();

  const cuirassMat = new THREE.MeshStandardMaterial({
    color: primaryColor,
    metalness: 0.85,
    roughness: 0.2,
    emissive: primaryColor,
    emissiveIntensity: tier === 3 ? 0.8 : 0.3,
  });

  if (tier === 1) {
    // Tier 1: Pristine Full Armor Plates
    const plateGeo = new THREE.BoxGeometry(0.48, 0.06, 0.03);
    const topPlate = new THREE.Mesh(plateGeo, cuirassMat);
    topPlate.position.set(0, 0.25, 0.01);
    armorGroup.add(topPlate);

    const bottomPlate = new THREE.Mesh(plateGeo, cuirassMat);
    bottomPlate.position.set(0, -0.25, 0.01);
    armorGroup.add(bottomPlate);
  } else if (tier === 2) {
    // Tier 2: Battle-Torn (Cracked, partial plates)
    const brokenPlateGeo = new THREE.BoxGeometry(0.22, 0.05, 0.03);
    const leftPlate = new THREE.Mesh(brokenPlateGeo, cuirassMat);
    leftPlate.position.set(-0.14, 0.22, 0.01);
    leftPlate.rotation.z = 0.1;
    armorGroup.add(leftPlate);
  } else {
    // Tier 3: Climax / Overdrive: Armor completely shattered, intense energy glow
    const coreGeo = new THREE.OctahedronGeometry(0.04, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0.05, 0.02);
    armorGroup.add(coreMesh);
  }

  return armorGroup;
}

/**
 * Creates floating 3D tactical health & mana bar HUD above the Valkyrie.
 */
export function createFloatingBars(
  hpPercent: number,
  manaPercent: number,
  isEnemy: boolean
): THREE.Group {
  const barGroup = new THREE.Group();
  barGroup.position.set(0, 1.25, 0.05);

  // Background
  const bgGeo = new THREE.PlaneGeometry(0.85, 0.1);
  const bgMat = new THREE.MeshBasicMaterial({ color: 0x080a14, side: THREE.DoubleSide });
  const bgMesh = new THREE.Mesh(bgGeo, bgMat);
  barGroup.add(bgMesh);

  // HP Bar
  const hpClamped = Math.max(0.001, Math.min(1, hpPercent));
  const hpWidth = 0.8 * hpClamped;
  const hpGeo = new THREE.PlaneGeometry(hpWidth, 0.055);
  const hpColor = isEnemy
    ? 0xff3355
    : hpPercent > 0.5
    ? 0x00f0ff
    : hpPercent > 0.25
    ? 0xffcc00
    : 0xff2244;
  const hpMat = new THREE.MeshBasicMaterial({ color: hpColor, side: THREE.DoubleSide });
  const hpMesh = new THREE.Mesh(hpGeo, hpMat);
  hpMesh.position.set(-0.4 + hpWidth / 2, 0.012, 0.005);
  barGroup.add(hpMesh);

  // Mana Bar
  const manaClamped = Math.max(0.001, Math.min(1, manaPercent));
  const manaWidth = 0.8 * manaClamped;
  const manaGeo = new THREE.PlaneGeometry(manaWidth, 0.025);
  const manaMat = new THREE.MeshBasicMaterial({ color: 0xaa44ff, side: THREE.DoubleSide });
  const manaMesh = new THREE.Mesh(manaGeo, manaMat);
  manaMesh.position.set(-0.4 + manaWidth / 2, -0.028, 0.005);
  barGroup.add(manaMesh);

  return barGroup;
}

const textureCache = new Map<string, THREE.Texture>();
const textureLoader = new THREE.TextureLoader();

export function getValkyrieTexture(valkyrieId: string): THREE.Texture {
  if (textureCache.has(valkyrieId)) {
    return textureCache.get(valkyrieId)!;
  }
  const tex = textureLoader.load(`/avatars/${valkyrieId}.jpg`);
  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(valkyrieId, tex);
  return tex;
}

import { createValkyrieAnime3DModel } from './procedural-anime-mesh.js';

export interface FigureConfig {
  valkyrieId: string;
  faction: FactionId;
  tier: ClothDamageTier;
  isEnemy: boolean;
  hpPercent?: number;
  manaPercent?: number;
  isCasting?: boolean;
}

/**
 * Builds the complete 3D Anime Valkyrie character model with articulated anatomy,
 * procedural anime face, stylized hair, signature weapon, and floating health/mana HUD.
 */
export function createValkyrie3DFullFigure(config: FigureConfig): THREE.Group {
  const figure = createValkyrieAnime3DModel({
    valkyrieId: config.valkyrieId,
    name: config.valkyrieId,
    faction: config.faction,
    tier: config.tier,
    isEnemy: config.isEnemy,
    hpPercent: config.hpPercent,
    manaPercent: config.manaPercent,
  });
  figure.name = `Valkyrie_${config.valkyrieId}_${config.isEnemy ? 'Enemy' : 'Player'}`;

  // Floating Health & Mana Bars HUD
  const hpP = config.hpPercent ?? 1.0;
  const manaP = config.manaPercent ?? 0.0;
  const hudBars = createFloatingBars(hpP, manaP, config.isEnemy);
  hudBars.name = 'HudBars';
  hudBars.position.set(0, 1.45, 0); // Position slightly above the anime head and halo
  figure.add(hudBars);

  return figure;
}

