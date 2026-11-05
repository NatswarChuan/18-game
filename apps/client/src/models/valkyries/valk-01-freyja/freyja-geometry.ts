import * as THREE from 'three';
import { FreyjaMaterials } from './freyja-materials.js';
import {
  buildOrganicTorsoHipsGeometry,
  buildOrganicTeardropBreastGeometry,
  buildOrganicLegGeometry,
  buildUpperArmGeometry,
  buildForearmGeometry,
  buildArticulatedAnimeHand,
  buildSculptedAnimeHeadGeometry,
  buildConformalFaceGeometry,
  buildStylizedAnimeHairLockGeometry,
  buildWingedPauldronGeometry,
  buildAnimeSabatonGeometry
} from '../anatomy/organic-anime-mesh-builder.js';
import { createInvertedHullOutlineMesh } from '../anime-shader/anime-cel-shader.js';

export interface FreyjaHierarchy {
  readonly rootGroup: THREE.Group;
  readonly hipsGroup: THREE.Group;
  readonly spineGroup: THREE.Group;
  readonly chestGroup: THREE.Group;
  readonly neckGroup: THREE.Group;
  readonly headGroup: THREE.Group;
  readonly hairGroup: THREE.Group;
  readonly ponytail: THREE.Group;
  readonly leftArmGroup: THREE.Group;
  readonly rightArmGroup: THREE.Group;
  readonly leftForearmGroup?: THREE.Group;
  readonly rightForearmGroup?: THREE.Group;
  readonly leftLegGroup: THREE.Group;
  readonly rightLegGroup: THREE.Group;
  readonly breastLeft: THREE.Mesh;
  readonly breastRight: THREE.Mesh;
  readonly breastplateMesh: THREE.Mesh;
  readonly breastplateGroup: THREE.Group;
  readonly greatswordGroup: THREE.Group;
  readonly swordPlasmaGlowMesh: THREE.Mesh;
  readonly dispose: () => void;
}

/**
 * Builds high-fidelity organic 3D anime humanoid body, hair, armor and weapon geometry for Freyja (VALK-01).
 * Dựng toàn bộ mô hình 3D hình người Anime cao cấp chuẩn Genshin Impact / Honkai Star Rail:
 * - Đầu điêu khắc cằm V-line, sống mũi nhỏ xinh, khuôn mặt cong ôm sát (Conformal Face Shell)
 * - Mái tóc Anime xếp lớp đa tầng: tóc mái rẽ ngôi cong mềm, lọn tóc mai dài 2 bên má ôm trọn khuôn mặt
 * - Vòng 1 Cúp G giọt nước quyến rũ với rãnh ngực tự nhiên & áo giáp ngực Valkyrie nạm vàng
 * - Thân hình đồng hồ cát liền khối từ đáy chậu lên đến xương quai xanh không hở rỗng
 * - Giáp vai cánh chiến thần khí động học flush sát bờ vai
 * - Tứ chi thon mềm với tuyệt kỹ "Tuyệt đối lĩnh vực" (Zettai Ryouiki) và bốt chiến đấu cao gót
 * - Đại kiếm Plasma Buster 1.65m cầm trực tiếp trong lòng bàn tay
 */
export function buildFreyjaGeometry(materials: FreyjaMaterials): FreyjaHierarchy {
  const disposables: THREE.BufferGeometry[] = [];
  const registerGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    disposables.push(geo);
    return geo;
  };

  const rootGroup = new THREE.Group();
  rootGroup.name = 'Freyja_Root';

  // 1. Organic Torso & Hips Group (Pelvis base at Y = 0.82)
  const hipsGroup = new THREE.Group();
  hipsGroup.name = 'Freyja_Hips';
  hipsGroup.position.set(0, 0.82, 0);
  rootGroup.add(hipsGroup);

  const torsoHipsGeo = registerGeo(
    buildOrganicTorsoHipsGeometry({
      clavicleRadius: 0.112,
      chestRibRadius: 0.118,
      waistRadius: 0.092,
      hipRadius: 0.148,
      pelvisRadius: 0.122
    }, 64)
  );

  const torsoHipsMesh = new THREE.Mesh(torsoHipsGeo, materials.bodysuitDark);
  torsoHipsMesh.name = 'Freyja_OrganicTorso';
  hipsGroup.add(torsoHipsMesh);

  // Armored hip skirts (Winged Tassets) with golden trim
  const leftTasset = buildTassetMesh(materials, registerGeo, false);
  const rightTasset = buildTassetMesh(materials, registerGeo, true);
  hipsGroup.add(leftTasset, rightTasset);

  // 2. Spine & Waist Joint (Y = 0.32 relative to hips base)
  const spineGroup = new THREE.Group();
  spineGroup.name = 'Freyja_Spine';
  spineGroup.position.set(0, 0.32, 0);
  hipsGroup.add(spineGroup);

  // Form-fitting Valkyrie Cyber Belt with golden buckle & cyan gem (Hugs slender wasp waist tightly)
  const beltGeo = registerGeo(new THREE.TorusGeometry(0.092, 0.0048, 8, 36));
  const belt = new THREE.Mesh(beltGeo, materials.armorGold);
  belt.rotation.set(Math.PI / 2 + 0.18, 0, 0);
  belt.position.set(0, -0.025, 0.005);

  const buckleGeo = registerGeo(new THREE.BoxGeometry(0.030, 0.016, 0.012));
  const buckle = new THREE.Mesh(buckleGeo, materials.armorSilver);
  buckle.position.set(0, -0.045, 0.096);

  const buckleGemGeo = registerGeo(new THREE.OctahedronGeometry(0.009, 0));
  const buckleGem = new THREE.Mesh(buckleGemGeo, materials.cyberCyanGlow);
  buckleGem.position.set(0, -0.045, 0.104);
  spineGroup.add(belt, buckle, buckleGem);

  // 3. Chest Group (Y = 0.20 relative to spine)
  const chestGroup = new THREE.Group();
  chestGroup.name = 'Freyja_Chest';
  chestGroup.position.set(0, 0.20, 0);
  spineGroup.add(chestGroup);

  // Voluptuous Cup G Organic Teardrop Breasts
  const { breastLeft, breastRight } = buildBreasts(materials, registerGeo);
  chestGroup.add(breastLeft, breastRight);

  // Armored Valkyrie Cuirass & Power Core
  const { breastplateMesh, breastplateGroup } = buildCuirass(materials, registerGeo);
  chestGroup.add(breastplateGroup);

  // 4. Slender Anime Neck & Choker (Y = 0.14 relative to chest)
  const neckGroup = new THREE.Group();
  neckGroup.name = 'Freyja_Neck';
  neckGroup.position.set(0, 0.14, 0);
  chestGroup.add(neckGroup);

  const neckGeo = registerGeo(new THREE.CylinderGeometry(0.046, 0.058, 0.10, 24));
  const neckMesh = new THREE.Mesh(neckGeo, materials.skin);

  const chokerGeo = registerGeo(new THREE.TorusGeometry(0.050, 0.006, 8, 24));
  const chokerMesh = new THREE.Mesh(chokerGeo, materials.armorGold);
  chokerMesh.rotation.x = Math.PI / 2;
  chokerMesh.position.y = 0.01;

  const chokerGemGeo = registerGeo(new THREE.OctahedronGeometry(0.010, 0));
  const chokerGem = new THREE.Mesh(chokerGemGeo, materials.cyberCyanGlow);
  chokerGem.position.set(0, 0.01, 0.056);
  neckGroup.add(neckMesh, chokerMesh, chokerGem);

  // 5. Sculpted V-line Anime Head Group (Y = 0.11 relative to neck)
  const headGroup = new THREE.Group();
  headGroup.name = 'Freyja_Head';
  headGroup.position.set(0, 0.11, 0.01);
  neckGroup.add(headGroup);

  const sculptedHeadGeo = registerGeo(buildSculptedAnimeHeadGeometry(0.126, 64, 48));
  const headMesh = new THREE.Mesh(sculptedHeadGeo, materials.skin);
  headMesh.name = 'Freyja_SculptedHead';
  headGroup.add(headMesh);

  // Conformal Curved Anime Face Shell (Seamlessly renders glowing expressive eyes, blush & lips)
  const conformalFaceGeo = registerGeo(buildConformalFaceGeometry(0.126, 48, 36));
  const faceMesh = new THREE.Mesh(conformalFaceGeo, materials.face);
  faceMesh.name = 'Freyja_ConformalFace';
  faceMesh.renderOrder = 10;
  headGroup.add(faceMesh);

  // Sleek Cyberpunk Audio Comm Headsets matching VALK-01.jpg
  buildCyberEarComms(headGroup, materials, registerGeo);

  // Signature Glowing Cyan Cyber Scouter HUD Eyepiece (Left Eye)
  buildCyberScouter(headGroup, materials, registerGeo);

  // 6. Layered Anime Hair (Helmet, Curtain Bangs, Flowing Sidelocks & Ponytail)
  const { hairGroup, ponytail } = buildAnimeHair(headGroup, materials, registerGeo);

  // 7. Organic Sculpted Articulated Arms & 5-Finger Hands
  const { leftArmGroup, rightArmGroup, leftForearmGroup, rightForearmGroup } = buildArms(chestGroup, materials, registerGeo);

  // 8. Organic Sculpted Legs & Combat Sabatons
  const { leftLegGroup, rightLegGroup } = buildLegs(hipsGroup, materials, registerGeo);

  // 9. Signature Weapon: Greatsword (Held pointing downward at side in combat ready stance)
  const { greatswordGroup, swordPlasmaGlowMesh } = buildGreatsword(materials, registerGeo);
  // Attach greatsword to the right forearm group near hand
  greatswordGroup.position.set(0.02, -0.25, 0.04);
  greatswordGroup.rotation.set(Math.PI - 0.45, 0.18, -0.20);
  rightForearmGroup.add(greatswordGroup);

  // Dispose lifecycle cleanup
  const dispose = (): void => {
    disposables.forEach((geo) => geo.dispose());
  };

  return {
    rootGroup,
    hipsGroup,
    spineGroup,
    chestGroup,
    neckGroup,
    headGroup,
    hairGroup,
    ponytail,
    leftArmGroup,
    rightArmGroup,
    leftForearmGroup,
    rightForearmGroup,
    leftLegGroup,
    rightLegGroup,
    breastLeft,
    breastRight,
    breastplateMesh,
    breastplateGroup,
    greatswordGroup,
    swordPlasmaGlowMesh,
    dispose
  };
}

