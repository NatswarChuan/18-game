import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { FreyjaHierarchy } from './freyja-geometry.js';

/**
 * Procedural circular glow texture for additive energy particles and sparks.
 * Tạo texture hạt phát sáng mềm với tâm sáng và viền mờ dần.
 */
function createParticleGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.35, 'rgba(255, 180, 220, 0.85)');
    grad.addColorStop(0.70, 'rgba(255, 40, 120, 0.35)');
    grad.addColorStop(1.0, 'rgba(255, 0, 80, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Procedural soft steam vapor puff texture for ecchi perspiration vapor.
 * Tạo texture hơi nước bốc lên từ làn da sứ đẫm mồ hôi.
 */
function createSteamPuffTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 240, 245, 0.85)');
    grad.addColorStop(0.40, 'rgba(255, 210, 225, 0.45)');
    grad.addColorStop(0.80, 'rgba(255, 180, 205, 0.15)');
    grad.addColorStop(1.0, 'rgba(255, 160, 190, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Procedural high-tech aerodynamic Photon Wing Blade Texture.
 * Tạo texture lưỡi cánh năng lượng Photon gradient Neon Cyan sang Magenta với sống laser sáng rực.
 */
function createPhotonWingBladeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 512);

    // Aerodynamic energy feather contour
    ctx.beginPath();
    ctx.moveTo(64, 16); // Sharp wing tip
    ctx.bezierCurveTo(105, 120, 115, 340, 72, 496); // Outer sweep edge
    ctx.lineTo(56, 496); // Feather root
    ctx.bezierCurveTo(15, 340, 25, 120, 64, 16); // Inner edge
    ctx.closePath();

    // Body gradient: Neon Cyan -> Magenta
    const bodyGrad = ctx.createLinearGradient(64, 16, 64, 496);
    bodyGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
    bodyGrad.addColorStop(0.15, 'rgba(0, 240, 255, 0.88)');
    bodyGrad.addColorStop(0.55, 'rgba(0, 180, 255, 0.75)');
    bodyGrad.addColorStop(0.85, 'rgba(255, 0, 140, 0.80)');
    bodyGrad.addColorStop(1.0, 'rgba(255, 40, 100, 0.20)');
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // High energy laser spine down the center
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.lineWidth = 4.0;
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(64, 24);
    ctx.lineTo(64, 470);
    ctx.stroke();

    // Energy circuit nodes on the blade
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    [80, 160, 260, 360].forEach((y) => {
      ctx.beginPath();
      ctx.arc(64, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Procedural Edge-Glow Plasma Texture for Greatsword Aura Sheath.
 * Tạo texture hào quang plasma viền ngoài với vùng lõi trong suốt 100% để lộ lưỡi kiếm kim loại titan.
 */
function createSwordPlasmaAuraTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 128, 512);

    // Lateral edge-glow gradient: Glowing outer flanks -> 100% transparent center
    const grad = ctx.createLinearGradient(0, 0, 128, 0);
    grad.addColorStop(0.00, 'rgba(255, 0, 100, 0.90)');
    grad.addColorStop(0.18, 'rgba(255, 0, 120, 0.45)');
    grad.addColorStop(0.38, 'rgba(255, 0, 140, 0.0)');
    grad.addColorStop(0.62, 'rgba(255, 0, 140, 0.0)');
    grad.addColorStop(0.82, 'rgba(255, 0, 120, 0.45)');
    grad.addColorStop(1.00, 'rgba(255, 0, 100, 0.90)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 512);

    // Tip flame burst
    const tipGrad = ctx.createRadialGradient(64, 485, 2, 64, 485, 42);
    tipGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    tipGrad.addColorStop(0.35, 'rgba(255, 0, 100, 0.80)');
    tipGrad.addColorStop(1.0, 'rgba(255, 0, 80, 0)');
    ctx.fillStyle = tipGrad;
    ctx.beginPath();
    ctx.arc(64, 485, 42, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Procedural 512x512 Outer Norse Cyber Rune Ring.
 * Vòng tròn ma trận cổ ngữ Runes Bắc Âu bên ngoài xoay ngược chiều kim đồng hồ.
 */
function createOuterRuneRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const c = 256;
    ctx.clearRect(0, 0, 512, 512);

    // Outer cyber ring borders
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.90)';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.arc(c, c, 245, 0, Math.PI * 2);
    ctx.arc(c, c, 218, 0, Math.PI * 2);
    ctx.stroke();

    // Nordic cyber nodes along the ring
    const nodeCount = 32;
    for (let i = 0; i < nodeCount; i++) {
      const ang = (i * 2 * Math.PI) / nodeCount;
      const x = c + Math.cos(ang) * 231;
      const y = c + Math.sin(ang) * 231;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.95)' : 'rgba(255, 0, 128, 0.95)';
      ctx.beginPath();
      ctx.arc(x, y, i % 4 === 0 ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Procedural 512x512 Inner Hexagram / Valknut Magic Seal.
 * Trận pháp hình học ma pháp bên trong xoay thuận chiều kim đồng hồ.
 */
function createInnerMagicSealTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const c = 256;
    ctx.clearRect(0, 0, 512, 512);

    // Valknut / Hexagram interlocking triangles
    ctx.strokeStyle = 'rgba(255, 0, 128, 0.90)';
    ctx.lineWidth = 3.5;
    for (let k = 0; k < 2; k++) {
      const offset = (k * Math.PI) / 3;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const ang = offset + (i * 2 * Math.PI) / 3;
        const x = c + Math.cos(ang) * 165;
        const y = c + Math.sin(ang) * 165;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Inner glowing core ring & central sun
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(c, c, 95, 0, Math.PI * 2);
    ctx.arc(c, c, 35, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.arc(c, c, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Builds articulated 8-feather Cyber Photon Wings.
 * Dựng đôi cánh năng lượng Photon 8 lưỡi cánh fanned ra sau lưng Valkyrie với vật liệu ánh sáng Additive.
 */
function buildCyberPhotonWings(
  disposables: Array<{ dispose: () => void }>,
  wingTex: THREE.Texture
): {
  wingsGroup: THREE.Group;
  leftWing: THREE.Group;
  rightWing: THREE.Group;
  wingMeshes: THREE.Mesh[];
} {
  const wingsGroup = new THREE.Group();
  wingsGroup.name = 'Freyja_CyberPhotonWings';
  wingsGroup.position.set(0, 0.12, -0.12);

  const featherGeo = new THREE.PlaneGeometry(0.18, 0.78);
  featherGeo.translate(0, 0.39, 0); // Origin at feather base
  disposables.push(featherGeo);

  const featherMat = new THREE.MeshBasicMaterial({
    map: wingTex,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  disposables.push(featherMat);

  const leftWing = new THREE.Group();
  const rightWing = new THREE.Group();
  const wingMeshes: THREE.Mesh[] = [];

  const featherConfigs = [
    { scale: 1.25, rotZ: 0.52, yOff: 0.16, xOff: 0.08 },
    { scale: 1.10, rotZ: 0.82, yOff: 0.08, xOff: 0.12 },
    { scale: 0.95, rotZ: 1.12, yOff: 0.00, xOff: 0.14 },
    { scale: 0.78, rotZ: 1.42, yOff: -0.08, xOff: 0.12 }
  ];

  featherConfigs.forEach((cfg) => {
    // Left feather
    const lFeather = new THREE.Mesh(featherGeo, featherMat);
    lFeather.scale.set(cfg.scale, cfg.scale, cfg.scale);
    lFeather.position.set(-cfg.xOff - 0.04, cfg.yOff, 0);
    lFeather.rotation.z = cfg.rotZ;
    leftWing.add(lFeather);
    wingMeshes.push(lFeather);

    // Right feather
    const rFeather = new THREE.Mesh(featherGeo, featherMat);
    rFeather.scale.set(cfg.scale, cfg.scale, cfg.scale);
    rFeather.position.set(cfg.xOff + 0.04, cfg.yOff, 0);
    rFeather.rotation.z = -cfg.rotZ;
    rightWing.add(rFeather);
    wingMeshes.push(rFeather);
  });

  wingsGroup.add(leftWing, rightWing);
  return { wingsGroup, leftWing, rightWing, wingMeshes };
}

/**
 * Master visual effects controller for Freyja (VALK-01).
 * Bộ điều khiển toàn bộ hiệu ứng kỹ xảo ánh sáng, hạt plasma, hơi thở nồng nàn và sấm sét tuyệt kỹ của Freyja.
 */
export class FreyjaVfxController {
  private readonly vfxGroup: THREE.Group;
  private readonly leftWing: THREE.Group;
  private readonly rightWing: THREE.Group;
  private readonly wingMeshes: THREE.Mesh[];
  private readonly groundOuterRuneMesh: THREE.Mesh;
  private readonly groundInnerSealMesh: THREE.Mesh;
  private readonly swordEmbers: THREE.Points;
  private readonly swordEmberPositions: Float32Array;
  private readonly swordAuraSheath: THREE.Mesh;
  private readonly swordAuraMaterial: THREE.MeshBasicMaterial;
  private readonly lightningLines: THREE.LineSegments;
  private readonly lightningPositions: Float32Array;
  private readonly lightningLineMaterial: THREE.LineBasicMaterial;
  private readonly ecchiSteam: THREE.Points;
  private readonly ecchiSteamPositions: Float32Array;
  private readonly glitchEmbers: THREE.Points;
  private readonly glitchPositions: Float32Array;
  private readonly hierarchy: FreyjaHierarchy;
  private readonly slashWaveMesh: THREE.Mesh;
  private readonly slashWaveMaterial: THREE.MeshBasicMaterial;
  private readonly slashWaveInnerMesh: THREE.Mesh;
  private readonly slashWaveInnerMaterial: THREE.MeshBasicMaterial;
  private readonly shockwaveRing: THREE.Mesh;
  private readonly shockwaveMaterial: THREE.MeshBasicMaterial;
  private readonly shockwaveRing2: THREE.Mesh;
  private readonly shockwaveMaterial2: THREE.MeshBasicMaterial;
  private readonly lightningBolt: THREE.Mesh;
  private readonly lightningMaterial: THREE.MeshBasicMaterial;
  private readonly disposables: Array<{ dispose: () => void }> = [];

  private slashProgress: number = 0;
  private shockwaveProgress: number = 0;
  private lightningProgress: number = 0;
  private attackVfxDelay: number = 0;
  private ultimateVfxDelay: number = 0;

  public constructor(hierarchy: FreyjaHierarchy) {
    this.hierarchy = hierarchy;
    this.vfxGroup = new THREE.Group();
    this.vfxGroup.name = 'Freyja_Master_VFX';
    hierarchy.rootGroup.add(this.vfxGroup);

    const glowTex = createParticleGlowTexture();
    const steamTex = createSteamPuffTexture();
    const wingTex = createPhotonWingBladeTexture();
    const outerRuneTex = createOuterRuneRingTexture();
    const innerSealTex = createInnerMagicSealTexture();
    this.disposables.push(glowTex, steamTex, wingTex, outerRuneTex, innerSealTex);

    // 1. Articulated Cyber Photon Wings on Spine
    const { wingsGroup, leftWing, rightWing, wingMeshes } = buildCyberPhotonWings(this.disposables, wingTex);
    this.leftWing = leftWing;
    this.rightWing = rightWing;
    this.wingMeshes = wingMeshes;
    hierarchy.spineGroup.add(wingsGroup);

    // 2. Dual-Layer Revolving Ground Magic Circles
    // Outer Runic Ring (rotates counter-clockwise)
    const outerGeo = new THREE.PlaneGeometry(2.9, 2.9);
    this.disposables.push(outerGeo);
    const outerMat = new THREE.MeshBasicMaterial({
      map: outerRuneTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.disposables.push(outerMat);
    this.groundOuterRuneMesh = new THREE.Mesh(outerGeo, outerMat);
    this.groundOuterRuneMesh.rotation.x = -Math.PI / 2;
    this.groundOuterRuneMesh.position.y = 0.010;
    this.vfxGroup.add(this.groundOuterRuneMesh);

    // Inner Magic Seal (rotates clockwise)
    const innerGeo = new THREE.PlaneGeometry(1.9, 1.9);
    this.disposables.push(innerGeo);
    const innerMat = new THREE.MeshBasicMaterial({
      map: innerSealTex,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.disposables.push(innerMat);
    this.groundInnerSealMesh = new THREE.Mesh(innerGeo, innerMat);
    this.groundInnerSealMesh.rotation.x = -Math.PI / 2;
    this.groundInnerSealMesh.position.y = 0.012;
    this.vfxGroup.add(this.groundInnerSealMesh);

    // 3. Greatsword Plasma Energy Sheath Aura (Cross-Plane with Edge-Glow texture)
    const auraTex = createSwordPlasmaAuraTexture();
    this.disposables.push(auraTex);

    const auraGeo = new THREE.PlaneGeometry(0.24, 1.38);
    auraGeo.translate(0, 0.69, 0);
    this.disposables.push(auraGeo);

    this.swordAuraMaterial = new THREE.MeshBasicMaterial({
      map: auraTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.disposables.push(this.swordAuraMaterial);

    this.swordAuraSheath = new THREE.Mesh(auraGeo, this.swordAuraMaterial);
    this.swordAuraSheath.position.y = 0.22;
    hierarchy.greatswordGroup.add(this.swordAuraSheath);

    // 4. Plasma Buster Sword Embers (48 particles attached to Greatsword blade)
    const emberCount = 48;
    this.swordEmberPositions = new Float32Array(emberCount * 3);
    const emberGeo = new THREE.BufferGeometry();
    for (let i = 0; i < emberCount; i++) {
      this.swordEmberPositions[i * 3] = (Math.random() - 0.5) * 0.12;
      this.swordEmberPositions[i * 3 + 1] = 0.25 + Math.random() * 1.30;
      this.swordEmberPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(this.swordEmberPositions, 3));
    this.disposables.push(emberGeo);

    // 5. Dynamic Crackling Plasma Lightning Tendrils along the blade
    const lightningCount = 16;
    this.lightningPositions = new Float32Array(lightningCount * 2 * 3);
    const lightningLineGeo = new THREE.BufferGeometry();
    lightningLineGeo.setAttribute('position', new THREE.BufferAttribute(this.lightningPositions, 3));
    this.disposables.push(lightningLineGeo);

    this.lightningLineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending
    });
    this.disposables.push(this.lightningLineMaterial);
    this.lightningLines = new THREE.LineSegments(lightningLineGeo, this.lightningLineMaterial);
    hierarchy.greatswordGroup.add(this.lightningLines);

    const emberMat = new THREE.PointsMaterial({
      size: 0.075,
      map: glowTex,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xff0066
    });
    this.disposables.push(emberMat);
    this.swordEmbers = new THREE.Points(emberGeo, emberMat);
    hierarchy.greatswordGroup.add(this.swordEmbers);

    // 5. Ecchi Perspiration Steam (36 particles rising from cleavage & thighs)
    const steamCount = 36;
    this.ecchiSteamPositions = new Float32Array(steamCount * 3);
    const steamGeo = new THREE.BufferGeometry();
    for (let i = 0; i < steamCount; i++) {
      this.ecchiSteamPositions[i * 3] = (Math.random() - 0.5) * 0.28;
      this.ecchiSteamPositions[i * 3 + 1] = 0.85 + Math.random() * 0.55;
      this.ecchiSteamPositions[i * 3 + 2] = 0.05 + Math.random() * 0.15;
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(this.ecchiSteamPositions, 3));
    this.disposables.push(steamGeo);

    const steamMat = new THREE.PointsMaterial({
      size: 0.115,
      map: steamTex,
      transparent: true,
      opacity: 0.0,
      blending: THREE.NormalBlending,
      depthWrite: false,
      color: 0xffe4ec
    });
    this.disposables.push(steamMat);
    this.ecchiSteam = new THREE.Points(steamGeo, steamMat);
    this.vfxGroup.add(this.ecchiSteam);

    // 5b. Damaged Armor Holographic Glitch Sparks (28 particles around chest and waist)
    const glitchCount = 28;
    this.glitchPositions = new Float32Array(glitchCount * 3);
    const glitchGeo = new THREE.BufferGeometry();
    for (let i = 0; i < glitchCount; i++) {
      this.glitchPositions[i * 3] = (Math.random() - 0.5) * 0.22;
      this.glitchPositions[i * 3 + 1] = 1.05 + (Math.random() - 0.5) * 0.35;
      this.glitchPositions[i * 3 + 2] = 0.10 + Math.random() * 0.08;
    }
    glitchGeo.setAttribute('position', new THREE.BufferAttribute(this.glitchPositions, 3));
    this.disposables.push(glitchGeo);

    const glitchMat = new THREE.PointsMaterial({
      size: 0.045,
      map: glowTex,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0x00f0ff
    });
    this.disposables.push(glitchMat);
    this.glitchEmbers = new THREE.Points(glitchGeo, glitchMat);
    this.vfxGroup.add(this.glitchEmbers);

    // 6. Giant Dual-Layer Attack Cleave Crescent Slash Wave Arc (Radius 2.2m)
    // Outer fiery plasma slash
    const slashGeo = new THREE.RingGeometry(1.20, 2.25, 48, 1, 0, Math.PI * 0.96);
    this.disposables.push(slashGeo);
    this.slashWaveMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.disposables.push(this.slashWaveMaterial);
    this.slashWaveMesh = new THREE.Mesh(slashGeo, this.slashWaveMaterial);
    this.slashWaveMesh.position.set(0.15, 1.15, 0.45);
    this.slashWaveMesh.rotation.set(-0.35, 0.42, -Math.PI * 0.45);
    this.vfxGroup.add(this.slashWaveMesh);

    // Inner bright cyan laser slash blade
    const slashInnerGeo = new THREE.RingGeometry(1.35, 1.85, 48, 1, 0, Math.PI * 0.90);
    this.disposables.push(slashInnerGeo);
    this.slashWaveInnerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.disposables.push(this.slashWaveInnerMaterial);
    this.slashWaveInnerMesh = new THREE.Mesh(slashInnerGeo, this.slashWaveInnerMaterial);
    this.slashWaveInnerMesh.position.set(0.15, 1.15, 0.46);
    this.slashWaveInnerMesh.rotation.set(-0.35, 0.42, -Math.PI * 0.45);
    this.vfxGroup.add(this.slashWaveInnerMesh);

    // 7. Ultimate Ground Dual Shockwave Energy Rings
    const shockwaveGeo1 = new THREE.RingGeometry(0.35, 0.65, 48);
    this.disposables.push(shockwaveGeo1);
    this.shockwaveMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.disposables.push(this.shockwaveMaterial);
    this.shockwaveRing = new THREE.Mesh(shockwaveGeo1, this.shockwaveMaterial);
    this.shockwaveRing.rotation.x = -Math.PI / 2;
    this.shockwaveRing.position.y = 0.015;
    this.vfxGroup.add(this.shockwaveRing);

    const shockwaveGeo2 = new THREE.RingGeometry(0.20, 0.45, 48);
    this.disposables.push(shockwaveGeo2);
    this.shockwaveMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xff0088,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.disposables.push(this.shockwaveMaterial2);
    this.shockwaveRing2 = new THREE.Mesh(shockwaveGeo2, this.shockwaveMaterial2);
    this.shockwaveRing2.rotation.x = -Math.PI / 2;
    this.shockwaveRing2.position.y = 0.016;
    this.vfxGroup.add(this.shockwaveRing2);

    // 8. Blinding Vertical Thunder Bolt Pillar
    const lightningGeo = new THREE.CylinderGeometry(0.09, 0.32, 5.5, 16, 1, true);
    this.disposables.push(lightningGeo);
    this.lightningMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.disposables.push(this.lightningMaterial);
    this.lightningBolt = new THREE.Mesh(lightningGeo, this.lightningMaterial);
    this.lightningBolt.position.set(0.15, 2.7, 0.35);
    this.vfxGroup.add(this.lightningBolt);
  }

  public triggerAttackVfx(): void {
    // Attack swing forward occurs ~0.22s after windup
    this.attackVfxDelay = 0.22;
  }

  public triggerUltimateVfx(): void {
    // Sword slams ground 0.55s after leap
    this.ultimateVfxDelay = 0.55;
  }

  public triggerHitVfx(): void {
    this.shockwaveProgress = 0.65;
  }

  /**
   * Updates all active particle systems, energy ribbons, and lighting pulses per frame.
   * Cập nhật chuyển động hạt, dải sóng chém và hào quang năng lượng mỗi khung hình.
   */
  public update(delta: number, elapsedTime: number, _state: UnitCombatVisualState, tier: ClothDamageTier): void {
    // Delayed attack slash trigger
    if (this.attackVfxDelay > 0) {
      this.attackVfxDelay -= delta;
      if (this.attackVfxDelay <= 0) {
        this.slashProgress = 1.0;
      }
    }

    // Delayed ultimate lightning and shockwave trigger
    if (this.ultimateVfxDelay > 0) {
      this.ultimateVfxDelay -= delta;
      if (this.ultimateVfxDelay <= 0) {
        this.lightningProgress = 1.0;
        this.shockwaveProgress = 1.0;
      }
    }

    // 1. Cyber Photon Wings flutter & breathing
    const wingFlap = Math.sin(elapsedTime * 2.4) * 0.14;
    const wingTierScale = tier === 3 ? 1.32 : tier === 2 ? 1.15 : 1.0;
    this.leftWing.rotation.y = 0.35 + wingFlap;
    this.rightWing.rotation.y = -0.35 - wingFlap;
    this.leftWing.scale.set(wingTierScale, wingTierScale, wingTierScale);
    this.rightWing.scale.set(wingTierScale, wingTierScale, wingTierScale);

    // Shimmering feather opacity
    const wingPulse = 0.82 + Math.sin(elapsedTime * 4.5) * 0.16;
    this.wingMeshes.forEach((mesh, idx) => {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = wingPulse + Math.sin(elapsedTime * 6.0 + idx) * 0.05;
    });

    // 2. Dual Revolving Ground Rune Circles
    this.groundOuterRuneMesh.rotation.z = -elapsedTime * 0.18; // Counter-clockwise
    this.groundInnerSealMesh.rotation.z = elapsedTime * 0.28; // Clockwise
    const runeAlpha = 0.72 + Math.sin(elapsedTime * 3.0) * 0.18;
    (this.groundOuterRuneMesh.material as THREE.MeshBasicMaterial).opacity = runeAlpha;
    (this.groundInnerSealMesh.material as THREE.MeshBasicMaterial).opacity = runeAlpha * 0.95;

    // 3. Greatsword Plasma Aura Sheath
    const swordAuraPulse = tier === 3
      ? 0.55 + Math.sin(elapsedTime * 10.0) * 0.25
      : 0.32 + Math.sin(elapsedTime * 6.0) * 0.15;
    this.swordAuraMaterial.opacity = swordAuraPulse;
    if (tier === 3) {
      this.swordAuraMaterial.color.setHex(0xff0044);
    } else {
      this.swordAuraMaterial.color.setHex(0xff0077);
    }

    // 4. Greatsword Plasma Ember Swirl
    const pos = this.swordEmbers.geometry.attributes.position;
    if (pos) {
      const arr = this.swordEmberPositions;
      const count = arr.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const curY = arr[idx + 1] ?? 0.25;
        const curX = arr[idx] ?? 0;
        const curZ = arr[idx + 2] ?? 0;

        arr[idx + 1] = curY + delta * 0.65; // Drift upward along blade
        arr[idx] = curX + Math.sin(elapsedTime * 6.0 + i) * (delta * 0.05);
        arr[idx + 2] = curZ + Math.cos(elapsedTime * 6.0 + i) * (delta * 0.05);

        if ((arr[idx + 1] ?? 0) > 1.55) {
          arr[idx + 1] = 0.25;
          arr[idx] = (Math.random() - 0.5) * 0.12;
          arr[idx + 2] = (Math.random() - 0.5) * 0.04;
        }
      }
      pos.needsUpdate = true;
    }

    // 5. Dynamic Crackling Plasma Lightning Tendrils
    const lPos = this.lightningLines.geometry.attributes.position;
    if (lPos) {
      const lArr = this.lightningPositions;
      const arcColor = tier === 3 ? 0xff0066 : 0x00f0ff;
      this.lightningLineMaterial.color.setHex(arcColor);
      const isBurst = this.slashProgress > 0 || this.lightningProgress > 0;
      this.lightningLineMaterial.opacity = isBurst ? 1.0 : (Math.random() > 0.3 ? 0.85 : 0.2);

      for (let i = 0; i < 16; i++) {
        const startY = 0.22 + Math.random() * 1.25;
        const startX = (Math.random() - 0.5) * (isBurst ? 0.35 : 0.14);
        const startZ = (Math.random() - 0.5) * 0.06;
        const endY = startY + (Math.random() - 0.4) * 0.25;
        const endX = startX + (Math.random() - 0.5) * 0.18;
        const endZ = startZ + (Math.random() - 0.5) * 0.06;

        const baseIdx = i * 6;
        lArr[baseIdx] = startX;
        lArr[baseIdx + 1] = startY;
        lArr[baseIdx + 2] = startZ;
        lArr[baseIdx + 3] = endX;
        lArr[baseIdx + 4] = endY;
        lArr[baseIdx + 5] = endZ;
      }
      lPos.needsUpdate = true;
    }

    // 5. Steam turned off to preserve 100% crisp, sharp character aesthetics (Zero fogging/blurring)
    this.ecchiSteam.visible = false;
    const steamMat = this.ecchiSteam.material as THREE.PointsMaterial;
    steamMat.opacity = 0.0;

    // Bi-phasic Valkyrie heart reactor core pulse
    const core = this.hierarchy.breastplateGroup?.getObjectByName('Freyja_Heart_Reactor_Core');
    if (core) {
      const heartPhase = (elapsedTime * 3.5) % Math.PI;
      const thump = Math.pow(Math.sin(heartPhase), 8.0) * 0.35 + Math.pow(Math.sin(heartPhase - 0.3), 8.0) * 0.18;
      const coreScale = 1.0 + thump;
      core.scale.set(coreScale, coreScale, coreScale);
    }

    // Damaged Armor Glitch Sparks (Active in Tier 2 and Tier 3)
    const gMat = this.glitchEmbers.material as THREE.PointsMaterial;
    if (tier >= 2) {
      gMat.opacity = (tier === 3 ? 0.95 : 0.65) * (Math.random() > 0.15 ? 1.0 : 0.2);
      gMat.color.setHex(Math.random() > 0.4 ? 0x00f0ff : 0xff0066);
      const gPos = this.glitchEmbers.geometry.attributes.position;
      if (gPos) {
        for (let i = 0; i < 28; i++) {
          const idx = i * 3;
          this.glitchPositions[idx] = (this.glitchPositions[idx] ?? 0) + (Math.random() - 0.5) * 0.015;
          this.glitchPositions[idx + 1] = (this.glitchPositions[idx + 1] ?? 0) + (Math.random() - 0.3) * 0.02;
          if (Math.abs(this.glitchPositions[idx] ?? 0) > 0.18 || (this.glitchPositions[idx + 1] ?? 0) > 1.45) {
            this.glitchPositions[idx] = (Math.random() - 0.5) * 0.16;
            this.glitchPositions[idx + 1] = 1.00 + (Math.random() - 0.5) * 0.25;
            this.glitchPositions[idx + 2] = 0.10 + Math.random() * 0.08;
          }
        }
        gPos.needsUpdate = true;
      }
    } else {
      gMat.opacity = 0.0;
    }

    // 6. Dual-Layer Attack Slash Wave Animation
    if (this.slashProgress > 0) {
      this.slashProgress = Math.max(0, this.slashProgress - delta * 1.5);
      const t = 1 - this.slashProgress;
      const scale = 0.75 + t * 0.95;
      this.slashWaveMesh.scale.set(scale, scale, scale);
      this.slashWaveMesh.rotation.z = -Math.PI * 0.45 + t * 1.85;
      this.slashWaveMaterial.opacity = Math.sin(t * Math.PI) * 0.98;

      this.slashWaveInnerMesh.scale.set(scale * 0.92, scale * 0.92, scale * 0.92);
      this.slashWaveInnerMesh.rotation.z = -Math.PI * 0.45 + t * 1.85;
      this.slashWaveInnerMaterial.opacity = Math.sin(t * Math.PI) * 0.95;
    } else {
      this.slashWaveMaterial.opacity = 0.0;
      this.slashWaveInnerMaterial.opacity = 0.0;
    }

    // 7. Ultimate Dual Ground Shockwave Rings
    if (this.shockwaveProgress > 0) {
      this.shockwaveProgress = Math.max(0, this.shockwaveProgress - delta * 1.2);
      const t = 1 - this.shockwaveProgress;

      // Cyan outer shockwave
      const ringScale1 = 0.5 + t * 4.5;
      this.shockwaveRing.scale.set(ringScale1, ringScale1, 1.0);
      this.shockwaveMaterial.opacity = Math.sin(t * Math.PI) * 0.92;

      // Magenta inner shockwave (slightly delayed and faster expansion)
      const ringScale2 = 0.3 + Math.pow(t, 0.8) * 5.2;
      this.shockwaveRing2.scale.set(ringScale2, ringScale2, 1.0);
      this.shockwaveMaterial2.opacity = Math.sin(t * Math.PI) * 0.85;
    } else {
      this.shockwaveMaterial.opacity = 0.0;
      this.shockwaveMaterial2.opacity = 0.0;
    }

    // 8. Ultimate Lightning Pillar
    if (this.lightningProgress > 0) {
      this.lightningProgress = Math.max(0, this.lightningProgress - delta * 1.1);
      const t = 1 - this.lightningProgress;
      const flicker = Math.random() > 0.20 ? 1.0 : 0.30;
      this.lightningMaterial.opacity = Math.sin(t * Math.PI) * 0.98 * flicker;
      const beamW = 1.0 + Math.sin(t * Math.PI * 4) * 0.50;
      this.lightningBolt.scale.set(beamW, 1.0, beamW);
    } else {
      this.lightningMaterial.opacity = 0.0;
    }
  }

  public dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }
}
