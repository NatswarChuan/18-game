import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { KaraMaterials } from './kara-materials.js';

export interface KaraMeshHierarchy {
  readonly rootGroup: THREE.Group;
  readonly pelvisGroup: THREE.Group;
  readonly spineGroup: THREE.Group;
  readonly chestGroup: THREE.Group;
  readonly neckGroup: THREE.Group;
  readonly headGroup: THREE.Group;
  readonly leftTwinTail: THREE.Group;
  readonly rightTwinTail: THREE.Group;
  readonly leftArmGroup: THREE.Group;
  readonly rightArmGroup: THREE.Group;
  readonly cannonGroup: THREE.Group;
  readonly cannonBarrel: THREE.Mesh;
  readonly leftLegGroup: THREE.Group;
  readonly rightLegGroup: THREE.Group;
  readonly tier1Group: THREE.Group;
  readonly tier2Group: THREE.Group;
  readonly tier3Group: THREE.Group;
  readonly updateClothDamageTier: (tier: ClothDamageTier) => void;
  readonly dispose: () => void;
}

/**
 * Builds the complete 3D procedural humanoid mesh hierarchy for Kara (VALK-04).
 * Xây dựng cấu trúc hình học 3D cho Kara: Chiều cao 1.62m, cúp ngực D (0.31m),
 * tóc vàng twin-tails bồng bềnh, khẩu trọng pháo hạt nhân Heavy Railgun dài 1.85m vác vai,
 * và cơ chế rách quân phục 3 cấp độ chuẩn Anime 18+.
 */
