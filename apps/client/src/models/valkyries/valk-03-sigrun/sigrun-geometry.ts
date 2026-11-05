import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { SigrunMaterials } from './sigrun-materials.js';

export interface SigrunBones {
  readonly rootGroup: THREE.Group;
  readonly hipsGroup: THREE.Group;
  readonly spineGroup: THREE.Group;
  readonly chestGroup: THREE.Group;
  readonly headGroup: THREE.Group;
  readonly hairGroup: THREE.Group;
  readonly braid: THREE.Group;
  readonly leftArmGroup: THREE.Group;
  readonly rightArmGroup: THREE.Group;
  readonly leftDaggerGroup: THREE.Group;
  readonly rightDaggerGroup: THREE.Group;
  readonly leftLegGroup: THREE.Group;
  readonly rightLegGroup: THREE.Group;
}

export interface SigrunMeshes {
  readonly cuirassMesh: THREE.Mesh;
  readonly cuirassTrim: THREE.Mesh;
  readonly rightPauldron: THREE.Mesh;
  readonly leftPauldron: THREE.Mesh;
  readonly leftDaggerBlade: THREE.Mesh;
  readonly leftDaggerGlow: THREE.Mesh;
  readonly rightDaggerBlade: THREE.Mesh;
  readonly rightDaggerGlow: THREE.Mesh;
  readonly dispose: () => void;
}

export interface SigrunGeometryBundle {
  readonly bones: SigrunBones;
  readonly meshes: SigrunMeshes;
  readonly updateTier: (tier: ClothDamageTier) => void;
}

/**
 * Constructs the complete 3D procedural humanoid geometry for Sigrun (VALK-03).
 * Dựng toàn bộ khung xương và lưới hình học 3D cho Sigrun - Sát Thủ Bóng Đêm (Neo-Valhalla).
 *
 * @param materials - SigrunMaterials bundle.
 * @returns SigrunGeometryBundle containing skeletal hierarchy and update hooks.
 */
