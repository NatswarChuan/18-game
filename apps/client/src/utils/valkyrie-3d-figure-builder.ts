import * as THREE from 'three';
import { ClothDamageTier, FactionId } from '@valkyrie/shared-domain';

export interface Valkyrie3DFigureConfig {
  readonly valkyrieId: string;
  readonly faction: FactionId;
  readonly tier: ClothDamageTier;
  readonly isEnemy: boolean;
  readonly primaryColor: number;
}

/**
 * Creates a floating 3D Faction Energy Halo behind the Valkyrie's head.
 * Tạo vòng hào quang thiên sứ 3D Faction Energy Halo lơ lửng phía sau đầu Valkyrie.
 *
 * @param factionColor - Faction primary hex color.
 * @param tier - Current cloth damage tier.
 * @returns THREE.Group containing the multi-ring halo.
 */
export function createValkyrie3DHalo(factionColor: number, tier: ClothDamageTier): THREE.Group {
  const haloGroup = new THREE.Group();
  haloGroup.position.set(0, 1.70, -0.10);
  haloGroup.rotation.x = Math.PI / 6;

  const color = tier === 3 ? 0xff2a85 : factionColor;

  // 1. Delicate Outer Torus Ring (radius 0.20m = 40cm diameter, graceful anime proportions)
  const outerGeo = new THREE.TorusGeometry(0.20, 0.012, 12, 32);
  const outerMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: tier === 3 ? 0.95 : 0.75,
    blending: THREE.AdditiveBlending
  });
  haloGroup.add(new THREE.Mesh(outerGeo, outerMat));

  // 2. Inner Tech Rune Concentric Ring
  const innerGeo = new THREE.RingGeometry(0.12, 0.15, 24);
  const innerMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
    wireframe: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  haloGroup.add(new THREE.Mesh(innerGeo, innerMat));

  return haloGroup;
}

/**
 * Creates 3D Cyber Weapon floating alongside the Valkyrie.
 * Tạo vũ khí 3D Cyberpunk đặc trưng bay lơ lửng cạnh nữ chiến binh:
 * Đại kiếm Buster Blade (Tiên Phong), Song đao Plasma (Đột Kích), Cầu năng lượng (Hậu Phương).
 *
 * @param valkyrieId - Valkyrie identifier.
 * @param primaryColor - Faction neon color.
 * @returns THREE.Group containing the weapon model.
 */