// ==========================================
// MODULAR COMPONENT BUILDERS (Clean SRP)
// ==========================================

function buildTassetMesh(
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T,
  isRight: boolean
): THREE.Group {
  const group = new THREE.Group();
  const dir = isRight ? 1 : -1;
  // Mounted flush on the iliac crest (X = dir * 0.150, Y = 0.15, Z = 0.01)
  group.position.set(dir * 0.150, 0.15, 0.01);
  group.rotation.set(0.08, 0, -dir * 0.22);

  // 1. Sleek aerodynamic golden vernier housing hugging hip crest
  const housingGeo = registerGeo(new THREE.BoxGeometry(0.016, 0.048, 0.034));
  const housing = new THREE.Mesh(housingGeo, materials.armorGold);

  // 2. Glowing cyan cyber energy nozzle
  const nozzleGeo = registerGeo(new THREE.CylinderGeometry(0.006, 0.008, 0.020, 12));
  const nozzle = new THREE.Mesh(nozzleGeo, materials.cyberCyanGlow);
  nozzle.position.set(dir * 0.008, -0.020, 0);
  nozzle.rotation.z = -dir * 0.30;

  // 3. Compact silver aero-fin trailing backwards
  const finGeo = registerGeo(new THREE.BoxGeometry(0.004, 0.065, 0.018));
  const fin = new THREE.Mesh(finGeo, materials.armorSilver);
  fin.position.set(dir * 0.008, -0.010, -0.012);
  fin.rotation.x = -0.30;

  group.add(housing, nozzle, fin);
  return group;
}

function buildBreasts(
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): { breastLeft: THREE.Mesh; breastRight: THREE.Mesh } {
  // Voluptuous, full G-cup anime teardrop breasts with natural cleavage contour
  const leftBreastGeo = registerGeo(
    buildOrganicTeardropBreastGeometry({
      cupRadius: 0.072,
      projection: 1.18,
      sagFactor: 0.06,
      isRight: false
    }, 40, 32)
  );
  const breastLeft = new THREE.Mesh(leftBreastGeo, materials.breastLeft);
  breastLeft.name = 'Freyja_Breast_Left';
  breastLeft.position.set(-0.038, 0.032, 0.092);
  breastLeft.rotation.set(-0.02, 0.03, -0.02);

  const rightBreastGeo = registerGeo(
    buildOrganicTeardropBreastGeometry({
      cupRadius: 0.072,
      projection: 1.18,
      sagFactor: 0.06,
      isRight: true
    }, 40, 32)
  );
  const breastRight = new THREE.Mesh(rightBreastGeo, materials.breastRight);
  breastRight.name = 'Freyja_Breast_Right';
  breastRight.position.set(0.038, 0.032, 0.092);
  breastRight.rotation.set(-0.02, -0.03, 0.02);

  return { breastLeft, breastRight };
}

