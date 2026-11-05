import * as THREE from 'three';
import { GondulMaterialsBundle } from './gondul-materials.js';

export interface GondulMeshHierarchy {
  readonly rootGroup: THREE.Group;
  readonly bodyGroup: THREE.Group;
  readonly headGroup: THREE.Group;
  readonly chestGroup: THREE.Group;
  readonly labCoatGroup: THREE.Group;
  readonly leftArmGroup: THREE.Group;
  readonly rightArmGroup: THREE.Group;
  readonly leftLegGroup: THREE.Group;
  readonly rightLegGroup: THREE.Group;
  readonly hologramPadGroup: THREE.Group;
  readonly drone1Group: THREE.Group;
  readonly drone2Group: THREE.Group;
  readonly forcefieldMesh: THREE.Mesh;
  readonly hairLocks: readonly THREE.Mesh[];
  readonly setClothTierGeometry: (tier: number) => void;
}

/**
 * Builds high-fidelity 3D procedural humanoid geometry for VALK-09 Gondul.
 * Xây dựng cấu trúc hình học 3D cho VALK-09 Gondul:
 * - Chiều cao: 1.68m
 * - Vòng 1 Cúp F (0.36m - đẫy đà tròn trịa chuẩn học giả anime)
 * - Vòng eo 0.20m / Vòng hông 0.38m
 * - Áo khoác blouse trắng phòng thí nghiệm vạt dài
 * - Cặp kính cận 3D gọng vàng kim trên sống mũi
 * - Máy tính ba chiều Hologram trên tay trái
 * - 2 Drone hộ vệ Ma trận khiên bay lơ lửng
 */
