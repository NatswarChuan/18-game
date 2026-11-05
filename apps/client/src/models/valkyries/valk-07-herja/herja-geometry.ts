import * as THREE from 'three';
import { HerjaMaterialBundle } from './herja-materials';

export interface HerjaMeshParts {
  rootGroup: THREE.Group;
  headGroup: THREE.Group;
  hairGroup: THREE.Group;
  bustGroup: THREE.Group;
  absGroup: THREE.Group;
  pauldronGroup: THREE.Group;
  spearGroup: THREE.Group;
  spearBladeMesh: THREE.Mesh;
  tier1Group: THREE.Group;
  tier2Group: THREE.Group;
  tier3Group: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
}

/**
 * Builds the complete 3D humanoid mesh for VALK-07: Herja (Frontline Berserker).
 * Dựng toàn bộ hình khối 3D cho Herja:
 * - Chiều cao 1.74m, Cúp ngực E (0.34m) săn chắc nở nang.
 * - Cơ bụng số 11 sắc nét, eo 0.19m / Hông 0.38m (vóc dáng chiến binh phương Bắc).
 * - Mái tóc vàng hoang dã buộc đuôi ngựa cao, giáp vai Titan một bên có gai nhọn.
 * - Ngọn Thương Sấm Sét Gungnir Replica dài 2.10m bùng cháy tia sét Plasma.
 * - 3 cấp độ rách giáp chiến binh (Tier 1-3).
 */