export function createValkyrie3DWeapon(valkyrieId: string, primaryColor: number): THREE.Group {
  const weaponGroup = new THREE.Group();
  const num = parseInt(valkyrieId.replace(/\D/g, ''), 10) || 1;

  // Premium titanium alloy material with metallic luster
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x1e2433,
    metalness: 0.92,
    roughness: 0.16,
    emissive: 0x080c16
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe0e8f8,
    metalness: 0.98,
    roughness: 0.1
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.95,
    roughness: 0.2,
    emissive: 0x332800
  });

  // Pure glowing plasma laser material
  const plasmaMat = new THREE.MeshBasicMaterial({
    color: primaryColor,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const edgeGlowMat = new THREE.MeshBasicMaterial({
    color: primaryColor,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });

  if (num % 3 === 1) {
    // 1. Vanguard: High-Tech Cyberpunk Plasma Buster Greatsword
    // Positioned floating gracefully behind right shoulder (Nier / Honkai style)
    weaponGroup.position.set(0.48, 1.05, -0.15);
    weaponGroup.rotation.z = -Math.PI / 10;
    weaponGroup.rotation.x = Math.PI / 14;
    weaponGroup.rotation.y = -Math.PI / 10;
    weaponGroup.scale.set(0.78, 0.78, 0.78);

    // A. Main Titanium Blade Body (Angular faceted spine)
    const bladeGeo = new THREE.BoxGeometry(0.18, 1.35, 0.045);
    const blade = new THREE.Mesh(bladeGeo, metalMat);
    blade.position.y = 0.12;

    // B. Beveled Cutting Edges (Left and Right sharp edges)
    const edgeLeftGeo = new THREE.ConeGeometry(0.045, 1.35, 3);
    edgeLeftGeo.rotateY(Math.PI / 2);
    const edgeLeft = new THREE.Mesh(edgeLeftGeo, chromeMat);
    edgeLeft.position.set(-0.11, 0.12, 0);

    const edgeRightGeo = new THREE.ConeGeometry(0.045, 1.35, 3);
    edgeRightGeo.rotateY(-Math.PI / 2);
    const edgeRight = new THREE.Mesh(edgeRightGeo, chromeMat);
    edgeRight.position.set(0.11, 0.12, 0);

    // C. Angular Piercing Tip
    const tipGeo = new THREE.ConeGeometry(0.13, 0.32, 4);
    tipGeo.rotateY(Math.PI / 4);
    const tip = new THREE.Mesh(tipGeo, chromeMat);
    tip.position.set(0, 0.94, 0);

    // D. Central Plasma Acceleration Rail (Glowing Neon Core)
    const coreBeamGeo = new THREE.BoxGeometry(0.05, 1.25, 0.055);
    const coreBeam = new THREE.Mesh(coreBeamGeo, plasmaMat);
    coreBeam.position.set(0, 0.12, 0);

    // E. Outer Laser Aura
    const auraGeo = new THREE.BoxGeometry(0.02, 1.38, 0.06);
    const aura = new THREE.Mesh(auraGeo, edgeGlowMat);
    aura.position.set(0, 0.14, 0);

    // F. Sleek Tapered Cyber Mechanical Crossguard (Flush, aerodynamic anime silhouette)
    const guardBase = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.045, 0.08), metalMat);
    guardBase.position.y = -0.58;

    const guardEnergyCell = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.048, 0.085), plasmaMat);
    guardEnergyCell.position.set(0, -0.58, 0);

    const guardTrimL = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.05, 0.082), goldAccentMat);
    guardTrimL.position.set(-0.14, -0.58, 0);

    const guardTrimR = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.05, 0.082), goldAccentMat);
    guardTrimR.position.set(0.14, -0.58, 0);

    // G. Two-Handed Ergonomic Hilt
    const hilt = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.38, 12), metalMat);
    hilt.position.y = -0.80;

    // Hilt Grip Rings (3 gold alloy traction bands)
    [-0.72, -0.80, -0.88].forEach((yPos) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.006, 8, 16), goldAccentMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = yPos;
      weaponGroup.add(ring);
    });

    // H. Floating Magnetic Pommel & Counterweight
    const pommel = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 12), chromeMat);
    pommel.position.y = -1.02;

    const pommelHalo = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.008, 8, 16), plasmaMat);
    pommelHalo.rotation.x = Math.PI / 2;
    pommelHalo.position.y = -1.02;

    weaponGroup.add(
      blade,
      edgeLeft,
      edgeRight,
      tip,
      coreBeam,
      aura,
      guardBase,
      guardTrimL,
      guardTrimR,
      guardEnergyCell,
      hilt,
      pommel,
      pommelHalo
    );
  } else if (num % 3 === 2) {
    // 2. Infiltrator: Twin High-Frequency Plasma Cyber Katanas (0.85m)
    weaponGroup.position.set(0.82, 0.90, 0.12);

    const createDagger = (xOff: number, yOff: number, zRot: number): THREE.Group => {
      const g = new THREE.Group();
      g.position.set(xOff, yOff, 0);
      g.rotation.z = zRot;

      // Curved slender blade
      const bladeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.72, 0.02), metalMat);
      bladeMesh.position.y = 0.22;

      // Laser Edge
      const laserEdge = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.74, 0.024), plasmaMat);
      laserEdge.position.set(0.025, 0.22, 0);

      // Piercing Tip
      const tipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.18, 4), chromeMat);
      tipMesh.position.set(0, 0.64, 0);

      // Sci-fi Tsuba Handguard
      const tsuba = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.025, 6), metalMat);
      tsuba.position.y = -0.16;

      const tsubaGlow = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.008, 6, 12), plasmaMat);
      tsubaGlow.rotation.x = Math.PI / 2;
      tsubaGlow.position.y = -0.16;

      // Tsuka Grip
      const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.24, 8), metalMat);
      grip.position.y = -0.30;

      const daggerPommel = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), goldAccentMat);
      daggerPommel.position.y = -0.44;

      g.add(bladeMesh, laserEdge, tipMesh, tsuba, tsubaGlow, grip, daggerPommel);
      return g;
    };

    const dagger1 = createDagger(-0.06, 0.12, Math.PI / 6);
    const dagger2 = createDagger(0.12, -0.18, -Math.PI / 8);
    weaponGroup.add(dagger1, dagger2);
  } else {
    // 3. Tactician: Triple Orbiting Resonance Astral Nexus Orbs
    weaponGroup.position.set(0.82, 1.08, 0.08);

    const orbPositions: readonly [number, number, number][] = [
      [0, 0.38, 0],
      [0.22, -0.14, 0.10],
      [-0.18, -0.36, -0.08]
    ];

    orbPositions.forEach(([ox, oy, oz], idx) => {
      const orbGroup = new THREE.Group();
      orbGroup.position.set(ox, oy, oz);

      // Multi-Faceted Crystal Core
      const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.075, 1), chromeMat);
      const innerLight = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), plasmaMat);

      // Concentric Gyro Tech Rings
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.012, 8, 24), plasmaMat);
      ring1.rotation.x = Math.PI / 3 + idx * 0.4;
      ring1.rotation.y = idx * 0.5;

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.008, 6, 24), metalMat);
      ring2.rotation.y = Math.PI / 4 - idx * 0.3;

      orbGroup.add(coreMesh, innerLight, ring1, ring2);
      weaponGroup.add(orbGroup);
    });
  }

  return weaponGroup;
}

