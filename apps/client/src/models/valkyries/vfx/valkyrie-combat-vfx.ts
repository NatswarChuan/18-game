import * as THREE from 'three';

/**
 * Creates a procedural neon gradient texture for combat slash arc ribbons.
 * Tạo texture dải sáng lưỡi liềm phát quang với lõi sáng trắng và vệt năng lượng chuyển màu mượt mà.
 */
function createSlashArcTexture(primaryColorHex: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 128);

    const color = new THREE.Color(primaryColorHex);
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.12, `rgba(${r}, ${g}, ${b}, 0.25)`);
    grad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.95)`);
    grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.98)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 1.0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 64);
    ctx.quadraticCurveTo(256, 4, 512, 0);
    ctx.lineTo(512, 42);
    ctx.quadraticCurveTo(256, 116, 0, 64);
    ctx.closePath();
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates a procedural glowing spark particle texture.
 * Tạo texture hạt tia lửa plasma phát sáng tâm tròn mềm.
 */
function createSparkGlowTexture(primaryColorHex: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const color = new THREE.Color(primaryColorHex);
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, 0.95)`);
    grad.addColorStop(0.70, `rgba(${r}, ${g}, ${b}, 0.45)`);
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

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
 * Creates a procedural vertical gradient texture for energy blast pillars.
 * Tạo texture cột sáng năng lượng nổ thẳng đứng khi giáng tuyệt kỹ.
 */