export function buildHerjaGeometry(mats: HerjaMaterialBundle): HerjaMeshParts {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'Valkyrie_07_Herja_Root';

  const tier1Group = new THREE.Group();
  const tier2Group = new THREE.Group();
  const tier3Group = new THREE.Group();
  tier2Group.visible = false;
  tier3Group.visible = false;
  rootGroup.add(tier1Group, tier2Group, tier3Group);

  // ==========================================
  // 1. THÂN THỂ CỐT LÕI (CORE TORSO) - 1.74m
  // ==========================================
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.94;
  rootGroup.add(torsoGroup);

  // Khung xương chậu & Hông (Hips - 0.38m)
  const hipsGeo = new THREE.CylinderGeometry(0.18, 0.21, 0.24, 20);
  const hipsMesh = new THREE.Mesh(hipsGeo, mats.skinMat);
  hipsMesh.position.y = -0.02;
  torsoGroup.add(hipsMesh);

  // Quần short da chiến binh (Warrior Leather Shorts)
  const shortsGeo = new THREE.CylinderGeometry(0.185, 0.215, 0.20, 20);
  const shortsMesh = new THREE.Mesh(shortsGeo, mats.leatherMat);
  shortsMesh.position.y = -0.03;
  tier1Group.add(shortsMesh);

  // Thắt lưng da bản to có khóa vàng Bắc Âu
  const beltGeo = new THREE.CylinderGeometry(0.188, 0.192, 0.06, 24);
  const beltMesh = new THREE.Mesh(beltGeo, mats.leatherMat);
  beltMesh.position.y = 0.08;
  tier1Group.add(beltMesh);

  const buckleGeo = new THREE.BoxGeometry(0.06, 0.07, 0.03);
  const buckleMesh = new THREE.Mesh(buckleGeo, mats.goldTrimMat);
  buckleMesh.position.set(0, 0.08, 0.19);
  tier1Group.add(buckleMesh);

  // ==========================================
  // 2. VÒNG EO SĂN CHẮC & CƠ BỤNG SỐ 11 (ABS MIDRIFF)
  // ==========================================
  const absGroup = new THREE.Group();
  absGroup.position.set(0, 0.18, 0);
  torsoGroup.add(absGroup);

  // Khối eo săn chắc (Waist - 0.19m)
  const waistGeo = new THREE.CylinderGeometry(0.14, 0.175, 0.22, 20);
  const waistMesh = new THREE.Mesh(waistGeo, mats.skinMat);
  absGroup.add(waistMesh);

  // Rãnh cơ bụng số 11 bên trái (Left 11-line ab ridge)
  const leftAbRidgeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8);
  const leftAbRidge = new THREE.Mesh(leftAbRidgeGeo, mats.skinMat);
  leftAbRidge.position.set(0.038, 0.02, 0.145);
  leftAbRidge.scale.set(1.0, 1.0, 0.5);
  absGroup.add(leftAbRidge);

  // Rãnh cơ bụng số 11 bên phải (Right 11-line ab ridge)
  const rightAbRidge = new THREE.Mesh(leftAbRidgeGeo, mats.skinMat);
  rightAbRidge.position.set(-0.038, 0.02, 0.145);
  rightAbRidge.scale.set(1.0, 1.0, 0.5);
  absGroup.add(rightAbRidge);

  // Rãnh cơ bụng trung tâm (Linea alba)
  const centerAbGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.19, 8);
  const centerAb = new THREE.Mesh(centerAbGeo, mats.leatherMat);
  centerAb.position.set(0, 0.02, 0.144);
  centerAb.scale.set(1.0, 1.0, 0.2);
  absGroup.add(centerAb);

  // Khuyên rốn vàng kim gợi cảm (Pierced Navel)
  const navelRingGeo = new THREE.TorusGeometry(0.008, 0.003, 8, 16);
  const navelRing = new THREE.Mesh(navelRingGeo, mats.goldTrimMat);
  navelRing.position.set(0, -0.05, 0.155);
  absGroup.add(navelRing);

  // ==========================================
  // 3. VÒNG 1 CÚP E SĂN CHẮC (0.34m - BUST CUP E)
  // ==========================================
  const bustGroup = new THREE.Group();
  bustGroup.position.set(0, 0.34, 0.06);
  torsoGroup.add(bustGroup);

  // Ngực trái Cup E (Left Breast)
  const leftBreastGeo = new THREE.SphereGeometry(0.118, 22, 18);
  leftBreastGeo.scale(1.0, 1.02, 1.34);
  const leftBreastMesh = new THREE.Mesh(leftBreastGeo, mats.skinMat);
  leftBreastMesh.position.set(0.092, 0, 0.06);
  leftBreastMesh.rotation.set(-0.10, 0.12, -0.05);
  bustGroup.add(leftBreastMesh);

  // Ngực phải Cup E (Right Breast)
  const rightBreastGeo = new THREE.SphereGeometry(0.118, 22, 18);
  rightBreastGeo.scale(1.0, 1.02, 1.34);
  const rightBreastMesh = new THREE.Mesh(rightBreastGeo, mats.skinMat);
  rightBreastMesh.position.set(-0.092, 0, 0.06);
  rightBreastMesh.rotation.set(-0.10, -0.12, 0.05);
  bustGroup.add(rightBreastMesh);

  // Áo ngực da chéo chiến binh Tier 1 (Warrior Leather Bra Wrap)
  const braGeo = new THREE.SphereGeometry(0.122, 22, 18);
  braGeo.scale(1.02, 1.04, 1.36);
  const braLeft = new THREE.Mesh(braGeo, mats.leatherMat);
  braLeft.position.set(0.092, 0, 0.06);
  braLeft.rotation.set(-0.10, 0.12, -0.05);

  const braRight = new THREE.Mesh(braGeo, mats.leatherMat);
  braRight.position.set(-0.092, 0, 0.06);
  braRight.rotation.set(-0.10, -0.12, 0.05);
  tier1Group.add(braLeft, braRight);

  // Dây đai da chéo qua ngực (Harness straps)
  const strapGeo = new THREE.BoxGeometry(0.26, 0.035, 0.015);
  const strapMesh = new THREE.Mesh(strapGeo, mats.leatherMat);
  strapMesh.position.set(0, 0.05, 0.17);
  strapMesh.rotation.z = 0.35;
  tier1Group.add(strapMesh);

  // Tier 2: Vỡ một bên áo da ngực trái, để lộ bầu ngực tròn rớm máu khiêu khích
  const tornBraRight = new THREE.Mesh(braGeo, mats.leatherMat);
  tornBraRight.position.set(-0.092, 0, 0.06);
  tornBraRight.rotation.set(-0.10, -0.12, 0.05);
  tier2Group.add(tornBraRight);

  // 3 vết cào rớm máu trên ngực trái (Blood Scratch Marks)
  const cut1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.008, 0.01), mats.bloodCutMat);
  cut1.position.set(0.10, 0.02, 0.18);
  cut1.rotation.z = 0.45;

  const cut2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.008, 0.01), mats.bloodCutMat);
  cut2.position.set(0.11, -0.02, 0.18);
  cut2.rotation.z = 0.48;

  const cut3 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.007, 0.01), mats.bloodCutMat);
  cut3.position.set(0.08, -0.05, 0.18);
  cut3.rotation.z = 0.42;
  tier2Group.add(cut1, cut2, cut3);

  // Tier 3: Áo da rách toạc chỉ còn sợi dây đai đơn manh quấn chéo ngực trần
  const slimStrap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.01), mats.tornStrapMat);
  slimStrap.position.set(0, 0, 0.18);
  slimStrap.rotation.z = -0.42;
  tier3Group.add(slimStrap);

  // Vết cào rớm máu đậm hơn ở Tier 3
  const cutTier3 = cut1.clone();
  cutTier3.position.set(0.09, 0.01, 0.18);
  tier3Group.add(cutTier3);

  // ==========================================
  // 4. GIÁP VAI TITAN GAI NHỌN BẮC ÂU (PAULDRON)
  // ==========================================
  const pauldronGroup = new THREE.Group();
  pauldronGroup.position.set(-0.25, 0.46, 0); // Vai phải
  torsoGroup.add(pauldronGroup);

  // Giáp vai vòm titan
  const pauldronGeo = new THREE.SphereGeometry(0.095, 16, 14, 0, Math.PI, 0, Math.PI * 0.7);
  const pauldronMesh = new THREE.Mesh(pauldronGeo, mats.titanMetalMat);
  pauldronMesh.rotation.set(0, 0, -Math.PI / 2);
  pauldronGroup.add(pauldronMesh);

  // 3 gai nhọn vươn lên từ giáp vai (Titan Spikes)
  const spikeGeo = new THREE.ConeGeometry(0.022, 0.12, 8);
  const spike1 = new THREE.Mesh(spikeGeo, mats.titanMetalMat);
  spike1.position.set(-0.06, 0.07, 0.03);
  spike1.rotation.z = 0.55;

  const spike2 = new THREE.Mesh(spikeGeo, mats.titanMetalMat);
  spike2.position.set(-0.04, 0.09, -0.02);
  spike2.rotation.z = 0.35;

  const spike3 = new THREE.Mesh(spikeGeo, mats.titanMetalMat);
  spike3.position.set(-0.07, 0.05, -0.05);
  spike3.rotation.z = 0.75;
  pauldronGroup.add(spike1, spike2, spike3);

  // Viền vàng Bắc Âu trên giáp vai
  const pauldronGold = new THREE.Mesh(new THREE.TorusGeometry(0.096, 0.008, 8, 24), mats.goldTrimMat);
  pauldronGold.rotation.y = Math.PI / 2;
  pauldronGroup.add(pauldronGold);

  // ==========================================
  // 5. ĐẦU, MẶT & MÁI TÓC VÀNG HOANG DÃ (WILD HAIR)
  // ==========================================
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.58, 0);
  torsoGroup.add(headGroup);

  // Cổ săn chắc
  const neckGeo = new THREE.CylinderGeometry(0.058, 0.068, 0.11, 16);
  const neckMesh = new THREE.Mesh(neckGeo, mats.skinMat);
  neckMesh.position.y = -0.04;
  headGroup.add(neckMesh);

  // Khối đầu
  const headGeo = new THREE.SphereGeometry(0.128, 24, 20);
  const headMesh = new THREE.Mesh(headGeo, mats.skinMat);
  headGroup.add(headMesh);

  // Mặt Anime 3D
  const facePlaneGeo = new THREE.PlaneGeometry(0.21, 0.23);
  const faceMesh = new THREE.Mesh(facePlaneGeo, mats.faceMat);
  faceMesh.position.set(0, -0.01, 0.126);
  headGroup.add(faceMesh);

  // Mái tóc vàng ánh kim hoang dã bù xù (Wild Blonde Hair)
  const hairGroup = new THREE.Group();
  headGroup.add(hairGroup);

  // Tóc búi/đuôi ngựa cao phía sau đỉnh đầu (High Ponytail)
  const ponytailGeo = new THREE.ConeGeometry(0.09, 0.52, 14);
  const ponytailMesh = new THREE.Mesh(ponytailGeo, mats.hairMat);
  ponytailMesh.position.set(0, 0.18, -0.18);
  ponytailMesh.rotation.set(-0.95, 0, 0);
  hairGroup.add(ponytailMesh);

  // Dây buộc tóc da đính khuyên vàng
  const hairTieGeo = new THREE.TorusGeometry(0.045, 0.012, 8, 20);
  const hairTieMesh = new THREE.Mesh(hairTieGeo, mats.goldTrimMat);
  hairTieMesh.position.set(0, 0.12, -0.12);
  hairTieMesh.rotation.x = 0.65;
  hairGroup.add(hairTieMesh);

  // Tóc mái nhọn xõa hoang dã trước trán (Spiky Bangs)
  const bang1 = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 8), mats.hairMat);
  bang1.position.set(-0.06, 0.04, 0.13);
  bang1.rotation.set(0.35, 0, 0.35);

  const bang2 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 8), mats.hairMat);
  bang2.position.set(0.04, 0.02, 0.135);
  bang2.rotation.set(0.40, 0, -0.25);

  const bang3 = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.16, 8), mats.hairMat);
  bang3.position.set(0.10, 0.05, 0.12);
  bang3.rotation.set(0.32, 0, -0.55);
  hairGroup.add(bang1, bang2, bang3);

  // Lọn tóc mai hai bên má
  const sideTuftL = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.32, 8), mats.hairMat);
  sideTuftL.position.set(0.13, -0.08, 0.04);
  sideTuftL.rotation.z = -0.22;

  const sideTuftR = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.32, 8), mats.hairMat);
  sideTuftR.position.set(-0.13, -0.08, 0.04);
  sideTuftR.rotation.z = 0.22;
  hairGroup.add(sideTuftL, sideTuftR);

  // ==========================================
  // 6. THƯƠNG SẤM SÉT GUNGNIR REPLICA (2.10m SPEAR)
  // ==========================================
  const spearGroup = new THREE.Group();
  spearGroup.position.set(-0.52, 0.88, 0.25); // Cầm bên tay phải
  spearGroup.rotation.set(0.22, 0, -0.18);
  rootGroup.add(spearGroup);

  // Cán thương kim loại gia cường dài 2.10m
  const shaftGeo = new THREE.CylinderGeometry(0.018, 0.020, 2.10, 16);
  const shaftMesh = new THREE.Mesh(shaftGeo, mats.spearShaftMat);
  spearGroup.add(shaftMesh);

  // Bọc da tay cầm ở giữa cán thương
  const gripGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.45, 16);
  const gripMesh = new THREE.Mesh(gripGeo, mats.leatherMat);
  gripMesh.position.y = 0.05;
  spearGroup.add(gripMesh);

  // Chuôi đáy thương (Bottom Spike)
  const btmSpikeGeo = new THREE.ConeGeometry(0.028, 0.16, 10);
  btmSpikeGeo.rotateX(Math.PI);
  const btmSpike = new THREE.Mesh(btmSpikeGeo, mats.titanMetalMat);
  btmSpike.position.y = -1.12;
  spearGroup.add(btmSpike);

  // Cụm đầu thương Gungnir Replica
  const spearheadGroup = new THREE.Group();
  spearheadGroup.position.y = 1.05;
  spearGroup.add(spearheadGroup);

  // Chắn tay hình cánh đại bàng Bắc Âu
  const crossguardGeo = new THREE.BoxGeometry(0.24, 0.035, 0.05);
  const crossguard = new THREE.Mesh(crossguardGeo, mats.goldTrimMat);
  spearheadGroup.add(crossguard);

  // Lưỡi thương sấm sét Plasma ba cạnh rực sáng (0.45m)
  const bladeGeo = new THREE.ConeGeometry(0.08, 0.45, 3);
  bladeGeo.scale(1.0, 1.0, 0.35); // Dẹp sắc bén
  const spearBladeMesh = new THREE.Mesh(bladeGeo, mats.thunderPlasmaMat);
  spearBladeMesh.position.y = 0.24;
  spearheadGroup.add(spearBladeMesh);

  // Lõi dẫn sấm sét trên lưỡi thương
  const plasmaCoreGeo = new THREE.CylinderGeometry(0.012, 0.005, 0.32, 8);
  const plasmaCore = new THREE.Mesh(plasmaCoreGeo, mats.goldTrimMat);
  plasmaCore.position.y = 0.18;
  spearheadGroup.add(plasmaCore);

  // ==========================================
  // 7. TAY & CHÂN CHIẾN BINH (ARMS & LEGS)
  // ==========================================
  // Tay phải (cầm thương vững chãi)
  const rightArm = new THREE.Group();
  rightArm.position.set(-0.25, 0.42, 0);
  torsoGroup.add(rightArm);

  const rArmGeo = new THREE.CylinderGeometry(0.045, 0.040, 0.32, 16);
  const rArmMesh = new THREE.Mesh(rArmGeo, mats.skinMat);
  rArmMesh.position.y = -0.16;
  rightArm.add(rArmMesh);

  // Găng tay hộ giáp Titan bảo vệ cổ tay và mu bàn tay
  const rGauntletGeo = new THREE.CylinderGeometry(0.048, 0.042, 0.26, 16);
  const rGauntlet = new THREE.Mesh(rGauntletGeo, mats.titanMetalMat);
  rGauntlet.position.y = -0.34;
  rightArm.add(rGauntlet);
  rightArm.rotation.set(0.42, 0, -0.28);

  // Tay trái (giơ nắm đấm khiêu khích hoặc giữ thăng bằng)
  const leftArm = new THREE.Group();
  leftArm.position.set(0.25, 0.42, 0);
  torsoGroup.add(leftArm);

  const lArmGeo = new THREE.CylinderGeometry(0.044, 0.038, 0.32, 16);
  const lArmMesh = new THREE.Mesh(lArmGeo, mats.skinMat);
  lArmMesh.position.y = -0.16;
  leftArm.add(lArmMesh);

  // Bao cổ tay da có đinh tán vàng
  const lBracerGeo = new THREE.CylinderGeometry(0.042, 0.036, 0.22, 16);
  const lBracer = new THREE.Mesh(lBracerGeo, mats.leatherMat);
  lBracer.position.y = -0.32;
  leftArm.add(lBracer);
  leftArm.rotation.set(-0.35, 0.2, 0.35);

  // Chân trái & Chân phải (Đùi săn chắc, giáp xà cạp thép dũng mãnh)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0.12, -0.12, 0);
  torsoGroup.add(leftLeg);

  // Đùi trái
  const thighGeo = new THREE.CylinderGeometry(0.082, 0.055, 0.42, 16);
  const lThigh = new THREE.Mesh(thighGeo, mats.skinMat);
  lThigh.position.y = -0.21;
  leftLeg.add(lThigh);

  // Đai đùi da dắt dao găm (Thigh dagger harness)
  const garterGeo = new THREE.TorusGeometry(0.075, 0.009, 8, 20);
  const garter = new THREE.Mesh(garterGeo, mats.leatherMat);
  garter.rotation.x = Math.PI / 2;
  garter.position.y = -0.18;
  leftLeg.add(garter);

  // Giáp cẳng chân & Ủng chiến binh Titan (Greaves)
  const greaveGeo = new THREE.CylinderGeometry(0.065, 0.052, 0.44, 16);
  const lGreave = new THREE.Mesh(greaveGeo, mats.titanMetalMat);
  lGreave.position.y = -0.58;
  leftLeg.add(lGreave);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(-0.12, -0.12, 0);
  torsoGroup.add(rightLeg);

  const rThigh = new THREE.Mesh(thighGeo, mats.skinMat);
  rThigh.position.y = -0.21;
  rightLeg.add(rThigh);

  const rGreave = new THREE.Mesh(greaveGeo, mats.titanMetalMat);
  rGreave.position.y = -0.58;
  rightLeg.add(rGreave);

  return {
    rootGroup,
    headGroup,
    hairGroup,
    bustGroup,
    absGroup,
    pauldronGroup,
    spearGroup,
    spearBladeMesh,
    tier1Group,
    tier2Group,
    tier3Group,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg
  };
}
