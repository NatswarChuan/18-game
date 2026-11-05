import * as THREE from 'three';
import { MistMaterialBundle } from './mist-materials';

export interface MistMeshParts {
  rootGroup: THREE.Group;
  headGroup: THREE.Group;
  hairGroup: THREE.Group;
  bustGroup: THREE.Group;
  wingsGroup: THREE.Group;
  leftWing: THREE.Group;
  rightWing: THREE.Group;
  scepterGroup: THREE.Group;
  scepterCoreMesh: THREE.Mesh;
  skirtGroup: THREE.Group;
  tier1Group: THREE.Group;
  tier2Group: THREE.Group;
  tier3Group: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
}

/**
 * Builds the complete 3D humanoid mesh for VALK-06: Mist (Holy Saint / Support).
 * Dựng toàn bộ hình khối 3D cho Mist:
 * - Chiều cao 1.68m, Cúp ngực H (0.42m) đồ sộ nhất dàn Neo-Valhalla.
 * - Khăn trùm đầu nữ tu công nghệ tương lai (Cyber-Nun Veil).
 * - Đôi cánh ánh sáng thiên thần (Angelic Light Wings) 8 lưỡi quang vũ.
 * - Quyền trượng Nano Thánh Quang (Holy Nano-Scepter) 1.55m với lõi sao xoay.
 * - Trang phục nữ tu 3 tầng rách giáp (Tier 1-3).
 */