function createPillarEnergyTexture(primaryColorHex: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 512);

    const color = new THREE.Color(primaryColorHex);
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    const gradV = ctx.createLinearGradient(0, 512, 0, 0);
    gradV.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradV.addColorStop(0.20, `rgba(${r}, ${g}, ${b}, 0.95)`);
    gradV.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, 0.35)`);
    gradV.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, 256, 512);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates a procedural holographic runic summoning circle texture for floor projection.
 * Tạo texture vòng ma trận công nghệ hologram chiếu dưới chân khi tụ lực hoặc giáng đòn.
 */
function createRunicCircleTexture(primaryColorHex: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    const color = new THREE.Color(primaryColorHex);
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
    ctx.lineWidth = 4;

    // Outer circle
    ctx.beginPath();
    ctx.arc(256, 256, 230, 0, Math.PI * 2);
    ctx.stroke();

    // Segmented middle ring
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 185, 0, Math.PI * 2);
    ctx.stroke();

    // Inner ring
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 256, 120, 0, Math.PI * 2);
    ctx.stroke();

    // 6 Hexagonal Nodes
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = 256 + Math.cos(angle) * 185;
      const y = 256 + Math.sin(angle) * 185;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();

      // Radial connector lines
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(angle) * 120, 256 + Math.sin(angle) * 120);
      ctx.lineTo(256 + Math.cos(angle) * 230, 256 + Math.sin(angle) * 230);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

export interface ValkyrieCombatVfxController {
  readonly vfxGroup: THREE.Group;
  readonly triggerSlashVfx: (origin?: THREE.Vector3, dir?: number) => void;
  readonly triggerImpactShockwave: (position?: THREE.Vector3) => void;
  readonly triggerChargeAura: (duration?: number) => void;
  readonly update: (delta: number) => void;
  readonly dispose: () => void;
}

/**
 * Instantiates the High-Fidelity 3D Combat Visual Effects Suite for Valkyrie models:
 * - Dual-layer Neon Crescent Slash Ribbon (white-hot inner blade + neon plasma outer fringe)
 * - Holographic Runic Summoning Circle projecting on the floor
 * - Triple-layer ground impact shockwave rings + vertical laser blast pillar
 * - 96-Particle directional plasma sparks with gravity and air drag
 * - 32-Particle swirling charge energy vortex
 */
export function createValkyrieCombatVfx(primaryColorHex: number): ValkyrieCombatVfxController {
  const vfxGroup = new THREE.Group();
  vfxGroup.name = 'Valkyrie_Combat_VFX_Group';

  const texturesToDispose: THREE.Texture[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // 1. Dual-Layer Crescent Slash Arc Ribbon
  const slashTex = createSlashArcTexture(primaryColorHex);
  texturesToDispose.push(slashTex);

  const slashGeoOuter = new THREE.RingGeometry(0.75, 1.85, 48, 1, 0, Math.PI * 1.25);
  const slashGeoInner = new THREE.RingGeometry(0.95, 1.45, 48, 1, 0, Math.PI * 1.15);
  geometriesToDispose.push(slashGeoOuter, slashGeoInner);

  const slashMatOuter = new THREE.MeshBasicMaterial({
    map: slashTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const slashMatInner = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: slashTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  materialsToDispose.push(slashMatOuter, slashMatInner);

  const slashMeshOuter = new THREE.Mesh(slashGeoOuter, slashMatOuter);
  const slashMeshInner = new THREE.Mesh(slashGeoInner, slashMatInner);
  slashMeshOuter.position.set(0, 1.15, 0.45);
  slashMeshInner.position.set(0, 1.15, 0.46);
  slashMeshOuter.visible = false;
  slashMeshInner.visible = false;
  vfxGroup.add(slashMeshOuter, slashMeshInner);

  let slashActive = false;
  let slashProgress = 0;
  const slashDuration = 0.48;

  // 2. Holographic Floor Runic Summoning Circle
  const runicTex = createRunicCircleTexture(primaryColorHex);
  texturesToDispose.push(runicTex);

  const runicGeo = new THREE.PlaneGeometry(2.4, 2.4);
  geometriesToDispose.push(runicGeo);

  const runicMat = new THREE.MeshBasicMaterial({
    map: runicTex,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  materialsToDispose.push(runicMat);

  const runicMesh = new THREE.Mesh(runicGeo, runicMat);
  runicMesh.rotation.x = -Math.PI / 2;
  runicMesh.position.set(0, 0.012, 0);
  runicMesh.visible = false;
  vfxGroup.add(runicMesh);

  let runicActive = false;
  let runicTimer = 0;
  let runicMaxDuration = 1.0;

  // 3. Ground Impact Shockwave Rings (Triple Layer)
  const shockwaveGeo1 = new THREE.RingGeometry(0.15, 0.55, 48);
  const shockwaveGeo2 = new THREE.RingGeometry(0.40, 0.85, 48);
  const shockwaveGeo3 = new THREE.RingGeometry(0.70, 1.15, 48);
  geometriesToDispose.push(shockwaveGeo1, shockwaveGeo2, shockwaveGeo3);

  const shockwaveMat1 = new THREE.MeshBasicMaterial({
    color: primaryColorHex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const shockwaveMat2 = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const shockwaveMat3 = new THREE.MeshBasicMaterial({
    color: primaryColorHex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  materialsToDispose.push(shockwaveMat1, shockwaveMat2, shockwaveMat3);

  const shockwaveRing1 = new THREE.Mesh(shockwaveGeo1, shockwaveMat1);
  const shockwaveRing2 = new THREE.Mesh(shockwaveGeo2, shockwaveMat2);
  const shockwaveRing3 = new THREE.Mesh(shockwaveGeo3, shockwaveMat3);
  shockwaveRing1.rotation.x = -Math.PI / 2;
  shockwaveRing2.rotation.x = -Math.PI / 2;
  shockwaveRing3.rotation.x = -Math.PI / 2;
  shockwaveRing1.visible = false;
  shockwaveRing2.visible = false;
  shockwaveRing3.visible = false;
  vfxGroup.add(shockwaveRing1, shockwaveRing2, shockwaveRing3);

  let shockwaveActive = false;
  let shockwaveProgress = 0;
  const shockwaveDuration = 0.65;

  // 4. Vertical Dual-Layer Energy Blast Pillar
  const pillarTex = createPillarEnergyTexture(primaryColorHex);
  texturesToDispose.push(pillarTex);

  const pillarGeoOuter = new THREE.CylinderGeometry(0.40, 0.75, 4.2, 32, 1, true);
  const pillarGeoCore = new THREE.CylinderGeometry(0.16, 0.28, 4.4, 16, 1, true);
  geometriesToDispose.push(pillarGeoOuter, pillarGeoCore);

  const pillarMatOuter = new THREE.MeshBasicMaterial({
    map: pillarTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const pillarMatCore = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: pillarTex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  materialsToDispose.push(pillarMatOuter, pillarMatCore);

  const pillarMeshOuter = new THREE.Mesh(pillarGeoOuter, pillarMatOuter);
  const pillarMeshCore = new THREE.Mesh(pillarGeoCore, pillarMatCore);
  pillarMeshOuter.position.set(0, 2.1, 0.45);
  pillarMeshCore.position.set(0, 2.1, 0.45);
  pillarMeshOuter.visible = false;
  pillarMeshCore.visible = false;
  vfxGroup.add(pillarMeshOuter, pillarMeshCore);

  let pillarActive = false;
  let pillarProgress = 0;
  const pillarDuration = 0.58;

  // 5. Radial Plasma Sparks (96 particles)
  const sparkTex = createSparkGlowTexture(primaryColorHex);
  texturesToDispose.push(sparkTex);

  const sparkCount = 96;
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkVelocities: THREE.Vector3[] = [];

  for (let i = 0; i < sparkCount; i++) {
    sparkPositions[i * 3] = 0;
    sparkPositions[i * 3 + 1] = 0;
    sparkPositions[i * 3 + 2] = 0;
    sparkVelocities.push(new THREE.Vector3());
  }

  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  geometriesToDispose.push(sparkGeo);

  const sparkMat = new THREE.PointsMaterial({
    size: 0.24,
    map: sparkTex,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  materialsToDispose.push(sparkMat);

  const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
  sparkPoints.visible = false;
  vfxGroup.add(sparkPoints);

  let sparksActive = false;
  let sparksProgress = 0;
  const sparksDuration = 0.60;

  // 6. Swirling Energy Charge Aura
  const auraCount = 36;
  const auraPositions = new Float32Array(auraCount * 3);
  const auraAngles = new Float32Array(auraCount);
  const auraHeights = new Float32Array(auraCount);
  const auraSpeeds = new Float32Array(auraCount);

  for (let i = 0; i < auraCount; i++) {
    auraAngles[i] = Math.random() * Math.PI * 2;
    auraHeights[i] = Math.random() * 2.2;
    auraSpeeds[i] = 2.8 + Math.random() * 3.5;
    const r = 0.40 + Math.random() * 0.40;
    auraPositions[i * 3] = Math.cos(auraAngles[i] ?? 0) * r;
    auraPositions[i * 3 + 1] = auraHeights[i] ?? 0;
    auraPositions[i * 3 + 2] = Math.sin(auraAngles[i] ?? 0) * r;
  }

  const auraGeo = new THREE.BufferGeometry();
  auraGeo.setAttribute('position', new THREE.BufferAttribute(auraPositions, 3));
  geometriesToDispose.push(auraGeo);

  const auraMat = new THREE.PointsMaterial({
    size: 0.18,
    map: sparkTex,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  materialsToDispose.push(auraMat);

  const auraPoints = new THREE.Points(auraGeo, auraMat);
  auraPoints.visible = false;
  vfxGroup.add(auraPoints);

  let auraActive = false;
  let auraTimer = 0;
  let auraMaxDuration = 0.8;

  // Trigger Functions
  const triggerSlashVfx = (origin?: THREE.Vector3, _dir = 1): void => {
    slashActive = true;
    slashProgress = 0;
    slashMeshOuter.visible = true;
    slashMeshInner.visible = true;
    slashMatOuter.opacity = 1.0;
    slashMatInner.opacity = 1.0;
    slashMeshOuter.scale.set(0.75, 0.75, 0.75);
    slashMeshInner.scale.set(0.70, 0.70, 0.70);
    slashMeshOuter.rotation.z = -Math.PI / 3;
    slashMeshInner.rotation.z = -Math.PI / 3;

    const centerPos = origin ?? new THREE.Vector3(0, 1.15, 0.45);
    slashMeshOuter.position.copy(centerPos);
    slashMeshInner.position.set(centerPos.x, centerPos.y, centerPos.z + 0.01);

    // Radial sparks along trajectory
    sparksActive = true;
    sparksProgress = 0;
    sparkPoints.visible = true;
    sparkMat.opacity = 1.0;

    for (let i = 0; i < sparkCount; i++) {
      const pIdx = i * 3;
      sparkPositions[pIdx] = centerPos.x;
      sparkPositions[pIdx + 1] = centerPos.y;
      sparkPositions[pIdx + 2] = centerPos.z;

      const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 2.0 + Math.random() * 3.5;
      const v = sparkVelocities[i];
      if (v) {
        v.set(
          Math.cos(angle) * speed,
          (Math.random() - 0.2) * speed * 0.9,
          Math.sin(angle) * speed * 0.7 + 0.7
        );
      }
    }
    const posAttr1 = sparkGeo.attributes.position;
    if (posAttr1) posAttr1.needsUpdate = true;
  };

  const triggerImpactShockwave = (position?: THREE.Vector3): void => {
    const hitPos = position ?? new THREE.Vector3(0, 0.015, 0.55);

    // Shockwave rings
    shockwaveActive = true;
    shockwaveProgress = 0;
    shockwaveRing1.visible = true;
    shockwaveRing2.visible = true;
    shockwaveRing3.visible = true;
    shockwaveMat1.opacity = 1.0;
    shockwaveMat2.opacity = 1.0;
    shockwaveMat3.opacity = 0.9;
    shockwaveRing1.scale.set(0.2, 0.2, 0.2);
    shockwaveRing2.scale.set(0.15, 0.15, 0.15);
    shockwaveRing3.scale.set(0.1, 0.1, 0.1);
    shockwaveRing1.position.copy(hitPos);
    shockwaveRing2.position.set(hitPos.x, hitPos.y + 0.005, hitPos.z);
    shockwaveRing3.position.set(hitPos.x, hitPos.y + 0.008, hitPos.z);

    // Runic summoning circle flash
    runicActive = true;
    runicTimer = 0;
    runicMaxDuration = 1.1;
    runicMesh.visible = true;
    runicMat.opacity = 1.0;
    runicMesh.position.set(hitPos.x, hitPos.y + 0.003, hitPos.z);
    runicMesh.scale.set(0.6, 0.6, 0.6);

    // Dual-layer Vertical Energy Pillar
    pillarActive = true;
    pillarProgress = 0;
    pillarMeshOuter.visible = true;
    pillarMeshCore.visible = true;
    pillarMatOuter.opacity = 1.0;
    pillarMatCore.opacity = 1.0;
    pillarMeshOuter.position.set(hitPos.x, hitPos.y + 2.1, hitPos.z);
    pillarMeshCore.position.set(hitPos.x, hitPos.y + 2.1, hitPos.z);
    pillarMeshOuter.scale.set(1.0, 0.1, 1.0);
    pillarMeshCore.scale.set(1.0, 0.1, 1.0);

    // Radial sparks
    sparksActive = true;
    sparksProgress = 0;
    sparkPoints.visible = true;
    sparkMat.opacity = 1.0;

    for (let i = 0; i < sparkCount; i++) {
      const pIdx = i * 3;
      sparkPositions[pIdx] = hitPos.x;
      sparkPositions[pIdx + 1] = hitPos.y + 0.05;
      sparkPositions[pIdx + 2] = hitPos.z;

      const angle = (i / sparkCount) * Math.PI * 2;
      const speed = 2.8 + Math.random() * 4.2;
      const v = sparkVelocities[i];
      if (v) {
        v.set(
          Math.cos(angle) * speed,
          Math.random() * 3.4 + 1.1,
          Math.sin(angle) * speed
        );
      }
    }
    const posAttr2 = sparkGeo.attributes.position;
    if (posAttr2) posAttr2.needsUpdate = true;
  };

  const triggerChargeAura = (duration = 0.8): void => {
    auraActive = true;
    auraTimer = 0;
    auraMaxDuration = duration;
    auraPoints.visible = true;
    auraMat.opacity = 0.95;

    runicActive = true;
    runicTimer = 0;
    runicMaxDuration = duration;
    runicMesh.visible = true;
    runicMat.opacity = 0.85;
    runicMesh.position.set(0, 0.012, 0);
    runicMesh.scale.set(1.0, 1.0, 1.0);
  };

  // Update loop
  const update = (delta: number): void => {
    // 1. Slash Arc
    if (slashActive) {
      slashProgress += delta;
      const t = Math.min(1, slashProgress / slashDuration);
      if (t < 1) {
        const easeOut = 1 - Math.pow(1 - t, 2.2);
        slashMeshOuter.scale.set(0.75 + easeOut * 1.1, 0.75 + easeOut * 1.1, 1);
        slashMeshInner.scale.set(0.70 + easeOut * 1.0, 0.70 + easeOut * 1.0, 1);
        slashMeshOuter.rotation.z = -Math.PI / 3 + easeOut * (Math.PI * 0.95);
        slashMeshInner.rotation.z = -Math.PI / 3 + easeOut * (Math.PI * 0.95);
        slashMatOuter.opacity = 1 - Math.pow(t, 1.8);
        slashMatInner.opacity = 1 - Math.pow(t, 1.4);
      } else {
        slashActive = false;
        slashMeshOuter.visible = false;
        slashMeshInner.visible = false;
        slashMatOuter.opacity = 0;
        slashMatInner.opacity = 0;
      }
    }

    // 2. Shockwave Rings
    if (shockwaveActive) {
      shockwaveProgress += delta;
      const t = Math.min(1, shockwaveProgress / shockwaveDuration);
      if (t < 1) {
        const expand1 = 0.2 + t * 5.2;
        const expand2 = 0.15 + t * 4.4;
        const expand3 = 0.1 + t * 3.6;
        shockwaveRing1.scale.set(expand1, expand1, 1);
        shockwaveRing2.scale.set(expand2, expand2, 1);
        shockwaveRing3.scale.set(expand3, expand3, 1);
        shockwaveMat1.opacity = (1 - t) * 0.95;
        shockwaveMat2.opacity = (1 - t) * 0.85;
        shockwaveMat3.opacity = (1 - t) * 0.75;
      } else {
        shockwaveActive = false;
        shockwaveRing1.visible = false;
        shockwaveRing2.visible = false;
        shockwaveRing3.visible = false;
      }
    }

    // 3. Runic Summoning Circle
    if (runicActive) {
      runicTimer += delta;
      if (runicTimer < runicMaxDuration) {
        runicMesh.rotation.z += delta * 1.5;
        const fade = 1 - runicTimer / runicMaxDuration;
        runicMat.opacity = fade * 0.95;
        const s = 1.0 + (runicTimer / runicMaxDuration) * 0.45;
        runicMesh.scale.set(s, s, s);
      } else {
        runicActive = false;
        runicMesh.visible = false;
        runicMat.opacity = 0;
      }
    }

    // 4. Energy Blast Pillar
    if (pillarActive) {
      pillarProgress += delta;
      const t = Math.min(1, pillarProgress / pillarDuration);
      if (t < 1) {
        const pScaleY = Math.min(1.0, t * 5.5);
        const pScaleXZ = 1.0 + t * 0.9;
        pillarMeshOuter.scale.set(pScaleXZ, pScaleY, pScaleXZ);
        pillarMeshCore.scale.set(pScaleXZ * 0.65, pScaleY, pScaleXZ * 0.65);
        pillarMatOuter.opacity = Math.sin(t * Math.PI) * 0.95;
        pillarMatCore.opacity = Math.sin(t * Math.PI) * 1.0;
        pillarMeshOuter.rotation.y += delta * 5;
        pillarMeshCore.rotation.y -= delta * 7;
      } else {
        pillarActive = false;
        pillarMeshOuter.visible = false;
        pillarMeshCore.visible = false;
      }
    }

    // 5. Sparks
    if (sparksActive) {
      sparksProgress += delta;
      const t = Math.min(1, sparksProgress / sparksDuration);
      if (t < 1) {
        sparkMat.opacity = 1 - t;
        const posAttr = sparkGeo.attributes.position;
        if (posAttr) {
          for (let i = 0; i < sparkCount; i++) {
            const pIdx = i * 3;
            const vel = sparkVelocities[i];
            if (vel) {
              sparkPositions[pIdx] = (sparkPositions[pIdx] ?? 0) + vel.x * delta;
              sparkPositions[pIdx + 1] = (sparkPositions[pIdx + 1] ?? 0) + vel.y * delta;
              sparkPositions[pIdx + 2] = (sparkPositions[pIdx + 2] ?? 0) + vel.z * delta;
              vel.y -= 7.5 * delta;
              vel.multiplyScalar(Math.exp(-5.0 * delta));
            }
          }
          posAttr.needsUpdate = true;
        }
      } else {
        sparksActive = false;
        sparkPoints.visible = false;
      }
    }

    // 6. Charge Aura
    if (auraActive) {
      auraTimer += delta;
      if (auraTimer < auraMaxDuration) {
        const auraPosAttr = auraGeo.attributes.position;
        if (auraPosAttr) {
          for (let i = 0; i < auraCount; i++) {
            const spd = auraSpeeds[i] ?? 3;
            auraAngles[i] = (auraAngles[i] ?? 0) + spd * delta;
            auraHeights[i] = ((auraHeights[i] ?? 0) + delta * 2.8) % 2.4;
            const r = 0.40 + (auraHeights[i] ?? 0) * 0.20;

            const pIdx = i * 3;
            auraPositions[pIdx] = Math.cos(auraAngles[i] ?? 0) * r;
            auraPositions[pIdx + 1] = auraHeights[i] ?? 0;
            auraPositions[pIdx + 2] = Math.sin(auraAngles[i] ?? 0) * r;
          }
          auraPosAttr.needsUpdate = true;
        }
        auraMat.opacity = THREE.MathUtils.lerp(0.95, 0.0, auraTimer / auraMaxDuration);
      } else {
        auraActive = false;
        auraPoints.visible = false;
      }
    }
  };

  const dispose = (): void => {
    texturesToDispose.forEach((t) => t.dispose());
    materialsToDispose.forEach((m) => m.dispose());
    geometriesToDispose.forEach((g) => g.dispose());
    vfxGroup.clear();
  };

  return {
    vfxGroup,
    triggerSlashVfx,
    triggerImpactShockwave,
    triggerChargeAura,
    update,
    dispose
  };
}