function buildCuirass(
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): { breastplateMesh: THREE.Mesh; breastplateGroup: THREE.Group } {
  const breastplateGroup = new THREE.Group();
  breastplateGroup.name = 'Freyja_Cuirass_Group';

  // 1. Radiant Golden Underwire Support Rims hugging underbust
  const underwireGeo = registerGeo(new THREE.TorusGeometry(0.072, 0.0030, 8, 36, Math.PI * 0.85));
  const leftUnderwire = new THREE.Mesh(underwireGeo, materials.armorGold);
  leftUnderwire.position.set(-0.038, -0.002, 0.096);
  leftUnderwire.rotation.set(0.24, 0, -0.15);

  const rightUnderwire = new THREE.Mesh(underwireGeo, materials.armorGold);
  rightUnderwire.position.set(0.038, -0.002, 0.096);
  rightUnderwire.rotation.set(0.24, 0, 0.15);

  // 2. Glowing Neon Cyan Energy Conduit along the lower underbust seam
  const neonUnderwireGeo = registerGeo(new THREE.TorusGeometry(0.072, 0.0018, 6, 36, Math.PI * 0.85));
  const leftNeonRim = new THREE.Mesh(neonUnderwireGeo, materials.cyberCyanGlow);
  leftNeonRim.position.set(-0.038, 0.001, 0.097);
  leftNeonRim.rotation.set(0.24, 0, -0.15);

  const rightNeonRim = new THREE.Mesh(neonUnderwireGeo, materials.cyberCyanGlow);
  rightNeonRim.position.set(0.038, 0.001, 0.097);
  rightNeonRim.rotation.set(0.24, 0, 0.15);

  // 3. Seductive low-plunging underbust Valkyrie solar plexus bracket
  const sternumShape = new THREE.Shape();
  sternumShape.moveTo(-0.016, 0);
  sternumShape.lineTo(0.016, 0);
  sternumShape.lineTo(0.012, -0.045);
  sternumShape.lineTo(0, -0.060);
  sternumShape.lineTo(-0.012, -0.045);
  sternumShape.closePath();

  const sternumGeo = registerGeo(new THREE.ExtrudeGeometry(sternumShape, { depth: 0.005, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002 }));
  sternumGeo.center();
  const breastplateMesh = new THREE.Mesh(sternumGeo, materials.armorSilver);
  breastplateMesh.position.set(0, -0.036, 0.096);

  // 4. Glowing Cyan Valkyrie Power Reactor Core nestled in the solar plexus bracket
  const coreGeo = registerGeo(new THREE.OctahedronGeometry(0.010, 0));
  const coreMesh = new THREE.Mesh(coreGeo, materials.cyberCyanGlow);
  coreMesh.name = 'Freyja_Heart_Reactor_Core';
  coreMesh.position.set(0, -0.036, 0.104);

  breastplateGroup.add(
    leftUnderwire, rightUnderwire,
    leftNeonRim, rightNeonRim,
    breastplateMesh, coreMesh
  );
  return { breastplateMesh, breastplateGroup };
}

/**
 * Builds sleek cyberpunk audio comm headsets flush against the ears matching VALK-01.jpg.
 * Bộ đàm liên lạc tai nghe viễn tưởng ôm sát hai bên tai chuẩn phong cách Cyber-Valkyrie.
 */
function buildCyberEarComms(
  headGroup: THREE.Group,
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): void {
  const commsGroup = new THREE.Group();
  commsGroup.name = 'Freyja_CyberEarComms';

  const commGeo = registerGeo(new THREE.CylinderGeometry(0.016, 0.020, 0.016, 16));
  commGeo.rotateZ(Math.PI / 2);

  const ringGeo = registerGeo(new THREE.TorusGeometry(0.015, 0.0020, 6, 20));
  ringGeo.rotateY(Math.PI / 2);

  // Left ear comm (viewer's left: X = -0.138, Y = 0.015, Z = 0.010)
  const leftComm = new THREE.Mesh(commGeo, materials.armorSilver);
  leftComm.position.set(-0.138, 0.015, 0.010);
  const leftRing = new THREE.Mesh(ringGeo, materials.cyberCyanGlow);
  leftRing.position.set(-0.146, 0.015, 0.010);

  // Right ear comm (viewer's right: X = 0.138, Y = 0.015, Z = 0.010)
  const rightComm = new THREE.Mesh(commGeo, materials.armorSilver);
  rightComm.position.set(0.138, 0.015, 0.010);
  const rightRing = new THREE.Mesh(ringGeo, materials.cyberCyanGlow);
  rightRing.position.set(0.146, 0.015, 0.010);

  commsGroup.add(leftComm, leftRing, rightComm, rightRing);
  headGroup.add(commsGroup);
}

/**
 * Builds the signature Glowing Cyan Cyber Scouter HUD targeting eyepiece from official VALK-01 art.
 * Thiết bị kính ngắm mắt trái Scouter viễn tưởng phát sáng Neon Cyan đặc trưng của Freyja.
 */
function buildCyberScouter(
  headGroup: THREE.Group,
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): void {
  const scouterGroup = new THREE.Group();
  scouterGroup.name = 'Freyja_CyberScouter_HUD';
  // Positioned directly over character's left eye (viewer's right, X = 0.040, Y = 0.038, Z = 0.147)
  scouterGroup.position.set(0.034, 0.005, 0.125);

  // 1. Holographic HUD targeting ring
  const ringGeo = registerGeo(new THREE.TorusGeometry(0.020, 0.0016, 6, 24));
  const ringMesh = new THREE.Mesh(ringGeo, materials.cyberCyanGlow);
  scouterGroup.add(ringMesh);

  // 2. Tactical targeting brackets (Góc ngắm viễn tưởng công nghệ cao)
  const bracketGeo = registerGeo(new THREE.BoxGeometry(0.010, 0.0018, 0.0018));
  const topBracket = new THREE.Mesh(bracketGeo, materials.cyberCyanGlow);
  topBracket.position.set(0.015, 0.018, 0);
  const sideBracket = new THREE.Mesh(bracketGeo, materials.cyberCyanGlow);
  sideBracket.position.set(0.020, 0.013, 0);
  sideBracket.rotation.z = Math.PI / 2;
  scouterGroup.add(topBracket, sideBracket);

  headGroup.add(scouterGroup);
}