export function buildMistGeometry(mats: MistMaterialBundle): MistMeshParts {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'Valkyrie_06_Mist_Root';

  // Nhóm phân cấp theo Tier rách giáp
  const tier1Group = new THREE.Group();
  const tier2Group = new THREE.Group();
  const tier3Group = new THREE.Group();
  tier2Group.visible = false;
  tier3Group.visible = false;
  rootGroup.add(tier1Group, tier2Group, tier3Group);

  // ==========================================
  // 1. THÂN THỂ CỐT LÕI (CORE TORSO) - 1.68m
  // ==========================================
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.90;
  rootGroup.add(torsoGroup);

  // Khung xương chậu & Hông (Hips - 0.38m)
  const hipsGeo = new THREE.CylinderGeometry(0.19, 0.22, 0.24, 20);
  const hipsMesh = new THREE.Mesh(hipsGeo, mats.skinMat);
  hipsMesh.position.y = -0.02;
  torsoGroup.add(hipsMesh);

  // Đai quần lót lụa trắng (Tier 1 & 2)
  const undiesGeo = new THREE.CylinderGeometry(0.192, 0.222, 0.18, 20);
  const undiesMesh = new THREE.Mesh(undiesGeo, mats.habitWhiteMat);
  undiesMesh.position.y = -0.03;
  tier1Group.add(undiesMesh);

  // Eo thon con kiến (Waist - 0.20m)
  const waistGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.18, 20);
  const waistMesh = new THREE.Mesh(waistGeo, mats.skinMat);
  waistMesh.position.y = 0.16;
  torsoGroup.add(waistMesh);

  // Áo bó eo nữ tu (Habit Corset Waistband)
  const corsetGeo = new THREE.CylinderGeometry(0.145, 0.185, 0.16, 20);
  const corsetMesh = new THREE.Mesh(corsetGeo, mats.habitWhiteMat);
  corsetMesh.position.y = 0.16;
  tier1Group.add(corsetMesh);

  // Viền vàng kim ôm eo
  const waistGoldGeo = new THREE.TorusGeometry(0.16, 0.012, 12, 32);
  const waistGoldMesh = new THREE.Mesh(waistGoldGeo, mats.goldTrimMat);
  waistGoldMesh.rotation.x = Math.PI / 2;
  waistGoldMesh.position.y = 0.15;
  tier1Group.add(waistGoldMesh);

  // ==========================================
  // 2. VÒNG 1 CÚP H ĐỒ SỘ (0.42m - BUST CUP H)
  // ==========================================
  const bustGroup = new THREE.Group();
  bustGroup.position.set(0, 0.33, 0.06);
  torsoGroup.add(bustGroup);

  // Ngực trái Cup H (Left Breast - Cực kỳ căng tròn và đồ sộ)
  const leftBreastGeo = new THREE.SphereGeometry(0.125, 24, 20);
  leftBreastGeo.scale(1.0, 1.05, 1.38);
  const leftBreastMesh = new THREE.Mesh(leftBreastGeo, mats.skinMat);
  leftBreastMesh.position.set(0.098, 0, 0.07);
  leftBreastMesh.rotation.set(-0.12, 0.14, -0.06);
  bustGroup.add(leftBreastMesh);

  // Ngực phải Cup H (Right Breast)
  const rightBreastGeo = new THREE.SphereGeometry(0.125, 24, 20);
  rightBreastGeo.scale(1.0, 1.05, 1.38);
  const rightBreastMesh = new THREE.Mesh(rightBreastGeo, mats.skinMat);
  rightBreastMesh.position.set(-0.098, 0, 0.07);
  rightBreastMesh.rotation.set(-0.12, -0.14, 0.06);
  bustGroup.add(rightBreastMesh);

  // Yếm ngực áo nữ tu Tier 1 (Che trọn vẹn nhưng ôm sát tôn đường cong Cup H)
  const habitBustGeo = new THREE.SphereGeometry(0.13, 24, 20);
  habitBustGeo.scale(1.02, 1.07, 1.4);
  const habitBustLeft = new THREE.Mesh(habitBustGeo, mats.habitWhiteMat);
  habitBustLeft.position.set(0.098, 0, 0.07);
  habitBustLeft.rotation.set(-0.12, 0.14, -0.06);
  tier1Group.add(habitBustLeft);

  const habitBustRight = new THREE.Mesh(habitBustGeo, mats.habitWhiteMat);
  habitBustRight.position.set(-0.098, 0, 0.07);
  habitBustRight.rotation.set(-0.12, -0.14, 0.06);
  tier1Group.add(habitBustRight);

  // Biểu tượng Thánh Giá Vàng rủ giữa khe ngực (Holy Gold Cross Pendant)
  const crossGroup = new THREE.Group();
  crossGroup.position.set(0, -0.02, 0.17);
  const crossVGeo = new THREE.BoxGeometry(0.016, 0.08, 0.012);
  const crossHGeo = new THREE.BoxGeometry(0.06, 0.016, 0.012);
  const crossVMesh = new THREE.Mesh(crossVGeo, mats.goldTrimMat);
  const crossHMesh = new THREE.Mesh(crossHGeo, mats.goldTrimMat);
  crossHMesh.position.y = 0.015;
  crossGroup.add(crossVMesh, crossHMesh);

  const crossGemGeo = new THREE.SphereGeometry(0.014, 12, 12);
  const crossGemMesh = new THREE.Mesh(crossGemGeo, mats.cyanGemMat);
  crossGemMesh.position.set(0, 0.015, 0.008);
  crossGroup.add(crossGemMesh);
  bustGroup.add(crossGroup);

  // Tier 2: Yếm ngực nứt vỡ, lộ khe ngực Cup H sâu thẳm
  const tornBustGeo = new THREE.SphereGeometry(0.131, 20, 16);
  tornBustGeo.scale(0.85, 0.9, 1.41);
  const tornBustLeft = new THREE.Mesh(tornBustGeo, mats.habitWhiteMat);
  tornBustLeft.position.set(0.115, -0.02, 0.07);
  tier2Group.add(tornBustLeft);

  const tornBustRight = new THREE.Mesh(tornBustGeo, mats.habitWhiteMat);
  tornBustRight.position.set(-0.115, -0.02, 0.07);
  tier2Group.add(tornBustRight);

  // Tier 3: Dải ruy băng thánh mỏng manh che hờ hững nhũ hoa Cup H (Climax Extreme 18+)
  const ribbonGeo = new THREE.BoxGeometry(0.24, 0.035, 0.01);
  const ribbonMesh = new THREE.Mesh(ribbonGeo, mats.lingerieMat);
  ribbonMesh.position.set(0, 0.01, 0.185);
  tier3Group.add(ribbonMesh);

  const crossRibbonV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.01), mats.lingerieMat);
  crossRibbonV.position.set(0.1, 0, 0.185);
  const crossRibbonV2 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.01), mats.lingerieMat);
  crossRibbonV2.position.set(-0.1, 0, 0.185);
  tier3Group.add(crossRibbonV, crossRibbonV2);

  // ==========================================
  // 3. TÀ VÁY ÁO NỮ TU (HOLY HABIT SKIRT)
  // ==========================================
  const skirtGroup = new THREE.Group();
  skirtGroup.position.set(0, -0.05, 0);
  torsoGroup.add(skirtGroup);

  // Tà váy dài trắng viền vàng xòe nhẹ đến bắp chân (Tier 1)
  const skirtGeo = new THREE.CylinderGeometry(0.20, 0.38, 0.62, 24, 1, true);
  const skirtMesh = new THREE.Mesh(skirtGeo, mats.habitWhiteMat);
  skirtMesh.position.y = -0.31;
  tier1Group.add(skirtMesh);

  // Viền vàng chân váy
  const skirtHemGeo = new THREE.TorusGeometry(0.38, 0.015, 12, 32);
  const skirtHemMesh = new THREE.Mesh(skirtHemGeo, mats.goldTrimMat);
  skirtHemMesh.rotation.x = Math.PI / 2;
  skirtHemMesh.position.y = -0.62;
  tier1Group.add(skirtHemMesh);

  // Tier 2: Tà váy rách tả tơi để lộ trọn vẹn cặp đùi trắng nõn và vớ lụa
  const tornSkirtGeo = new THREE.CylinderGeometry(0.20, 0.32, 0.32, 18, 1, true);
  const tornSkirtMesh = new THREE.Mesh(tornSkirtGeo, mats.habitWhiteMat);
  tornSkirtMesh.position.y = -0.16;
  tier2Group.add(tornSkirtMesh);

  // ==========================================
  // 4. ĐẦU, MẶT, TÓC & KHĂN TRÙM TU SĨ (HEAD & VEIL)
  // ==========================================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.58, 0);
  torsoGroup.add(headGroup);

  // Cổ trắng nõn nà
  const neckGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.11, 16);
  const neckMesh = new THREE.Mesh(neckGeo, mats.skinMat);
  neckMesh.position.y = -0.04;
  headGroup.add(neckMesh);

  // Khối đầu tròn
  const headGeo = new THREE.SphereGeometry(0.128, 24, 20);
  const headMesh = new THREE.Mesh(headGeo, mats.skinMat);
  headGroup.add(headMesh);

  // Mặt Anime 3D
  const facePlaneGeo = new THREE.PlaneGeometry(0.21, 0.23);
  const faceMesh = new THREE.Mesh(facePlaneGeo, mats.faceMat);
  faceMesh.position.set(0, -0.01, 0.126);
  headGroup.add(faceMesh);

  // Mái tóc xanh ngọc bích dịu dàng (Aquamarine / Mint Hair)
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Tóc mái trước che trán tự nhiên
  const bangsGeo = new THREE.SphereGeometry(0.134, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.42);
  const bangsMesh = new THREE.Mesh(bangsGeo, mats.hairMat);
  bangsMesh.rotation.x = 0.28;
  hairGroup.add(bangsMesh);

  // Lọn tóc mai hai bên má
  const sidelockGeo = new THREE.CylinderGeometry(0.02, 0.008, 0.36, 12);
  const leftSidelock = new THREE.Mesh(sidelockGeo, mats.hairMat);
  leftSidelock.position.set(0.13, -0.12, 0.06);
  leftSidelock.rotation.z = -0.12;

  const rightSidelock = new THREE.Mesh(sidelockGeo, mats.hairMat);
  rightSidelock.position.set(-0.13, -0.12, 0.06);
  rightSidelock.rotation.z = 0.12;
  hairGroup.add(leftSidelock, rightSidelock);

  // Tóc dài buông xõa sau lưng đến thắt lưng (Long flowing hair)
  const backHairGeo = new THREE.CylinderGeometry(0.11, 0.18, 0.65, 16);
  const backHairMesh = new THREE.Mesh(backHairGeo, mats.hairMat);
  backHairMesh.position.set(0, -0.28, -0.08);
  hairGroup.add(backHairMesh);

  // Khăn trùm đầu nữ tu công nghệ (Cyber-Nun Veil - Tier 1 & 2)
  const veilGroup = new THREE.Group();
  headGroup.add(veilGroup);

  // Phần mũ trùm trên đỉnh đầu
  const veilCapGeo = new THREE.SphereGeometry(0.142, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.65);
  const veilCapMesh = new THREE.Mesh(veilCapGeo, mats.veilMat);
  veilGroup.add(veilCapMesh);

  // Tà khăn rủ hai bên vai và sau lưng
  const veilDrapeGeo = new THREE.CylinderGeometry(0.15, 0.28, 0.68, 20, 1, true);
  const veilDrapeMesh = new THREE.Mesh(veilDrapeGeo, mats.veilMat);
  veilDrapeMesh.position.set(0, -0.32, -0.04);
  veilGroup.add(veilDrapeMesh);

  // Viền vàng kim vòng cung quanh khăn trùm
  const veilTrimGeo = new THREE.TorusGeometry(0.144, 0.012, 12, 32);
  const veilTrimMesh = new THREE.Mesh(veilTrimGeo, mats.goldTrimMat);
  veilTrimMesh.rotation.x = Math.PI / 2.3;
  veilTrimMesh.position.set(0, 0.03, 0.02);
  veilGroup.add(veilTrimMesh);

  tier1Group.add(veilGroup);

  // ==========================================
  // 5. ĐÔI CÁNH THIÊN THẦN ÁNH SÁNG (ANGELIC WINGS)
  // ==========================================
  const wingsGroup = new THREE.Group();
  wingsGroup.position.set(0, 0.32, -0.13);
  torsoGroup.add(wingsGroup);

  const leftWing = new THREE.Group();
  const rightWing = new THREE.Group();
  wingsGroup.add(leftWing, rightWing);

  // Khớp nối cánh Cyber-Socket đính ngọc vàng
  const socketGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 16);
  socketGeo.rotateZ(Math.PI / 2);
  const leftSocket = new THREE.Mesh(socketGeo, mats.goldTrimMat);
  leftSocket.position.set(0.08, 0, 0);
  const rightSocket = new THREE.Mesh(socketGeo, mats.goldTrimMat);
  rightSocket.position.set(-0.08, 0, 0);
  wingsGroup.add(leftSocket, rightSocket);

  // Hàm tạo lông vũ quang năng (Light Feather Blade)
  const createLightFeather = (length: number, width: number, angleZ: number, offsetX: number, offsetY: number): THREE.Mesh => {
    const featherGeo = new THREE.ConeGeometry(width, length, 12);
    featherGeo.scale(1.0, 1.0, 0.15); // Dẹp mỏng như lưỡi gươm ánh sáng
    const featherMesh = new THREE.Mesh(featherGeo, mats.wingMat);
    featherMesh.position.set(offsetX, offsetY + length / 2, 0);
    featherMesh.rotation.z = angleZ;
    return featherMesh;
  };

  // Cánh trái (4 tầng lông vũ ánh sáng dang rộng)
  leftWing.position.set(0.12, 0, 0);
  leftWing.add(createLightFeather(0.85, 0.085, -0.68, 0.12, 0.05)); // Lông vũ chính vươn cao
  leftWing.add(createLightFeather(0.68, 0.075, -0.95, 0.18, -0.05)); // Lông vũ thứ 2
  leftWing.add(createLightFeather(0.50, 0.065, -1.22, 0.16, -0.18)); // Lông vũ thứ 3
  leftWing.add(createLightFeather(0.35, 0.055, -1.45, 0.12, -0.28)); // Lông vũ dưới cùng

  // Cánh phải (Đối xứng)
  rightWing.position.set(-0.12, 0, 0);
  rightWing.add(createLightFeather(0.85, 0.085, 0.68, -0.12, 0.05));
  rightWing.add(createLightFeather(0.68, 0.075, 0.95, -0.18, -0.05));
  rightWing.add(createLightFeather(0.50, 0.065, 1.22, -0.16, -0.18));
  rightWing.add(createLightFeather(0.35, 0.055, 1.45, -0.12, -0.28));

  // ==========================================
  // 6. QUYỀN TRƯỢNG NANO THÁNH QUANG (1.55m HOLY SCEPTER)
  // ==========================================
  const scepterGroup = new THREE.Group();
  scepterGroup.position.set(0.48, 0.78, 0.18);
  rootGroup.add(scepterGroup);

  // Thân quyền trượng (Staff Shaft)
  const shaftGeo = new THREE.CylinderGeometry(0.016, 0.018, 1.55, 16);
  const shaftMesh = new THREE.Mesh(shaftGeo, mats.scepterShaftMat);
  scepterGroup.add(shaftMesh);

  // Chuôi trượng đáy (Bottom Pommel)
  const pommelGeo = new THREE.SphereGeometry(0.038, 16, 16);
  const pommelMesh = new THREE.Mesh(pommelGeo, mats.goldTrimMat);
  pommelMesh.position.y = -0.78;
  scepterGroup.add(pommelMesh);

  // Đầu quyền trượng Thánh Quang (Ornate Headpiece)
  const headpieceGroup = new THREE.Group();
  headpieceGroup.position.y = 0.78;
  scepterGroup.add(headpieceGroup);

  // Vòng hào quang vàng kim (Gold Ring)
  const ringGeo = new THREE.TorusGeometry(0.16, 0.018, 16, 32);
  const ringMesh = new THREE.Mesh(ringGeo, mats.goldTrimMat);
  headpieceGroup.add(ringMesh);

  // Lõi sao thánh quang phát sáng cực độ xoay tròn (Pulsating Star Core)
  const coreGeo = new THREE.OctahedronGeometry(0.065, 0);
  const scepterCoreMesh = new THREE.Mesh(coreGeo, mats.scepterCoreMat);
  headpieceGroup.add(scepterCoreMesh);

  // 4 cánh chữ thập thánh giá bảo vệ lõi
  const crossPillarV = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 12), mats.goldTrimMat);
  const crossPillarH = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 12), mats.goldTrimMat);
  crossPillarH.rotation.z = Math.PI / 2;
  headpieceGroup.add(crossPillarV, crossPillarH);

  // 4 viên ngọc Cyan trên đỉnh 4 nhánh chữ thập
  const tipGemGeo = new THREE.SphereGeometry(0.018, 12, 12);
  const topGem = new THREE.Mesh(tipGemGeo, mats.cyanGemMat);
  topGem.position.y = 0.16;
  const btmGem = new THREE.Mesh(tipGemGeo, mats.cyanGemMat);
  btmGem.position.y = -0.16;
  const leftGem = new THREE.Mesh(tipGemGeo, mats.cyanGemMat);
  leftGem.position.x = 0.16;
  const rightGem = new THREE.Mesh(tipGemGeo, mats.cyanGemMat);
  rightGem.position.x = -0.16;
  headpieceGroup.add(topGem, btmGem, leftGem, rightGem);

  // Đôi cánh thiên sứ mini trên đầu quyền trượng
  const miniWingL = createLightFeather(0.24, 0.035, -0.65, 0.08, 0.08);
  const miniWingR = createLightFeather(0.24, 0.035, 0.65, -0.08, 0.08);
  headpieceGroup.add(miniWingL, miniWingR);

  // ==========================================
  // 7. TAY & CHÂN (ARMS, LEGS, STOCKINGS & HEELS)
  // ==========================================
  // Tay phải (cầm quyền trượng)
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.24, 0.38, 0);
  torsoGroup.add(rightArm);

  const rArmGeo = new THREE.CylinderGeometry(0.042, 0.036, 0.32, 16);
  const rArmMesh = new THREE.Mesh(rArmGeo, mats.skinMat);
  rArmMesh.position.y = -0.16;
  rightArm.add(rArmMesh);

  // Găng tay lụa trắng dài đến khuỷu tay
  const rGloveGeo = new THREE.CylinderGeometry(0.04, 0.032, 0.28, 16);
  const rGloveMesh = new THREE.Mesh(rGloveGeo, mats.habitWhiteMat);
  rGloveMesh.position.y = -0.36;
  rightArm.add(rGloveMesh);
  rightArm.rotation.set(0.32, 0, -0.25);

  // Tay trái (giơ cử chỉ cầu nguyện / ban phước thánh)
  const leftArm = new THREE.Group();
  leftArm.position.set(0.24, 0.38, 0);
  torsoGroup.add(leftArm);

  const lArmGeo = new THREE.CylinderGeometry(0.042, 0.036, 0.32, 16);
  const lArmMesh = new THREE.Mesh(lArmGeo, mats.skinMat);
  lArmMesh.position.y = -0.16;
  leftArm.add(lArmMesh);

  const lGloveGeo = new THREE.CylinderGeometry(0.04, 0.032, 0.28, 16);
  const lGloveMesh = new THREE.Mesh(lGloveGeo, mats.habitWhiteMat);
  lGloveMesh.position.y = -0.36;
  leftArm.add(lGloveMesh);
  leftArm.rotation.set(-0.45, 0.25, 0.38);

  // Chân trái & Chân phải (Thon dài, vớ lụa trắng bán trong suốt)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.11, -0.12, 0);
  torsoGroup.add(leftLeg);

  const lLegGeo = new THREE.CylinderGeometry(0.075, 0.048, 0.78, 16);
  const lLegMesh = new THREE.Mesh(lLegGeo, mats.stockingsMat);
  lLegMesh.position.y = -0.39;
  leftLeg.add(lLegMesh);

  // Giày cao gót nữ tu thánh quang
  const lHeelGeo = new THREE.ConeGeometry(0.05, 0.12, 12);
  const lHeelMesh = new THREE.Mesh(lHeelGeo, mats.goldTrimMat);
  lHeelMesh.position.set(0, -0.80, 0.02);
  lHeelMesh.rotation.x = 0.35;
  leftLeg.add(lHeelMesh);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.11, -0.12, 0);
  torsoGroup.add(rightLeg);

  const rLegMesh = new THREE.Mesh(lLegGeo, mats.stockingsMat);
  rLegMesh.position.y = -0.39;
  rightLeg.add(rLegMesh);

  const rHeelMesh = new THREE.Mesh(lHeelGeo, mats.goldTrimMat);
  rHeelMesh.position.set(0, -0.80, 0.02);
  rHeelMesh.rotation.x = 0.35;
  rightLeg.add(rHeelMesh);

  return {
    rootGroup,
    headGroup,
    hairGroup,
    bustGroup,
    wingsGroup,
    leftWing,
    rightWing,
    scepterGroup,
    scepterCoreMesh,
    skirtGroup,
    tier1Group,
    tier2Group,
    tier3Group,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg
  };
}