export function buildKaraGeometry(materials: KaraMaterials): KaraMeshHierarchy {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'VALK-04_Kara_Root';

  const disposableGeometries: THREE.BufferGeometry[] = [];
  const registerGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };

  // 1. Pelvis Root (Hip center at Y = 0.84m)
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.set(0, 0.84, 0);
  rootGroup.add(pelvisGroup);

  const hipGeo = registerGeo(new THREE.CylinderGeometry(0.18, 0.16, 0.14, 16));
  const hipMesh = new THREE.Mesh(hipGeo, materials.pleatedSkirt);
  pelvisGroup.add(hipMesh);

  // 2. Spine Group
  const spineGroup = new THREE.Group();
  spineGroup.position.set(0, 0.08, 0);
  pelvisGroup.add(spineGroup);

  const waistGeo = registerGeo(new THREE.CylinderGeometry(0.14, 0.16, 0.15, 16));
  const waistMesh = new THREE.Mesh(waistGeo, materials.whiteShirt);
  spineGroup.add(waistMesh);

  // 3. Chest Group (Cup D anime curvature)
  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 0.14, 0);
  spineGroup.add(chestGroup);

  const ribcageGeo = registerGeo(new THREE.CylinderGeometry(0.17, 0.14, 0.16, 16));
  const ribcageMesh = new THREE.Mesh(ribcageGeo, materials.militaryCoat);
  chestGroup.add(ribcageMesh);

  // Bust: Symmetrical Cup D anime spheres (0.31m chest contour)
  const bustGeo = registerGeo(new THREE.SphereGeometry(0.098, 16, 16));
  const leftBreast = new THREE.Mesh(bustGeo, materials.whiteShirt);
  leftBreast.position.set(-0.088, 0.02, 0.11);
  leftBreast.scale.set(1.0, 1.05, 1.25);
  leftBreast.rotation.x = -0.15;

  const rightBreast = new THREE.Mesh(bustGeo, materials.whiteShirt);
  rightBreast.position.set(0.088, 0.02, 0.11);
  rightBreast.scale.set(1.0, 1.05, 1.25);
  rightBreast.rotation.x = -0.15;
  chestGroup.add(leftBreast, rightBreast);

  // Red Officer Tie
  const tieGeo = registerGeo(new THREE.BoxGeometry(0.04, 0.16, 0.02));
  const tieMesh = new THREE.Mesh(tieGeo, materials.redTie);
  tieMesh.position.set(0, 0.02, 0.17);
  chestGroup.add(tieMesh);

  // Gold Epaulets on shoulders
  const epauletGeo = registerGeo(new THREE.BoxGeometry(0.10, 0.025, 0.08));
  const leftEpaulet = new THREE.Mesh(epauletGeo, materials.goldTrim);
  leftEpaulet.position.set(-0.21, 0.09, 0);
  const rightEpaulet = new THREE.Mesh(epauletGeo, materials.goldTrim);
  rightEpaulet.position.set(0.21, 0.09, 0);
  chestGroup.add(leftEpaulet, rightEpaulet);

  // 4. Neck Group
  const neckGroup = new THREE.Group();
  neckGroup.position.set(0, 0.16, 0);
  chestGroup.add(neckGroup);

  const neckGeo = registerGeo(new THREE.CylinderGeometry(0.052, 0.062, 0.10, 12));
  const neckMesh = new THREE.Mesh(neckGeo, materials.skin);
  neckGroup.add(neckMesh);

  // 5. Head Group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.08, 0);
  neckGroup.add(headGroup);

  const headGeo = registerGeo(new THREE.SphereGeometry(0.175, 18, 18));
  const headMesh = new THREE.Mesh(headGeo, materials.skin);
  headMesh.scale.set(0.92, 1.05, 1.0);
  headGroup.add(headMesh);

  // High-Resolution 3D Anime Face Decal (Emerald Eyes, Blush, CyberHUD)
  const faceDecalGeo = registerGeo(new THREE.PlaneGeometry(0.22, 0.22));
  const faceDecal = new THREE.Mesh(faceDecalGeo, materials.face);
  faceDecal.position.set(0, 0.015, 0.182);
  headGroup.add(faceDecal);

  // 6. Sculpted Golden Blonde Twin-Tails Hair Group
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Crown hair cap covering entire cranium
  const hairCapGeo = registerGeo(new THREE.SphereGeometry(0.192, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.72));
  const hairCapMesh = new THREE.Mesh(hairCapGeo, materials.hair);
  hairCapMesh.scale.set(0.96, 1.05, 1.02);
  hairCapMesh.position.set(0, 0.012, -0.01);
  hairCapMesh.rotation.x = -0.04;
  hairGroup.add(hairCapMesh);

  // Back Hair Volume
  const backHairGeo = registerGeo(new THREE.SphereGeometry(0.20, 16, 16, 0, Math.PI, 0, Math.PI / 1.55));
  const backHairMesh = new THREE.Mesh(backHairGeo, materials.hair);
  backHairMesh.rotation.y = -Math.PI / 2;
  backHairMesh.rotation.x = 0.10;
  backHairMesh.position.set(0, 0.02, -0.035);
  hairGroup.add(backHairMesh);

  // Tsundere Forehead Bangs
  const bangGeo = registerGeo(new THREE.ConeGeometry(0.032, 0.14, 6));
  for (let i = -2; i <= 2; i++) {
    const bang = new THREE.Mesh(bangGeo, materials.hair);
    bang.position.set(i * 0.038, 0.125, 0.162);
    bang.rotation.set(Math.PI * 0.94, 0, i * -0.14);
    hairGroup.add(bang);
  }

  // Side Locks
  const sideLockGeo = registerGeo(new THREE.ConeGeometry(0.040, 0.35, 6));
  const leftSideLock = new THREE.Mesh(sideLockGeo, materials.hair);
  leftSideLock.position.set(-0.16, -0.04, 0.08);
  leftSideLock.rotation.set(0.2, 0, 0.16);
  const rightSideLock = new THREE.Mesh(sideLockGeo, materials.hair);
  rightSideLock.position.set(0.16, -0.04, 0.08);
  rightSideLock.rotation.set(0.2, 0, -0.16);
  hairGroup.add(leftSideLock, rightSideLock);

  // Left Twin-Tail (Bouncy, arched ponytail)
  const leftTwinTail = new THREE.Group();
  leftTwinTail.position.set(-0.17, 0.12, -0.04);
  hairGroup.add(leftTwinTail);

  const tieRingGeo = registerGeo(new THREE.TorusGeometry(0.04, 0.015, 8, 16));
  const leftTieRing = new THREE.Mesh(tieRingGeo, materials.goldTrim);
  leftTieRing.rotation.x = Math.PI / 2;
  leftTwinTail.add(leftTieRing);

  const tailGeo1 = registerGeo(new THREE.CylinderGeometry(0.045, 0.038, 0.32, 8));
  const leftTailMesh1 = new THREE.Mesh(tailGeo1, materials.hair);
  leftTailMesh1.position.set(-0.06, -0.16, 0);
  leftTailMesh1.rotation.z = 0.28;

  const tailGeo2 = registerGeo(new THREE.ConeGeometry(0.045, 0.40, 8));
  const leftTailMesh2 = new THREE.Mesh(tailGeo2, materials.hair);
  leftTailMesh2.position.set(-0.12, -0.48, 0.02);
  leftTailMesh2.rotation.z = 0.15;
  leftTwinTail.add(leftTailMesh1, leftTailMesh2);

  // Right Twin-Tail
  const rightTwinTail = new THREE.Group();
  rightTwinTail.position.set(0.17, 0.12, -0.04);
  hairGroup.add(rightTwinTail);

  const rightTieRing = new THREE.Mesh(tieRingGeo, materials.goldTrim);
  rightTieRing.rotation.x = Math.PI / 2;
  rightTwinTail.add(rightTieRing);

  const rightTailMesh1 = new THREE.Mesh(tailGeo1, materials.hair);
  rightTailMesh1.position.set(0.06, -0.16, 0);
  rightTailMesh1.rotation.z = -0.28;

  const rightTailMesh2 = new THREE.Mesh(tailGeo2, materials.hair);
  rightTailMesh2.position.set(0.12, -0.48, 0.02);
  rightTailMesh2.rotation.z = -0.15;
  rightTwinTail.add(rightTailMesh1, rightTailMesh2);

  // 7. Right Arm & Shoulder Mounted Heavy Railgun Cannon (1.85m)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.24, 0.07, 0);
  chestGroup.add(rightArmGroup);

  const armGeo = registerGeo(new THREE.CylinderGeometry(0.055, 0.050, 0.22, 12));
  const rightUpperArm = new THREE.Mesh(armGeo, materials.militaryCoat);
  rightUpperArm.position.set(0, -0.10, 0);
  rightArmGroup.add(rightUpperArm);

  const rightForearm = new THREE.Group();
  rightForearm.position.set(0, -0.21, 0);
  rightArmGroup.add(rightForearm);

  const gauntletGeo = registerGeo(new THREE.CylinderGeometry(0.060, 0.052, 0.20, 12));
  const rightGauntlet = new THREE.Mesh(gauntletGeo, materials.bootsArmor);
  rightGauntlet.position.set(0, -0.09, 0);
  rightForearm.add(rightGauntlet);

  // Left Arm (Stabilizing front of cannon)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.24, 0.07, 0);
  chestGroup.add(leftArmGroup);

  const leftUpperArm = new THREE.Mesh(armGeo, materials.militaryCoat);
  leftUpperArm.position.set(0, -0.10, 0);
  leftArmGroup.add(leftUpperArm);

  const leftForearm = new THREE.Group();
  leftForearm.position.set(0, -0.21, 0);
  leftArmGroup.add(leftForearm);

  const leftGauntlet = new THREE.Mesh(gauntletGeo, materials.bootsArmor);
  leftGauntlet.position.set(0, -0.09, 0);
  leftForearm.add(leftGauntlet);

  // Position arms to brace the heavy shoulder cannon
  rightArmGroup.rotation.set(-0.6, 0.2, -0.2);
  rightForearm.rotation.set(-0.7, 0, 0.3);

  leftArmGroup.rotation.set(-0.8, -0.4, 0.3);
  leftForearm.rotation.set(-0.6, 0.2, -0.4);

  // 8. Heavy Plasma Railgun Cannon (Dài 1.85m)
  const cannonGroup = new THREE.Group();
  cannonGroup.position.set(0.25, 0.16, -0.22); // Resting on right shoulder
  cannonGroup.rotation.set(-0.06, 0.12, 0); // Tilted slightly outward so chest and face are completely unobstructed
  chestGroup.add(cannonGroup);

  // Main Cannon Receiver / Chassis
  const chassisGeo = registerGeo(new THREE.BoxGeometry(0.24, 0.28, 0.65));
  const chassisMesh = new THREE.Mesh(chassisGeo, materials.cannonChassis);
  chassisMesh.position.set(0, 0, 0);
  cannonGroup.add(chassisMesh);

  // Hexagonal Long Barrel (1.25m long)
  const barrelGeo = registerGeo(new THREE.CylinderGeometry(0.075, 0.085, 1.25, 6));
  const cannonBarrel = new THREE.Mesh(barrelGeo, materials.cannonBarrel);
  cannonBarrel.rotation.x = Math.PI / 2;
  cannonBarrel.position.set(0, 0.04, 0.85);
  cannonGroup.add(cannonBarrel);

  // Muzzle Brake Hexagonal Cap
  const muzzleGeo = registerGeo(new THREE.CylinderGeometry(0.10, 0.08, 0.16, 6));
  const muzzleMesh = new THREE.Mesh(muzzleGeo, materials.cannonChassis);
  muzzleMesh.rotation.x = Math.PI / 2;
  muzzleMesh.position.set(0, 0.04, 1.52);
  cannonGroup.add(muzzleMesh);

  // Glowing Nuclear Plasma Power Core
  const coreGeo = registerGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.45, 12));
  const coreMesh = new THREE.Mesh(coreGeo, materials.nuclearCoreGlow);
  coreMesh.rotation.x = Math.PI / 2;
  coreMesh.position.set(0, 0.04, 0.15);
  cannonGroup.add(coreMesh);

  // Heat sink fins
  const finGeo = registerGeo(new THREE.BoxGeometry(0.32, 0.04, 0.35));
  const finMesh = new THREE.Mesh(finGeo, materials.goldTrim);
  finMesh.position.set(0, 0.12, 0.10);
  cannonGroup.add(finMesh);

  // 9. Legs & Zettai Ryouiki Stockings
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.09, -0.08, 0);
  pelvisGroup.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.09, -0.08, 0);
  pelvisGroup.add(rightLegGroup);

  // Thighs: Top portion exposed skin, bottom portion sheer black stockings (Zettai Ryouiki)
  const thighSkinGeo = registerGeo(new THREE.CylinderGeometry(0.078, 0.070, 0.12, 16));
  const leftThighSkin = new THREE.Mesh(thighSkinGeo, materials.skin);
  leftThighSkin.position.set(0, -0.06, 0);
  const rightThighSkin = new THREE.Mesh(thighSkinGeo, materials.skin);
  rightThighSkin.position.set(0, -0.06, 0);
  leftLegGroup.add(leftThighSkin);
  rightLegGroup.add(rightThighSkin);

  const thighStockingGeo = registerGeo(new THREE.CylinderGeometry(0.070, 0.062, 0.26, 16));
  const leftThighStocking = new THREE.Mesh(thighStockingGeo, materials.stockings);
  leftThighStocking.position.set(0, -0.24, 0);
  const rightThighStocking = new THREE.Mesh(thighStockingGeo, materials.stockings);
  rightThighStocking.position.set(0, -0.24, 0);
  leftLegGroup.add(leftThighStocking);
  rightLegGroup.add(rightThighStocking);

  // Shin & Combat Armored Boots
  const shinGeo = registerGeo(new THREE.CylinderGeometry(0.062, 0.055, 0.34, 16));
  const leftShin = new THREE.Mesh(shinGeo, materials.bootsArmor);
  leftShin.position.set(0, -0.52, 0);
  const rightShin = new THREE.Mesh(shinGeo, materials.bootsArmor);
  rightShin.position.set(0, -0.52, 0);
  leftLegGroup.add(leftShin);
  rightLegGroup.add(rightShin);

  // 10. 3-Tier Cloth Damage Variations (Military Uniform Destruction)
  const tier1Group = new THREE.Group();
  const tier2Group = new THREE.Group();
  const tier3Group = new THREE.Group();
  pelvisGroup.add(tier1Group, tier2Group, tier3Group);

  // Tier 1 (Pristine): Crisp Pleated Skirt
  const skirtGeoT1 = registerGeo(new THREE.ConeGeometry(0.24, 0.18, 16, 1, true));
  const skirtMeshT1 = new THREE.Mesh(skirtGeoT1, materials.pleatedSkirt);
  skirtMeshT1.position.set(0, -0.06, 0);
  tier1Group.add(skirtMeshT1);

  // Tier 2 (Torn): Skirt slashed open on right side, garter clip visible
  const skirtGeoT2 = registerGeo(new THREE.ConeGeometry(0.23, 0.14, 12, 1, true, 0, Math.PI * 1.4));
  const skirtMeshT2 = new THREE.Mesh(skirtGeoT2, materials.pleatedSkirt);
  skirtMeshT2.position.set(0, -0.04, 0);
  skirtMeshT2.rotation.y = -Math.PI / 3;

  const garterGeo = registerGeo(new THREE.TorusGeometry(0.072, 0.008, 8, 16));
  const garterMesh = new THREE.Mesh(garterGeo, materials.redTie);
  garterMesh.rotation.x = Math.PI / 2;
  garterMesh.position.set(0.09, -0.07, 0);
  tier2Group.add(skirtMeshT2, garterMesh);

  // Tier 3 (Climax Extreme 18+): Micro lace underwear & exposed bare legs
  const laceMicroGeo = registerGeo(new THREE.CylinderGeometry(0.15, 0.12, 0.09, 16));
  const laceMicroMesh = new THREE.Mesh(laceMicroGeo, materials.laceUnderwear);
  laceMicroMesh.position.set(0, -0.02, 0);
  tier3Group.add(laceMicroMesh);

  // Initial state setup
  tier1Group.visible = true;
  tier2Group.visible = false;
  tier3Group.visible = false;

  const updateClothDamageTier = (tier: ClothDamageTier): void => {
    tier1Group.visible = tier === 1;
    tier2Group.visible = tier === 2;
    tier3Group.visible = tier === 3;

    if (tier === 1) {
      leftBreast.material = materials.whiteShirt;
      rightBreast.material = materials.whiteShirt;
      coreMesh.material = materials.nuclearCoreGlow;
    } else if (tier === 2) {
      // Unbuttoned shirt, exposed cleavage
      leftBreast.material = materials.whiteShirt;
      rightBreast.material = materials.skin; // One breast exposed
    } else {
      // Climax: Full bust exposed with lace straps, cannon red hot
      leftBreast.material = materials.skin;
      rightBreast.material = materials.skin;
      coreMesh.material = new THREE.MeshStandardMaterial({
        color: 0xFF0033,
        emissive: 0xFF0033,
        emissiveIntensity: 3.5
      });
    }
  };

  const dispose = (): void => {
    disposableGeometries.forEach((g) => g.dispose());
  };

  return {
    rootGroup,
    pelvisGroup,
    spineGroup,
    chestGroup,
    neckGroup,
    headGroup,
    leftTwinTail,
    rightTwinTail,
    leftArmGroup,
    rightArmGroup,
    cannonGroup,
    cannonBarrel,
    leftLegGroup,
    rightLegGroup,
    tier1Group,
    tier2Group,
    tier3Group,
    updateClothDamageTier,
    dispose
  };
}