export function buildGondulGeometry(materials: GondulMaterialsBundle): GondulMeshHierarchy {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'Valkyrie_Gondul_Root';

  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'Gondul_Body';
  rootGroup.add(bodyGroup);

  // 1. Pelvis & Hips (Vòng hông 0.38m mềm mại nở nang)
  const pelvisGeo = new THREE.CylinderGeometry(0.18, 0.20, 0.22, 20);
  const pelvisMesh = new THREE.Mesh(pelvisGeo, materials.bodysuitMat);
  pelvisMesh.position.y = 0.88;
  bodyGroup.add(pelvisMesh);

  // Bodysuit Belt Trim
  const beltGeo = new THREE.TorusGeometry(0.19, 0.015, 12, 24);
  const beltMesh = new THREE.Mesh(beltGeo, materials.trimMat);
  beltMesh.rotation.x = Math.PI / 2;
  beltMesh.position.y = 0.98;
  bodyGroup.add(beltMesh);

  // 2. Torso & Waist (Vòng eo 0.20m thon gọn)
  const waistGeo = new THREE.CylinderGeometry(0.17, 0.18, 0.22, 20);
  const waistMesh = new THREE.Mesh(waistGeo, materials.bodysuitMat);
  waistMesh.position.y = 1.08;
  bodyGroup.add(waistMesh);

  // 3. Chest & Cup F Bust (Vòng 1 Cúp F đồ sộ 0.36m)
  const chestGroup = new THREE.Group();
  chestGroup.name = 'Gondul_ChestGroup';
  chestGroup.position.set(0, 1.22, 0);
  bodyGroup.add(chestGroup);

  // Upper ribcage
  const ribcageGeo = new THREE.CylinderGeometry(0.19, 0.17, 0.18, 20);
  const ribcageMesh = new THREE.Mesh(ribcageGeo, materials.bodysuitMat);
  chestGroup.add(ribcageMesh);

  // Voluptuous Cup F Breasts (Đôi gò bồng đảo Cúp F đẫy đà)
  const breastGeo = new THREE.SphereGeometry(0.125, 24, 20);
  breastGeo.scale(1.0, 1.08, 1.25);

  const leftBreast = new THREE.Mesh(breastGeo, materials.skinMat);
  leftBreast.position.set(-0.095, 0.03, 0.125);
  leftBreast.rotation.x = 0.18;
  leftBreast.rotation.y = -0.08;
  chestGroup.add(leftBreast);

  const rightBreast = new THREE.Mesh(breastGeo, materials.skinMat);
  rightBreast.position.set(0.095, 0.03, 0.125);
  rightBreast.rotation.x = 0.18;
  rightBreast.rotation.y = 0.08;
  chestGroup.add(rightBreast);

  // Plunging Bodysuit Fabric & Cleavage Frame
  const bodysuitCleavageGeo = new THREE.ConeGeometry(0.09, 0.16, 16);
  bodysuitCleavageGeo.scale(1.1, 0.4, 0.8);
  const cleavageCover = new THREE.Mesh(bodysuitCleavageGeo, materials.bodysuitMat);
  cleavageCover.position.set(0, -0.04, 0.18);
  cleavageCover.rotation.x = Math.PI;
  chestGroup.add(cleavageCover);

  // 4. Lab Coat (Áo blouse trắng phòng thí nghiệm thanh lịch)
  const labCoatGroup = new THREE.Group();
  labCoatGroup.name = 'Gondul_LabCoat';
  bodyGroup.add(labCoatGroup);

  // Lab coat collar lapels
  const lapelGeo = new THREE.BoxGeometry(0.07, 0.22, 0.02);
  const leftLapel = new THREE.Mesh(lapelGeo, materials.labCoatMat);
  leftLapel.position.set(-0.16, 1.24, 0.12);
  leftLapel.rotation.z = -0.25;
  leftLapel.rotation.y = 0.2;
  labCoatGroup.add(leftLapel);

  const rightLapel = new THREE.Mesh(lapelGeo, materials.labCoatMat);
  rightLapel.position.set(0.16, 1.24, 0.12);
  rightLapel.rotation.z = 0.25;
  rightLapel.rotation.y = -0.2;
  labCoatGroup.add(rightLapel);

  // Lab coat back & side panels (Flaring gracefully down to thighs)
  const coatBackGeo = new THREE.CylinderGeometry(0.21, 0.28, 0.52, 16, 1, true, -Math.PI * 0.8, Math.PI * 1.6);
  const coatBackMesh = new THREE.Mesh(coatBackGeo, materials.labCoatMat);
  coatBackMesh.position.set(0, 0.98, -0.02);
  labCoatGroup.add(coatBackMesh);

  // Lab coat hem cyan accent trim
  const coatTrimGeo = new THREE.TorusGeometry(0.275, 0.01, 8, 24, Math.PI * 1.55);
  const coatTrimMesh = new THREE.Mesh(coatTrimGeo, materials.trimMat);
  coatTrimMesh.rotation.x = Math.PI / 2;
  coatTrimMesh.rotation.z = -Math.PI * 0.78;
  coatTrimMesh.position.set(0, 0.72, -0.02);
  labCoatGroup.add(coatTrimMesh);

  // 5. Neck & Head
  const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.12, 16);
  const neckMesh = new THREE.Mesh(neckGeo, materials.skinMat);
  neckMesh.position.set(0, 1.35, 0);
  bodyGroup.add(neckMesh);

  // Gold tech choker
  const chokerGeo = new THREE.TorusGeometry(0.07, 0.012, 8, 20);
  const chokerMesh = new THREE.Mesh(chokerGeo, materials.trimMat);
  chokerMesh.rotation.x = Math.PI / 2;
  chokerMesh.position.set(0, 1.34, 0);
  bodyGroup.add(chokerMesh);

  const headGroup = new THREE.Group();
  headGroup.name = 'Gondul_Head';
  headGroup.position.set(0, 1.48, 0);
  bodyGroup.add(headGroup);

  // Head Base
  const headGeo = new THREE.SphereGeometry(0.14, 24, 20);
  headGeo.scale(0.95, 1.05, 1.0);
  const headMesh = new THREE.Mesh(headGeo, materials.skinMat);
  headGroup.add(headMesh);

  // Anime Face Decal Screen
  const faceDecalGeo = new THREE.SphereGeometry(0.141, 24, 20, 0, Math.PI, 0, Math.PI * 0.65);
  faceDecalGeo.scale(0.952, 1.052, 1.002);
  const faceDecalMesh = new THREE.Mesh(faceDecalGeo, materials.faceMat);
  faceDecalMesh.rotation.y = -Math.PI / 2;
  faceDecalMesh.rotation.x = 0.1;
  headGroup.add(faceDecalMesh);

  // 6. Meganekko 3D Glasses (Kính cận tri thức 3D)
  const glassesGroup = new THREE.Group();
  glassesGroup.name = 'Gondul_Glasses';
  glassesGroup.position.set(0, 0.02, 0.142);
  headGroup.add(glassesGroup);

  const rimGeo = new THREE.TorusGeometry(0.045, 0.005, 8, 20);
  const leftRimMesh = new THREE.Mesh(rimGeo, materials.glassesMat);
  leftRimMesh.position.set(-0.055, 0, 0);
  glassesGroup.add(leftRimMesh);

  const rightRimMesh = new THREE.Mesh(rimGeo, materials.glassesMat);
  rightRimMesh.position.set(0.055, 0, 0);
  glassesGroup.add(rightRimMesh);

  const bridgeGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.025, 8);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, materials.glassesMat);
  bridgeMesh.rotation.z = Math.PI / 2;
  bridgeMesh.position.set(0, 0.005, 0);
  glassesGroup.add(bridgeMesh);

  // 7. Soft Pastel Pink Anime Hair & Cowlick (Ahoge)
  const hairGroup = new THREE.Group();
  hairGroup.name = 'Gondul_Hair';
  headGroup.add(hairGroup);

  // Hair helmet base
  const hairBaseGeo = new THREE.SphereGeometry(0.155, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.65);
  hairBaseGeo.scale(0.98, 1.05, 1.04);
  const hairBaseMesh = new THREE.Mesh(hairBaseGeo, materials.hairMat);
  hairBaseMesh.position.set(0, 0.015, -0.01);
  hairGroup.add(hairBaseMesh);

  // Soft bangs draping across forehead
  const bangsGeo = new THREE.ConeGeometry(0.035, 0.14, 8);
  bangsGeo.scale(1.2, 1.0, 0.5);

  const hairLocks: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const bang = new THREE.Mesh(bangsGeo, materials.hairMat);
    bang.position.set(-0.08 + i * 0.04, 0.04, 0.135);
    bang.rotation.z = (i - 2) * 0.15;
    bang.rotation.x = -0.22;
    hairGroup.add(bang);
    hairLocks.push(bang);
  }

  // Side hair locks framing face
  const sideLockGeo = new THREE.CylinderGeometry(0.025, 0.015, 0.32, 10);
  const leftSideLock = new THREE.Mesh(sideLockGeo, materials.hairMat);
  leftSideLock.position.set(-0.14, -0.06, 0.06);
  leftSideLock.rotation.z = -0.15;
  hairGroup.add(leftSideLock);
  hairLocks.push(leftSideLock);

  const rightSideLock = new THREE.Mesh(sideLockGeo, materials.hairMat);
  rightSideLock.position.set(0.14, -0.06, 0.06);
  rightSideLock.rotation.z = 0.15;
  hairGroup.add(rightSideLock);
  hairLocks.push(rightSideLock);

  // Cute Ahoge Cowlick (Sợi tóc ngốc nghếch cong vút trên đỉnh đầu)
  const ahogeGeo = new THREE.TorusGeometry(0.07, 0.008, 6, 16, Math.PI * 0.85);
  const ahogeMesh = new THREE.Mesh(ahogeGeo, materials.hairMat);
  ahogeMesh.position.set(0.02, 0.16, 0.02);
  ahogeMesh.rotation.y = 0.3;
  hairGroup.add(ahogeMesh);
  hairLocks.push(ahogeMesh);

  // 8. Arms & Hologram Tablet (Tay trái cầm máy tính ba chiều)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'Gondul_LeftArm';
  leftArmGroup.position.set(-0.24, 1.25, 0);
  bodyGroup.add(leftArmGroup);

  const shoulderPadGeo = new THREE.SphereGeometry(0.065, 12, 10);
  const leftShoulder = new THREE.Mesh(shoulderPadGeo, materials.labCoatMat);
  leftArmGroup.add(leftShoulder);

  const upperArmGeo = new THREE.CylinderGeometry(0.048, 0.042, 0.24, 12);
  const leftUpperArm = new THREE.Mesh(upperArmGeo, materials.labCoatMat);
  leftUpperArm.position.y = -0.12;
  leftArmGroup.add(leftUpperArm);

  const leftForearmGroup = new THREE.Group();
  leftForearmGroup.position.set(0, -0.24, 0);
  leftArmGroup.add(leftForearmGroup);

  const forearmGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.22, 12);
  const leftForearm = new THREE.Mesh(forearmGeo, materials.skinMat);
  leftForearm.position.y = -0.11;
  leftForearmGroup.add(leftForearm);

  // Hologram Cyber Tablet Pad in Left Hand
  const hologramPadGroup = new THREE.Group();
  hologramPadGroup.name = 'Gondul_HologramPad';
  hologramPadGroup.position.set(0.02, -0.22, 0.12);
  leftForearmGroup.add(hologramPadGroup);

  // Pad frame
  const padFrameGeo = new THREE.BoxGeometry(0.24, 0.015, 0.16);
  const padFrameMesh = new THREE.Mesh(padFrameGeo, materials.droneShellMat);
  hologramPadGroup.add(padFrameMesh);

  // Translucent glowing hologram display projector screen
  const screenGeo = new THREE.PlaneGeometry(0.22, 0.14);
  const screenMesh = new THREE.Mesh(screenGeo, materials.hologramMat);
  screenMesh.rotation.x = -Math.PI / 2;
  screenMesh.position.y = 0.012;
  hologramPadGroup.add(screenMesh);

  // Right Arm (Gracefully raised touching glasses or commanding drones)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.name = 'Gondul_RightArm';
  rightArmGroup.position.set(0.24, 1.25, 0);
  bodyGroup.add(rightArmGroup);

  const rightShoulder = new THREE.Mesh(shoulderPadGeo, materials.labCoatMat);
  rightArmGroup.add(rightShoulder);

  const rightUpperArm = new THREE.Mesh(upperArmGeo, materials.labCoatMat);
  rightUpperArm.position.y = -0.12;
  rightArmGroup.add(rightUpperArm);

  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.position.set(0, -0.24, 0);
  rightArmGroup.add(rightForearmGroup);

  const rightForearm = new THREE.Mesh(forearmGeo, materials.skinMat);
  rightForearm.position.y = -0.11;
  rightForearmGroup.add(rightForearm);

  // 9. Legs & Stockings (Chân thon dài trong tất đùi công nghệ cao)
  const leftLegGroup = new THREE.Group();
  leftLegGroup.name = 'Gondul_LeftLeg';
  leftLegGroup.position.set(-0.11, 0.8, 0);
  bodyGroup.add(leftLegGroup);

  const thighGeo = new THREE.CylinderGeometry(0.09, 0.068, 0.42, 16);
  const leftThigh = new THREE.Mesh(thighGeo, materials.bodysuitMat);
  leftThigh.position.y = -0.21;
  leftLegGroup.add(leftThigh);

  const calfGeo = new THREE.CylinderGeometry(0.065, 0.048, 0.44, 16);
  const leftCalf = new THREE.Mesh(calfGeo, materials.skinMat);
  leftCalf.position.y = -0.64;
  leftLegGroup.add(leftCalf);

  const shoeGeo = new THREE.BoxGeometry(0.09, 0.07, 0.19);
  const leftShoe = new THREE.Mesh(shoeGeo, materials.droneShellMat);
  leftShoe.position.set(0, -0.86, 0.03);
  leftLegGroup.add(leftShoe);

  const rightLegGroup = new THREE.Group();
  rightLegGroup.name = 'Gondul_RightLeg';
  rightLegGroup.position.set(0.11, 0.8, 0);
  bodyGroup.add(rightLegGroup);

  const rightThigh = new THREE.Mesh(thighGeo, materials.bodysuitMat);
  rightThigh.position.y = -0.21;
  rightLegGroup.add(rightThigh);

  const rightCalf = new THREE.Mesh(calfGeo, materials.skinMat);
  rightCalf.position.y = -0.64;
  rightLegGroup.add(rightCalf);

  const rightShoe = new THREE.Mesh(shoeGeo, materials.droneShellMat);
  rightShoe.position.set(0, -0.86, 0.03);
  rightLegGroup.add(rightShoe);

  // 10. Pair of Shield Matrix Drones (2 Drone Hộ Vệ Ma Trận Khiên)
  const createDrone = (name: string): THREE.Group => {
    const droneGroup = new THREE.Group();
    droneGroup.name = name;

    // Ceramic aero shell
    const shellGeo = new THREE.SphereGeometry(0.075, 16, 12);
    shellGeo.scale(1.2, 0.8, 1.0);
    const shellMesh = new THREE.Mesh(shellGeo, materials.droneShellMat);
    droneGroup.add(shellMesh);

    // Rotating cyan plasma emitter ring
    const ringGeo = new THREE.TorusGeometry(0.09, 0.012, 8, 20);
    const ringMesh = new THREE.Mesh(ringGeo, materials.droneCoreMat);
    droneGroup.add(ringMesh);

    // Antenna spike
    const antGeo = new THREE.CylinderGeometry(0.003, 0.006, 0.09, 6);
    const antMesh = new THREE.Mesh(antGeo, materials.trimMat);
    antMesh.position.y = 0.08;
    droneGroup.add(antMesh);

    return droneGroup;
  };

  const drone1Group = createDrone('Gondul_Drone_Left');
  drone1Group.position.set(-0.45, 1.45, -0.15);
  rootGroup.add(drone1Group);

  const drone2Group = createDrone('Gondul_Drone_Right');
  drone2Group.position.set(0.45, 1.45, -0.15);
  rootGroup.add(drone2Group);

  // 11. Hexagonal Forcefield Shield (Màng khiên ma trận lục giác)
  const forcefieldGeo = new THREE.IcosahedronGeometry(1.2, 2);
  const forcefieldMesh = new THREE.Mesh(forcefieldGeo, materials.forcefieldMat);
  forcefieldMesh.position.set(0, 1.1, 0);
  forcefieldMesh.visible = false; // Triggered during Overclock Forcefield ultimate
  rootGroup.add(forcefieldMesh);

  // Geometry Cloth Tier updater
  const setClothTierGeometry = (tier: number): void => {
    if (tier === 1) {
      labCoatGroup.visible = true;
      coatBackMesh.visible = true;
      leftLapel.visible = true;
      rightLapel.visible = true;
      glassesGroup.position.set(0, 0.02, 0.142);
      glassesGroup.rotation.z = 0;
    } else if (tier === 2) {
      labCoatGroup.visible = true;
      coatBackMesh.visible = true;
      leftLapel.visible = true;
      rightLapel.visible = false; // Torn off
      glassesGroup.position.set(0.01, 0.01, 0.142);
      glassesGroup.rotation.z = 0.12; // Glasses askew
    } else {
      // Tier 3: Climax Extreme
      coatBackMesh.visible = false; // Lab coat ripped off
      leftLapel.visible = false;
      rightLapel.visible = false;
      glassesGroup.position.set(0.02, -0.04, 0.14); // Glasses slipping off
      glassesGroup.rotation.z = 0.28;
    }
  };

  return {
    rootGroup,
    bodyGroup,
    headGroup,
    chestGroup,
    labCoatGroup,
    leftArmGroup,
    rightArmGroup,
    leftLegGroup,
    rightLegGroup,
    hologramPadGroup,
    drone1Group,
    drone2Group,
    forcefieldMesh,
    hairLocks,
    setClothTierGeometry
  };
}
