import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { BrynhildrMaterials } from './brynhildr-materials.js';

export interface BrynhildrBones {
  readonly rootGroup: THREE.Group;
  readonly hipsGroup: THREE.Group;
  readonly spineGroup: THREE.Group;
  readonly chestGroup: THREE.Group;
  readonly headGroup: THREE.Group;
  readonly hairGroup: THREE.Group;
  readonly ponytail: THREE.Group;
  readonly leftArmGroup: THREE.Group;
  readonly rightArmGroup: THREE.Group;
  readonly shieldGroup: THREE.Group;
  readonly swordGroup: THREE.Group;
  readonly leftLegGroup: THREE.Group;
  readonly rightLegGroup: THREE.Group;
}

export interface BrynhildrMeshes {
  readonly breastplateMesh: THREE.Mesh;
  readonly breastplateTrim: THREE.Mesh;
  readonly rightPauldron: THREE.Mesh;
  readonly leftPauldron: THREE.Mesh;
  readonly shieldMesh: THREE.Mesh;
  readonly shieldGlowMesh: THREE.Mesh;
  readonly swordMesh: THREE.Mesh;
  readonly swordGlowMesh: THREE.Mesh;
  readonly leftTasset: THREE.Mesh;
  readonly rightTasset: THREE.Mesh;
  readonly dispose: () => void;
}

export interface BrynhildrGeometryBundle {
  readonly bones: BrynhildrBones;
  readonly meshes: BrynhildrMeshes;
  readonly updateTier: (tier: ClothDamageTier) => void;
}

/**
 * Constructs the complete 3D procedural humanoid geometry for Brynhildr (VALK-02).
 * Dựng toàn bộ khung xương và lưới hình học 3D cho Brynhildr - Khiên Băng Tuyệt Đối (Neo-Valhalla).
 *
 * @param materials - BrynhildrMaterials bundle.
 * @returns BrynhildrGeometryBundle containing skeletal hierarchy and update hooks.
 */
