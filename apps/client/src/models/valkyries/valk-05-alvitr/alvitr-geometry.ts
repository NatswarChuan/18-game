import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { AlvitrMaterials } from './alvitr-materials.js';

export interface AlvitrMeshHierarchy {
  readonly rootGroup: THREE.Group;
  readonly pelvisGroup: THREE.Group;
  readonly spineGroup: THREE.Group;
  readonly chestGroup: THREE.Group;
  readonly neckGroup: THREE.Group;
  readonly headGroup: THREE.Group;
  readonly longHairGroup: THREE.Group;
  readonly leftArmGroup: THREE.Group;
  readonly rightArmGroup: THREE.Group;
  readonly orbGroup: THREE.Group;
  readonly orbRing1: THREE.Mesh;
  readonly orbRing2: THREE.Mesh;
  readonly orbRing3: THREE.Mesh;
  readonly leftLegGroup: THREE.Group;
  readonly rightLegGroup: THREE.Group;
  readonly tier1Group: THREE.Group;
  readonly tier2Group: THREE.Group;
  readonly tier3Group: THREE.Group;
  readonly updateClothDamageTier: (tier: ClothDamageTier) => void;
  readonly dispose: () => void;
}

/**
 * Builds the complete 3D procedural humanoid mesh hierarchy for Alvitr (VALK-05).
 * Xây dựng cấu trúc hình học 3D cho Alvitr: Chiều cao 1.70m, cúp ngực F (0.36m),
 * mái tóc tím thẫm dài gợn sóng lãng mạn, tư thế bay lơ lửng ma mị,
 * quả cầu lôi điện tử Gimbal Gyroscope 3 vòng xoay độc lập và cơ chế rách đầm lụa 3 cấp độ 18+.
 */
