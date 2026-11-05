import * as THREE from 'three';
import { RotaMaterialBundle } from './rota-materials';

export interface RotaMeshParts {
  rootGroup: THREE.Group;
  headGroup: THREE.Group;
  hairGroup: THREE.Group;
  ponytailMesh: THREE.Mesh;
  bustGroup: THREE.Group;
  leotardGroup: THREE.Group;
  bladesGroup: THREE.Group;
  floatingBlades: THREE.Group[];
  tier1Group: THREE.Group;
  tier2Group: THREE.Group;
  tier3Group: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
}

/**
 * Builds the complete 3D humanoid mesh for VALK-08: Rota (Midline Skirmisher / Blade Dancer).
 * Dựng toàn bộ hình khối 3D cho Rota:
 * - Chiều cao 1.70m, Cúp ngực D (0.32m) săn chắc đàn hồi cao.
 * - Bộ đồ Leotard bó sát khoét hông cao khoe trọn xương chậu và cặp chân vũ công dài miên man.
 * - Mái tóc xanh cobalt buộc đuôi ngựa cao buông xõa dài.
 * - 4 Lưỡi Kiếm Bay Lơ Lửng (4 Floating Flying Blades) xoay quanh cơ thể theo trường lực plasma.
 * - 3 cấp độ rách giáp leotard (Tier 1-3).
 */
