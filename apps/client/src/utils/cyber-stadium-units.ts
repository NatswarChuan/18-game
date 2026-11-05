import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '@valkyrie/shared-domain';
import { getHologramValkyrieTexture } from './valkyrie-hologram-texture.js';
import { getFactionHexColor } from './three-valkyrie-builder.js';
import { createValkyrie3DFullFigure } from './valkyrie-3d-figure-builder.js';

export interface Unit3DRenderConfig {
  readonly valkyrieId: string;
  readonly faction: FactionId;
  readonly currentHp: number;
  readonly maxHp: number;
  readonly currentMana: number;
  readonly maxMana: number;
  readonly tier: ClothDamageTier;
  readonly isEnemy: boolean;
  readonly isCasting: boolean;
  readonly isAlive: boolean;
}

/**
 * Creates a floating 3D tactical health & mana bar HUD above the character's head.
 * Tạo cụm thanh máu (HP) và năng lượng (Mana) lơ lửng 3D trên đỉnh đầu nhân vật.
 *
 * @param hpPercent - Percentage of health (0 to 1).
 * @param manaPercent - Percentage of mana (0 to 1).
 * @param isEnemy - True if enemy unit.
 * @returns THREE.Group containing the floating HUD bars.
 */
export function createFloatingBars(
  hpPercent: number,
  manaPercent: number,
  isEnemy: boolean
): THREE.Group {
  const barGroup = new THREE.Group();

  // 1. Dark HUD Background Bar
  const bgGeo = new THREE.PlaneGeometry(1.1, 0.1);
  const bgMat = new THREE.MeshBasicMaterial({ color: 0x080a14, side: THREE.DoubleSide });
  const bgMesh = new THREE.Mesh(bgGeo, bgMat);
  barGroup.add(bgMesh);

  // 2. Health Fill Bar
  const hpWidth = Math.max(0.01, 1.06 * Math.min(1, Math.max(0, hpPercent)));
  const hpGeo = new THREE.PlaneGeometry(hpWidth, 0.07);
  const hpColor = isEnemy
    ? 0xff3344
    : hpPercent > 0.5
    ? 0x00f0ff
    : hpPercent > 0.25
    ? 0xffd700
    : 0xff3344;
  const hpMat = new THREE.MeshBasicMaterial({ color: hpColor, side: THREE.DoubleSide });
  const hpMesh = new THREE.Mesh(hpGeo, hpMat);
  hpMesh.position.set(-0.53 + hpWidth / 2, 0.012, 0.01);
  barGroup.add(hpMesh);

  // 3. Mana Fill Bar
  const manaWidth = Math.max(0.01, 1.06 * Math.min(1, Math.max(0, manaPercent)));
  const manaGeo = new THREE.PlaneGeometry(manaWidth, 0.035);
  const manaMat = new THREE.MeshBasicMaterial({ color: 0x9933ff, side: THREE.DoubleSide });
  const manaMesh = new THREE.Mesh(manaGeo, manaMat);
  manaMesh.position.set(-0.53 + manaWidth / 2, -0.065, 0.01);
  barGroup.add(manaMesh);

  return barGroup;
}

/**
 * Builds a standing 2.5D Valkyrie Hologram Figure on the 3D Stadium Stage.
 * Dựng hình thể đứng 2.5D lăng kính pha lê Hologram của nữ chiến binh Valkyrie trên sàn đấu 3D:
 * Chiều cao 1.8m, cắt gọt viền pha lê trong suốt, bệ hào quang và thanh máu lơ lửng.
 *
 * @param config - Unit render parameters and combat telemetry.
 * @returns THREE.Group representing the complete standing character.
 */
export function createStandingValkyrieFigure(config: Unit3DRenderConfig): THREE.Group {
  const figureGroup = new THREE.Group();
  const factionColor = getFactionHexColor(config.faction);
  const primaryColor = config.isEnemy ? 0xff3344 : factionColor;

  // 1. Footprint Tech Rings on pedestal surface (Y = 0.02, lies flat on floor)
  const footRingGeo = new THREE.RingGeometry(0.35, 0.58, 24);
  const footRingMat = new THREE.MeshBasicMaterial({
    color: primaryColor,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
  const footRingMesh = new THREE.Mesh(footRingGeo, footRingMat);
  footRingMesh.rotation.x = -Math.PI / 2;
  footRingMesh.position.set(0, 0.02, 0);
  figureGroup.add(footRingMesh);

  const innerFootGeo = new THREE.RingGeometry(0.18, 0.22, 24);
  const innerFootMat = new THREE.MeshBasicMaterial({
    color: primaryColor,
    transparent: true,
    opacity: 0.75,
    wireframe: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const innerFootMesh = new THREE.Mesh(innerFootGeo, innerFootMat);
  innerFootMesh.rotation.x = -Math.PI / 2;
  innerFootMesh.position.set(0, 0.025, 0);
  figureGroup.add(innerFootMesh);

  // 2. Upright Standing 3D Character Group (standing tall, vertical on pedestal)
  const billboardGroup = new THREE.Group();
  billboardGroup.position.set(0, 0.04, 0);
  billboardGroup.rotation.x = 0;
  billboardGroup.scale.set(1.15, 1.15, 1.15);

  // 2a. Core Layer: True 3D Prismatic Valkyrie Diorama (Designed by model-3d-designer)
  const texture = getHologramValkyrieTexture(config.valkyrieId, config.faction, config.tier);
  const full3DFigure = createValkyrie3DFullFigure(
    {
      valkyrieId: config.valkyrieId,
      faction: config.faction,
      tier: config.tier,
      isEnemy: config.isEnemy,
      primaryColor
    },
    texture
  );
  billboardGroup.add(full3DFigure);

  // 2b. Floating 3D Health & Mana Bars cleanly above character head (Y = 2.18)
  const hpPercent = config.maxHp > 0 ? config.currentHp / config.maxHp : 1;
  const manaPercent = config.maxMana > 0 ? config.currentMana / config.maxMana : 0;
  const bars = createFloatingBars(hpPercent, manaPercent, config.isEnemy);
  bars.position.set(0, 2.18, 0.04);
  billboardGroup.add(bars);

  // 2c. Overdrive Tier 3 Climax Aura Ring
  if (config.tier === 3) {
    const flameGeo = new THREE.RingGeometry(0.68, 0.95, 32);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff2a85,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(0, 1.05, 0.02);
    billboardGroup.add(flameMesh);
  }

  figureGroup.add(billboardGroup);
  return figureGroup;
}
