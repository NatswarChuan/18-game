import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from '../valkyrie-3d-types.js';
import {
  injectAnimeRimLight,
  getSharedSkinToonRamp,
  getSharedToonRamp
} from '../anime-shader/anime-cel-shader.js';

import { createValkyrie3DWeapon, createValkyrie3DHalo } from '../../../utils/valkyrie-3d-figure-builder.js';
import { createValkyrieCombatVfx } from '../vfx/valkyrie-combat-vfx.js';

const TARGET_ANIME_HEIGHT = 1.72;

export type DeniaPoseMode = 'ARMS_CROSSED' | 'STAND' | 'HAND_ON_HIP';

export interface DeniaFBXModelInstance extends Valkyrie3DModelInstance {
  readonly setPose: (pose: DeniaPoseMode) => Promise<void>;
  readonly triggerPoke: () => void;
}

/**
 * Creates a soft radial vapor steam texture for 18+ Sensual Climax Heat Haze.
 */
function createSensualSteamTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0.0, 'rgba(255, 230, 245, 0.75)');
    grad.addColorStop(0.35, 'rgba(255, 190, 225, 0.45)');
    grad.addColorStop(0.70, 'rgba(255, 160, 205, 0.18)');
    grad.addColorStop(1.0, 'rgba(255, 160, 205, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates diamond cloth/spangle fragment texture for cloth-tearing explosions.
 */
function createClothFragmentTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(16, 2);
    ctx.lineTo(30, 18);
    ctx.lineTo(16, 28);
    ctx.lineTo(2, 18);
    ctx.closePath();
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}

/**
 * Creates electric plasma arc / spark texture for 18+ Climax skin lightning.
 */
function createElectricSparkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(16, 16, 1, 16, 16, 15);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.25, 'rgba(255, 50, 150, 0.95)');
    grad.addColorStop(0.65, 'rgba(0, 240, 255, 0.45)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  return texture;
}


/**
 * Loads and renders the authentic sculpted 3D Denia Anime character model from ZaneAtega's repository:
 * - 226,242 multi-polygon sculpted mesh
 * - Accurate bone hierarchy with Arms-Crossed, Stand & Hand-on-Hip poses
 * - Array of 8 discrete Anime PBR materials with green chroma cutoff and GPU Anime Fresnel Rim Lighting
 * - Organic idle breathing motion (spine and head oscillation)
 * - 3D Cyber Weapon and Faction Halo dynamically attached
 * - 3 Cloth Damage Tiers (Pristine, Torn, Climax Extreme).
 * 
 * @param config - Model initialization configuration.
 * @param initialPose - Starting pose (defaults to 'ARMS_CROSSED').
 * @returns Instantiated DeniaFBXModelInstance.
 */