export function buildRotaGeometry(mats: RotaMaterialBundle): RotaMeshParts {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'Valkyrie_08_Rota_Root';

  const tier1Group = new THREE.Group();
  const tier2Group = new THREE.Group();
  const tier3Group = new THREE.Group();
  tier2Group.visible = false;
  tier3Group.visible = false;
  rootGroup.add(tier1Group, tier2Group, tier3Group);

  // ==========================================
  // 1. THÂN THỂ CỐT LÕI (CORE TORSO) - 1.70m
  // ==========================================
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.92;
  rootGroup.add(torsoGroup);

  // Khung xương chậu & Hông vũ công (Hips - 0.38m)
  const hipsGeo = new THREE.CylinderGeometry(0.175, 0.205, 0.24, 20);
  const hipsMesh = new THREE.Mesh(hipsGeo, mats.skinMat);
  hipsMesh.position.y = -0.02;
  torsoGroup.add(hipsMesh);

  // Vải Leotard khoét hông cao (High-cut Dancer Leotard Bottom)
  const leotardBtmGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.22, 20);
  const leotardBtmMesh = new THREE.Mesh(leotardBtmGeo, mats.leotardBlueMat);
  leotardBtmMesh.position.y = -0.02;
  tier1Group.add(leotardBtmMesh);

  // Viền vàng kim khoét hông hai bên đùi
  const hipTrimGeo = new THREE.TorusGeometry(0.182, 0.008, 8, 24);
  const leftHipTrim = new THREE.Mesh(hipTrimGeo, mats.goldTrimMat);
  leftHipTrim.position.set(0.06, -0.04, 0);
  leftHipTrim.rotation.set(0.4, 0, Math.PI / 2.8);

  const rightHipTrim = new THREE.Mesh(hipTrimGeo, mats.goldTrimMat);
  rightHipTrim.position.set(-0.06, -0.04, 0);
  rightHipTrim.rotation.set(-0.4, 0, -Math.PI / 2.8);
  tier1Group.add(leftHipTrim, rightHipTrim);

  // Vòng eo thon linh hoạt vũ công (Waist - 0.19m)
  const waistGeo = new THREE.CylinderGeometry(0.135, 0.17, 0.20, 20);
  const waistMesh = new THREE.Mesh(waistGeo, mats.skinMat);
  waistMesh.position.y = 0.17;
  torsoGroup.add(waistMesh);

  // Thân áo Leotard eo (Leotard Midriff)
  const leotardMidGeo = new THREE.CylinderGeometry(0.14, 0.175, 0.19, 20);
  const leotardMidMesh = new THREE.Mesh(leotardMidGeo, mats.leotardBlueMat);
  leotardMidMesh.position.y = 0.17;
  tier1Group.add(leotardMidMesh);

  // Mảng sọc trắng satin dọc giữa thân áo
  const satinStripeGeo = new THREE.BoxGeometry(0.06, 0.19, 0.02);
  const satinStripe = new THREE.Mesh(satinStripeGeo, mats.leotardWhiteMat);
  satinStripe.position.set(0, 0.17, 0.142);
  tier1Group.add(satinStripe);

  // ==========================================
  // 2. VÒNG 1 CÚP D SĂN CHẮC (0.32m - BUST CUP D)
  // ==========================================
  const bustGroup = new THREE.Group();
  bustGroup.position.set(0, 0.33, 0.06);
  torsoGroup.add(bustGroup);

  // Ngực trái Cup D (Left Breast - Căng nẩy, săn chắc vũ công)
  const leftBreastGeo = new THREE.SphereGeometry(0.112, 22, 18);
  leftBreastGeo.scale(1.0, 1.02, 1.30);
  const leftBreastMesh = new THREE.Mesh(leftBreastGeo, mats.skinMat);
  leftBreastMesh.position.set(0.088, 0, 0.06);
  leftBreastMesh.rotation.set(-0.10, 0.12, -0.05);
  bustGroup.add(leftBreastMesh);

  // Ngực phải Cup D (Right Breast)
  const rightBreastGeo = new THREE.SphereGeometry(0.112, 22, 18);
  rightBreastGeo.scale(1.0, 1.02, 1.30);
  const rightBreastMesh = new THREE.Mesh(rightBreastGeo, mats.skinMat);
  rightBreastMesh.position.set(-0.088, 0, 0.06);
  rightBreastMesh.rotation.set(-0.10, -0.12, 0.05);
  bustGroup.add(rightBreastMesh);

  // Cúp ngực áo Leotard Tier 1 (Cổ khoét chữ V sâu để lộ khe ngực thanh tú)
  const leotardCupGeo = new THREE.SphereGeometry(0.116, 22, 18);
  leotardCupGeo.scale(1.02, 1.04, 1.32);
  const leotardCupL = new THREE.Mesh(leotardCupGeo, mats.leotardBlueMat);
  leotardCupL.position.set(0.088, 0, 0.06);
  leotardCupL.rotation.set(-0.10, 0.12, -0.05);

  const leotardCupR = new THREE.Mesh(leotardCupGeo, mats.leotardBlueMat);
  leotardCupR.position.set(-0.088, 0, 0.06);
  leotardCupR.rotation.set(-0.10, -0.12, 0.05);
  tier1Group.add(leotardCupL, leotardCupR);

  // Viền vàng cổ áo chữ V
  const collarTrimGeo = new THREE.TorusGeometry(0.09, 0.008, 8, 20);
  const collarTrim = new THREE.Mesh(collarTrimGeo, mats.goldTrimMat);
  collarTrim.position.set(0, 0.08, 0.13);
  collarTrim.rotation.x = Math.PI / 3;
  tier1Group.add(collarTrim);

  // Tier 2: Leotard rách toạc hai bên sườn và nứt bung ngực áo để lộ khe ngực sâu
  const tornCupGeo = new THREE.SphereGeometry(0.117, 18, 16);
  tornCupGeo.scale(0.85, 0.88, 1.33);
  const tornCupL = new THREE.Mesh(tornCupGeo, mats.leotardBlueMat);
  tornCupL.position.set(0.10, -0.02, 0.06);

  const tornCupR = new THREE.Mesh(tornCupGeo, mats.leotardBlueMat);
  tornCupR.position.set(-0.10, -0.02, 0.06);
  tier2Group.add(tornCupL, tornCupR);

  // Tier 3: Leotard nát vụn chỉ còn các sợi dây đan chéo mỏng manh che hờ hững
  const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.018, 0.01), mats.lingerieStrapMat);
  strapL.position.set(0, 0.02, 0.17);
  strapL.rotation.z = 0.45;

  const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.018, 0.01), mats.lingerieStrapMat);
  strapR.position.set(0, 0.02, 0.17);
  strapR.rotation.z = -0.45;
  tier3Group.add(strapL, strapR);

  // ==========================================
  // 3. ĐẦU, MẶT & ĐUÔI NGỰA XANH COBALT (HAIR)
  // ==========================================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.57, 0);
  torsoGroup.add(headGroup);

  // Cổ thon thả vũ công
  const neckGeo = new THREE.CylinderGeometry(0.054, 0.064, 0.11, 16);
  const neckMesh = new THREE.Mesh(neckGeo, mats.skinMat);
  neckMesh.position.y = -0.04;
  headGroup.add(neckMesh);

  // Vòng cổ kim loại vàng dancer choker
  const chokerGeo = new THREE.CylinderGeometry(0.056, 0.058, 0.025, 16);
  const chokerMesh = new THREE.Mesh(chokerGeo, mats.goldTrimMat);
  chokerMesh.position.y = -0.04;
  headGroup.add(chokerMesh);

  // Khối đầu
  const headGeo = new THREE.SphereGeometry(0.128, 24, 20);
  const headMesh = new THREE.Mesh(headGeo, mats.skinMat);
  headGroup.add(headMesh);

  // Mặt Anime 3D
  const facePlaneGeo = new THREE.PlaneGeometry(0.21, 0.23);
  const faceMesh = new THREE.Mesh(facePlaneGeo, mats.faceMat);
  faceMesh.position.set(0, -0.01, 0.126);
  headGroup.add(faceMesh);

  // Mái tóc xanh cobalt rực rỡ (Cobalt Hair)
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Tóc buộc đuôi ngựa cao dài đến thắt lưng (High Ponytail)
  const ponytailGeo = new THREE.ConeGeometry(0.08, 0.72, 16);
  const ponytailMesh = new THREE.Mesh(ponytailGeo, mats.hairMat);
  ponytailMesh.position.set(0, 0.16, -0.22);
  ponytailMesh.rotation.set(-1.05, 0, 0);
  hairGroup.add(ponytailMesh);

  // Kẹp tóc hoàng kim giữ đuôi ngựa
  const hairClipGeo = new THREE.TorusGeometry(0.042, 0.014, 8, 20);
  const hairClipMesh = new THREE.Mesh(hairClipGeo, mats.goldTrimMat);
  hairClipMesh.position.set(0, 0.12, -0.12);
  hairClipMesh.rotation.x = 0.62;
  hairGroup.add(hairClipMesh);

  // Dải ruy băng trắng rủ từ đuôi ngựa
  const ribbonGeo = new THREE.BoxGeometry(0.02, 0.45, 0.005);
  const ribbonL = new THREE.Mesh(ribbonGeo, mats.leotardWhiteMat);
  ribbonL.position.set(0.05, -0.08, -0.16);
  ribbonL.rotation.set(-0.55, 0, -0.25);

  const ribbonR = new THREE.Mesh(ribbonGeo, mats.leotardWhiteMat);
  ribbonR.position.set(-0.05, -0.08, -0.16);
  ribbonR.rotation.set(-0.55, 0, 0.25);
  hairGroup.add(ribbonL, ribbonR);

  // Tóc mái chéo thanh lịch trước trán
  const bangsGeo = new THREE.SphereGeometry(0.133, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.40);
  const bangsMesh = new THREE.Mesh(bangsGeo, mats.hairMat);
  bangsMesh.rotation.set(0.32, 0.15, -0.12);
  hairGroup.add(bangsMesh);

  // Lọn tóc mai thanh mảnh bên má
  const sidelockL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.006, 0.32, 10), mats.hairMat);
  sidelockL.position.set(0.13, -0.10, 0.05);
  sidelockL.rotation.z = -0.14;

  const sidelockR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.006, 0.32, 10), mats.hairMat);
  sidelockR.position.set(-0.13, -0.10, 0.05);
  sidelockR.rotation.z = 0.14;
  hairGroup.add(sidelockL, sidelockR);

  // ==========================================
  // 4. BỐN LƯỠI KIẾM BAY LƠ LỬNG (4 FLOATING BLADES)
  // ==========================================
  const bladesGroup = new THREE.Group();
  bladesGroup.position.set(0, 0.32, 0); // Tâm quay quanh ngực/eo
  torsoGroup.add(bladesGroup);

  const floatingBlades: THREE.Group[] = [];

  // Hàm tạo 1 lưỡi kiếm bay plasma
  const createFloatingBlade = (index: number): THREE.Group => {
    const bladeGroup = new THREE.Group();
    bladeGroup.name = `FloatingBlade_${index}`;

    // Thân kiếm thép gương phản chiếu (0.85m)
    const bladeCoreGeo = new THREE.BoxGeometry(0.05, 0.85, 0.012);
    const bladeCore = new THREE.Mesh(bladeCoreGeo, mats.bladeSteelMat);
    bladeGroup.add(bladeCore);

    // Mũi kiếm vát nhọn
    const bladeTipGeo = new THREE.ConeGeometry(0.035, 0.18, 4);
    bladeTipGeo.scale(1.0, 1.0, 0.35);
    const bladeTip = new THREE.Mesh(bladeTipGeo, mats.bladeSteelMat);
    bladeTip.position.y = 0.51;
    bladeGroup.add(bladeTip);

    // Lưỡi phát quang Plasma Sapphire bao quanh hai cạnh kiếm
    const plasmaEdgeGeo = new THREE.BoxGeometry(0.065, 0.82, 0.016);
    const plasmaEdge = new THREE.Mesh(plasmaEdgeGeo, mats.bladePlasmaMat);
    bladeGroup.add(plasmaEdge);

    // Đốc kiếm Bắc Âu đính ngọc vàng
    const hiltGuardGeo = new THREE.BoxGeometry(0.14, 0.025, 0.025);
    const hiltGuard = new THREE.Mesh(hiltGuardGeo, mats.goldTrimMat);
    hiltGuard.position.y = -0.42;
    bladeGroup.add(hiltGuard);

    return bladeGroup;
  };

  // Khởi tạo 4 thanh kiếm ở 4 góc quay đồng tâm quanh Rota
  const bladeRadius = 0.72;
  for (let i = 0; i < 4; i++) {
    const bGroup = createFloatingBlade(i);
    const angle = (i * Math.PI) / 2;
    bGroup.position.set(
      bladeRadius * Math.cos(angle),
      Math.sin(angle * 2) * 0.12,
      bladeRadius * Math.sin(angle)
    );
    bGroup.rotation.z = Math.PI * 0.12;
    bladesGroup.add(bGroup);
    floatingBlades.push(bGroup);
  }

  // ==========================================
  // 5. TAY & CHÂN VŨ CÔNG (DANCER ARMS & LEGS)
  // ==========================================
  // Tay phải (giơ tư thế chỉ đạo kiếm vũ)
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.23, 0.38, 0);
  torsoGroup.add(rightArm);

  const armGeo = new THREE.CylinderGeometry(0.040, 0.034, 0.32, 16);
  const rArmMesh = new THREE.Mesh(armGeo, mats.skinMat);
  rArmMesh.position.y = -0.16;
  rightArm.add(rArmMesh);

  // Găng tay ống lụa trắng dài qua khuỷu tay
  const gloveGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.26, 16);
  const rGlove = new THREE.Mesh(gloveGeo, mats.leotardWhiteMat);
  rGlove.position.y = -0.34;
  rightArm.add(rGlove);
  rightArm.rotation.set(-0.35, 0.22, -0.48);

  // Tay trái (uốn lượn thăng bằng duyên dáng)
  const leftArm = new THREE.Group();
  leftArm.position.set(0.23, 0.38, 0);
  torsoGroup.add(leftArm);

  const lArmMesh = new THREE.Mesh(armGeo, mats.skinMat);
  lArmMesh.position.y = -0.16;
  leftArm.add(lArmMesh);

  const lGlove = new THREE.Mesh(gloveGeo, mats.leotardWhiteMat);
  lGlove.position.y = -0.34;
  leftArm.add(lGlove);
  leftArm.rotation.set(0.28, -0.18, 0.52);

  // Chân trái & Chân phải (Đôi chân vũ công dài miên man, săn chắc tuyệt mỹ)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.10, -0.12, 0);
  torsoGroup.add(leftLeg);

  // Đùi trái thon thả
  const thighGeo = new THREE.CylinderGeometry(0.076, 0.050, 0.44, 16);
  const lThigh = new THREE.Mesh(thighGeo, mats.skinMat);
  lThigh.position.y = -0.22;
  leftLeg.add(lThigh);

  // Dải ruy băng xanh quấn đùi trái (Thigh dancer ribbon)
  const ribbonThighGeo = new THREE.TorusGeometry(0.072, 0.008, 8, 20);
  const ribbonThigh = new THREE.Mesh(ribbonThighGeo, mats.thighRibbonMat);
  ribbonThigh.rotation.x = Math.PI / 2;
  ribbonThigh.position.y = -0.18;
  leftLeg.add(ribbonThigh);

  // Cẳng chân trái
  const calfGeo = new THREE.CylinderGeometry(0.048, 0.038, 0.44, 16);
  const lCalf = new THREE.Mesh(calfGeo, mats.skinMat);
  lCalf.position.y = -0.64;
  leftLeg.add(lCalf);

  // Giày múa kiếm cao gót mũi kim loại nhọn mạ vàng
  const dancerShoeGeo = new THREE.ConeGeometry(0.042, 0.12, 12);
  const lShoe = new THREE.Mesh(dancerShoeGeo, mats.goldTrimMat);
  lShoe.position.set(0, -0.88, 0.02);
  lShoe.rotation.x = 0.38;
  leftLeg.add(lShoe);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.10, -0.12, 0);
  torsoGroup.add(rightLeg);

  const rThigh = new THREE.Mesh(thighGeo, mats.skinMat);
  rThigh.position.y = -0.22;
  rightLeg.add(rThigh);

  const rCalf = new THREE.Mesh(calfGeo, mats.skinMat);
  rCalf.position.y = -0.64;
  rightLeg.add(rCalf);

  const rShoe = new THREE.Mesh(dancerShoeGeo, mats.goldTrimMat);
  rShoe.position.set(0, -0.88, 0.02);
  rShoe.rotation.x = 0.38;
  rightLeg.add(rShoe);

  return {
    rootGroup,
    headGroup,
    hairGroup,
    ponytailMesh,
    bustGroup,
    leotardGroup: torsoGroup,
    bladesGroup,
    floatingBlades,
    tier1Group,
    tier2Group,
    tier3Group,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg
  };
}