export function buildSigrunGeometry(materials: SigrunMaterials): SigrunGeometryBundle {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'Sigrun_VALK-03_Root';

  const disposableGeometries: THREE.BufferGeometry[] = [];
  const registerGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };

  // 1. Pelvis / Hips Group (Y = 0.84m above ground)
  const hipsGroup = new THREE.Group();
  hipsGroup.position.set(0, 0.84, 0);
  rootGroup.add(hipsGroup);

  const hipsGeo = registerGeo(new THREE.CylinderGeometry(0.20, 0.18, 0.16, 16));
  const hipsMesh = new THREE.Mesh(hipsGeo, materials.bodysuitNano);
  hipsGroup.add(hipsMesh);

  // Assassin leather thigh pouches / throwing kunai holsters
  const holsterGeo = registerGeo(new THREE.BoxGeometry(0.06, 0.12, 0.10));
  const leftHolster = new THREE.Mesh(holsterGeo, materials.armorCarbon);
  leftHolster.position.set(-0.21, -0.02, 0.05);
  leftHolster.rotation.z = 0.10;
  const rightHolster = new THREE.Mesh(holsterGeo, materials.armorCarbon);
  rightHolster.position.set(0.21, -0.02, 0.05);
  rightHolster.rotation.z = -0.10;
  hipsGroup.add(leftHolster, rightHolster);

  // 2. Spine / Slim Hourglass Waist Group (Y = 0.13 relative to hips)
  const spineGroup = new THREE.Group();
  spineGroup.position.set(0, 0.13, 0);
  hipsGroup.add(spineGroup);

  const waistGeo = registerGeo(new THREE.CylinderGeometry(0.18, 0.20, 0.15, 16));
  const waistMesh = new THREE.Mesh(waistGeo, materials.bodysuitNano);
  spineGroup.add(waistMesh);

  // Glowing violet cyber sash ring
  const waistRingGeo = registerGeo(new THREE.TorusGeometry(0.19, 0.012, 8, 24));
  const waistRing = new THREE.Mesh(waistRingGeo, materials.armorViolet);
  waistRing.rotation.x = Math.PI / 2;
  spineGroup.add(waistRing);

  // 3. Chest Group (Y = 0.17 relative to spine)
  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 0.17, 0);
  spineGroup.add(chestGroup);

  const chestBaseGeo = registerGeo(new THREE.CylinderGeometry(0.22, 0.18, 0.17, 16));
  const chestBaseMesh = new THREE.Mesh(chestBaseGeo, materials.bodysuitNano);
  chestGroup.add(chestBaseMesh);

  // E-Cup Voluptuous Svelte Assassin Bust Geometry
  const breastGeo = registerGeo(new THREE.SphereGeometry(0.118, 16, 16));
  const breastLeft = new THREE.Mesh(breastGeo, materials.skin);
  breastLeft.position.set(-0.088, 0.02, 0.11);
  breastLeft.scale.set(1.0, 1.05, 1.20);
  breastLeft.rotation.z = -0.14;

  const breastRight = new THREE.Mesh(breastGeo, materials.skin);
  breastRight.position.set(0.088, 0.02, 0.11);
  breastRight.scale.set(1.0, 1.05, 1.20);
  breastRight.rotation.z = 0.14;
  chestGroup.add(breastLeft, breastRight);

  // Cleavage contour
  const cleavageGeo = registerGeo(new THREE.BoxGeometry(0.022, 0.12, 0.10));
  const cleavageMesh = new THREE.Mesh(cleavageGeo, materials.bodysuitNano);
  cleavageMesh.position.set(0, 0.02, 0.09);
  chestGroup.add(cleavageMesh);

  // Cropped Assassin Carbon Cuirass with violet glowing trim
  const cuirassGeo = registerGeo(new THREE.CylinderGeometry(0.225, 0.20, 0.11, 16, 1, false, 0, Math.PI));
  const cuirassMesh = new THREE.Mesh(cuirassGeo, materials.armorCarbon);
  cuirassMesh.position.set(0, -0.02, 0.048);
  cuirassMesh.rotation.y = -Math.PI / 2;

  const cuirassTrim = new THREE.Mesh(cuirassGeo, materials.armorViolet);
  cuirassTrim.position.set(0, -0.025, 0.052);
  cuirassTrim.scale.set(1.02, 0.35, 1.02);
  cuirassTrim.rotation.y = -Math.PI / 2;
  chestGroup.add(cuirassMesh, cuirassTrim);

  // 4. Neck & Choker Group (Y = 0.16 relative to chest)
  const neckGroup = new THREE.Group();
  neckGroup.position.set(0, 0.16, 0);
  chestGroup.add(neckGroup);

  const neckGeo = registerGeo(new THREE.CylinderGeometry(0.075, 0.085, 0.11, 12));
  const neckMesh = new THREE.Mesh(neckGeo, materials.skin);
  const chokerGeo = registerGeo(new THREE.TorusGeometry(0.085, 0.010, 8, 16));
  const chokerMesh = new THREE.Mesh(chokerGeo, materials.armorViolet);
  chokerMesh.rotation.x = Math.PI / 2;
  neckGroup.add(neckMesh, chokerMesh);

  // 5. Head & Anime Facial Group (Y = 0.14 relative to neck)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.14, 0);
  neckGroup.add(headGroup);

  const headGeo = registerGeo(new THREE.SphereGeometry(0.175, 18, 18));
  const headMesh = new THREE.Mesh(headGeo, materials.skin);
  headMesh.scale.set(0.92, 1.05, 1.0);
  headGroup.add(headMesh);

  // High-Resolution 3D Anime Face Layer (Amethyst Eyes, Blush, Lashes)
  const faceDecalGeo = registerGeo(new THREE.PlaneGeometry(0.22, 0.22));
  const faceDecal = new THREE.Mesh(faceDecalGeo, materials.face);
  faceDecal.position.set(0, 0.015, 0.182);
  headGroup.add(faceDecal);

  // Sleek Cyber Assassin Visor / Horn Diadem
  const hornGeo = registerGeo(new THREE.ConeGeometry(0.03, 0.14, 4));
  const leftHorn = new THREE.Mesh(hornGeo, materials.armorViolet);
  leftHorn.position.set(-0.15, 0.11, 0.04);
  leftHorn.rotation.set(0, 0, 0.70);
  const rightHorn = new THREE.Mesh(hornGeo, materials.armorViolet);
  rightHorn.position.set(0.15, 0.11, 0.04);
  rightHorn.rotation.set(0, 0, -0.70);
  headGroup.add(leftHorn, rightHorn);

  // 6. Sculpted Midnight Raven Hair Group
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Crown hair cap covering entire cranium
  const hairCapGeo = registerGeo(new THREE.SphereGeometry(0.192, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.72));
  const hairCapMesh = new THREE.Mesh(hairCapGeo, materials.hair);
  hairCapMesh.scale.set(0.96, 1.05, 1.02);
  hairCapMesh.position.set(0, 0.012, -0.01);
  hairCapMesh.rotation.x = -0.04;
  hairGroup.add(hairCapMesh);

  // Back Bob Hair Volume
  const backBobGeo = registerGeo(new THREE.SphereGeometry(0.20, 16, 16, 0, Math.PI, 0, Math.PI / 1.55));
  const backBobMesh = new THREE.Mesh(backBobGeo, materials.hair);
  backBobMesh.rotation.y = -Math.PI / 2;
  backBobMesh.rotation.x = 0.12;
  backBobMesh.position.set(0, 0.02, -0.035);
  hairGroup.add(backBobMesh);

  // Asymmetric Forehead Bangs
  const bangGeo = registerGeo(new THREE.ConeGeometry(0.032, 0.14, 6));
  for (let i = -2; i <= 2; i++) {
    const bang = new THREE.Mesh(bangGeo, materials.hair);
    bang.position.set(i * 0.038, 0.125, 0.162);
    bang.rotation.set(Math.PI * 0.94, 0, i * -0.14);
    hairGroup.add(bang);
  }

  // Side Locks framing cheeks
  const sideLockGeo = registerGeo(new THREE.ConeGeometry(0.042, 0.36, 6));
  const leftSideLock = new THREE.Mesh(sideLockGeo, materials.hair);
  leftSideLock.position.set(-0.16, -0.04, 0.08);
  leftSideLock.rotation.set(0.2, 0, 0.16);
  hairGroup.add(leftSideLock);

  // Right Side Long Assassin Braid
  const braid = new THREE.Group();
  braid.position.set(0.16, 0.02, 0.06);
  hairGroup.add(braid);

  const braidGeo1 = registerGeo(new THREE.CylinderGeometry(0.045, 0.035, 0.28, 8));
  const braidMesh1 = new THREE.Mesh(braidGeo1, materials.hair);
  braidMesh1.position.set(0, -0.14, 0);
  braidMesh1.rotation.z = -0.15;
  const braidGeo2 = registerGeo(new THREE.ConeGeometry(0.04, 0.32, 8));
  const braidMesh2 = new THREE.Mesh(braidGeo2, materials.hair);
  braidMesh2.position.set(0.03, -0.42, 0);
  braidMesh2.rotation.z = -0.10;
  braid.add(braidMesh1, braidMesh2);

  // 7. Left Arm Group (Holding Left Shadow Dagger in reverse grip)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.26, 0.05, 0);
  chestGroup.add(leftArmGroup);

  const pauldronGeo = registerGeo(new THREE.SphereGeometry(0.09, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7));
  const leftPauldron = new THREE.Mesh(pauldronGeo, materials.armorCarbon);
  leftPauldron.rotation.z = -Math.PI / 3;
  leftArmGroup.add(leftPauldron);

  const bicepGeo = registerGeo(new THREE.CylinderGeometry(0.058, 0.052, 0.22, 12));
  const leftBicep = new THREE.Mesh(bicepGeo, materials.bodysuitNano);
  leftBicep.position.set(0, -0.11, 0);
  leftArmGroup.add(leftBicep);

  const leftForearm = new THREE.Group();
  leftForearm.position.set(0, -0.22, 0);
  leftArmGroup.add(leftForearm);

  const gauntletGeo = registerGeo(new THREE.CylinderGeometry(0.065, 0.055, 0.22, 12));
  const leftGauntlet = new THREE.Mesh(gauntletGeo, materials.armorCarbon);
  leftGauntlet.position.set(0, -0.09, 0);
  leftForearm.add(leftGauntlet);

  // Left Shadow Dagger (0.65m long)
  const leftDaggerGroup = new THREE.Group();
  leftDaggerGroup.position.set(0, -0.18, 0.06);
  leftDaggerGroup.rotation.x = -Math.PI / 2.1; // Reverse grip pointing backward
  leftForearm.add(leftDaggerGroup);

  const daggerHiltGeo = registerGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8));
  const leftDaggerHilt = new THREE.Mesh(daggerHiltGeo, materials.armorGold);
  leftDaggerHilt.position.y = -0.07;
  leftDaggerGroup.add(leftDaggerHilt);

  const daggerGuardGeo = registerGeo(new THREE.BoxGeometry(0.12, 0.025, 0.04));
  const leftDaggerGuard = new THREE.Mesh(daggerGuardGeo, materials.armorCarbon);
  leftDaggerGroup.add(leftDaggerGuard);

  const daggerBladeGeo = registerGeo(new THREE.BoxGeometry(0.045, 0.58, 0.015));
  const leftDaggerBlade = new THREE.Mesh(daggerBladeGeo, materials.daggersBlade);
  leftDaggerBlade.position.y = 0.29;
  leftDaggerGroup.add(leftDaggerBlade);

  const daggerGlowGeo = registerGeo(new THREE.BoxGeometry(0.055, 0.60, 0.02));
  const leftDaggerGlow = new THREE.Mesh(daggerGlowGeo, materials.daggersPlasmaGlow);
  leftDaggerGlow.position.y = 0.29;
  leftDaggerGroup.add(leftDaggerGlow);

  // 8. Right Arm Group (Holding Right Shadow Dagger in forward attack grip)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.26, 0.05, 0);
  chestGroup.add(rightArmGroup);

  const rightPauldron = new THREE.Mesh(pauldronGeo, materials.armorCarbon);
  rightPauldron.rotation.z = Math.PI / 3;
  rightArmGroup.add(rightPauldron);

  const rightBicep = new THREE.Mesh(bicepGeo, materials.bodysuitNano);
  rightBicep.position.set(0, -0.11, 0);
  rightArmGroup.add(rightBicep);

  const rightForearm = new THREE.Group();
  rightForearm.position.set(0, -0.22, 0);
  rightArmGroup.add(rightForearm);

  const rightGauntlet = new THREE.Mesh(gauntletGeo, materials.armorCarbon);
  rightGauntlet.position.set(0, -0.09, 0);
  rightForearm.add(rightGauntlet);

  // Right Shadow Dagger
  const rightDaggerGroup = new THREE.Group();
  rightDaggerGroup.position.set(0, -0.18, 0.06);
  rightDaggerGroup.rotation.x = Math.PI / 2.1; // Forward attack grip
  rightForearm.add(rightDaggerGroup);

  const rightDaggerHilt = new THREE.Mesh(daggerHiltGeo, materials.armorGold);
  rightDaggerHilt.position.y = -0.07;
  rightDaggerGroup.add(rightDaggerHilt);

  const rightDaggerGuard = new THREE.Mesh(daggerGuardGeo, materials.armorCarbon);
  rightDaggerGroup.add(rightDaggerGuard);

  const rightDaggerBlade = new THREE.Mesh(daggerBladeGeo, materials.daggersBlade);
  rightDaggerBlade.position.y = 0.29;
  rightDaggerGroup.add(rightDaggerBlade);

  const rightDaggerGlow = new THREE.Mesh(daggerGlowGeo, materials.daggersPlasmaGlow);
  rightDaggerGlow.position.y = 0.29;
  rightDaggerGroup.add(rightDaggerGlow);

  // 9. Left Leg (Thigh, Shin, Assassin Greave)
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.10, -0.06, 0);
  hipsGroup.add(leftLegGroup);

  const thighGeo = registerGeo(new THREE.CylinderGeometry(0.082, 0.068, 0.40, 16));
  const leftThigh = new THREE.Mesh(thighGeo, materials.skin);
  leftThigh.position.set(0, -0.20, 0);
  leftLegGroup.add(leftThigh);

  const greaveGeo = registerGeo(new THREE.CylinderGeometry(0.075, 0.058, 0.40, 16));
  const leftGreave = new THREE.Mesh(greaveGeo, materials.armorCarbon);
  leftGreave.position.set(0, -0.60, 0.01);
  leftLegGroup.add(leftGreave);

  // 10. Right Leg
  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.10, -0.06, 0);
  hipsGroup.add(rightLegGroup);

  const rightThigh = new THREE.Mesh(thighGeo, materials.skin);
  rightThigh.position.set(0, -0.20, 0);
  rightLegGroup.add(rightThigh);

  const rightGreave = new THREE.Mesh(greaveGeo, materials.armorCarbon);
  rightGreave.position.set(0, -0.60, 0.01);
  rightLegGroup.add(rightGreave);

  // Update Tier Hook for Cloth Damage 18+
  const updateTier = (tier: ClothDamageTier): void => {
    if (tier === 1) {
      cuirassMesh.visible = true;
      cuirassTrim.visible = true;
      rightPauldron.visible = true;
      leftPauldron.visible = true;
      leftDaggerGlow.scale.set(1.0, 1.0, 1.0);
      rightDaggerGlow.scale.set(1.0, 1.0, 1.0);
    } else if (tier === 2) {
      cuirassMesh.visible = true;
      cuirassTrim.visible = false;
      rightPauldron.visible = false; // Right shoulder pauldron broken
      leftPauldron.visible = true;
      leftDaggerGlow.scale.set(1.15, 1.05, 1.15);
      rightDaggerGlow.scale.set(1.15, 1.05, 1.15);
    } else {
      // Tier 3: Climax Extreme
      cuirassMesh.visible = false; // Cuirass completely destroyed
      cuirassTrim.visible = false;
      rightPauldron.visible = false;
      leftPauldron.visible = false;
      leftDaggerGlow.scale.set(1.35, 1.10, 1.35); // Supercharged ultraviolet electric plasma
      rightDaggerGlow.scale.set(1.35, 1.10, 1.35);
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
      braid,
      leftArmGroup,
      rightArmGroup,
      leftDaggerGroup,
      rightDaggerGroup,
      leftLegGroup,
      rightLegGroup
    },
    meshes: {
      cuirassMesh,
      cuirassTrim,
      rightPauldron,
      leftPauldron,
      leftDaggerBlade,
      leftDaggerGlow,
      rightDaggerBlade,
      rightDaggerGlow,
      dispose
    },
    updateTier
  };
}