export async function loadZaneAtegaDeniaModel(
  config: ValkyrieModelInitConfig,
  initialPose: DeniaPoseMode = 'STAND'
): Promise<DeniaFBXModelInstance> {
  const textureLoader = new THREE.TextureLoader();
  const texBase = '/models/textures/Denia_2/';

  const loadTex = (file: string): THREE.Texture => {
    const tex = textureLoader.load(`${texBase}${file}`);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  const faceTex = loadTex('T_R2T1DaniyaMd10011Face_D.png');
  const hairTex = loadTex('T_R2T1DaniyaMd10011Hair_D.png');
  const bangsTex = loadTex('T_R2T1DaniyaMd10011Bangs_D.png');
  const clothTex = loadTex('T_R2T1DaniyaMd10011Cloth_D.png');
  const upTex = loadTex('T_R2T1DaniyaMd10011Up_D.png');
  const downTex = loadTex('T_R2T1DaniyaMd10011Down_D.png');
  const eyeTex = loadTex('T_R2T1DaniyaMd10011Eye_D.png');

  const fbxLoader = new FBXLoader();
  const fbx = await fbxLoader.loadAsync('/models/Denia_2.fbx');

  const rootGroup = new THREE.Group();
  rootGroup.name = `ZaneAtega_Denia_${config.valkyrieId}`;

  // 1. Skeletal Bone Registry & Baseline Transforms
  const pelvisBone = fbx.getObjectByName('Bip001Pelvis') ?? fbx.getObjectByName('Bip001 Pelvis') ?? fbx.getObjectByName('腰');
  const spineBone = fbx.getObjectByName('Bip001Spine') ?? fbx.getObjectByName('Bip001 Spine');
  const spine1Bone = fbx.getObjectByName('Bip001Spine1') ?? fbx.getObjectByName('Bip001 Spine1');
  const spine2Bone = fbx.getObjectByName('Bip001Spine2') ?? fbx.getObjectByName('Bip001 Spine2');
  const neckBone = fbx.getObjectByName('Bip001Neck') ?? fbx.getObjectByName('Bip001 Neck');
  const headBone = fbx.getObjectByName('Bip001Head') ?? fbx.getObjectByName('Bip001 Head');

  const rClavicle = fbx.getObjectByName('Bip001RClavicle') ?? fbx.getObjectByName('Bip001 R Clavicle');
  const lClavicle = fbx.getObjectByName('Bip001LClavicle') ?? fbx.getObjectByName('Bip001 L Clavicle');
  const rUpperArm = fbx.getObjectByName('Bip001RUpperArm') ?? fbx.getObjectByName('Bip001 R UpperArm');
  const rForearm = fbx.getObjectByName('Bip001RForearm') ?? fbx.getObjectByName('Bip001 R Forearm');
  const rHand = fbx.getObjectByName('Bip001RHand') ?? fbx.getObjectByName('Bip001 R Hand');
  const lUpperArm = fbx.getObjectByName('Bip001LUpperArm') ?? fbx.getObjectByName('Bip001 L UpperArm');
  const lForearm = fbx.getObjectByName('Bip001LForearm') ?? fbx.getObjectByName('Bip001 L Forearm');
  const lHand = fbx.getObjectByName('Bip001LHand') ?? fbx.getObjectByName('Bip001 L Hand');

  const rThigh = fbx.getObjectByName('Bip001RThigh') ?? fbx.getObjectByName('Bip001 R Thigh');
  const lThigh = fbx.getObjectByName('Bip001LThigh') ?? fbx.getObjectByName('Bip001 L Thigh');
  const rCalf = fbx.getObjectByName('Bip001RCalf') ?? fbx.getObjectByName('Bip001 R Calf');
  const lCalf = fbx.getObjectByName('Bip001LCalf') ?? fbx.getObjectByName('Bip001 L Calf');
  const rFoot = fbx.getObjectByName('Bip001RFoot') ?? fbx.getObjectByName('Bip001 R Foot');
  const lFoot = fbx.getObjectByName('Bip001LFoot') ?? fbx.getObjectByName('Bip001 L Foot');

  // Bust / Breast Physics Bones (18+ Anime Aesthetic)
  const chestBoneL1 = fbx.getObjectByName('Bone_Chest001_L');
  const chestBoneL2 = fbx.getObjectByName('Bone_Chest002_L');
  const chestBoneR1 = fbx.getObjectByName('Bone_Chest001_R');
  const chestBoneR2 = fbx.getObjectByName('Bone_Chest002_R');

  // Secondary Physics Hair, Ribbon & Skirt Cloth Bones
  interface ClothBoneNode {
    readonly bone: THREE.Object3D;
    readonly group: number;
    readonly depth: number;
    readonly side: 'L' | 'R' | 'M';
    readonly baseRot: THREE.Euler;
  }
  const clothBoneNodes: ClothBoneNode[] = [];
  fbx.traverse((child) => {
    if (child.name.startsWith('Bone_Piao')) {
      const match = child.name.match(/^Bone_Piao(\d{2})(\d+)_([LRM])$/);
      if (match) {
        clothBoneNodes.push({
          bone: child,
          group: parseInt(match[1] ?? '0', 10),
          depth: parseInt(match[2] ?? '1', 10),
          side: (match[3] as 'L' | 'R' | 'M') ?? 'M',
          baseRot: child.rotation.clone()
        });
      } else {
        clothBoneNodes.push({
          bone: child,
          group: 9,
          depth: 1,
          side: 'M',
          baseRot: child.rotation.clone()
        });
      }
    }
  });

  // Delicate Living Finger Bones
  const rFingers: THREE.Object3D[] = [];
  const lFingers: THREE.Object3D[] = [];
  fbx.traverse((child) => {
    if (child.name.startsWith('Bip001RFinger') || child.name.startsWith('Bip001 R Finger')) {
      rFingers.push(child);
    } else if (child.name.startsWith('Bip001LFinger') || child.name.startsWith('Bip001 L Finger')) {
      lFingers.push(child);
    }
  });

  const basePelvisQuat = new THREE.Quaternion();
  const basePelvisPos = new THREE.Vector3();
  const baseSpineQuat = new THREE.Quaternion();
  const baseSpine1Quat = new THREE.Quaternion();
  const baseSpine2Quat = new THREE.Quaternion();
  const baseNeckQuat = new THREE.Quaternion();
  const baseHeadQuat = new THREE.Quaternion();

  const baseRClavQuat = new THREE.Quaternion();
  const baseRArmQuat = new THREE.Quaternion();
  const baseRForeQuat = new THREE.Quaternion();
  const baseRHandQuat = new THREE.Quaternion();
  const baseLClavQuat = new THREE.Quaternion();
  const baseLArmQuat = new THREE.Quaternion();
  const baseLForeQuat = new THREE.Quaternion();
  const baseLHandQuat = new THREE.Quaternion();

  const baseRThighQuat = new THREE.Quaternion();
  const baseLThighQuat = new THREE.Quaternion();
  const baseRCalfQuat = new THREE.Quaternion();
  const baseLCalfQuat = new THREE.Quaternion();
  const baseRFootQuat = new THREE.Quaternion();
  const baseLFootQuat = new THREE.Quaternion();

  const baseChestL1Quat = new THREE.Quaternion();
  const baseChestL2Quat = new THREE.Quaternion();
  const baseChestR1Quat = new THREE.Quaternion();
  const baseChestR2Quat = new THREE.Quaternion();
  const baseRFingerRots: THREE.Euler[] = [];
  const baseLFingerRots: THREE.Euler[] = [];

  const recordBaseBoneTransforms = (): void => {
    if (pelvisBone) {
      basePelvisQuat.copy(pelvisBone.quaternion);
      basePelvisPos.copy(pelvisBone.position);
    }
    if (spineBone) baseSpineQuat.copy(spineBone.quaternion);
    if (spine1Bone) baseSpine1Quat.copy(spine1Bone.quaternion);
    if (spine2Bone) baseSpine2Quat.copy(spine2Bone.quaternion);
    if (neckBone) baseNeckQuat.copy(neckBone.quaternion);
    if (headBone) baseHeadQuat.copy(headBone.quaternion);

    if (rClavicle) baseRClavQuat.copy(rClavicle.quaternion);
    if (rUpperArm) baseRArmQuat.copy(rUpperArm.quaternion);
    if (rForearm) baseRForeQuat.copy(rForearm.quaternion);
    if (rHand) baseRHandQuat.copy(rHand.quaternion);
    if (lClavicle) baseLClavQuat.copy(lClavicle.quaternion);
    if (lUpperArm) baseLArmQuat.copy(lUpperArm.quaternion);
    if (lForearm) baseLForeQuat.copy(lForearm.quaternion);
    if (lHand) baseLHandQuat.copy(lHand.quaternion);

    if (rThigh) baseRThighQuat.copy(rThigh.quaternion);
    if (lThigh) baseLThighQuat.copy(lThigh.quaternion);
    if (rCalf) baseRCalfQuat.copy(rCalf.quaternion);
    if (lCalf) baseLCalfQuat.copy(lCalf.quaternion);
    if (rFoot) baseRFootQuat.copy(rFoot.quaternion);
    if (lFoot) baseLFootQuat.copy(lFoot.quaternion);

    if (chestBoneL1) baseChestL1Quat.copy(chestBoneL1.quaternion);
    if (chestBoneL2) baseChestL2Quat.copy(chestBoneL2.quaternion);
    if (chestBoneR1) baseChestR1Quat.copy(chestBoneR1.quaternion);
    if (chestBoneR2) baseChestR2Quat.copy(chestBoneR2.quaternion);

    for (const node of clothBoneNodes) {
      node.baseRot.copy(node.bone.rotation);
    }

    baseRFingerRots.length = 0;
    for (const b of rFingers) {
      baseRFingerRots.push(b.rotation.clone());
    }
    baseLFingerRots.length = 0;
    for (const b of lFingers) {
      baseLFingerRots.push(b.rotation.clone());
    }
  };

  // Record baseline sculptor bind transforms immediately upon loading FBX (Prevents identity quat corruption)
  recordBaseBoneTransforms();

  // Function to Apply Skeletal Pose from JSON (Pristine author quaternions, 0 Euler corruption)
  const applyPose = async (poseMode: DeniaPoseMode): Promise<void> => {
    const posePath = poseMode === 'ARMS_CROSSED'
      ? '/models/poses/Denia_2/Arms-Crossed.json'
      : poseMode === 'HAND_ON_HIP'
      ? '/models/poses/Denia_3/Hand-on-Hip.json'
      : '/models/poses/Denia/Stand.json';

    try {
      const response = await fetch(posePath);
      if (!response.ok) return;
      const poseData = (await response.json()) as Record<
        string,
        { readonly position?: number[]; readonly quaternion?: number[]; readonly scale?: number[] }
      >;

      for (const [boneName, transform] of Object.entries(poseData)) {
        const bone = fbx.getObjectByName(boneName);
        if (bone) {
          // Only apply root translation to Bip001 or Bip001Pelvis (Preserves limb joint socket integrity)
          if (transform.position && (boneName === 'Bip001' || boneName === 'Bip001Pelvis')) {
            bone.position.fromArray(transform.position);
          }
          if (transform.quaternion) {
            bone.quaternion.fromArray(transform.quaternion);
          }
        }
      }

      fbx.updateMatrixWorld(true);
      recordBaseBoneTransforms();
    } catch (err) {
      console.warn('Failed to apply Denia pose:', err);
    }
  };

  // Apply initial pose before calculating world bounds
  await applyPose(initialPose);

  // 2. Automated Bounds Normalization (Auto-scale to 1.72m & align feet firmly at Y = 0)
  const rawBox = new THREE.Box3().setFromObject(fbx);
  const rawSize = new THREE.Vector3();
  rawBox.getSize(rawSize);

  const scaleFactor = rawSize.y > 0.1 ? TARGET_ANIME_HEIGHT / rawSize.y : 0.01225;
  fbx.scale.set(scaleFactor, scaleFactor, scaleFactor);
  fbx.updateMatrixWorld(true);

  // Recalculate scaled box to center in X/Z and place feet at Y = 0
  const scaledBox = new THREE.Box3().setFromObject(fbx);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  fbx.position.x = -center.x;
  fbx.position.z = -center.z;
  fbx.position.y = -scaledBox.min.y;

  rootGroup.add(fbx);

  // Combat Visual Effects Suite
  const combatVfx = createValkyrieCombatVfx(config.primaryColor);
  rootGroup.add(combatVfx.vfxGroup);

  // 3. Build 8 Multi-Material Anime Cel-Shading Slots with Inverted Ink Silhouette & Eye Glow
  const factionColor = config.primaryColor ?? 0x00f0ff;
  const isAbyssal = config.faction === 'ABYSSAL_EDEN';
  const isSol = config.faction === 'SOL_DYNASTY';

  const hairRim = isAbyssal ? 0xff2a85 : isSol ? 0xffdf88 : 0xffc8dc;
  const clothRim = isAbyssal ? 0xff0066 : isSol ? 0xffd700 : 0x00f0ff;

  // Slot 0: Face (Porcelain skin ramp, soft peach shadow - NO rim light for pristine anime features)
  const matFace = new THREE.MeshToonMaterial({
    map: faceTex,
    color: 0xfff6f2,
    gradientMap: getSharedSkinToonRamp(),
    side: THREE.DoubleSide
  });

  // Slot 1: Cloth (Outer decorative shawl fabric)
  const matCloth = new THREE.MeshToonMaterial({
    map: clothTex,
    gradientMap: getSharedToonRamp(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1.0
  });
  injectAnimeRimLight(matCloth, clothRim, 0.35, 3.8);

  // Slot 2: Fx (Particle veil mesh in FBX — transparent to avoid obstructing neck & porcelain chest)
  const matFx = new THREE.MeshBasicMaterial({
    color: clothRim,
    transparent: true,
    opacity: 0.0,
    depthWrite: false
  });

  // Slot 3: Eye (Anime Eye unshaded luminous sparkle: crystal sharp starry reflections)
  const matEye = new THREE.MeshBasicMaterial({
    map: eyeTex,
    side: THREE.FrontSide
  });

  // Slot 4: Bangs (Front hair with delicate edge rim highlight)
  const matBangs = new THREE.MeshToonMaterial({
    map: bangsTex,
    gradientMap: getSharedToonRamp(),
    side: THREE.DoubleSide
  });
  injectAnimeRimLight(matBangs, hairRim, 0.28, 4.2);

  // Slot 5: Hair (Back hair volume with subtle silhouette rim)
  const matHair = new THREE.MeshToonMaterial({
    map: hairTex,
    gradientMap: getSharedToonRamp(),
    side: THREE.DoubleSide
  });
  injectAnimeRimLight(matHair, hairRim, 0.28, 4.2);

  // Slot 6: Up (Body, Porcelain Skin, Decolletage, Arms & Inner Battle Leotard)
  const matUp = new THREE.MeshToonMaterial({
    map: upTex,
    color: 0xfff6f2,
    gradientMap: getSharedSkinToonRamp(),
    side: THREE.DoubleSide
  });
  injectAnimeRimLight(matUp, clothRim, 0.25, 3.8);

  // Slot 7: Down (Outer battle dress: bodice, pleated skirt, petticoat & stockings)
  const matDown = new THREE.MeshToonMaterial({
    map: downTex,
    gradientMap: getSharedToonRamp(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1.0
  });
  injectAnimeRimLight(matDown, clothRim, 0.30, 3.8);

  const materialsList: THREE.Material[] = [
    matFace,  // 0: MI_R2T1DaniyaMd10011Face
    matCloth, // 1: MI_R2T1DaniyaMd10011Cloth
    matFx,    // 2: MI_R2T1DaniyaMd10011Fx (transparent, clears chest)
    matEye,   // 3: MI_R2T1DaniyaMd10011Eye (unshaded starry anime eyes)
    matBangs, // 4: MI_R2T1DaniyaMd10011Bangs (cel-shaded hair)
    matHair,  // 5: MI_R2T1DaniyaMd10011Hair (cel-shaded hair)
    matUp,    // 6: MI_R2T1DaniyaMd10011Up
    matDown   // 7: MI_R2T1DaniyaMd10011Down
  ];

  fbx.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = materialsList;
      child.frustumCulled = false;
      if (child.geometry) {
        child.geometry.computeBoundingBox();
        child.geometry.computeBoundingSphere();
      }
    }
  });
  fbx.frustumCulled = false;
  rootGroup.frustumCulled = false;

  // Attach 3D Sculpted Cyber Weapon dynamically floating beside Denia
  const weapon = createValkyrie3DWeapon(config.valkyrieId, factionColor);
  weapon.name = 'Denia_Weapon';
  rootGroup.add(weapon);

  // Attach 3D Faction Energy Halo behind head
  // Attach 3D Faction Energy Halo behind head
  const halo = createValkyrie3DHalo(factionColor, config.tier);
  halo.name = 'Denia_Halo';
  halo.position.set(0, 1.82, -0.08);
  rootGroup.add(halo);

  // 3b. Sensual Heat Haze Steam System (Active during Tier 3 Climax Extreme)
  const STEAM_COUNT = 44;
  const steamGeo = new THREE.BufferGeometry();
  const steamPositions = new Float32Array(STEAM_COUNT * 3);
  const steamVelocities: { x: number; y: number; z: number; startY: number; speed: number; phase: number }[] = [];

  for (let i = 0; i < STEAM_COUNT; i++) {
    const rx = (Math.random() - 0.5) * 0.10;
    const ry = 1.02 + Math.random() * 0.28; // Tightly focused on cleavage and abdomen
    const rz = 0.06 + (Math.random() - 0.5) * 0.08;
    steamPositions[i * 3] = rx;
    steamPositions[i * 3 + 1] = ry;
    steamPositions[i * 3 + 2] = rz;
    steamVelocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: 0.12 + Math.random() * 0.14,
      z: (Math.random() - 0.5) * 0.02,
      startY: ry,
      speed: 0.12 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2
    });
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

  const steamTex = createSensualSteamTexture();
  const steamMat = new THREE.PointsMaterial({
    size: 0.12,
    map: steamTex,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xfff2f8
  });
  const steamPoints = new THREE.Points(steamGeo, steamMat);
  steamPoints.name = 'Denia_SensualSteam';
  steamPoints.visible = false;
  rootGroup.add(steamPoints);

  // 3c. Cloth Shred Particle Explosion System (Triggers when entering Tier 2 / 3)
  const BURST_COUNT = 72;
  const burstGeo = new THREE.BufferGeometry();
  const burstPositions = new Float32Array(BURST_COUNT * 3);
  const burstColors = new Float32Array(BURST_COUNT * 3);
  const burstData: { vx: number; vy: number; vz: number; life: number; maxLife: number }[] = [];

  for (let i = 0; i < BURST_COUNT; i++) {
    burstPositions[i * 3] = 0;
    burstPositions[i * 3 + 1] = -50;
    burstPositions[i * 3 + 2] = 0;
    burstColors[i * 3] = 1;
    burstColors[i * 3 + 1] = 0.8;
    burstColors[i * 3 + 2] = 0.9;
    burstData.push({ vx: 0, vy: 0, vz: 0, life: 0, maxLife: 1.0 });
  }
  burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
  burstGeo.setAttribute('color', new THREE.BufferAttribute(burstColors, 3));

  const burstTex = createClothFragmentTexture();
  const burstMat = new THREE.PointsMaterial({
    size: 0.22,
    map: burstTex,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });
  const burstPoints = new THREE.Points(burstGeo, burstMat);
  burstPoints.name = 'Denia_ClothBurst';
  burstPoints.visible = false;
  rootGroup.add(burstPoints);

  let burstTimer = 0;

  // 3d. Floor Overdrive Energy Ring (Pulsing tactical circle beneath feet)
  const ringGeo = new THREE.RingGeometry(0.55, 0.76, 48);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff1166,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const overdriveRing = new THREE.Mesh(ringGeo, ringMat);
  overdriveRing.position.y = 0.015;
  overdriveRing.visible = false;
  rootGroup.add(overdriveRing);

  // 3e. Electrical Arc Sparks across bare skin (Active during Tier 3)
  const LIGHTNING_COUNT = 28;
  const lightningGeo = new THREE.BufferGeometry();
  const lightningPositions = new Float32Array(LIGHTNING_COUNT * 3);
  for (let i = 0; i < LIGHTNING_COUNT; i++) {
    lightningPositions[i * 3] = (Math.random() - 0.5) * 0.28;
    lightningPositions[i * 3 + 1] = 0.65 + Math.random() * 0.75;
    lightningPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.22;
  }
  lightningGeo.setAttribute('position', new THREE.BufferAttribute(lightningPositions, 3));
  const lightningTex = createElectricSparkTexture();
  const lightningMat = new THREE.PointsMaterial({
    size: 0.14,
    map: lightningTex,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0x00f0ff
  });
  const lightningPoints = new THREE.Points(lightningGeo, lightningMat);
  lightningPoints.name = 'Denia_LightningSparks';
  lightningPoints.visible = false;
  rootGroup.add(lightningPoints);

  // 3f. Orbiting Shattered Armor Crystal Shards
  const ORBIT_COUNT = 18;
  const orbitShardGeo = new THREE.BufferGeometry();
  const orbitShardPositions = new Float32Array(ORBIT_COUNT * 3);
  for (let i = 0; i < ORBIT_COUNT; i++) {
    orbitShardPositions[i * 3] = 0;
    orbitShardPositions[i * 3 + 1] = 0.95;
    orbitShardPositions[i * 3 + 2] = 0;
  }
  orbitShardGeo.setAttribute('position', new THREE.BufferAttribute(orbitShardPositions, 3));
  const orbitShardTex = createClothFragmentTexture();
  const orbitShardMat = new THREE.PointsMaterial({
    size: 0.16,
    map: orbitShardTex,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffaa00
  });
  const orbitShardPoints = new THREE.Points(orbitShardGeo, orbitShardMat);
  orbitShardPoints.name = 'Denia_OrbitShards';
  orbitShardPoints.visible = false;
  rootGroup.add(orbitShardPoints);





  // 4. Facial Blendshape / Morph Target Indexing
  const findMorphMesh = (): THREE.Mesh | null => {
    let found: THREE.Mesh | null = null;
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh && child.morphTargetDictionary) {
        found = child;
      }
    });
    return found;
  };

  const morphMesh = findMorphMesh();
  const morphDict: Record<string, number> = morphMesh?.morphTargetDictionary ?? {};
  const morphInfluences: number[] | undefined = morphMesh?.morphTargetInfluences;

  const blinkRIdx = morphDict['E_Close_R'];
  const blinkLIdx = morphDict['E_Close_L'];
  const smileRIdx = morphDict['M_Smile_R'];
  const smileLIdx = morphDict['M_Smile_L'];

  // Apply subtle natural waifu smile
  if (morphInfluences) {
    if (smileRIdx !== undefined) morphInfluences[smileRIdx] = 0.22;
    if (smileLIdx !== undefined) morphInfluences[smileLIdx] = 0.22;
  }

  let currentTier: ClothDamageTier = config.tier;
  let attackShake = 0;
  let animTimer = 0;
  let blinkTimer = 0;
  let nextBlinkInterval = 3.2;
  let isBlinking = false;
  let blinkProgress = 0;
  let isDoubleBlinking = false;
  const initialY = fbx.position.y;
  let attackProgress = 0;
  let isAttacking = false;
  let ultProgress = 0;
  let isUlting = false;
  let hitProgress = 0;
  let isHitted = false;
  let isPoked = false;
  let pokeProgress = 0;

  // Living Anime Kinematics State Tracking (Interactive Gaze & Spontaneous Fidgets)
  let currentGazeYaw = 0;
  let currentGazePitch = 0;
  let saccadeTimer = 0;
  let nextSaccadeInterval = 1.8;
  let saccadeTargetYaw = 0;
  let saccadeTargetPitch = 0;
  let saccadeCurrentYaw = 0;
  let saccadeCurrentPitch = 0;
  // Seamless Action-to-Idle Cross-Fade Timer (Zero snap/jerk)
  let actionBlendTimer = 0;
  const ACTION_BLEND_DURATION = 0.35;

  // Soft-Body Second-Order Spring Damper Physics for Bust (Zero robotic oscillations)
  let bustSpringDisp = 0;
  let bustSpringVel = 0;

  const triggerClothBurst = (tier: ClothDamageTier, _fromTier?: ClothDamageTier): void => {
    burstTimer = 1.45;
    burstMat.opacity = 1.0;
    burstPoints.visible = true;
    attackShake = tier === 3 ? 0.35 : tier === 2 ? 0.18 : 0.08;

    const isTier3 = tier === 3;
    const isRestoring = tier === 1;
    const posAttr = burstGeo.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = burstGeo.getAttribute('color') as THREE.BufferAttribute;

    for (let i = 0; i < BURST_COUNT; i++) {
      posAttr.setXYZ(
        i,
        (Math.random() - 0.5) * 0.26,
        1.08 + (Math.random() - 0.5) * 0.32,
        0.06 + (Math.random() - 0.5) * 0.15
      );

      const angle = Math.random() * Math.PI * 2;
      const speed = isRestoring ? 0.6 + Math.random() * 0.9 : 1.2 + Math.random() * 2.2;
      burstData[i] = {
        vx: Math.cos(angle) * speed,
        vy: isRestoring ? 0.6 + Math.random() * 1.4 : 0.8 + Math.random() * 2.2,
        vz: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.95 + Math.random() * 0.60
      };

      if (isTier3) {
        const mix = Math.random();
        colAttr.setXYZ(i, 1.0, mix > 0.4 ? 0.10 : 0.70, mix > 0.4 ? 0.40 : 0.95);
      } else if (isRestoring) {
        colAttr.setXYZ(i, 0.0, 0.94, 1.0);
      } else {
        colAttr.setXYZ(i, 1.0, 0.85 + Math.random() * 0.15, 0.30 + Math.random() * 0.40);
      }
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  };

  // Seamless Continuous Cloth Damage Transition (Dissolve / Reconstruct & Emissive Flash)
  let clothTransitionTimer = 0;
  const CLOTH_TRANSITION_DURATION = 0.85;
  let clothTransitionFromTier: ClothDamageTier = currentTier;
  let clothTransitionToTier: ClothDamageTier = currentTier;

  // Snapshot starting states for C1 continuous Hermite S-curve blending (Zero abrupt jumps)
  let startClothOpacity = 1.0;
  let startDownOpacity = 1.0;
  let startUpEmissiveIntensity = 0.0;
  let startDownEmissiveIntensity = 0.0;
  let startHaloScale = 1.0;
  const startFaceColor = new THREE.Color(0xfff6f2);
  const startUpEmissiveColor = new THREE.Color(0x000000);
  const startDownEmissiveColor = new THREE.Color(0x000000);

  const targetFaceColor = new THREE.Color(0xfff6f2);
  let targetHaloScale = 1.0;
  const targetUpEmissiveColor = new THREE.Color(0x000000);
  let targetUpEmissiveIntensity = 0.0;
  const targetDownEmissiveColor = new THREE.Color(0x000000);
  let targetDownEmissiveIntensity = 0.0;
  let targetClothOpacity = 1.0;
  let targetDownOpacity = 1.0;
  let targetRingOpacity = 0.0;
  const targetRingColor = new THREE.Color(0xff0055);
  const targetWeaponColor = new THREE.Color(factionColor);
  let targetBlinkInfluence = 0.0;
  let targetSmileInfluence = 0.22;

  const updateClothTierVisibility = (tier: ClothDamageTier): void => {
    const prevTier = currentTier;
    if (prevTier === tier && clothTransitionTimer <= 0) return;

    currentTier = tier;
    clothTransitionFromTier = prevTier;
    clothTransitionToTier = tier;
    clothTransitionTimer = CLOTH_TRANSITION_DURATION;

    // Snapshot current state for velvet smooth S-curve interpolation
    startClothOpacity = matCloth.opacity;
    startDownOpacity = matDown.opacity;
    startUpEmissiveIntensity = matUp.emissiveIntensity;
    startDownEmissiveIntensity = matDown.emissiveIntensity;
    startHaloScale = halo.scale.x;
    startFaceColor.copy(matFace.color);
    startUpEmissiveColor.copy(matUp.emissive);
    startDownEmissiveColor.copy(matDown.emissive);

    // Awaken meshes at start of transition
    matCloth.visible = true;
    matCloth.transparent = true;
    matDown.visible = true;
    matDown.transparent = true;

    triggerClothBurst(tier, prevTier);

    if (tier === 3) {
      // Tier 3: Climax Extreme (Dress surges with blazing crimson plasma overdrive, baring shoulders/neckline with full solid anatomy)
      targetClothOpacity = 0.0; // Decorative shawl stripped, baring shoulders and collarbone
      targetDownOpacity = 1.0;  // Dress remains 100% solid & opaque: preserves complete sculpted body with zero hollow gaps!
      targetFaceColor.setHex(0xffcfd9); // Hot flushed bedroom glow
      targetBlinkInfluence = 0.42;
      targetSmileInfluence = 0.65;
      targetHaloScale = 1.42;
      targetUpEmissiveColor.setHex(0x660028);
      targetUpEmissiveIntensity = 0.65;
      targetDownEmissiveColor.setHex(0x880038); // Blazing crimson plasma overdrive veins
      targetDownEmissiveIntensity = 0.65;
      targetRingColor.setHex(0xff0055);
      targetRingOpacity = 0.90;
      targetWeaponColor.setHex(0xff0055);

      orbitShardMat.color.setHex(0xff0055);
      orbitShardPoints.visible = true;
      lightningPoints.visible = true;
      overdriveRing.visible = true;
      steamPoints.visible = true;
    } else if (tier === 2) {
      // Tier 2: Torn Armor (Outer shawl shattered/stripped, solid dress surges with molten gold battle fracture veins)
      targetClothOpacity = 0.0; // Shawl removed
      targetDownOpacity = 1.0;  // 100% solid and opaque: eliminates see-through into hollow interior
      targetFaceColor.setHex(0xffeef2); // Soft warm peach blush
      targetBlinkInfluence = 0.18;
      targetSmileInfluence = 0.38;
      targetHaloScale = 1.18;
      targetUpEmissiveColor.setHex(0x332211);
      targetUpEmissiveIntensity = 0.30;
      targetDownEmissiveColor.setHex(0x553311); // Molten golden fracture lines
      targetDownEmissiveIntensity = 0.45;
      targetRingColor.setHex(0xffaa00);
      targetRingOpacity = 0.55;
      targetWeaponColor.setHex(0xffaa00);

      orbitShardMat.color.setHex(0xffbb22);
      orbitShardPoints.visible = true;
      lightningPoints.visible = false;
      overdriveRing.visible = true;
      steamPoints.visible = false;
    } else {
      // Tier 1: Pristine Holy Robe (Full dress, full shawl, porcelain purity)
      targetClothOpacity = 1.0;
      targetDownOpacity = 1.0; // 100% solid royal gown
      targetFaceColor.setHex(0xfff6f2); // Pure porcelain
      targetBlinkInfluence = 0.0;
      targetSmileInfluence = 0.22;
      targetHaloScale = 1.0;
      targetUpEmissiveColor.setHex(0x000000);
      targetUpEmissiveIntensity = 0.0;
      targetDownEmissiveColor.setHex(0x000000);
      targetDownEmissiveIntensity = 0.0;
      targetRingOpacity = 0.0;
      targetWeaponColor.setHex(factionColor);

      orbitShardPoints.visible = false;
      lightningPoints.visible = false;
      steamPoints.visible = false;
    }
  };

  updateClothTierVisibility(currentTier);

  const update = (delta: number, _elapsedTime: number, state: UnitCombatVisualState): void => {
    animTimer += delta;

    // Natural Organic Eye Blinking with smooth tier-aware target blend
    const baseEyelid = THREE.MathUtils.damp(
      morphInfluences && blinkRIdx !== undefined ? morphInfluences[blinkRIdx] ?? 0 : 0,
      targetBlinkInfluence,
      4.0,
      delta
    );
    const baseSmile = THREE.MathUtils.damp(
      morphInfluences && smileRIdx !== undefined ? morphInfluences[smileRIdx] ?? 0.22 : 0.22,
      targetSmileInfluence,
      4.0,
      delta
    );

    blinkTimer += delta;
    if (!isBlinking && blinkTimer >= nextBlinkInterval) {
      isBlinking = true;
      blinkProgress = 0;
      blinkTimer = 0;
      isDoubleBlinking = Math.random() < 0.35; // 35% chance of charming anime double-blink
      nextBlinkInterval = 2.4 + Math.random() * 2.8;
    }

    if (isBlinking && morphInfluences) {
      blinkProgress += delta;
      const blinkDuration = isDoubleBlinking ? 0.36 : 0.18;
      if (blinkProgress <= blinkDuration) {
        let blinkWeight = 0;
        if (!isDoubleBlinking) {
          const u = blinkProgress / blinkDuration;
          blinkWeight = (0.5 - 0.5 * Math.cos(u * Math.PI * 2)) * (1.0 - baseEyelid);
        } else {
          const p = blinkProgress / blinkDuration;
          if (p < 0.45) {
            const u = p / 0.45;
            blinkWeight = (0.5 - 0.5 * Math.cos(u * Math.PI * 2)) * (1.0 - baseEyelid);
          } else if (p > 0.55) {
            const u = (p - 0.55) / 0.45;
            blinkWeight = (0.5 - 0.5 * Math.cos(u * Math.PI * 2)) * (1.0 - baseEyelid);
          }
        }
        if (blinkRIdx !== undefined) morphInfluences[blinkRIdx] = Math.min(1.0, baseEyelid + blinkWeight);
        if (blinkLIdx !== undefined) morphInfluences[blinkLIdx] = Math.min(1.0, baseEyelid + blinkWeight);
      } else {
        isBlinking = false;
        if (blinkRIdx !== undefined) morphInfluences[blinkRIdx] = baseEyelid;
        if (blinkLIdx !== undefined) morphInfluences[blinkLIdx] = baseEyelid;
      }
    } else if (morphInfluences) {
      if (blinkRIdx !== undefined) morphInfluences[blinkRIdx] = baseEyelid;
      if (blinkLIdx !== undefined) morphInfluences[blinkLIdx] = baseEyelid;
      if (smileRIdx !== undefined) morphInfluences[smileRIdx] = baseSmile;
      if (smileLIdx !== undefined) morphInfluences[smileLIdx] = baseSmile;
    }

    // 🌟 CONTINUOUS MULTI-TIER CLOTH TRANSITION & DISINTEGRATION DISSOLVE
    if (clothTransitionTimer > 0) {
      clothTransitionTimer = Math.max(0, clothTransitionTimer - delta);
      const p = 1.0 - (clothTransitionTimer / CLOTH_TRANSITION_DURATION);
      // C1 Continuous Hermite Cosine S-Curve (zero initial and terminal derivative)
      const smoothP = 0.5 - 0.5 * Math.cos(p * Math.PI);
      const edgeArc = Math.sin(p * Math.PI);

      // Exact smooth Hermite opacity dissolve across both cloth elements
      matCloth.opacity = THREE.MathUtils.lerp(startClothOpacity, targetClothOpacity, smoothP);
      matDown.opacity = THREE.MathUtils.lerp(startDownOpacity, targetDownOpacity, smoothP);

      // Cinematic edge emission wave along dissolving/reconstructing seams
      if (clothTransitionToTier >= 2 && clothTransitionFromTier === 1) {
        // Tearing: Molten gold / crimson plasma burn wave
        const burnColor = clothTransitionToTier === 3 ? 0xff0055 : 0xffaa00;
        matCloth.emissive.setHex(burnColor);
        matCloth.emissiveIntensity = edgeArc * 2.6;
        matDown.emissive.setHex(burnColor);
        matDown.emissiveIntensity = THREE.MathUtils.lerp(startDownEmissiveIntensity, targetDownEmissiveIntensity, smoothP) + edgeArc * 1.8;
      } else if (clothTransitionToTier === 1 && clothTransitionFromTier >= 2) {
        // Reconstructing: Celestial cyan nanite weave wave
        matCloth.emissive.setHex(0x00f0ff);
        matCloth.emissiveIntensity = edgeArc * 2.2;
        matDown.emissive.setHex(0x00f0ff);
        matDown.emissiveIntensity = edgeArc * 1.8;
      } else if (clothTransitionToTier === 3 && clothTransitionFromTier === 2) {
        // Tier 2 -> 3: Full plasma stripping
        const surgeColor = new THREE.Color(0xff0055);
        matDown.emissive.lerp(surgeColor, edgeArc * 0.9);
        matDown.emissiveIntensity = THREE.MathUtils.lerp(startDownEmissiveIntensity, targetDownEmissiveIntensity, smoothP) + edgeArc * 1.6;
      } else {
        matDown.emissive.lerp(targetDownEmissiveColor, smoothP);
        matDown.emissiveIntensity = THREE.MathUtils.lerp(startDownEmissiveIntensity, targetDownEmissiveIntensity, smoothP);
      }

      // Material color & glow interpolations
      matFace.color.lerpColors(startFaceColor, targetFaceColor, smoothP);
      matUp.color.lerpColors(startFaceColor, targetFaceColor, smoothP);
      matUp.emissive.lerpColors(startUpEmissiveColor, targetUpEmissiveColor, smoothP);
      matUp.emissiveIntensity = THREE.MathUtils.lerp(startUpEmissiveIntensity, targetUpEmissiveIntensity, smoothP) + edgeArc * 0.6;

      const currentHaloScale = THREE.MathUtils.lerp(startHaloScale, targetHaloScale, smoothP);
      halo.scale.set(currentHaloScale, currentHaloScale, currentHaloScale);

      // Final settling on completion
      if (clothTransitionTimer <= 0) {
        matCloth.opacity = targetClothOpacity;
        matDown.opacity = targetDownOpacity;
        matUp.emissiveIntensity = targetUpEmissiveIntensity;
        matDown.emissiveIntensity = targetDownEmissiveIntensity;
        matDown.emissive.copy(targetDownEmissiveColor);
        matUp.emissive.copy(targetUpEmissiveColor);
        matFace.color.copy(targetFaceColor);
        matUp.color.copy(targetFaceColor);
        halo.scale.set(targetHaloScale, targetHaloScale, targetHaloScale);
      }
    } else {
      // Continuous gentle settling damp
      matFace.color.lerp(targetFaceColor, delta * 3.5);
      matUp.color.lerp(targetFaceColor, delta * 3.5);
      matUp.emissive.lerp(targetUpEmissiveColor, delta * 4.0);
      matUp.emissiveIntensity = THREE.MathUtils.damp(matUp.emissiveIntensity, targetUpEmissiveIntensity, 4.0, delta);
      matDown.emissive.lerp(targetDownEmissiveColor, delta * 4.0);
      matDown.emissiveIntensity = THREE.MathUtils.damp(matDown.emissiveIntensity, targetDownEmissiveIntensity, 4.0, delta);
      matCloth.opacity = THREE.MathUtils.damp(matCloth.opacity, targetClothOpacity, 5.0, delta);
      matDown.opacity = THREE.MathUtils.damp(matDown.opacity, targetDownOpacity, 5.0, delta);
    }

    // Material visibility & depth sorting guards (100% artifact-free)
    matCloth.visible = matCloth.opacity > 0.005;
    matCloth.depthWrite = matCloth.opacity > 0.70;

    // matDown (Dress) is ALWAYS 100% opaque, solid, and non-transparent to preserve complete sculpted anatomy!
    matDown.visible = true;
    matDown.opacity = 1.0;
    matDown.transparent = false;
    matDown.depthWrite = true;
    matDown.side = THREE.DoubleSide;

    ringMat.color.lerp(targetRingColor, delta * 4.0);
    ringMat.opacity = THREE.MathUtils.damp(ringMat.opacity, targetRingOpacity, 4.0, delta);
    overdriveRing.visible = ringMat.opacity > 0.02;

    weapon.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        for (const m of mats) {
          if (m instanceof THREE.MeshBasicMaterial || m instanceof THREE.MeshStandardMaterial) {
            m.color.lerp(targetWeaponColor, delta * 4.0);
          }
        }
      }
    });

    // Update Cloth Fragment Burst Particles (Gentle floating satin & ember drift)
    if (burstTimer > 0) {
      burstTimer -= delta;
      burstMat.opacity = Math.max(0, burstTimer / 1.35);
      const posAttr = burstGeo.getAttribute('position') as THREE.BufferAttribute;

      for (let i = 0; i < BURST_COUNT; i++) {
        const data = burstData[i];
        if (!data) continue;
        data.life += delta;
        if (data.life < data.maxLife) {
          data.vx *= Math.exp(-2.2 * delta);
          data.vz *= Math.exp(-2.2 * delta);
          data.vy = THREE.MathUtils.damp(data.vy, -0.35, 1.8, delta);
          const flutter = Math.sin(animTimer * 8.0 + i * 1.5) * 0.06 * delta;
          const cx = posAttr.getX(i) + (data.vx + flutter) * delta;
          const cy = posAttr.getY(i) + data.vy * delta;
          const cz = posAttr.getZ(i) + (data.vz + flutter * 0.5) * delta;
          posAttr.setXYZ(i, cx, cy, cz);
        } else {
          posAttr.setY(i, -50);
        }
      }
      posAttr.needsUpdate = true;

      if (burstTimer <= 0) {
        burstPoints.visible = false;
      }
    }

    // Update Persistent Orbiting Shattered Armor Shards (Harmonic Keplerian trajectory)
    if (currentTier >= 2) {
      orbitShardPoints.visible = true;
      orbitShardMat.opacity = 0.85;
      const shardPos = orbitShardGeo.getAttribute('position') as THREE.BufferAttribute;
      const orbitSpeed = currentTier === 3 ? 1.8 : 1.2;
      for (let i = 0; i < ORBIT_COUNT; i++) {
        const angle = animTimer * orbitSpeed + (i / ORBIT_COUNT) * Math.PI * 2;
        const radius = 0.44 + Math.sin(animTimer * 1.5 + i * 1.2) * 0.05;
        const ox = Math.cos(angle) * radius;
        const oy = 0.95 + Math.sin(animTimer * 2.0 + i * 1.5) * 0.12;
        const oz = Math.sin(angle) * radius;
        shardPos.setXYZ(i, ox, oy, oz);
      }
      shardPos.needsUpdate = true;
    } else {
      orbitShardPoints.visible = false;
    }

    // Update Skin Electrical Plasma Lightning (Tier 3 Smooth Helical Plasma Arcs)
    if (currentTier === 3) {
      lightningPoints.visible = true;
      // Gentle ethereal aura pulse without jarring strobes
      lightningMat.opacity = 0.75 + Math.sin(animTimer * 5.0) * 0.18;
      lightningMat.color.setHex(0x00f0ff);
      const lightPos = lightningGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < LIGHTNING_COUNT; i++) {
        const phase = animTimer * 1.8 + (i / LIGHTNING_COUNT) * Math.PI * 4;
        const radius = 0.22 + Math.sin(phase * 1.5 + i) * 0.05;
        const yProgress = ((animTimer * 0.6 + i / LIGHTNING_COUNT) % 1.0);
        const y = 0.45 + yProgress * 1.15;
        const rx = Math.cos(phase) * radius;
        const rz = Math.sin(phase) * radius;
        lightPos.setXYZ(i, rx, y, rz);
      }
      lightPos.needsUpdate = true;
    } else {
      lightningPoints.visible = false;
    }

    // Update Tier 3 Overdrive Energy Floor Ring
    if (currentTier === 3) {
      ringMat.opacity = 0.82 + Math.sin(animTimer * 3.5) * 0.12;
      overdriveRing.rotation.y += delta * 1.2;
    } else if (currentTier === 2) {
      ringMat.opacity = 0.50 + Math.sin(animTimer * 2.5) * 0.10;
      overdriveRing.rotation.y += delta * 0.6;
    }

    // Update Sensual Heat Haze Steam Vapor (Active during Tier 3 Climax Extreme)
    if (currentTier === 3) {
      steamPoints.visible = true;
      steamMat.opacity = 0.55 + Math.sin(animTimer * 2.8) * 0.15;
      const steamPos = steamGeo.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < STEAM_COUNT; i++) {
        const vel = steamVelocities[i];
        if (!vel) continue;
        let cy = steamPos.getY(i) + vel.speed * delta;
        if (cy > vel.startY + 0.38) {
          cy = vel.startY;
          steamPos.setX(i, (Math.random() - 0.5) * 0.12);
          steamPos.setZ(i, 0.06 + (Math.random() - 0.5) * 0.08);
        }
        steamPos.setY(i, cy);
        steamPos.setX(i, steamPos.getX(i) + Math.sin(animTimer * 2.5 + vel.phase) * 0.003 * delta);
      }
      steamPos.needsUpdate = true;
    } else {
      steamPoints.visible = false;
    }

    // Update Combat Visual Effects
    combatVfx.update(delta);

    // Smooth Kinetic Model Reaction (Sinusoidal impulse rather than random white noise)
    if (attackShake > 0.001) {
      attackShake = Math.max(0, attackShake - delta * 3.8);
      const shakeOffset = Math.sin(animTimer * 38.0) * attackShake * 0.06;
      fbx.position.x = -center.x + shakeOffset;
    } else {
      fbx.position.x = -center.x;
    }

    // Dynamic 3D Combat Action Animations with Full Skeletal Motion & Living Kinematics
    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);
    const easeInQuad = (x: number): number => x * x;
    const easeOutQuad = (x: number): number => 1 - (1 - x) * (1 - x);
    const smoothCos = (x: number): number => 0.5 - 0.5 * Math.cos(Math.PI * THREE.MathUtils.clamp(x, 0, 1));

    const tierBreatheFreq = currentTier === 3 ? 1.25 : currentTier === 2 ? 1.05 : 0.85;
    const tierBustMult = currentTier === 3 ? 1.85 : currentTier === 2 ? 1.40 : 1.10;

    let targetBustDisplacement = 0;
    let targetFingerCurl = 0;
    let hairImpulsePitch = 0;
    let hairImpulseRoll = 0;
    let totalBreath = 0;
    let effectiveStance = 0;
    let idleBlendWeight = 0;

    const HINGE_Z = new THREE.Vector3(0, 0, 1);
    const PITCH_Z = new THREE.Vector3(0, 0, 1);

    if (isAttacking) {
      attackProgress += delta;
      const attackDuration = 0.90;
      const t = Math.min(1, attackProgress / attackDuration);
      if (t < 1) {
        if (t < 0.26) {
          // Phase 1: Wind-up & Anticipation (Nâng đại kiếm chuẩn bị chém)
          const p = easeInQuad(t / 0.26);
          fbx.position.z = -center.z - p * 0.12;

          // Right arm raises weapon with natural shoulder & elbow kinematics
          if (rUpperArm) {
            const armQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -p * 0.40)
              .multiply(new THREE.Quaternion().setFromAxisAngle(HINGE_Z, p * 0.45));
            rUpperArm.quaternion.copy(baseRArmQuat).multiply(armQ);
          }
          if (rForearm) {
            // Elbow hinges strictly on local Z
            const elbowQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, -p * 0.85);
            rForearm.quaternion.copy(baseRForeQuat).multiply(elbowQ);
          }
          if (spineBone) {
            const spineQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -p * 0.15);
            spineBone.quaternion.copy(baseSpineQuat).multiply(spineQ);
          }

          if (weapon) {
            weapon.position.set(
              THREE.MathUtils.lerp(0.42, 0.65, p),
              THREE.MathUtils.lerp(1.05, 1.65, p),
              THREE.MathUtils.lerp(0.08, -0.45, p)
            );
            weapon.rotation.set(
              THREE.MathUtils.lerp(0.08, -0.75, p),
              THREE.MathUtils.lerp(-0.15, 0.45, p),
              THREE.MathUtils.lerp(-0.12, -0.95, p)
            );
          }
          targetFingerCurl = p * 0.50;
          targetBustDisplacement = -p * 0.08 * tierBustMult;
        } else if (t < 0.52) {
          // Phase 2: Explosive Forward Slash (Trảm kích đại kiếm uy mãnh)
          const p = easeOutCubic((t - 0.26) / 0.26);
          fbx.position.z = -center.z - 0.12 + p * 0.42;

          if (rUpperArm) {
            const armQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.lerp(-0.40, 0.35, p))
              .multiply(new THREE.Quaternion().setFromAxisAngle(HINGE_Z, THREE.MathUtils.lerp(0.45, -0.30, p)));
            rUpperArm.quaternion.copy(baseRArmQuat).multiply(armQ);
          }
          if (rForearm) {
            const elbowQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, THREE.MathUtils.lerp(-0.85, -0.15, p));
            rForearm.quaternion.copy(baseRForeQuat).multiply(elbowQ);
          }
          if (spineBone) {
            const spineQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.lerp(-0.15, 0.20, p));
            spineBone.quaternion.copy(baseSpineQuat).multiply(spineQ);
          }

          if (weapon) {
            weapon.position.set(
              THREE.MathUtils.lerp(0.65, -0.55, p),
              THREE.MathUtils.lerp(1.65, 0.85, p),
              THREE.MathUtils.lerp(-0.45, 0.95, p)
            );
            weapon.rotation.set(
              THREE.MathUtils.lerp(-0.75, 1.45, p),
              THREE.MathUtils.lerp(0.45, -0.85, p),
              THREE.MathUtils.lerp(-0.95, 1.65, p)
            );
          }

          if (p >= 0.20 && !hasTriggeredAttackVfx) {
            hasTriggeredAttackVfx = true;
            combatVfx.triggerSlashVfx(new THREE.Vector3(0, 1.15, 0.60));
          }
          targetFingerCurl = 0.50;
          targetBustDisplacement = Math.sin(p * Math.PI) * 0.18 * tierBustMult;
        } else if (t < 0.72) {
          // Phase 3: Hitstop Vibration Frame
          const p = (t - 0.52) / 0.20;
          const hitstopVibe = Math.sin(p * Math.PI * 10) * Math.exp(-p * 3.0) * 0.015;
          fbx.position.z = -center.z + 0.30 - p * 0.05;

          if (weapon) {
            weapon.position.set(-0.55 + hitstopVibe, 0.85, 0.95);
          }
          targetBustDisplacement = Math.sin(p * Math.PI * 4) * 0.08 * tierBustMult;
        } else {
          // Phase 4: Smooth Recovery to Base Pose
          const p = easeOutCubic((t - 0.72) / 0.28);
          fbx.position.z = THREE.MathUtils.lerp(-center.z + 0.25, -center.z, p);

          if (rUpperArm) rUpperArm.quaternion.slerp(baseRArmQuat, p);
          if (rForearm) rForearm.quaternion.slerp(baseRForeQuat, p);
          if (spineBone) spineBone.quaternion.slerp(baseSpineQuat, p);

          if (weapon) {
            weapon.position.set(
              THREE.MathUtils.lerp(-0.55, 0.42, p),
              THREE.MathUtils.lerp(0.85, 1.05, p),
              THREE.MathUtils.lerp(0.95, 0.08, p)
            );
            weapon.rotation.set(
              THREE.MathUtils.lerp(1.45, 0.08, p),
              THREE.MathUtils.lerp(-0.85, -0.15, p),
              THREE.MathUtils.lerp(1.65, -0.12, p)
            );
          }
          targetFingerCurl = (1 - p) * 0.50;
        }
      } else {
        isAttacking = false;
        fbx.position.z = -center.z;
        actionBlendTimer = ACTION_BLEND_DURATION;
        if (rUpperArm) rUpperArm.quaternion.copy(baseRArmQuat);
        if (rForearm) rForearm.quaternion.copy(baseRForeQuat);
        if (spineBone) spineBone.quaternion.copy(baseSpineQuat);
        if (weapon) {
          weapon.position.set(0.42, 1.05, 0.08);
          weapon.rotation.set(0.08, -0.15, -0.12);
        }
      }
    } else if (isUlting) {
      ultProgress += delta;
      const ultDuration = 1.80;
      const t = Math.min(1, ultProgress / ultDuration);
      if (t < 1) {
        if (t < 0.28) {
          // Phase 1: Singularity Charge (Hạ trọng tâm nạp năng lượng)
          const p = easeInQuad(t / 0.28);
          fbx.position.y = initialY - p * 0.12;

          // Knees hinge bend strictly on local Z
          if (rCalf) {
            const kneeQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, p * 0.45);
            rCalf.quaternion.copy(baseRCalfQuat).multiply(kneeQ);
          }
          if (lCalf) {
            const kneeQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, p * 0.45);
            lCalf.quaternion.copy(baseLCalfQuat).multiply(kneeQ);
          }
          if (spineBone) {
            const spineQ = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, p * 0.15);
            spineBone.quaternion.copy(baseSpineQuat).multiply(spineQ);
          }

          if (weapon) {
            weapon.position.set(0.42 - p * 0.20, 1.05 - p * 0.35, 0.08 + p * 0.15);
          }
          if (halo) halo.rotation.z += delta * 12;
          targetBustDisplacement = -p * 0.10 * tierBustMult;
        } else if (t < 0.58) {
          // Phase 2: Stratospheric Sky Ascent (Bật nhảy thăng thiên, gập gối tự nhiên)
          const p = easeOutCubic((t - 0.28) / 0.30);
          fbx.position.y = initialY - 0.12 + p * 1.85;
          fbx.position.z = -center.z - p * 0.25;

          // Leg flight kinematics: knees tuck gracefully on hinge Z
          if (rCalf) {
            const kneeQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, 0.45 + p * 0.75);
            rCalf.quaternion.copy(baseRCalfQuat).multiply(kneeQ);
          }
          if (lCalf) {
            const kneeQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, 0.45 + p * 0.85);
            lCalf.quaternion.copy(baseLCalfQuat).multiply(kneeQ);
          }

          // Arms raise overhead
          if (rUpperArm) {
            const armQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -p * 0.55)
              .multiply(new THREE.Quaternion().setFromAxisAngle(HINGE_Z, p * 1.25));
            rUpperArm.quaternion.copy(baseRArmQuat).multiply(armQ);
          }
          if (lUpperArm) {
            const armQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), p * 0.55)
              .multiply(new THREE.Quaternion().setFromAxisAngle(HINGE_Z, -p * 1.25));
            lUpperArm.quaternion.copy(baseLArmQuat).multiply(armQ);
          }

          if (weapon) {
            weapon.position.set(0.22 - p * 0.18, 0.70 + p * 3.30, 0.23 - p * 0.15);
          }
          if (halo) halo.rotation.z += delta * 24;
          targetBustDisplacement = p * 0.20 * tierBustMult;
        } else if (t < 0.78) {
          // Phase 3: Meteor Plunge Slam (Giáng lôi thiên phạt oanh tạc)
          const p = easeInQuad((t - 0.58) / 0.20);
          fbx.position.y = initialY + 1.73 - p * 1.85;
          fbx.position.z = -center.z - 0.25 + p * 0.65;

          if (rCalf) {
            const kneeQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, (1 - p) * 1.20 + p * 0.50);
            rCalf.quaternion.copy(baseRCalfQuat).multiply(kneeQ);
          }
          if (lCalf) {
            const kneeQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, (1 - p) * 1.30 + p * 0.50);
            lCalf.quaternion.copy(baseLCalfQuat).multiply(kneeQ);
          }

          if (weapon) {
            weapon.position.set(0.04, 4.00 - p * 3.90, 0.08 + p * 0.90);
          }

          if (p >= 0.50 && !hasTriggeredUltVfx) {
            hasTriggeredUltVfx = true;
            combatVfx.triggerImpactShockwave(new THREE.Vector3(0, 0.02, 1.05));
            attackShake = 0.45;
          }
          targetBustDisplacement = 0.30 * tierBustMult;
        } else {
          // Phase 4: Heroic Rise & Recovery
          const p = easeOutCubic((t - 0.78) / 0.22);
          fbx.position.y = THREE.MathUtils.lerp(initialY - 0.12, initialY, p);
          fbx.position.z = THREE.MathUtils.lerp(-center.z + 0.40, -center.z, p);

          if (rCalf) rCalf.quaternion.slerp(baseRCalfQuat, p);
          if (lCalf) lCalf.quaternion.slerp(baseLCalfQuat, p);
          if (rUpperArm) rUpperArm.quaternion.slerp(baseRArmQuat, p);
          if (lUpperArm) lUpperArm.quaternion.slerp(baseLArmQuat, p);
          if (spineBone) spineBone.quaternion.slerp(baseSpineQuat, p);

          if (weapon) {
            weapon.position.set(
              THREE.MathUtils.lerp(0.04, 0.42, p),
              THREE.MathUtils.lerp(0.10, 1.05, p),
              THREE.MathUtils.lerp(0.98, 0.08, p)
            );
            weapon.rotation.set(
              THREE.MathUtils.lerp(Math.PI / 2.05, 0.08, p),
              THREE.MathUtils.lerp(0, -0.15, p),
              THREE.MathUtils.lerp(0, -0.12, p)
            );
          }
        }
      } else {
        isUlting = false;
        fbx.position.y = initialY;
        fbx.position.z = -center.z;
        actionBlendTimer = ACTION_BLEND_DURATION;
        if (rCalf) rCalf.quaternion.copy(baseRCalfQuat);
        if (lCalf) lCalf.quaternion.copy(baseLCalfQuat);
        if (rUpperArm) rUpperArm.quaternion.copy(baseRArmQuat);
        if (lUpperArm) lUpperArm.quaternion.copy(baseLArmQuat);
        if (spineBone) spineBone.quaternion.copy(baseSpineQuat);
        if (weapon) {
          weapon.position.set(0.42, 1.05, 0.08);
          weapon.rotation.set(0.08, -0.15, -0.12);
        }
      }
    } else if (isHitted) {
      hitProgress += delta;
      const hitDuration = 0.36;
      const t = Math.min(1, hitProgress / hitDuration);
      if (t < 1) {
        const flinch = Math.sin(t * Math.PI);
        fbx.position.z = -center.z - flinch * 0.18;
        if (spineBone) {
          const spineQ = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, -flinch * 0.15);
          spineBone.quaternion.copy(baseSpineQuat).multiply(spineQ);
        }
        if (headBone) {
          const headQ = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, -flinch * 0.12);
          headBone.quaternion.copy(baseHeadQuat).multiply(headQ);
        }
        targetBustDisplacement = flinch * 0.22 * tierBustMult;
      } else {
        isHitted = false;
        fbx.position.z = -center.z;
        if (spineBone) spineBone.quaternion.copy(baseSpineQuat);
        if (headBone) headBone.quaternion.copy(baseHeadQuat);
        actionBlendTimer = ACTION_BLEND_DURATION;
      }
    } else if (isPoked) {
      // 🌸 Tương Tác Cưng Nựng (Waifu Poke / Touch Reaction)
      pokeProgress += delta;
      const pokeDuration = 1.25;
      const t = Math.min(1, pokeProgress / pokeDuration);
      if (t < 1) {
        if (t < 0.24) {
          // Phase 1: Surprised Gasp & Shy Flinch
          const p = easeOutCubic(t / 0.24);
          fbx.position.z = -center.z - p * 0.08;
          if (spineBone) {
            const spineQ = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, -p * 0.08);
            spineBone.quaternion.copy(baseSpineQuat).multiply(spineQ);
          }
          if (headBone) {
            const headQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -p * 0.08, p * 0.06, 'YXZ'));
            headBone.quaternion.copy(baseHeadQuat).multiply(headQ);
          }

          // Left hand raises demurely toward collarbone: elbow hinges strictly on local Z
          if (lForearm) {
            const elbowQ = new THREE.Quaternion().setFromAxisAngle(HINGE_Z, -p * 0.85);
            lForearm.quaternion.copy(baseLForeQuat).multiply(elbowQ);
          }
          if (lUpperArm) {
            const armQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), p * 0.30);
            lUpperArm.quaternion.copy(baseLArmQuat).multiply(armQ);
          }

          // Cute blushing face
          matFace.color.setHex(0xffb8c8);
          if (morphInfluences) {
            if (blinkRIdx !== undefined) morphInfluences[blinkRIdx] = 0.10;
            if (blinkLIdx !== undefined) morphInfluences[blinkLIdx] = 0.10;
            if (smileRIdx !== undefined) morphInfluences[smileRIdx] = 0.58;
            if (smileLIdx !== undefined) morphInfluences[smileLIdx] = 0.58;
          }
          targetBustDisplacement = p * 0.10 * tierBustMult;
        } else if (t < 0.72) {
          // Phase 2: Bashful Giggle
          const p = (t - 0.24) / 0.48;
          const giggle = Math.sin(p * Math.PI * 6) * 0.015;
          if (headBone) {
            const headQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.08 + giggle, 0.06, 'YXZ'));
            headBone.quaternion.copy(baseHeadQuat).multiply(headQ);
          }
          targetBustDisplacement = (0.08 + giggle * 2) * tierBustMult;
        } else {
          // Phase 3: Gentle Sweet Recovery
          const p = easeOutQuad((t - 0.72) / 0.28);
          fbx.position.z = THREE.MathUtils.lerp(-center.z - 0.08, -center.z, p);
          if (spineBone) spineBone.quaternion.slerp(baseSpineQuat, p);
          if (headBone) headBone.quaternion.slerp(baseHeadQuat, p);
          if (lForearm) lForearm.quaternion.slerp(baseLForeQuat, p);
          if (lUpperArm) lUpperArm.quaternion.slerp(baseLArmQuat, p);

          matFace.color.lerp(
            new THREE.Color(currentTier === 3 ? 0xffcfd9 : currentTier === 2 ? 0xffeef2 : 0xfff6f2),
            p
          );
          targetBustDisplacement = (1 - p) * 0.08 * tierBustMult;
        }
      } else {
        isPoked = false;
        fbx.position.z = -center.z;
        if (spineBone) spineBone.quaternion.copy(baseSpineQuat);
        if (headBone) headBone.quaternion.copy(baseHeadQuat);
        if (lForearm) lForearm.quaternion.copy(baseLForeQuat);
        if (lUpperArm) lUpperArm.quaternion.copy(baseLArmQuat);
        actionBlendTimer = ACTION_BLEND_DURATION;
      }
    } else {
      // 🌟 ORGANIC LIVING ANIME KINEMATICS ENGINE (100% HUMAN POSTURE & SMOOTH RESPIRATION)
      if (actionBlendTimer > 0) {
        actionBlendTimer = Math.max(0, actionBlendTimer - delta);
        const alpha = 1.0 - (actionBlendTimer / ACTION_BLEND_DURATION);
        idleBlendWeight = smoothCos(alpha);
      } else {
        idleBlendWeight = 1.0;
      }

      // Smooth physiological respiratory wave (~0.85 - 1.25 Hz depending on Tier)
      const breathWave = 0.5 - 0.5 * Math.cos(animTimer * tierBreatheFreq * Math.PI * 2);
      totalBreath = breathWave * (currentTier === 3 ? 1.35 : 1.0) * idleBlendWeight;

      // 1. Root & Legs: 100% stable and grounded on the floor (Zero floating, zero hip sway)
      fbx.position.y = initialY;
      fbx.position.z = -center.z;
      if (pelvisBone) {
        pelvisBone.position.copy(basePelvisPos);
        pelvisBone.quaternion.copy(basePelvisQuat);
      }
      if (rThigh) rThigh.quaternion.copy(baseRThighQuat);
      if (rCalf) rCalf.quaternion.copy(baseRCalfQuat);
      if (rFoot) rFoot.quaternion.copy(baseRFootQuat);
      if (lThigh) lThigh.quaternion.copy(baseLThighQuat);
      if (lCalf) lCalf.quaternion.copy(baseLCalfQuat);
      if (lFoot) lFoot.quaternion.copy(baseLFootQuat);

      // 2. Ribcage Breathing (Spine1, Spine2): Expansion on true anatomical pitch axis (Local Z)
      if (spineBone) spineBone.quaternion.copy(baseSpineQuat);
      if (spine1Bone) {
        const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, totalBreath * 0.007);
        spine1Bone.quaternion.copy(baseSpine1Quat).multiply(q);
      }
      if (spine2Bone) {
        const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, totalBreath * 0.005);
        spine2Bone.quaternion.copy(baseSpine2Quat).multiply(q);
      }

      // 3. Clavicles: Micro elevation on breathing
      if (rClavicle) {
        const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, totalBreath * 0.0035);
        rClavicle.quaternion.copy(baseRClavQuat).multiply(q);
      }
      if (lClavicle) {
        const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, -totalBreath * 0.0035);
        lClavicle.quaternion.copy(baseLClavQuat).multiply(q);
      }

      // 4. Arms & Hands: Relaxed in base pose
      if (rUpperArm) rUpperArm.quaternion.copy(baseRArmQuat);
      if (rForearm) rForearm.quaternion.copy(baseRForeQuat);
      if (rHand) rHand.quaternion.copy(baseRHandQuat);
      if (lUpperArm) lUpperArm.quaternion.copy(baseLArmQuat);
      if (lForearm) lForearm.quaternion.copy(baseLForeQuat);
      if (lHand) lHand.quaternion.copy(baseLHandQuat);

      // 5. Head & Neck Gaze: Clamped, smooth yaw & pitch
      let targetGazeYaw = 0;
      let targetGazePitch = 0;
      if (state.cameraPosition) {
        const dx = state.cameraPosition.x;
        const dy = state.cameraPosition.y - 1.45;
        const dz = state.cameraPosition.z;
        targetGazeYaw = THREE.MathUtils.clamp(Math.atan2(dx, dz), -0.32, 0.32);
        targetGazePitch = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.18, 0.18);
      }

      saccadeTimer += delta;
      if (saccadeTimer >= nextSaccadeInterval) {
        saccadeTimer = 0;
        nextSaccadeInterval = 2.5 + Math.random() * 2.5;
        saccadeTargetYaw = (Math.random() - 0.5) * 0.025;
        saccadeTargetPitch = (Math.random() - 0.5) * 0.018;
      }
      saccadeCurrentYaw = THREE.MathUtils.damp(saccadeCurrentYaw, saccadeTargetYaw, 3.2, delta);
      saccadeCurrentPitch = THREE.MathUtils.damp(saccadeCurrentPitch, saccadeTargetPitch, 3.2, delta);

      currentGazeYaw = THREE.MathUtils.damp(currentGazeYaw, (targetGazeYaw + saccadeCurrentYaw) * idleBlendWeight, 3.2, delta);
      currentGazePitch = THREE.MathUtils.damp(currentGazePitch, (targetGazePitch + saccadeCurrentPitch) * idleBlendWeight, 3.2, delta);

      if (neckBone) {
        const neckQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, currentGazeYaw * 0.12, currentGazePitch * 0.08, 'YXZ'));
        neckBone.quaternion.copy(baseNeckQuat).multiply(neckQ);
      }
      if (headBone) {
        const headQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, currentGazeYaw * 0.22, currentGazePitch * 0.14, 'YXZ'));
        headBone.quaternion.copy(baseHeadQuat).multiply(headQ);
      }

      targetFingerCurl = totalBreath * 0.015;
      targetBustDisplacement = totalBreath * 0.025 * tierBustMult;
      hairImpulsePitch = 0;
      hairImpulseRoll = 0;
    }

    // 🌟 CONTINUOUS SECONDARY PHYSICS & ANATOMICAL FLUIDITY (SIMULATED EVERY FRAME ACROSS ALL STATES)
    // 1. 18+ Soft-Body Elastic Bust Dynamics (Second-Order Spring Damper Simulation)
    const springForce = (targetBustDisplacement - bustSpringDisp) * 18.0 - bustSpringVel * 6.8;
    bustSpringVel += springForce * delta;
    bustSpringDisp += bustSpringVel * delta;

    if (chestBoneL1) {
      const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, bustSpringDisp);
      chestBoneL1.quaternion.copy(baseChestL1Quat).multiply(q);
    }
    if (chestBoneR1) {
      const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, bustSpringDisp);
      chestBoneR1.quaternion.copy(baseChestR1Quat).multiply(q);
    }
    if (chestBoneL2) {
      const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, bustSpringDisp * 0.75);
      chestBoneL2.quaternion.copy(baseChestL2Quat).multiply(q);
    }
    if (chestBoneR2) {
      const q = new THREE.Quaternion().setFromAxisAngle(PITCH_Z, bustSpringDisp * 0.75);
      chestBoneR2.quaternion.copy(baseChestR2Quat).multiply(q);
    }

    // 2. Silky Hair, Skirt & Ribbon Dynamic Wave Cascade (Airy floating anime breeze + Action impulse response)
    const breezeTime = animTimer * 1.45;
    const rippleTime = animTimer * 3.20;

    for (const node of clothBoneNodes) {
      const b = node.bone;
      const base = node.baseRot;

      // Group chiral phase and chain depth delay
      const groupPhase = (node.group * 0.628) % (Math.PI * 2);
      const sideSign = node.side === 'L' ? -1.0 : node.side === 'R' ? 1.0 : 0.0;
      const depthLag = node.depth * 0.42;

      // Primary broad ocean swell wave (fluid, elegant anime cloth billow)
      const primarySwell = Math.sin(breezeTime + groupPhase - depthLag);
      // Secondary silky surface ripple (golden ratio frequency for organic fabric fluidity)
      const silkyRipple = Math.sin(rippleTime + groupPhase * 1.618 - node.depth * 0.68) * 0.32;
      // Cross-draft oscillation (prevents flat planar vibration)
      const crossDraft = Math.cos(breezeTime * 0.88 + groupPhase * 0.9 - depthLag * 0.5) * 0.28;

      // Depth-scaled amplitude: root anchor (0.025 rad / 1.4°), mid (0.075 rad / 4.3°), hem tip (0.155 rad / 8.9°)
      const depthCurve = Math.pow(Math.min(node.depth, 5), 1.25);
      const clothActiveScale = 0.40 + 0.60 * matDown.opacity;
      const amp = (0.020 + depthCurve * 0.026) * clothActiveScale;

      // Inertial coupling from hip & stance shift (fabric lags behind body movements)
      const stanceLag = -effectiveStance * (0.022 + node.depth * 0.018);
      // Physical breathing compliance: skirt gently expands outward with respiration
      const breathFlare = totalBreath * (0.015 + node.depth * 0.010) * sideSign;
      // Natural gravity drape (hem curve)
      const gravityDrape = node.depth * 0.005;

      // Synthesized 3D rotation angles
      const waveX = (primarySwell * 0.78 + silkyRipple) * amp + hairImpulsePitch * (0.6 + node.depth * 0.22) + gravityDrape;
      const waveZ = (crossDraft + primarySwell * 0.35) * (amp * 0.85) * sideSign + stanceLag + breathFlare + hairImpulseRoll * (0.6 + node.depth * 0.22);
      const waveY = Math.sin(breezeTime * 1.1 + groupPhase) * (amp * 0.35) * sideSign;

      // Silky soft damped compliance (6.2 for responsive, fluid silk motion without spring snapping)
      b.rotation.x = THREE.MathUtils.damp(b.rotation.x, base.x + waveX, 6.2, delta);
      b.rotation.z = THREE.MathUtils.damp(b.rotation.z, base.z + waveZ, 6.2, delta);
      b.rotation.y = THREE.MathUtils.damp(b.rotation.y, base.y + waveY, 5.5, delta);
    }

    // 3. Composed Living Fingers (Delicate breathing response & dynamic fist grip, zero jerky jumps)
    for (let i = 0; i < rFingers.length; i++) {
      const b = rFingers[i];
      const base = baseRFingerRots[i];
      if (b && base) {
        const targetX = base.x + totalBreath * 0.012 + targetFingerCurl;
        b.rotation.x = THREE.MathUtils.damp(b.rotation.x, targetX, 12.0, delta);
      }
    }
    for (let i = 0; i < lFingers.length; i++) {
      const b = lFingers[i];
      const base = baseLFingerRots[i];
      if (b && base) {
        const targetX = base.x + totalBreath * 0.012 + targetFingerCurl * 0.5;
        b.rotation.x = THREE.MathUtils.damp(b.rotation.x, targetX, 12.0, delta);
      }
    }

    // 4. Magnetic Levitation Cyber Greatsword (Harmonized rhythmic floating in idle)
    if (!isAttacking && !isUlting && weapon) {
      const swordHoverY = 1.05 + Math.sin(animTimer * 0.95) * 0.025 * idleBlendWeight;
      const swordHoverX = 0.42 + Math.cos(animTimer * 0.75) * 0.015 * idleBlendWeight;
      const swordHoverZ = 0.08 + Math.sin(animTimer * 0.85) * 0.012 * idleBlendWeight;
      weapon.position.set(swordHoverX, swordHoverY, swordHoverZ);
      weapon.rotation.y = -0.15 + (Math.sin(animTimer * 0.75) * 0.04 + currentGazeYaw * 0.08) * idleBlendWeight;
      weapon.rotation.z = -0.12 + Math.cos(animTimer * 0.95) * 0.025 * idleBlendWeight;
      weapon.rotation.x = 0.08 + Math.sin(animTimer * 0.65) * 0.020 * idleBlendWeight;
    }

    if (halo) {
      const haloSpeed = currentTier === 3 ? 2.4 : currentTier === 2 ? 1.4 : 0.75;
      halo.rotation.z = animTimer * haloSpeed;
    }

    if (state.tier !== currentTier) {
      updateClothTierVisibility(state.tier);
    }
  };

  const setClothTier = (tier: ClothDamageTier): void => {
    updateClothTierVisibility(tier);
  };

  let hasTriggeredAttackVfx = false;
  let hasTriggeredUltVfx = false;

  const triggerAttack = (): void => {
    attackShake = 0.18;
    isAttacking = true;
    attackProgress = 0;
    isUlting = false;
    isHitted = false;
    isPoked = false;
    hasTriggeredAttackVfx = false;
  };

  const triggerUltimate = (): void => {
    attackShake = 0.38;
    isUlting = true;
    ultProgress = 0;
    isAttacking = false;
    isHitted = false;
    isPoked = false;
    hasTriggeredUltVfx = false;
    combatVfx.triggerChargeAura(0.45);
  };

  const triggerHit = (): void => {
    attackShake = 0.16;
    isHitted = true;
    hitProgress = 0;
    isAttacking = false;
    isUlting = false;
    isPoked = false;
  };

  const triggerPoke = (): void => {
    attackShake = 0.05;
    isPoked = true;
    pokeProgress = 0;
    isAttacking = false;
    isUlting = false;
    isHitted = false;
  };

  const setPose = async (pose: DeniaPoseMode): Promise<void> => {
    await applyPose(pose);
  };

  const dispose = (): void => {
    combatVfx.dispose();
    fbx.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    });
    weapon.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else if (child.material) child.material.dispose();
      }
    });
    halo.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else if (child.material) child.material.dispose();
      }
    });
    materialsList.forEach((m) => m.dispose());
    [faceTex, hairTex, bangsTex, clothTex, upTex, downTex, eyeTex].forEach((t) => t.dispose());
    steamGeo.dispose();
    steamMat.dispose();
    steamTex.dispose();
    burstGeo.dispose();
    burstMat.dispose();
    burstTex.dispose();
    ringGeo.dispose();
    ringMat.dispose();
    lightningGeo.dispose();
    lightningMat.dispose();
    lightningTex.dispose();
    orbitShardGeo.dispose();
    orbitShardMat.dispose();
    orbitShardTex.dispose();
    rootGroup.clear();
  };

  return {
    rootGroup,
    update,
    setClothTier,
    triggerAttack,
    triggerUltimate,
    triggerHit,
    triggerPoke,
    setPose,
    dispose
  };
}