function buildAnimeHair(
  headGroup: THREE.Group,
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): { hairGroup: THREE.Group; ponytail: THREE.Group } {
  const hairGroup = new THREE.Group();
  hairGroup.name = 'Freyja_Hair';
  headGroup.add(hairGroup);

  // 1. Full Cranium Cap covering the top of the skull dome down to upper hairline (theta = 0.28 PI)
  const craniumCapGeo = registerGeo(
    new THREE.SphereGeometry(0.134, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.28)
  );
  craniumCapGeo.scale(0.96, 1.02, 1.04);
  const craniumCap = new THREE.Mesh(craniumCapGeo, materials.hair);
  craniumCap.position.set(0, 0.016, -0.008);
  const craniumCapOutline = createInvertedHullOutlineMesh(craniumCapGeo, { thickness: 0.0020 });
  craniumCap.add(craniumCapOutline);
  hairGroup.add(craniumCap);

  // 1b. Back & Nape Hair Shell (covers back of skull down to nape from theta = 0.28 PI to 0.80 PI)
  const napeHairGeo = registerGeo(
    new THREE.SphereGeometry(0.136, 32, 24, -Math.PI * 0.32, Math.PI * 1.64, Math.PI * 0.28, Math.PI * 0.52)
  );
  napeHairGeo.scale(0.96, 1.02, 1.04);
  const napeHairMesh = new THREE.Mesh(napeHairGeo, materials.hair);
  napeHairMesh.position.set(0, 0.016, -0.008);
  hairGroup.add(napeHairMesh);

  // Volumetric crown locks on top of skull
  const crownTuftConfigs = [
    { x: -0.030, y: 0.132, z: 0.01, rotX: 0.20, rotZ: 0.25, len: 0.095, w: 0.034 },
    { x: 0.030, y: 0.132, z: 0.01, rotX: 0.20, rotZ: -0.25, len: 0.095, w: 0.034 },
    { x: -0.060, y: 0.120, z: -0.01, rotX: 0.10, rotZ: 0.45, len: 0.110, w: 0.038 },
    { x: 0.060, y: 0.120, z: -0.01, rotX: 0.10, rotZ: -0.45, len: 0.110, w: 0.038 }
  ];

  crownTuftConfigs.forEach((ct) => {
    const tuftGeo = registerGeo(
      buildStylizedAnimeHairLockGeometry({
        length: ct.len,
        baseWidth: ct.w,
        midWidth: ct.w * 0.92,
        tipWidth: 0.003,
        thickness: 0.012,
        curveForward: -0.025,
        curveLateral: ct.rotZ * 0.030,
        steps: 8
      })
    );
    const tuftMesh = new THREE.Mesh(tuftGeo, materials.hair);
    tuftMesh.position.set(ct.x, ct.y, ct.z);
    tuftMesh.rotation.set(ct.rotX, 0, ct.rotZ);
    hairGroup.add(tuftMesh);
  });

  // 2. Long Flowing Anime Face-Framing Side Locks (Curve gently inward to frame cheeks and jawline)
  const sideLockConfigs = [
    // Inner face-framing locks (grazing cheeks and jawline closely)
    { xOff: -0.076, yOff: 0.072, zOff: 0.092, rotZ: 0.08, len: 0.32, w: 0.038, curveForward: 0.040, curveLateral: 0.020 },
    { xOff: 0.076, yOff: 0.072, zOff: 0.092, rotZ: -0.08, len: 0.32, w: 0.038, curveForward: 0.040, curveLateral: -0.020 },
    // Outer voluminous side locks (flowing down over shoulders)
    { xOff: -0.098, yOff: 0.066, zOff: 0.070, rotZ: 0.04, len: 0.38, w: 0.044, curveForward: 0.035, curveLateral: 0.014 },
    { xOff: 0.098, yOff: 0.066, zOff: 0.070, rotZ: -0.04, len: 0.38, w: 0.044, curveForward: 0.035, curveLateral: -0.014 }
  ];

  sideLockConfigs.forEach((cfg) => {
    const lockGeo = registerGeo(
      buildStylizedAnimeHairLockGeometry({
        length: cfg.len,
        baseWidth: cfg.w,
        midWidth: cfg.w * 0.90,
        tipWidth: 0.002,
        thickness: 0.008,
        curveForward: cfg.curveForward,
        curveLateral: cfg.curveLateral,
        steps: 10
      })
    );
    const lockMesh = new THREE.Mesh(lockGeo, materials.hair);
    lockMesh.position.set(cfg.xOff, cfg.yOff, cfg.zOff);
    lockMesh.rotation.z = cfg.rotZ;
    hairGroup.add(lockMesh);
  });

  // 3. Luxurious Layered Anime Fringe (Emanates from hairline at Y ≈ 0.095, cascading to brow level Y ≈ 0.045)
  const bangConfigs = [
    // Far-left temple curtain lock
    { x: -0.054, y: 0.090, z: 0.104, rotZ: 0.28, rotX: 0.14, len: 0.060, w: 0.038 },
    // Mid-left bang
    { x: -0.036, y: 0.094, z: 0.108, rotZ: 0.16, rotX: 0.12, len: 0.054, w: 0.036 },
    // Inner-left bang
    { x: -0.018, y: 0.096, z: 0.111, rotZ: 0.08, rotX: 0.10, len: 0.048, w: 0.034 },
    // Center-left wisp
    { x: -0.006, y: 0.097, z: 0.113, rotZ: 0.03, rotX: 0.08, len: 0.045, w: 0.030 },
    // Center-right wisp
    { x: 0.006, y: 0.097, z: 0.113, rotZ: -0.03, rotX: 0.08, len: 0.045, w: 0.030 },
    // Inner-right bang
    { x: 0.018, y: 0.096, z: 0.111, rotZ: -0.08, rotX: 0.10, len: 0.048, w: 0.034 },
    // Mid-right bang
    { x: 0.036, y: 0.094, z: 0.108, rotZ: -0.16, rotX: 0.12, len: 0.054, w: 0.036 },
    // Far-right temple curtain lock
    { x: 0.054, y: 0.090, z: 0.104, rotZ: -0.28, rotX: 0.14, len: 0.060, w: 0.038 }
  ];

  bangConfigs.forEach((b) => {
    const strandGeo = registerGeo(
      buildStylizedAnimeHairLockGeometry({
        length: b.len,
        baseWidth: b.w,
        midWidth: b.w * 0.90,
        tipWidth: 0.002,
        thickness: 0.006,
        curveForward: 0.020,
        curveLateral: b.rotZ * 0.018,
        steps: 10
      })
    );
    const strand = new THREE.Mesh(strandGeo, materials.hair);
    strand.position.set(b.x, b.y, b.z);
    strand.rotation.set(b.rotX, 0, b.rotZ);
    hairGroup.add(strand);
  });

  // Cute charismatic anime Ahoge (Bouncing hair antenna lock at crown)
  const ahogeGeo = registerGeo(
    buildStylizedAnimeHairLockGeometry({
      length: 0.085,
      baseWidth: 0.008,
      midWidth: 0.010,
      tipWidth: 0.002,
      thickness: 0.006,
      curveForward: 0.055,
      curveLateral: 0.030,
      steps: 8
    })
  );
  const ahogeMesh = new THREE.Mesh(ahogeGeo, materials.hair);
  ahogeMesh.position.set(0.01, 0.135, -0.01);
  ahogeMesh.rotation.set(0.45, 0.20, 0.15);
  hairGroup.add(ahogeMesh);

  // 4. Dramatic Billowing Fiery Mane (Signature VALK-01.jpg sweeping flame locks)
  // Voluminous locks flaring outward past shoulders with blazing flame-orange tips!
  const flaringManeConfigs = [
    // Left flare plume (viewer's right, dramatic upward & outward sweeping flame)
    { x: 0.10, y: 0.08, z: -0.06, rotX: -0.22, rotY: 0.35, rotZ: -0.68, len: 0.58, w: 0.085, curveForward: -0.16, curveLateral: 0.28 },
    { x: 0.12, y: 0.04, z: -0.07, rotX: -0.18, rotY: 0.40, rotZ: -0.52, len: 0.52, w: 0.078, curveForward: -0.14, curveLateral: 0.24 },
    { x: 0.08, y: 0.12, z: -0.05, rotX: -0.28, rotY: 0.30, rotZ: -0.80, len: 0.64, w: 0.088, curveForward: -0.20, curveLateral: 0.35 },
    // Right flare plume (viewer's left, outward sweeping flame locks)
    { x: -0.10, y: 0.08, z: -0.06, rotX: -0.22, rotY: -0.30, rotZ: 0.52, len: 0.52, w: 0.080, curveForward: -0.15, curveLateral: -0.20 },
    { x: -0.12, y: 0.04, z: -0.07, rotX: -0.18, rotY: -0.35, rotZ: 0.42, len: 0.48, w: 0.072, curveForward: -0.13, curveLateral: -0.18 },
    // Center back cascade
    { x: 0.00, y: 0.06, z: -0.10, rotX: -0.34, rotY: 0.00, rotZ: 0.00, len: 0.56, w: 0.085, curveForward: -0.18, curveLateral: 0.04 }
  ];

  flaringManeConfigs.forEach((mc) => {
    const maneGeo = registerGeo(
      buildStylizedAnimeHairLockGeometry({
        length: mc.len,
        baseWidth: mc.w,
        midWidth: mc.w * 1.10,
        tipWidth: 0.006,
        thickness: 0.030,
        curveForward: mc.curveForward,
        curveLateral: mc.curveLateral,
        steps: 12
      })
    );
    const maneMesh = new THREE.Mesh(maneGeo, materials.hair);
    maneMesh.position.set(mc.x, mc.y, mc.z);
    maneMesh.rotation.set(mc.rotX, mc.rotY, mc.rotZ);
    const maneOutline = createInvertedHullOutlineMesh(maneGeo, { thickness: 0.0020 });
    maneMesh.add(maneOutline);
    hairGroup.add(maneMesh);
  });

  // 5. Flowing Back Ponytail
  const ponytail = new THREE.Group();
  ponytail.name = 'Freyja_Ponytail';
  ponytail.position.set(0, 0.08, -0.14);
  headGroup.add(ponytail);

  const ptRibbonGeo = registerGeo(new THREE.TorusGeometry(0.036, 0.010, 8, 16));
  const ptRibbon = new THREE.Mesh(ptRibbonGeo, materials.armorSilver);
  ponytail.add(ptRibbon);

  const tailLocks = [
    { xOff: 0, rotX: -0.38, rotY: 0, len: 0.52, w: 0.080 },
    { xOff: -0.030, rotX: -0.42, rotY: -0.15, len: 0.46, w: 0.062 },
    { xOff: 0.030, rotX: -0.42, rotY: 0.15, len: 0.46, w: 0.062 },
    { xOff: -0.018, rotX: -0.48, rotY: -0.08, len: 0.40, w: 0.052 },
    { xOff: 0.018, rotX: -0.48, rotY: 0.08, len: 0.40, w: 0.052 }
  ];

  tailLocks.forEach((tl) => {
    const tailGeo = registerGeo(
      buildStylizedAnimeHairLockGeometry({
        length: tl.len,
        baseWidth: tl.w,
        midWidth: tl.w * 1.08,
        tipWidth: 0.008,
        thickness: 0.032,
        curveForward: -0.15,
        curveLateral: tl.xOff * 1.4,
        steps: 12
      })
    );
    const tailMesh = new THREE.Mesh(tailGeo, materials.hair);
    tailMesh.position.set(tl.xOff, 0, 0);
    tailMesh.rotation.set(tl.rotX, tl.rotY, 0);
    const tailOutline = createInvertedHullOutlineMesh(tailGeo, { thickness: 0.0022 });
    tailMesh.add(tailOutline);
    ponytail.add(tailMesh);
  });

  return { hairGroup, ponytail };
}