export function buildAlvitrGeometry(materials: AlvitrMaterials): AlvitrMeshHierarchy {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'VALK-05_Alvitr_Root';

  const disposableGeometries: THREE.BufferGeometry[] = [];
  const registerGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposableGeometries.push(geo);
    return geo;
  };

  // 1. Pelvis Root (Floating sorceress height Y = 0.90m)
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.set(0, 0.90, 0);
  rootGroup.add(pelvisGroup);

  const hipGeo = registerGeo(new THREE.CylinderGeometry(0.19, 0.17, 0.16, 16));
  const hipMesh = new THREE.Mesh(hipGeo, materials.violetSilk);
  pelvisGroup.add(hipMesh);

  // 2. Spine Group
  const spineGroup = new THREE.Group();
  spineGroup.position.set(0, 0.09, 0);
  pelvisGroup.add(spineGroup);

  const waistGeo = registerGeo(new THREE.CylinderGeometry(0.15, 0.18, 0.16, 16));
  const waistMesh = new THREE.Mesh(waistGeo, materials.violetSilk);
  spineGroup.add(waistMesh);

  // Gold Corset Filigree Band
  const waistBandGeo = registerGeo(new THREE.TorusGeometry(0.165, 0.012, 8, 24));
  const waistBandMesh = new THREE.Mesh(waistBandGeo, materials.goldJewelry);
  waistBandMesh.rotation.x = Math.PI / 2;
  waistBandMesh.position.set(0, 0.04, 0);
  spineGroup.add(waistBandMesh);

  // 3. Chest Group (Cup F voluptuous anime curvature)
  const chestGroup = new THREE.Group();
  chestGroup.position.set(0, 0.15, 0);
  spineGroup.add(chestGroup);

  const ribcageGeo = registerGeo(new THREE.CylinderGeometry(0.18, 0.15, 0.17, 16));
  const ribcageMesh = new THREE.Mesh(ribcageGeo, materials.violetSilk);
  chestGroup.add(ribcageMesh);

  // Bust: Symmetrical Cup F anime spheres (0.36m chest contour)
  const bustGeo = registerGeo(new THREE.SphereGeometry(0.114, 18, 18));
  const leftBreast = new THREE.Mesh(bustGeo, materials.violetSilk);
  leftBreast.position.set(-0.10, 0.02, 0.12);
  leftBreast.scale.set(1.0, 1.05, 1.28);
  leftBreast.rotation.x = -0.15;

  const rightBreast = new THREE.Mesh(bustGeo, materials.violetSilk);
  rightBreast.position.set(0.10, 0.02, 0.12);
  rightBreast.scale.set(1.0, 1.05, 1.28);
  rightBreast.rotation.x = -0.15;
  chestGroup.add(leftBreast, rightBreast);

  // Gold Cleavage Brooch with Glowing Cyan Cyber Gem
  const broochGeo = registerGeo(new THREE.OctahedronGeometry(0.035, 0));
  const broochMesh = new THREE.Mesh(broochGeo, materials.cyberGem);
  broochMesh.position.set(0, 0.05, 0.19);
  chestGroup.add(broochMesh);

  // 4. Neck Group
  const neckGroup = new THREE.Group();
  neckGroup.position.set(0, 0.17, 0);
  chestGroup.add(neckGroup);

  const neckGeo = registerGeo(new THREE.CylinderGeometry(0.054, 0.065, 0.10, 12));
  const neckMesh = new THREE.Mesh(neckGeo, materials.skin);
  neckGroup.add(neckMesh);

  // Gold Choker Necklace
  const chokerGeo = registerGeo(new THREE.TorusGeometry(0.062, 0.008, 8, 20));
  const chokerMesh = new THREE.Mesh(chokerGeo, materials.goldJewelry);
  chokerMesh.rotation.x = Math.PI / 2;
  neckGroup.add(chokerMesh);

  // 5. Head Group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.08, 0);
  neckGroup.add(headGroup);

  const headGeo = registerGeo(new THREE.SphereGeometry(0.178, 18, 18));
  const headMesh = new THREE.Mesh(headGeo, materials.skin);
  headMesh.scale.set(0.92, 1.05, 1.0);
  headGroup.add(headMesh);

  // High-Resolution 3D Anime Face Decal (Amber Eyes, Beauty Mark, Plum Lips)
  const faceDecalGeo = registerGeo(new THREE.PlaneGeometry(0.22, 0.22));
  const faceDecal = new THREE.Mesh(faceDecalGeo, materials.face);
  faceDecal.position.set(0, 0.015, 0.182);
  headGroup.add(faceDecal);

  // Cyber Sorceress Diadem Tiara
  const tiaraGeo = registerGeo(new THREE.TorusGeometry(0.185, 0.010, 8, 24, Math.PI * 0.9));
  const tiaraMesh = new THREE.Mesh(tiaraGeo, materials.goldJewelry);
  tiaraMesh.position.set(0, 0.12, 0.04);
  tiaraMesh.rotation.x = 0.35;
  headGroup.add(tiaraMesh);

  // 6. Sculpted Long Wavy Amethyst Hair Group
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Crown hair cap covering entire cranium
  const hairCapGeo = registerGeo(new THREE.SphereGeometry(0.194, 20, 20, 0, Math.PI * 2, 0, Math.PI / 1.72));
  const hairCapMesh = new THREE.Mesh(hairCapGeo, materials.hair);
  hairCapMesh.scale.set(0.96, 1.05, 1.02);
  hairCapMesh.position.set(0, 0.012, -0.01);
  hairCapMesh.rotation.x = -0.04;
  hairGroup.add(hairCapMesh);

  // Elegant Forehead Bangs
  const bangGeo = registerGeo(new THREE.ConeGeometry(0.032, 0.14, 6));
  for (let i = -2; i <= 2; i++) {
    const bang = new THREE.Mesh(bangGeo, materials.hair);
    bang.position.set(i * 0.038, 0.125, 0.162);
    bang.rotation.set(Math.PI * 0.94, 0, i * -0.14);
    hairGroup.add(bang);
  }

  // Side Locks framing cheeks
  const sideLockGeo = registerGeo(new THREE.ConeGeometry(0.042, 0.42, 6));
  const leftSideLock = new THREE.Mesh(sideLockGeo, materials.hair);
  leftSideLock.position.set(-0.16, -0.08, 0.08);
  leftSideLock.rotation.set(0.2, 0, 0.16);
  const rightSideLock = new THREE.Mesh(sideLockGeo, materials.hair);
  rightSideLock.position.set(0.16, -0.08, 0.08);
  rightSideLock.rotation.set(0.2, 0, -0.16);
  hairGroup.add(leftSideLock, rightSideLock);

  // Long Wavy Cascading Back Hair (Reaches down to lower back Y = -0.65m)
  const longHairGroup = new THREE.Group();
  longHairGroup.position.set(0, 0.04, -0.08);
  hairGroup.add(longHairGroup);

  const hairSegmentGeo1 = registerGeo(new THREE.CylinderGeometry(0.16, 0.14, 0.32, 12));
  const hairSegment1 = new THREE.Mesh(hairSegmentGeo1, materials.hair);
  hairSegment1.position.set(0, -0.16, 0);
  hairSegment1.rotation.x = 0.12;

  const hairSegmentGeo2 = registerGeo(new THREE.CylinderGeometry(0.14, 0.11, 0.35, 12));
  const hairSegment2 = new THREE.Mesh(hairSegmentGeo2, materials.hair);
  hairSegment2.position.set(0, -0.46, 0.04);
  hairSegment2.rotation.x = 0.08;

  const hairSegmentGeo3 = registerGeo(new THREE.ConeGeometry(0.11, 0.38, 12));
  const hairSegment3 = new THREE.Mesh(hairSegmentGeo3, materials.hair);
  hairSegment3.position.set(0, -0.78, 0.08);
  hairSegment3.rotation.x = 0.05;
  longHairGroup.add(hairSegment1, hairSegment2, hairSegment3);

  // 7. Arms Group (Graceful casting pose)
  const armGeo = registerGeo(new THREE.CylinderGeometry(0.052, 0.046, 0.24, 12));
  const forearmGeo = registerGeo(new THREE.CylinderGeometry(0.046, 0.040, 0.22, 12));

  // Left Arm (Raised gracefully to direct lightning)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.25, 0.08, 0);
  chestGroup.add(leftArmGroup);

  const leftUpperArm = new THREE.Mesh(armGeo, materials.skin);
  leftUpperArm.position.set(0, -0.11, 0);
  leftArmGroup.add(leftUpperArm);

  const leftForearm = new THREE.Group();
  leftForearm.position.set(0, -0.23, 0);
  leftArmGroup.add(leftForearm);

  const leftLowerArm = new THREE.Mesh(forearmGeo, materials.skin);
  leftLowerArm.position.set(0, -0.10, 0);
  leftForearm.add(leftLowerArm);

  // Gold Bracelet on Left Arm
  const braceletGeo = registerGeo(new THREE.TorusGeometry(0.050, 0.008, 8, 16));
  const leftBracelet = new THREE.Mesh(braceletGeo, materials.goldJewelry);
  leftBracelet.rotation.x = Math.PI / 2;
  leftBracelet.position.set(0, -0.05, 0);
  leftForearm.add(leftBracelet);

  leftArmGroup.rotation.set(-0.5, 0.2, 0.5);
  leftForearm.rotation.set(-0.6, 0, -0.3);

  // Right Arm (Reaching forward to cradle the floating Electro-Orb)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.25, 0.08, 0);
  chestGroup.add(rightArmGroup);

  const rightUpperArm = new THREE.Mesh(armGeo, materials.skin);
  rightUpperArm.position.set(0, -0.11, 0);
  rightArmGroup.add(rightUpperArm);

  const rightForearm = new THREE.Group();
  rightForearm.position.set(0, -0.23, 0);
  rightArmGroup.add(rightForearm);

  const rightLowerArm = new THREE.Mesh(forearmGeo, materials.skin);
  rightLowerArm.position.set(0, -0.10, 0);
  rightForearm.add(rightLowerArm);

  const rightBracelet = new THREE.Mesh(braceletGeo, materials.goldJewelry);
  rightBracelet.rotation.x = Math.PI / 2;
  rightBracelet.position.set(0, -0.05, 0);
  rightForearm.add(rightBracelet);

  rightArmGroup.rotation.set(-0.7, -0.2, -0.35);
  rightForearm.rotation.set(-0.5, 0.1, 0.4);

  // 8. Floating Quả Cầu Lôi Điện Tử (Electro-Orb with Gimbal Gyroscope Rings)
  const orbGroup = new THREE.Group();
  orbGroup.position.set(0.26, 0.10, 0.38); // Floating right before right palm
  chestGroup.add(orbGroup);

  // Plasma Electro-Orb Core
  const coreGeo = registerGeo(new THREE.SphereGeometry(0.085, 18, 18));
  const orbCoreMesh = new THREE.Mesh(coreGeo, materials.orbCore);
  orbGroup.add(orbCoreMesh);

  // Concentric Gyroscope Rings
  const ring1Geo = registerGeo(new THREE.TorusGeometry(0.125, 0.010, 8, 28));
  const orbRing1 = new THREE.Mesh(ring1Geo, materials.orbGimbalRings);
  orbGroup.add(orbRing1);

  const ring2Geo = registerGeo(new THREE.TorusGeometry(0.155, 0.010, 8, 28));
  const orbRing2 = new THREE.Mesh(ring2Geo, materials.orbGimbalRings);
  orbGroup.add(orbRing2);

  const ring3Geo = registerGeo(new THREE.TorusGeometry(0.185, 0.010, 8, 28));
  const orbRing3 = new THREE.Mesh(ring3Geo, materials.goldJewelry);
  orbGroup.add(orbRing3);

  // 9. Floating Legs & High-Slit Gown
  const leftLegGroup = new THREE.Group();
  leftLegGroup.position.set(-0.09, -0.08, 0);
  pelvisGroup.add(leftLegGroup);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.position.set(0.09, -0.08, 0);
  pelvisGroup.add(rightLegGroup);

  // Thighs (Floating pointing downwards gracefully)
  const thighGeo = registerGeo(new THREE.CylinderGeometry(0.076, 0.066, 0.32, 16));
  const leftThigh = new THREE.Mesh(thighGeo, materials.sheerStockings);
  leftThigh.position.set(0, -0.16, 0);
  const rightThigh = new THREE.Mesh(thighGeo, materials.sheerStockings);
  rightThigh.position.set(0, -0.16, 0);
  leftLegGroup.add(leftThigh);
  rightLegGroup.add(rightThigh);

  // Shins with arched toes pointing down
  const shinGeo = registerGeo(new THREE.CylinderGeometry(0.062, 0.048, 0.36, 16));
  const leftShin = new THREE.Mesh(shinGeo, materials.sheerStockings);
  leftShin.position.set(0, -0.48, 0);
  const rightShin = new THREE.Mesh(shinGeo, materials.sheerStockings);
  rightShin.position.set(0, -0.48, 0);
  leftLegGroup.add(leftShin);
  rightLegGroup.add(rightShin);

  // Gold Cyber Ankle Cuffs
  const cuffGeo = registerGeo(new THREE.TorusGeometry(0.052, 0.008, 8, 16));
  const leftCuff = new THREE.Mesh(cuffGeo, materials.goldJewelry);
  leftCuff.rotation.x = Math.PI / 2;
  leftCuff.position.set(0, -0.62, 0);
  const rightCuff = new THREE.Mesh(cuffGeo, materials.goldJewelry);
  rightCuff.rotation.x = Math.PI / 2;
  rightCuff.position.set(0, -0.62, 0);
  leftLegGroup.add(leftCuff);
  rightLegGroup.add(rightCuff);

  leftLegGroup.rotation.x = 0.12;
  rightLegGroup.rotation.x = 0.18;

  // 10. 3-Tier Cloth Damage Variations (Silk Gown Destruction)
  const tier1Group = new THREE.Group();
  const tier2Group = new THREE.Group();
  const tier3Group = new THREE.Group();
  pelvisGroup.add(tier1Group, tier2Group, tier3Group);

  // Tier 1 (Pristine): Flowing high-slit silk gown down to ankles
  const gownGeoT1 = registerGeo(new THREE.ConeGeometry(0.28, 0.72, 16, 1, true, 0, Math.PI * 1.65));
  const gownMeshT1 = new THREE.Mesh(gownGeoT1, materials.violetSilk);
  gownMeshT1.position.set(0, -0.32, 0);
  gownMeshT1.rotation.y = -Math.PI / 4; // High slit exposing left leg
  tier1Group.add(gownMeshT1);

  // Tier 2 (Torn): Slashed up to the hip, ragged hems
  const gownGeoT2 = registerGeo(new THREE.ConeGeometry(0.26, 0.45, 12, 1, true, 0, Math.PI * 1.3));
  const gownMeshT2 = new THREE.Mesh(gownGeoT2, materials.violetSilk);
  gownMeshT2.position.set(0, -0.18, 0);
  gownMeshT2.rotation.y = -Math.PI / 3;

  const laceRibbonGeo = registerGeo(new THREE.TorusGeometry(0.078, 0.010, 8, 16));
  const laceRibbon = new THREE.Mesh(laceRibbonGeo, materials.laceTorn);
  laceRibbon.rotation.x = Math.PI / 2;
  laceRibbon.position.set(-0.09, -0.06, 0);
  tier2Group.add(gownMeshT2, laceRibbon);

  // Tier 3 (Climax Extreme 18+): Gown shredded to wisps of violet lightning ribbons
  const microSilkGeo = registerGeo(new THREE.CylinderGeometry(0.16, 0.13, 0.08, 16));
  const microSilk = new THREE.Mesh(microSilkGeo, materials.laceTorn);
  microSilk.position.set(0, -0.02, 0);
  tier3Group.add(microSilk);

  // Initial state setup
  tier1Group.visible = true;
  tier2Group.visible = false;
  tier3Group.visible = false;

  const updateClothDamageTier = (tier: ClothDamageTier): void => {
    tier1Group.visible = tier === 1;
    tier2Group.visible = tier === 2;
    tier3Group.visible = tier === 3;

    if (tier === 1) {
      leftBreast.material = materials.violetSilk;
      rightBreast.material = materials.violetSilk;
      materials.orbCore.emissiveIntensity = 3.2;
    } else if (tier === 2) {
      // Slashed chest cleavage
      leftBreast.material = materials.violetSilk;
      rightBreast.material = materials.skin; // One breast fully exposed
      materials.orbCore.emissiveIntensity = 4.2;
    } else {
      // Climax: Full bare bust, lightning arcing around body
      leftBreast.material = materials.skin;
      rightBreast.material = materials.skin;
      materials.orbCore.emissiveIntensity = 6.0;
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
    longHairGroup,
    leftArmGroup,
    rightArmGroup,
    orbGroup,
    orbRing1,
    orbRing2,
    orbRing3,
    leftLegGroup,
    rightLegGroup,
    tier1Group,
    tier2Group,
    tier3Group,
    updateClothDamageTier,
    dispose
  };
}