/**
 * Creates the 3D Chamfered Crystal Frame and Depth Backplate.
 * Tạo khung viền pha lê vát góc 3D và tấm nền phát quang tạo chiều sâu không gian.
 *
 * @param primaryColor - Faction neon color.
 * @param tier - Current cloth damage tier.
 * @returns THREE.Group containing the backplate and edge highlights.
 */
/**
 * Creates a faceted sci-fi crystal contour shape with chamfered corners.
 */
function createFacetedCrystalShape(w: number, h: number, chamfer: number): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  const c = chamfer;

  shape.moveTo(-hw + c, -hh);
  shape.lineTo(hw - c, -hh);
  shape.lineTo(hw, -hh + c);
  shape.lineTo(hw, hh - c);
  shape.lineTo(hw - c, hh);
  shape.lineTo(-hw + c, hh);
  shape.lineTo(-hw, hh - c);
  shape.lineTo(-hw, -hh + c);
  shape.closePath();

  return shape;
}

/**
 * Creates Cyberpunk metallic corner clamp brackets with neon indicators.
 */
function createCyberBracket(x: number, y: number, color: number): THREE.Mesh {
  const geo = new THREE.BoxGeometry(0.12, 0.035, 0.12);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x181a28,
    metalness: 0.9,
    roughness: 0.2,
    emissive: color,
    emissiveIntensity: 0.4
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, 0);
  return mesh;
}