function buildArms(
  chestGroup: THREE.Group,
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): {
  leftArmGroup: THREE.Group;
  rightArmGroup: THREE.Group;
  leftForearmGroup: THREE.Group;
  rightForearmGroup: THREE.Group;
} {
  const upperArmGeo = registerGeo(
    buildUpperArmGeometry({
      shoulderRadius: 0.054,
      bicepRadius: 0.044,
      elbowRadius: 0.036
    }, 20)
  );

  const forearmGeo = registerGeo(
    buildForearmGeometry({
      elbowRadius: 0.036,
      forearmRadius: 0.040,
      wristRadius: 0.026
    }, 20)
  );

  const pauldronGeo = registerGeo(buildWingedPauldronGeometry());
  const vambraceGeo = registerGeo(new THREE.CylinderGeometry(0.034, 0.026, 0.14, 20));
  const wristCuffGeo = registerGeo(new THREE.TorusGeometry(0.027, 0.0028, 8, 24));
  const elbowCuffGeo = registerGeo(new THREE.TorusGeometry(0.035, 0.0028, 8, 24));
  const armVentGeo = registerGeo(new THREE.BoxGeometry(0.004, 0.12, 0.003));
  const pauldronTrimGeo = registerGeo(new THREE.TorusGeometry(0.046, 0.0032, 6, 20, Math.PI * 0.75));
  const pauldronVentGeo = registerGeo(new THREE.TorusGeometry(0.044, 0.0020, 6, 20, Math.PI * 0.55));
  const shoulderJointGeo = registerGeo(new THREE.SphereGeometry(0.052, 16, 12));
  const elbowJointGeo = registerGeo(new THREE.SphereGeometry(0.037, 16, 12));

  // 1. Left Arm (Shoulder socket at X = -0.142, Y = 0.08)
  const leftArmGroup = new THREE.Group();
  leftArmGroup.name = 'Freyja_LeftArm';
  leftArmGroup.position.set(-0.142, 0.08, 0);
  chestGroup.add(leftArmGroup);

  const leftShoulderJoint = new THREE.Mesh(shoulderJointGeo, materials.skin);
  const leftUpperMesh = new THREE.Mesh(upperArmGeo, materials.skin);
  leftArmGroup.add(leftShoulderJoint, leftUpperMesh);

  // Left Winged Pauldron (Hugging deltoid with high-tech Valkyrie armor)
  const leftPauldron = new THREE.Mesh(pauldronGeo, materials.armorSilver);
  leftPauldron.scale.set(1.05, 0.95, 1.05);
  leftPauldron.position.set(-0.010, 0.006, 0);
  leftPauldron.rotation.set(0, 0, -0.18);
  const leftPauldronOutline = createInvertedHullOutlineMesh(pauldronGeo, { thickness: 0.0016 });
  leftPauldron.add(leftPauldronOutline);

  const leftPTrim = new THREE.Mesh(pauldronTrimGeo, materials.armorGold);
  leftPTrim.position.set(-0.010, 0.010, 0);
  leftPTrim.rotation.set(Math.PI * 0.45, 0, -0.18);

  const leftPVent = new THREE.Mesh(pauldronVentGeo, materials.cyberCyanGlow);
  leftPVent.position.set(-0.010, 0.013, 0.008);
  leftPVent.rotation.set(Math.PI * 0.45, 0, -0.18);
  leftArmGroup.add(leftPauldron, leftPTrim, leftPVent);

  // Left Forearm Group (Pivoting at elbow Y = -0.26)
  const leftForearmGroup = new THREE.Group();
  leftForearmGroup.name = 'Freyja_LeftForearm';
  leftForearmGroup.position.set(0, -0.26, 0);
  leftArmGroup.add(leftForearmGroup);

  const leftElbowJoint = new THREE.Mesh(elbowJointGeo, materials.skin);
  const leftForearmMesh = new THREE.Mesh(forearmGeo, materials.skin);
  leftForearmGroup.add(leftElbowJoint, leftForearmMesh);

  const leftVambrace = new THREE.Mesh(vambraceGeo, materials.armorCrimson);
  leftVambrace.position.set(0, -0.12, 0);

  const leftWristCuff = new THREE.Mesh(wristCuffGeo, materials.armorGold);
  leftWristCuff.position.set(0, -0.20, 0);
  leftWristCuff.rotation.x = Math.PI / 2;

  const leftElbowCuff = new THREE.Mesh(elbowCuffGeo, materials.armorGold);
  leftElbowCuff.position.set(0, -0.02, 0);
  leftElbowCuff.rotation.x = Math.PI / 2;

  const leftArmVent = new THREE.Mesh(armVentGeo, materials.cyberCyanGlow);
  leftArmVent.position.set(-0.034, -0.12, 0);
  leftForearmGroup.add(leftVambrace, leftWristCuff, leftElbowCuff, leftArmVent);

  const leftHand = buildArticulatedAnimeHand(false, materials.skin);
  leftHand.position.set(0, -0.25, 0);
  leftForearmGroup.add(leftHand);

  // 2. Right Arm (Shoulder socket at X = 0.142, Y = 0.08)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.name = 'Freyja_RightArm';
  rightArmGroup.position.set(0.142, 0.08, 0);
  chestGroup.add(rightArmGroup);

  const rightShoulderJoint = new THREE.Mesh(shoulderJointGeo, materials.skin);
  const rightUpperMesh = new THREE.Mesh(upperArmGeo, materials.skin);
  rightArmGroup.add(rightShoulderJoint, rightUpperMesh);

  // Right Winged Pauldron
  const rightPauldron = new THREE.Mesh(pauldronGeo, materials.armorSilver);
  rightPauldron.scale.set(1.05, 0.95, 1.05);
  rightPauldron.position.set(0.010, 0.006, 0);
  rightPauldron.rotation.set(0, 0, 0.18);
  const rightPauldronOutline = createInvertedHullOutlineMesh(pauldronGeo, { thickness: 0.0016 });
  rightPauldron.add(rightPauldronOutline);

  const rightPTrim = new THREE.Mesh(pauldronTrimGeo, materials.armorGold);
  rightPTrim.position.set(0.010, 0.010, 0);
  rightPTrim.rotation.set(Math.PI * 0.45, 0, 0.18);

  const rightPVent = new THREE.Mesh(pauldronVentGeo, materials.cyberCyanGlow);
  rightPVent.position.set(0.010, 0.013, 0.008);
  rightPVent.rotation.set(Math.PI * 0.45, 0, 0.18);
  rightArmGroup.add(rightPauldron, rightPTrim, rightPVent);

  // Right Forearm Group (Pivoting at elbow Y = -0.26)
  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.name = 'Freyja_RightForearm';
  rightForearmGroup.position.set(0, -0.26, 0);
  rightArmGroup.add(rightForearmGroup);

  const rightElbowJoint = new THREE.Mesh(elbowJointGeo, materials.skin);
  const rightForearmMesh = new THREE.Mesh(forearmGeo, materials.skin);
  rightForearmGroup.add(rightElbowJoint, rightForearmMesh);

  const rightVambrace = new THREE.Mesh(vambraceGeo, materials.armorCrimson);
  rightVambrace.position.set(0, -0.12, 0);

  const rightWristCuff = new THREE.Mesh(wristCuffGeo, materials.armorGold);
  rightWristCuff.position.set(0, -0.20, 0);
  rightWristCuff.rotation.x = Math.PI / 2;

  const rightElbowCuff = new THREE.Mesh(elbowCuffGeo, materials.armorGold);
  rightElbowCuff.position.set(0, -0.02, 0);
  rightElbowCuff.rotation.x = Math.PI / 2;

  const rightArmVent = new THREE.Mesh(armVentGeo, materials.cyberCyanGlow);
  rightArmVent.position.set(0.034, -0.12, 0);
  rightForearmGroup.add(rightVambrace, rightWristCuff, rightElbowCuff, rightArmVent);

  const rightHand = buildArticulatedAnimeHand(true, materials.skin);
  rightHand.position.set(0, -0.25, 0);
  rightForearmGroup.add(rightHand);

  return { leftArmGroup, rightArmGroup, leftForearmGroup, rightForearmGroup };
}