export function buildBrynhildrGeometry(materials: BrynhildrMaterials): BrynhildrGeometryBundle {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'Brynhildr_VALK-02_Root';

  const disposableGeometries: THREE.BufferGeometry[] = [];
  const registerGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };

  // 1. Pelvis / Hips Group (Y = 0.88m above ground)
  const hipsGroup = new THREE.Group();
  hipsGroup.position.set(0, 0.88, 0);
  rootGroup.add(hipsGroup);

  const hipsGeo = registerGeo(new THREE.CylinderGeometry(0.22, 0.20, 0.18, 16));
  const hipsMesh = new THREE.Mesh(hipsGeo, materials.bodysuitDark);
  hipsGroup.add(hipsMesh);

  // Armored hip tassets (Platinum plates with cyan ice-blue trim)
  const tassetGeo = registerGeo(new THREE.BoxGeometry(0.08, 0.20, 0.24));
  const leftTasset = new THREE.Mesh(tassetGeo, materials.armorPlatinum);
  leftTasset.position.set(-0.25, -0.04, 0);
  leftTasset.rotation.z = 0.12;
  const rightTasset = new THREE.Mesh(tassetGeo, materials.armorPlatinum);
  rightTasset.position.set(0.25, -0.04, 0);
  rightTasset.rotation.z = -0.12;
  hipsGroup.add(leftTasset, rightTasset);

  // 2. Spine / Hourglass Waist Group (Y = 0.14 relative to hips)
  const spineGroup = new THREE.Group();
  spineGroup.position.set(0, 0.14, 0);
  hipsGroup.add(spineGroup);

  const waistGeo = registerGeo(new THREE.CylinderGeometry(0.19, 0.22, 0.16, 16));
  const waistMesh = new THREE.Mesh(waistGeo, materials.bodysuitDark);
  spineGroup.add(waistMesh);

  // Paladin Corset Accent Ring (Cyan Frost Glow)
  const waistRingGeo = registerGeo(new THREE.TorusGeometry(0.21, 0.014, 8, 24));
  const waistRing = new THREE.Mesh(waistRingGeo, materials.armorIceBlue);
  waistRing.rotation.x = Math.PI / 2;
  spineGroup.add(waistRing);

  // 3. Chest Group (Y = 0.18 relative to spine)
  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 0.18, 0);
  spineGroup.add(chestGroup);

  const chestBaseGeo = registerGeo(new THREE.CylinderGeometry(0.24, 0.19, 0.18, 16));
  const chestBaseMesh = new THREE.Mesh(chestBaseGeo, materials.bodysuitDark);
  chestGroup.add(chestBaseMesh);

  // F-Cup Sensual Paladin Bust Geometry
  const breastGeo = registerGeo(new THREE.SphereGeometry(0.125, 16, 16));
  const breastLeft = new THREE.Mesh(breastGeo, materials.skin);
  breastLeft.position.set(-0.092, 0.02, 0.115);
  breastLeft.scale.set(1.0, 1.08, 1.22);
  breastLeft.rotation.z = -0.14;

  const breastRight = new THREE.Mesh(breastGeo, materials.skin);
  breastRight.position.set(0.092, 0.02, 0.115);
  breastRight.scale.set(1.0, 1.08, 1.22);
  breastRight.rotation.z = 0.14;
  chestGroup.add(breastLeft, breastRight);

  // Cleavage contour
  const cleavageGeo = registerGeo(new THREE.BoxGeometry(0.025, 0.13, 0.11));
  const cleavageMesh = new THREE.Mesh(cleavageGeo, materials.bodysuitDark);
  cleavageMesh.position.set(0, 0.02, 0.095);
  chestGroup.add(cleavageMesh);

  // Paladin Knight Breastplate & Cyan Trim
  const breastplateGeo = registerGeo(new THREE.CylinderGeometry(0.24, 0.21, 0.12, 16, 1, false, 0, Math.PI));
  const breastplateMesh = new THREE.Mesh(breastplateGeo, materials.armorPlatinum);
  breastplateMesh.position.set(0, -0.02, 0.05);
  breastplateMesh.rotation.y = -Math.PI / 2;

  const breastplateTrim = new THREE.Mesh(breastplateGeo, materials.armorIceBlue);
  breastplateTrim.position.set(0, -0.025, 0.055);
  breastplateTrim.scale.set(1.02, 0.35, 1.02);
  breastplateTrim.rotation.y = -Math.PI / 2;
  chestGroup.add(breastplateMesh, breastplateTrim);

  // 4. Neck & Collar Group (Y = 0.17 relative to chest)
  const neckGroup = new THREE.Group();
  neckGroup.position.set(0, 0.17, 0);
  chestGroup.add(neckGroup);

  const neckGeo = registerGeo(new THREE.CylinderGeometry(0.08, 0.09, 0.12, 12));
  const neckMesh = new THREE.Mesh(neckGeo, materials.skin);
  const chokerGeo = registerGeo(new THREE.TorusGeometry(0.09, 0.012, 8, 16));
  const chokerMesh = new THREE.Mesh(chokerGeo, materials.armorGold);
  chokerMesh.rotation.x = Math.PI / 2;
  neckGroup.add(neckMesh, chokerMesh);

  // 5. Head & Anime Facial Group (Y = 0.15 relative to neck)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.15, 0);
  neckGroup.add(headGroup);

  const headGeo = registerGeo(new THREE.SphereGeometry(0.18, 18, 18));
  const headMesh = new THREE.Mesh(headGeo, materials.skin);
  headMesh.scale.set(0.92, 1.05, 1.0);
  headGroup.add(headMesh);

  // High-Resolution 3D Anime Face Layer (Ice-Sapphire Eyes, Blush, Lashes)
  const faceDecalGeo = registerGeo(new THREE.PlaneGeometry(0.22, 0.22));
  const faceDecal = new THREE.Mesh(faceDecalGeo, materials.face);
  faceDecal.position.set(0, 0.015, 0.182);
  headGroup.add(faceDecal);

  // Valhalla Paladin Winged Tiara
  const tiaraGeo = registerGeo(new THREE.ConeGeometry(0.035, 0.15, 4));
  const leftWing = new THREE.Mesh(tiaraGeo, materials.armorIceBlue);
  leftWing.position.set(-0.16, 0.12, 0.04);
  leftWing.rotation.set(0, 0, 0.65);
  const rightWing = new THREE.Mesh(tiaraGeo, materials.armorIceBlue);
  rightWing.position.set(0.16, 0.12, 0.04);
  rightWing.rotation.set(0, 0, -0.65);
  headGroup.add(leftWing, rightWing);

  // 6. Sculpted Platinum Hair Group
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Scalp and crown hair cap (does not block eyes, tilted back towards ponytail)
  const hairCapGeo = registerGeo(new THREE.SphereGeometry(0.185, 18, 18, 0, Math.PI * 2, 0, Math.PI / 2.4));
  const hairCapMesh = new THREE.Mesh(hairCapGeo, materials.hair);
  hairCapMesh.rotation.x = -0.18;
  hairCapMesh.position.set(0, 0.005, -0.015);
  hairGroup.add(hairCapMesh);

  // Forehead Bangs (Curved anime strands framing upper forehead)
  const bangGeo = registerGeo(new THREE.ConeGeometry(0.028, 0.13, 6));
  for (let i = -2; i <= 2; i++) {
    const bang = new THREE.Mesh(bangGeo, materials.hair);
    bang.position.set(i * 0.038, 0.095, 0.165);
    bang.rotation.set(Math.PI * 0.95, 0, i * -0.12);
    hairGroup.add(bang);
  }

  // Side Braids framing cheeks
  const sideBraidGeo = registerGeo(new THREE.ConeGeometry(0.04, 0.36, 6));
  const leftSideBraid = new THREE.Mesh(sideBraidGeo, materials.hair);
  leftSideBraid.position.set(-0.16, -0.05, 0.08);
  leftSideBraid.rotation.set(0.2, 0, 0.16);
  const rightSideBraid = new THREE.Mesh(sideBraidGeo, materials.hair);
  rightSideBraid.position.set(0.16, -0.05, 0.08);
  rightSideBraid.rotation.set(0.2, 0, -0.16);
  hairGroup.add(leftSideBraid, rightSideBraid);

  // Long Braided Ponytail (Attached to rear hair base)
  const ponytail = new THREE.Group();
  ponytail.position.set(0, 0.08, -0.16);
  hairGroup.add(ponytail);

  const ponytailSegmentGeo1 = registerGeo(new THREE.CylinderGeometry(0.07, 0.05, 0.30, 8));
  const ponytailMesh1 = new THREE.Mesh(ponytailSegmentGeo1, materials.hair);
  ponytailMesh1.position.set(0, -0.15, -0.05);
  ponytailMesh1.rotation.x = -0.32;
  const ponytailSegmentGeo2 = registerGeo(new THREE.ConeGeometry(0.06, 0.38, 8));
  const ponytailMesh2 = new THREE.Mesh(ponytailSegmentGeo2, materials.hair);
  ponytailMesh2.position.set(0, -0.45, -0.14);
  ponytailMesh2.rotation.x = -0.20;
  ponytail.add(ponytailMesh1, ponytailMesh2);

  // 7. Left Arm Group (Shield Arm - Glacial Tower Shield)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.28, 0.06, 0);
  chestGroup.add(leftArmGroup);

  const pauldronGeo = registerGeo(new THREE.SphereGeometry(0.11, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7));
  const leftPauldron = new THREE.Mesh(pauldronGeo, materials.armorPlatinum);
  leftPauldron.rotation.z = -Math.PI / 3;
  leftArmGroup.add(leftPauldron);

  const bicepGeo = registerGeo(new THREE.CylinderGeometry(0.065, 0.06, 0.24, 12));
  const leftBicep = new THREE.Mesh(bicepGeo, materials.bodysuitDark);
  leftBicep.position.set(0, -0.12, 0);
  leftArmGroup.add(leftBicep);

  const leftForearm = new THREE.Group();
  leftForearm.position.set(0, -0.24, 0);
  leftArmGroup.add(leftForearm);

  const gauntletGeo = registerGeo(new THREE.CylinderGeometry(0.075, 0.065, 0.24, 12));
  const leftGauntlet = new THREE.Mesh(gauntletGeo, materials.armorPlatinum);
  leftGauntlet.position.set(0, -0.10, 0);
  leftForearm.add(leftGauntlet);

  // Băng Tinh Trọng Khiên (Glacial Tower Shield 1.45m tall)
  const shieldGroup = new THREE.Group();
  shieldGroup.position.set(-0.10, -0.08, 0.18);
  shieldGroup.rotation.set(0, 0.35, 0);
  leftForearm.add(shieldGroup);

  // Central shield core
  const shieldCoreGeo = registerGeo(new THREE.BoxGeometry(0.55, 1.40, 0.06));
  const shieldMesh = new THREE.Mesh(shieldCoreGeo, materials.shieldCrystal);
  shieldGroup.add(shieldMesh);

  // Platinum shield rim
  const shieldRimGeo = registerGeo(new THREE.BoxGeometry(0.58, 1.44, 0.04));
  const shieldRim = new THREE.Mesh(shieldRimGeo, materials.armorPlatinum);
  shieldRim.position.z = -0.015;
  shieldGroup.add(shieldRim);

  // Glacial frost rune wireframe glow
  const shieldGlowGeo = registerGeo(new THREE.RingGeometry(0.20, 0.28, 6));
  const shieldGlowMesh = new THREE.Mesh(shieldGlowGeo, materials.shieldFrostGlow);
  shieldGlowMesh.position.z = 0.035;
  shieldGroup.add(shieldGlowMesh);

  // 8. Right Arm Group (Weapon Arm - Glacial Rapier / Frost Shortblade)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.28, 0.06, 0);
  chestGroup.add(rightArmGroup);

  const rightPauldron = new THREE.Mesh(pauldronGeo, materials.armorPlatinum);
  rightPauldron.rotation.z = Math.PI / 3;
  rightArmGroup.add(rightPauldron);

  const rightBicep = new THREE.Mesh(bicepGeo, materials.bodysuitDark);
  rightBicep.position.set(0, -0.12, 0);
  rightArmGroup.add(rightBicep);

  const rightForearm = new THREE.Group();
  rightForearm.position.set(0, -0.24, 0);
  rightArmGroup.add(rightForearm);

  const rightGauntlet = new THREE.Mesh(gauntletGeo, materials.armorPlatinum);
  rightGauntlet.position.set(0, -0.10, 0);
  rightForearm.add(rightGauntlet);

  // Frost Shortblade (0.95m long)
  const swordGroup = new THREE.Group();
  swordGroup.position.set(0, -0.20, 0.08);
  swordGroup.rotation.x = Math.PI / 2.2;
  rightForearm.add(swordGroup);

  const swordHiltGeo = registerGeo(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 8));
  const swordHilt = new THREE.Mesh(swordHiltGeo, materials.armorGold);
  swordHilt.position.y = -0.09;
  swordGroup.add(swordHilt);

  const swordGuardGeo = registerGeo(new THREE.BoxGeometry(0.22, 0.03, 0.06));
  const swordGuard = new THREE.Mesh(swordGuardGeo, materials.armorPlatinum);
  swordGroup.add(swordGuard);

  const swordBladeGeo = registerGeo(new THREE.BoxGeometry(0.06, 0.90, 0.02));
  const swordMesh = new THREE.Mesh(swordBladeGeo, materials.swordBlade);
  swordMesh.position.y = 0.45;
  swordGroup.add(swordMesh);

  const swordGlowGeo = registerGeo(new THREE.BoxGeometry(0.07, 0.92, 0.025));
  const swordGlowMesh = new THREE.Mesh(swordGlowGeo, materials.swordPlasmaGlow);
  swordGlowMesh.position.y = 0.45;
  swordGroup.add(swordGlowMesh);

  // 9. Left Leg (Thigh, Knee, Greave, Sabaton)
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.11, -0.06, 0);
  hipsGroup.add(leftLegGroup);

  const thighGeo = registerGeo(new THREE.CylinderGeometry(0.09, 0.075, 0.42, 16));
  const leftThigh = new THREE.Mesh(thighGeo, materials.skin);
  leftThigh.position.set(0, -0.21, 0);
  leftLegGroup.add(leftThigh);

  const greaveGeo = registerGeo(new THREE.CylinderGeometry(0.085, 0.065, 0.42, 16));
  const leftGreave = new THREE.Mesh(greaveGeo, materials.armorPlatinum);
  leftGreave.position.set(0, -0.63, 0.01);
  leftLegGroup.add(leftGreave);

  // 10. Right Leg
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.11, -0.06, 0);
  hipsGroup.add(rightLegGroup);

  const rightThigh = new THREE.Mesh(thighGeo, materials.skin);
  rightThigh.position.set(0, -0.21, 0);
  rightLegGroup.add(rightThigh);

  const rightGreave = new THREE.Mesh(greaveGeo, materials.armorPlatinum);
  rightGreave.position.set(0, -0.63, 0.01);
  rightLegGroup.add(rightGreave);

  // Update Tier Hook for Cloth Damage 18+
  const updateTier = (tier: ClothDamageTier): void => {
    if (tier === 1) {
      breastplateMesh.visible = true;
      breastplateTrim.visible = true;
      rightPauldron.visible = true;
      leftTasset.visible = true;
      rightTasset.visible = true;
      shieldMesh.scale.set(1.0, 1.0, 1.0);
    } else if (tier === 2) {
      breastplateMesh.visible = true;
      breastplateTrim.visible = false;
      rightPauldron.visible = false; // Right pauldron shattered
      leftTasset.visible = true;
      rightTasset.visible = false;
      shieldMesh.scale.set(1.0, 1.0, 1.0);
    } else {
      // Tier 3: Climax Extreme
      breastplateMesh.visible = false; // Breastplate shattered
      breastplateTrim.visible = false;
      rightPauldron.visible = false;
      leftTasset.visible = false;
      rightTasset.visible = false;
      shieldMesh.scale.set(1.15, 1.05, 1.15); // Shield supercharged
    }
  };

  const dispose = (): void => {
    disposableGeometries.forEach((g) => g.dispose());
  };

  return {
    bones: {
      rootGroup,
      hipsGroup,
      spineGroup,
      chestGroup,
      headGroup,
      hairGroup,
      ponytail,
      leftArmGroup,
      rightArmGroup,
      shieldGroup,
      swordGroup,
      leftLegGroup,
      rightLegGroup
    },
    meshes: {
      breastplateMesh,
      breastplateTrim,
      rightPauldron,
      leftPauldron,
      shieldMesh,
      shieldGlowMesh,
      swordMesh,
      swordGlowMesh,
      leftTasset,
      rightTasset,
      dispose
    },
    updateTier
  };
}