/**
 * Creates physical 3D Sci-Fi Armor Plating that physically detaches and strips across Tiers.
 * Dựng lớp giáp ngoại trang 3D thể tích (Vai, Ngực, Hông) tự động tháo rời/bắn tung khi rách giáp:
 * - Tier 1: Giáp Thánh đầy đủ (Giáp vai, giáp ngực, giáp hông che chắn kín đáo oai phong)
 * - Tier 2: Giáp vai bắn tung (xé toạc áo choàng & bộc lộ bờ vai), giáp ngực nứt vỡ rực lửa hoàng kim
 * - Tier 3: Toàn bộ giáp ngực và giáp hông vỡ nát hoàn toàn, bộc lộ trọn vẹn đường cong và trang phục leotard bó sát gợi cảm 100% sắc nét không mờ ảo!
 */
export function createDynamic3DArmorLayer(primaryColor: number, tier: ClothDamageTier): THREE.Group {
  const armorGroup = new THREE.Group();
  armorGroup.name = 'Prismatic_Armor_Layer';

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x1a2030,
    metalness: 0.92,
    roughness: 0.18,
    emissive: 0x080c18
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.95,
    roughness: 0.2,
    emissive: 0x332600
  });

  const neonColor = tier === 3 ? 0xff0055 : tier === 2 ? 0xffaa00 : primaryColor;
  const neonMat = new THREE.MeshBasicMaterial({
    color: neonColor,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  if (tier === 1) {
    // Tier 1: Full Noble Cyber Armor (Left & Right floating shoulder pauldrons + waist tassets)
    const leftPauldron = new THREE.Group();
    leftPauldron.position.set(-0.52, 0.44, 0.04);
    leftPauldron.rotation.z = Math.PI / 12;
    const pauldronMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.10, 0.05), metalMat);
    const pauldronTrim = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.02, 0.055), goldTrimMat);
    pauldronTrim.position.y = 0.04;
    const pauldronNeon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.06), neonMat);
    leftPauldron.add(pauldronMesh, pauldronTrim, pauldronNeon);

    const rightPauldron = leftPauldron.clone();
    rightPauldron.position.set(0.52, 0.44, 0.04);
    rightPauldron.rotation.z = -Math.PI / 12;

    const leftHipTasset = new THREE.Group();
    leftHipTasset.position.set(-0.42, -0.28, 0.03);
    leftHipTasset.rotation.z = -Math.PI / 10;
    const tassetMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.035), metalMat);
    const tassetNeon = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.24, 0.04), neonMat);
    leftHipTasset.add(tassetMesh, tassetNeon);

    const rightHipTasset = leftHipTasset.clone();
    rightHipTasset.position.set(0.42, -0.28, 0.03);
    rightHipTasset.rotation.z = Math.PI / 10;

    armorGroup.add(leftPauldron, rightPauldron, leftHipTasset, rightHipTasset);
  } else if (tier === 2) {
    // Tier 2: Torn Armor (Pauldrons shattered, molten fracture lines along waist)
    [-0.55, 0.55].forEach((x, i) => {
      const shard = new THREE.Mesh(new THREE.TetrahedronGeometry(0.045, 0), metalMat);
      shard.position.set(x, 0.46 + i * 0.04, 0.06);
      shard.rotation.set(0.4, 0.8 * i, 0.3);
      armorGroup.add(shard);
    });

    const hipCrackL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.20, 0.03), neonMat);
    hipCrackL.position.set(-0.38, -0.25, 0.035);
    hipCrackL.rotation.z = -Math.PI / 8;

    const hipCrackR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.20, 0.03), neonMat);
    hipCrackR.position.set(0.38, -0.25, 0.035);
    hipCrackR.rotation.z = Math.PI / 8;

    armorGroup.add(hipCrackL, hipCrackR);
  } else {
    // Tier 3: Climax Extreme (Outer armor completely stripped, blazing energy ribbons flanking waist)
    const ribbonGeo = new THREE.TorusGeometry(0.45, 0.012, 8, 32, Math.PI * 0.8);
    const ribbonMeshL = new THREE.Mesh(ribbonGeo, neonMat);
    ribbonMeshL.position.set(-0.25, -0.15, 0.04);
    ribbonMeshL.rotation.z = -Math.PI / 3;

    const ribbonMeshR = new THREE.Mesh(ribbonGeo, neonMat);
    ribbonMeshR.position.set(0.25, -0.15, 0.04);
    ribbonMeshR.rotation.z = Math.PI / 3 + Math.PI;

    armorGroup.add(ribbonMeshL, ribbonMeshR);
  }

  return armorGroup;
}