function buildLegs(
  hipsGroup: THREE.Group,
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): { leftLegGroup: THREE.Group; rightLegGroup: THREE.Group } {
  // Upper bare thigh skin (Grade-S Zettai Ryouiki bare porcelain skin)
  const upperThighGeo = registerGeo(
    buildOrganicLegGeometry({
      length: 0.84,
      thighUpperRadius: 0.116,
      thighMidRadius: 0.098,
      kneeRadius: 0.062,
      calfMaxRadius: 0.074,
      ankleRadius: 0.038,
      part: 'upperThigh'
    }, 32)
  );

  // Thigh-high 30-denier sheer stockings from ankle to stocking cuff
  const stockingGeo = registerGeo(
    buildOrganicLegGeometry({
      length: 0.84,
      thighUpperRadius: 0.116,
      thighMidRadius: 0.098,
      kneeRadius: 0.062,
      calfMaxRadius: 0.074,
      ankleRadius: 0.038,
      part: 'stocking'
    }, 32)
  );

  const kneePlateGeo = registerGeo(new THREE.OctahedronGeometry(0.038, 0));
  kneePlateGeo.scale(1.1, 1.35, 0.55);

  const kneeGemGeo = registerGeo(new THREE.OctahedronGeometry(0.014, 0));
  kneeGemGeo.scale(1.0, 1.3, 0.6);

  const sabatonGeo = registerGeo(buildAnimeSabatonGeometry());
  const heelGeo = registerGeo(new THREE.CylinderGeometry(0.006, 0.003, 0.082, 8));
  const thighBandGeo = registerGeo(new THREE.TorusGeometry(0.096, 0.0055, 8, 28));

  // Sensual garter strap: connects garter ring at Y = -0.20 up to pelvis at Y = 0
  const garterStrapGeo = registerGeo(new THREE.BoxGeometry(0.010, 0.19, 0.003));
  const garterClipGeo = registerGeo(new THREE.BoxGeometry(0.016, 0.012, 0.006));

  // Left Leg (Positioned flush with slender pelvis socket at X = -0.068)
  const leftLegGroup = new THREE.Group();
  leftLegGroup.name = 'Freyja_LeftLeg';
  leftLegGroup.position.set(-0.068, 0, 0);
  hipsGroup.add(leftLegGroup);

  // 1. Bare Porcelain Upper Thigh Skin (Grade-S Zettai Ryouiki)
  const leftUpperThighMesh = new THREE.Mesh(upperThighGeo, materials.skin);
  leftLegGroup.add(leftUpperThighMesh);

  // 2. 30-Denier Sheer Black Stocking
  const leftStockingMesh = new THREE.Mesh(stockingGeo, materials.stockingsDark);
  leftLegGroup.add(leftStockingMesh);

  // 3. Zettai Ryouiki gold stocking cuff with glowing cyan conduit
  const leftThighBand = new THREE.Mesh(thighBandGeo, materials.armorGold);
  leftThighBand.position.set(0, -0.20, 0);
  leftThighBand.rotation.x = Math.PI / 2;

  const garterNeonGeo = registerGeo(new THREE.TorusGeometry(0.091, 0.0022, 6, 28));
  const leftGarterNeon = new THREE.Mesh(garterNeonGeo, materials.cyberCyanGlow);
  leftGarterNeon.position.set(0, -0.20, 0);
  leftGarterNeon.rotation.x = Math.PI / 2;
  leftLegGroup.add(leftThighBand, leftGarterNeon);

  // 4. Sensual Front & Side Cyber Garter Straps with Gold Clips
  const leftGarterFront = new THREE.Mesh(garterStrapGeo, materials.bodysuitDark);
  leftGarterFront.position.set(0.018, -0.098, 0.088);
  leftGarterFront.rotation.y = 0.08;
  const leftClipFront = new THREE.Mesh(garterClipGeo, materials.armorGold);
  leftClipFront.position.set(0.018, -0.195, 0.090);

  const leftGarterSide = new THREE.Mesh(garterStrapGeo, materials.bodysuitDark);
  leftGarterSide.position.set(-0.086, -0.098, 0.01);
  leftGarterSide.rotation.y = Math.PI / 2;
  const leftClipSide = new THREE.Mesh(garterClipGeo, materials.armorGold);
  leftClipSide.position.set(-0.088, -0.195, 0.01);
  leftClipSide.rotation.y = Math.PI / 2;

  leftLegGroup.add(leftGarterFront, leftClipFront, leftGarterSide, leftClipSide);

  // Faceted Diamond Knee Armor with glowing cyan core
  const leftKnee = new THREE.Mesh(kneePlateGeo, materials.armorSilver);
  leftKnee.position.set(0, -0.42, 0.060);
  const leftKneeOutline = createInvertedHullOutlineMesh(kneePlateGeo, { thickness: 0.0016 });
  leftKnee.add(leftKneeOutline);

  const leftKneeGem = new THREE.Mesh(kneeGemGeo, materials.cyberCyanGlow);
  leftKneeGem.position.set(0, -0.42, 0.075);
  leftLegGroup.add(leftKnee, leftKneeGem);

  // Streamlined High-Heel Sabaton Boot
  const leftBoot = new THREE.Mesh(sabatonGeo, materials.armorSilver);
  leftBoot.position.set(0, -0.82, 0.02);
  const leftBootOutline = createInvertedHullOutlineMesh(sabatonGeo, { thickness: 0.0018 });
  leftBoot.add(leftBootOutline);

  const leftHeel = new THREE.Mesh(heelGeo, materials.armorGold);
  leftHeel.position.set(0, -0.865, -0.045);
  leftLegGroup.add(leftBoot, leftHeel);

  // Right Leg (Positioned flush with pelvis socket at X = 0.068)
  const rightLegGroup = new THREE.Group();
  rightLegGroup.name = 'Freyja_RightLeg';
  rightLegGroup.position.set(0.068, 0, 0);
  hipsGroup.add(rightLegGroup);

  // 1. Bare Porcelain Upper Thigh Skin (Grade-S Zettai Ryouiki)
  const rightUpperThighMesh = new THREE.Mesh(upperThighGeo, materials.skin);
  rightLegGroup.add(rightUpperThighMesh);

  // 2. 30-Denier Sheer Black Stocking
  const rightStockingMesh = new THREE.Mesh(stockingGeo, materials.stockingsDark);
  rightLegGroup.add(rightStockingMesh);

  // 3. Zettai Ryouiki gold stocking cuff with glowing cyan conduit
  const rightThighBand = new THREE.Mesh(thighBandGeo, materials.armorGold);
  rightThighBand.position.set(0, -0.20, 0);
  rightThighBand.rotation.x = Math.PI / 2;

  const rightGarterNeon = new THREE.Mesh(garterNeonGeo, materials.cyberCyanGlow);
  rightGarterNeon.position.set(0, -0.20, 0);
  rightGarterNeon.rotation.x = Math.PI / 2;
  rightLegGroup.add(rightThighBand, rightGarterNeon);

  // 4. Sensual Front & Side Cyber Garter Straps with Gold Clips
  const rightGarterFront = new THREE.Mesh(garterStrapGeo, materials.bodysuitDark);
  rightGarterFront.position.set(-0.018, -0.098, 0.088);
  rightGarterFront.rotation.y = -0.08;
  const rightClipFront = new THREE.Mesh(garterClipGeo, materials.armorGold);
  rightClipFront.position.set(-0.018, -0.195, 0.090);

  const rightGarterSide = new THREE.Mesh(garterStrapGeo, materials.bodysuitDark);
  rightGarterSide.position.set(0.086, -0.098, 0.01);
  rightGarterSide.rotation.y = -Math.PI / 2;
  const rightClipSide = new THREE.Mesh(garterClipGeo, materials.armorGold);
  rightClipSide.position.set(0.088, -0.195, 0.01);
  rightClipSide.rotation.y = -Math.PI / 2;

  rightLegGroup.add(rightGarterFront, rightClipFront, rightGarterSide, rightClipSide);

  const rightKnee = new THREE.Mesh(kneePlateGeo, materials.armorSilver);
  rightKnee.position.set(0, -0.42, 0.060);
  const rightKneeOutline = createInvertedHullOutlineMesh(kneePlateGeo, { thickness: 0.0016 });
  rightKnee.add(rightKneeOutline);

  const rightKneeGem = new THREE.Mesh(kneeGemGeo, materials.cyberCyanGlow);
  rightKneeGem.position.set(0, -0.42, 0.075);
  rightLegGroup.add(rightKnee, rightKneeGem);

  const rightBoot = new THREE.Mesh(sabatonGeo, materials.armorSilver);
  rightBoot.position.set(0, -0.82, 0.02);
  const rightBootOutline = createInvertedHullOutlineMesh(sabatonGeo, { thickness: 0.0018 });
  rightBoot.add(rightBootOutline);

  const rightHeel = new THREE.Mesh(heelGeo, materials.armorGold);
  rightHeel.position.set(0, -0.865, -0.045);
  rightLegGroup.add(rightBoot, rightHeel);

  return { leftLegGroup, rightLegGroup };
}