/**
 * Creates the outer glowing neon depth frame and translucent backplate.
 */
function createPrismFrameAndBackplate(primaryColor: number, tier: ClothDamageTier): THREE.Group {
  const frameGroup = new THREE.Group();

  // 1. Translucent Depth Backplate (Z = -0.015)
  const backGeo = new THREE.PlaneGeometry(1.52, 2.1);
  const backMat = new THREE.MeshBasicMaterial({
    color: primaryColor,
    transparent: true,
    opacity: tier === 3 ? 0.35 : 0.18,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const backMesh = new THREE.Mesh(backGeo, backMat);
  backMesh.position.set(0, 1.05, -0.025);
  frameGroup.add(backMesh);

  // 2. Beveled Neon Edge Rim Lines
  const edgeColor = tier === 3 ? 0xff2a85 : tier === 2 ? 0xffd700 : primaryColor;
  const edgeMat = new THREE.MeshBasicMaterial({
    color: edgeColor,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  // Top and Bottom Glow Bars
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.025, 0.04), edgeMat);
  topBar.position.set(0, 2.06, 0);
  const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.025, 0.04), edgeMat);
  bottomBar.position.set(0, 0.04, 0);

  // Left and Right Glow Bars
  const leftBar = new THREE.Mesh(new THREE.BoxGeometry(0.025, 2.02, 0.04), edgeMat);
  leftBar.position.set(-0.72, 1.05, 0);
  const rightBar = new THREE.Mesh(new THREE.BoxGeometry(0.025, 2.02, 0.04), edgeMat);
  rightBar.position.set(0.72, 1.05, 0);

  // 4 Cyberpunk Corner Brackets
  frameGroup.add(
    topBar,
    bottomBar,
    leftBar,
    rightBar,
    createCyberBracket(-0.68, 0.06, edgeColor),
    createCyberBracket(0.68, 0.06, edgeColor),
    createCyberBracket(-0.68, 2.04, edgeColor),
    createCyberBracket(0.68, 2.04, edgeColor)
  );

  return frameGroup;
}

/**
 * Builds the complete 3D Stylized Valkyrie Prismatic Diorama Figure.
 * Dựng mô hình Lăng Kính Pha Lê 3D (3D Prismatic Diorama) đạt độ sâu điêu khắc thể tích:
 * - Khối pha lê Acrylic nguyên khối vát cạnh kim cương phát quang (ExtrudeGeometry với Bevel 3D)
 * - Mặt trước & sau phủ tranh Anime độ phân giải cao sắc nét, có chiều sâu khúc xạ
 * - Bệ phóng Hologram Projector với chùm tia năng lượng thể tích hướng lên
 * - Vòng hào quang Energy Halo và Vũ khí 3D xoay quanh theo quỹ đạo không gian thực
 * - Lõi năng lượng hạt nhân (Energy Core) phát quang tỏa hạt neon tại lồng ngực
 * - Hỗ trợ đầy đủ biến đổi 3 cấp độ rách giáp (Pristine -> Torn -> Climax Extreme).
 *
 * @param config - Configuration settings for unit 3D rendering.
 * @param valkyrieTexture - High-definition dynamic canvas texture containing the anime character.
 * @returns THREE.Group representing the stunning 3D Valkyrie.
 */