function buildGreatsword(
  materials: FreyjaMaterials,
  registerGeo: <T extends THREE.BufferGeometry>(geo: T) => T
): { greatswordGroup: THREE.Group; swordPlasmaGlowMesh: THREE.Mesh } {
  const greatswordGroup = new THREE.Group();
  greatswordGroup.name = 'Freyja_Greatsword';

  // Hilt & Pommel (Gripped in right hand)
  const hiltGeo = registerGeo(new THREE.CylinderGeometry(0.016, 0.016, 0.42, 12));
  const hilt = new THREE.Mesh(hiltGeo, materials.swordCore);
  greatswordGroup.add(hilt);

  const pommelGeo = registerGeo(new THREE.SphereGeometry(0.030, 12, 10));
  const pommel = new THREE.Mesh(pommelGeo, materials.armorGold);
  pommel.position.y = -0.22;
  greatswordGroup.add(pommel);

  // Ornate Valkyrie Wing Crossguard
  const guardShape = new THREE.Shape();
  guardShape.moveTo(-0.16, 0.05);
  guardShape.lineTo(-0.05, 0.02);
  guardShape.lineTo(0.05, 0.02);
  guardShape.lineTo(0.16, 0.05);
  guardShape.lineTo(0.13, -0.035);
  guardShape.lineTo(0, -0.018);
  guardShape.lineTo(-0.13, -0.035);
  guardShape.closePath();

  const guardGeo = registerGeo(new THREE.ExtrudeGeometry(guardShape, { depth: 0.040, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005 }));
  guardGeo.center();
  const crossguard = new THREE.Mesh(guardGeo, materials.armorSilver);
  crossguard.position.y = 0.21;
  const guardOutline = createInvertedHullOutlineMesh(guardGeo, { thickness: 0.0022 });
  crossguard.add(guardOutline);
  greatswordGroup.add(crossguard);

  const coreEyeGeo = registerGeo(new THREE.OctahedronGeometry(0.022, 0));
  const coreEye = new THREE.Mesh(coreEyeGeo, materials.cyberCyanGlow);
  coreEye.position.set(0, 0.21, 0.030);
  greatswordGroup.add(coreEye);

  // Circular Glowing Cyan Power Reactor Rings on crossguard matching VALK-01.jpg
  const coreRingGeo = registerGeo(new THREE.TorusGeometry(0.030, 0.0032, 6, 24));
  const coreRingFront = new THREE.Mesh(coreRingGeo, materials.cyberCyanGlow);
  coreRingFront.position.set(0, 0.21, 0.024);
  const coreRingBack = new THREE.Mesh(coreRingGeo, materials.cyberCyanGlow);
  coreRingBack.position.set(0, 0.21, -0.024);
  greatswordGroup.add(coreRingFront, coreRingBack);

  // Futuristic Tapered Blade Core (Length 1.35m)
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(-0.075, 0);
  bladeShape.lineTo(-0.070, 1.10);
  bladeShape.lineTo(0, 1.35); // Pointed apex
  bladeShape.lineTo(0.070, 1.10);
  bladeShape.lineTo(0.075, 0);
  bladeShape.closePath();

  const bladeCoreGeo = registerGeo(new THREE.ExtrudeGeometry(bladeShape, { depth: 0.026, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005 }));
  bladeCoreGeo.center();
  const bladeCore = new THREE.Mesh(bladeCoreGeo, materials.swordCore);
  bladeCore.position.y = 0.90;
  const bladeCoreOutline = createInvertedHullOutlineMesh(bladeCoreGeo, { thickness: 0.0022 });
  bladeCore.add(bladeCoreOutline);
  greatswordGroup.add(bladeCore);

  // Central Laser Power Conduit Channel running down the blade core
  const conduitGeo = registerGeo(new THREE.BoxGeometry(0.010, 1.15, 0.030));
  const conduit = new THREE.Mesh(conduitGeo, materials.cyberCyanGlow);
  conduit.position.set(0, 0.88, 0);
  greatswordGroup.add(conduit);

  // Dual Razor-Sharp Plasma Cutting Glow Edges (Leaves dark titanium core & cyan conduit visible)
  const leftPlasmaShape = new THREE.Shape();
  leftPlasmaShape.moveTo(-0.072, 0);
  leftPlasmaShape.lineTo(-0.092, 0);
  leftPlasmaShape.lineTo(-0.086, 1.10);
  leftPlasmaShape.lineTo(0, 1.37);
  leftPlasmaShape.lineTo(0, 1.34);
  leftPlasmaShape.lineTo(-0.068, 1.08);
  leftPlasmaShape.closePath();

  const rightPlasmaShape = new THREE.Shape();
  rightPlasmaShape.moveTo(0.072, 0);
  rightPlasmaShape.lineTo(0.092, 0);
  rightPlasmaShape.lineTo(0.086, 1.10);
  rightPlasmaShape.lineTo(0, 1.37);
  rightPlasmaShape.lineTo(0, 1.34);
  rightPlasmaShape.lineTo(0.068, 1.08);
  rightPlasmaShape.closePath();

  const edgeGeoLeft = registerGeo(new THREE.ExtrudeGeometry(leftPlasmaShape, { depth: 0.022, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003 }));
  edgeGeoLeft.center();
  const leftEdgeMesh = new THREE.Mesh(edgeGeoLeft, materials.swordPlasmaGlow);
  leftEdgeMesh.position.set(-0.046, 0.90, 0);
  greatswordGroup.add(leftEdgeMesh);

  const edgeGeoRight = registerGeo(new THREE.ExtrudeGeometry(rightPlasmaShape, { depth: 0.022, bevelEnabled: true, bevelSize: 0.003, bevelThickness: 0.003 }));
  edgeGeoRight.center();
  const rightEdgeMesh = new THREE.Mesh(edgeGeoRight, materials.swordPlasmaGlow);
  rightEdgeMesh.position.set(0.046, 0.90, 0);
  greatswordGroup.add(rightEdgeMesh);

  return { greatswordGroup, swordPlasmaGlowMesh: leftEdgeMesh };
}