export function createValkyrie3DFullFigure(
  config: Valkyrie3DFigureConfig,
  valkyrieTexture?: THREE.Texture
): THREE.Group {
  const figure = new THREE.Group();

  // 1. Layer 1: Hologram Projector Emitter & Upward Beam Base
  const emitterGeo = new THREE.CylinderGeometry(0.48, 0.58, 0.04, 32);
  const emitterMat = new THREE.MeshStandardMaterial({
    color: 0x090c18,
    metalness: 0.88,
    roughness: 0.25,
    emissive: config.primaryColor,
    emissiveIntensity: 0.35
  });
  const emitterMesh = new THREE.Mesh(emitterGeo, emitterMat);
  emitterMesh.position.set(0, 0.02, 0);
  figure.add(emitterMesh);

  const beamGeo = new THREE.CylinderGeometry(0.55, 0.38, 0.45, 24, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: config.primaryColor,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.set(0, 0.22, 0);
  figure.add(beamMesh);

  // 2. Layer 2: 3D Crystal Prism Depth Frame & Neon Backplate
  figure.add(createPrismFrameAndBackplate(config.primaryColor, config.tier));

  // 3. Layer 3: Main 3D Faceted Acrylic Crystal Housing (Beveled Volume Frame)
  const crystalShape = createFacetedCrystalShape(1.42, 1.98, 0.12);
  const crystalGeo = new THREE.ExtrudeGeometry(crystalShape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelThickness: 0.022,
    bevelSize: 0.018,
    bevelSegments: 3
  });
  crystalGeo.center();

  const crystalHousingMat = new THREE.MeshStandardMaterial({
    color: config.primaryColor,
    metalness: 0.3,
    roughness: 0.1,
    transparent: true,
    opacity: 0.28,
    emissive: config.primaryColor,
    emissiveIntensity: 0.2,
    depthWrite: false
  });

  const crystalMesh = new THREE.Mesh(crystalGeo, crystalHousingMat);
  crystalMesh.position.set(0, 1.05, 0.0);
  crystalMesh.castShadow = true;
  crystalMesh.receiveShadow = true;
  figure.add(crystalMesh);

  // 3b. Dedicated High-Resolution Anime Character Portrait Plane (100% Unclipped, 1:1 UV mapping)
  const textureLoader = new THREE.TextureLoader();
  const directAvatarTex = valkyrieTexture ?? textureLoader.load(`/avatars/${config.valkyrieId}.jpg`);
  directAvatarTex.colorSpace = THREE.SRGBColorSpace;

  const portraitGeo = new THREE.PlaneGeometry(1.34, 1.90);
  const portraitMat = new THREE.MeshBasicMaterial({
    map: directAvatarTex,
    side: THREE.DoubleSide
  });
  const portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
  portraitMesh.name = 'Prismatic_Portrait';
  portraitMesh.position.set(0, 1.05, 0.082);
  figure.add(portraitMesh);

  // 3c. Physical 3D Sci-Fi Battle Armor Plating (Physically strips off across Tiers!)
  const armorLayer = createDynamic3DArmorLayer(config.primaryColor, config.tier);
  armorLayer.position.set(0, 1.05, 0.088);
  figure.add(armorLayer);

  // 4. Layer 4: Floating 3D Faction Energy Halo behind head
  const halo = createValkyrie3DHalo(config.primaryColor, config.tier);
  halo.name = 'Prismatic_Halo';
  figure.add(halo);

  // 5. Layer 5: Floating 3D Cyber Weapon beside character with 3D Depth
  const weapon = createValkyrie3DWeapon(config.valkyrieId, config.primaryColor);
  weapon.name = 'Prismatic_Weapon';
  figure.add(weapon);

  // 7. Layer 7: Cloth Damage Overdrive Flames (Tier 3 Climax Extreme)
  if (config.tier === 3) {
    const flameGeo = new THREE.RingGeometry(0.65, 0.88, 32);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff2a85,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.name = 'Prismatic_Overdrive_Aura';
    flameMesh.position.set(0, 1.05, -0.04);
    figure.add(flameMesh);
  }

  return figure;
}
