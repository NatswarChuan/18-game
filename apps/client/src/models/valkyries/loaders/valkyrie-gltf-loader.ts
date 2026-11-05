import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { createValkyrie3DWeapon, createValkyrie3DHalo } from '../../../utils/valkyrie-3d-figure-builder.js';
import { createValkyrieCombatVfx } from '../vfx/valkyrie-combat-vfx.js';

export interface GLTFModelLoadResult {
  readonly instance: Valkyrie3DModelInstance;
  readonly isVRM: boolean;
  readonly clipNames: readonly string[];
}

/**
 * Standard anime model height target in Three.js world units (~1.72m).
 */
const TARGET_ANIME_HEIGHT = 1.72;

/**
 * High-performance, memory-safe Loader & Runtime Engine for GLTF, GLB, and VRM 3D Anime Models.
 * Bộ nạp và điều khiển mô hình 3D Anime chuẩn công nghiệp (GLTF / GLB / VRM):
 * - Hỗ trợ cả đường dẫn URL cục bộ lẫn tập tin tải lên kéo thả (Drag & Drop)
 * - Tự động chuẩn hóa tỷ lệ (Auto-Scale về chiều cao chuẩn 1.72m) và căn chỉnh bàn chân chạm sàn (Y = 0)
 * - Tự động phát hiện VRM (VRoid Studio / Booth.pm) và kích hoạt VRM Spring Bones & BlendShapes
 * - Tích hợp AnimationMixer xử lý chuyển động chiến đấu mượt mà 60 FPS
 * - Quản lý vòng đời bộ nhớ nghiêm ngặt (100% dispose geometry, material, texture).
 */
export async function loadValkyrieGLTFModel(
  source: string | File | ArrayBuffer,
  config: ValkyrieModelInitConfig
): Promise<GLTFModelLoadResult> {
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));

  let objectUrlToRevoke: string | null = null;
  let rawGltf: GLTF;

  if (typeof source === 'string') {
    rawGltf = await loader.loadAsync(source);
  } else if (source instanceof File) {
    objectUrlToRevoke = URL.createObjectURL(source);
    rawGltf = await loader.loadAsync(objectUrlToRevoke);
  } else {
    rawGltf = await new Promise<GLTF>((resolve, reject) => {
      loader.parse(source, '', resolve, reject);
    });
  }

  const vrm: VRM | undefined = rawGltf.userData.vrm;
  const isVRM = vrm !== undefined;

  const rootGroup = new THREE.Group();
  rootGroup.name = `Valkyrie_GLTF_${config.valkyrieId}`;

  const sceneModel = isVRM && vrm ? vrm.scene : rawGltf.scene;
  rootGroup.add(sceneModel);

  // Attach 3D Sculpted Cyber Weapon dynamically floating beside character
  const weapon = createValkyrie3DWeapon(config.valkyrieId, config.primaryColor);
  weapon.name = 'GLTF_Weapon';
  rootGroup.add(weapon);

  // Attach 3D Faction Energy Halo behind head
  const halo = createValkyrie3DHalo(config.primaryColor, config.tier);
  halo.name = 'GLTF_Halo';
  halo.position.set(0, 1.82, -0.08);
  rootGroup.add(halo);

  // 1. VRM-specific orientation adjustments (VRM models face -Z by default, rotate to face +Z)
  if (isVRM && vrm) {
    VRMUtils.removeUnnecessaryVertices(sceneModel);
    VRMUtils.removeUnnecessaryJoints(sceneModel);
    VRMUtils.rotateVRM0(vrm);

    // Natural Anime Humanoid Posing: Drops arms from 90° T-pose into an elegant resting posture
    if (vrm.humanoid) {
      const leftUpperArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm');
      const rightUpperArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm');
      const leftLowerArm = vrm.humanoid.getNormalizedBoneNode('leftLowerArm');
      const rightLowerArm = vrm.humanoid.getNormalizedBoneNode('rightLowerArm');
      const leftHand = vrm.humanoid.getNormalizedBoneNode('leftHand');
      const rightHand = vrm.humanoid.getNormalizedBoneNode('rightHand');
      const spine = vrm.humanoid.getNormalizedBoneNode('spine');
      const chest = vrm.humanoid.getNormalizedBoneNode('chest');
      const head = vrm.humanoid.getNormalizedBoneNode('head');
      const hips = vrm.humanoid.getNormalizedBoneNode('hips');

      if (leftUpperArm) leftUpperArm.rotation.set(0.08, 0.02, 1.18);
      if (rightUpperArm) rightUpperArm.rotation.set(0.08, -0.02, -1.18);
      if (leftLowerArm) leftLowerArm.rotation.set(0.22, 0.28, 0.18);
      if (rightLowerArm) rightLowerArm.rotation.set(0.22, -0.28, -0.18);
      if (leftHand) leftHand.rotation.set(0.08, 0, 0.12);
      if (rightHand) rightHand.rotation.set(0.08, 0, -0.12);
      if (spine) spine.rotation.set(0.04, 0, 0);
      if (chest) chest.rotation.set(-0.02, 0, 0);
      if (head) head.rotation.set(-0.04, 0.02, 0.01);
      if (hips) hips.rotation.set(0, 0.02, 0.01);
    }
  }

  // 2. Automated Bounds Normalization (Auto-scale to 1.72m & align feet at Y = 0)
  const initialBox = new THREE.Box3().setFromObject(sceneModel);
  const size = new THREE.Vector3();
  initialBox.getSize(size);

  if (size.y > 0.001) {
    const scaleFactor = TARGET_ANIME_HEIGHT / size.y;
    sceneModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }

  // Recalculate box after scaling to offset feet to Y = 0 and center in X/Z
  const scaledBox = new THREE.Box3().setFromObject(sceneModel);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  sceneModel.position.x -= center.x;
  sceneModel.position.z -= center.z;
  sceneModel.position.y -= scaledBox.min.y; // Ensure feet firmly on ground (Y = 0)

  // 3. Animation Pipeline
  const mixer = new THREE.AnimationMixer(sceneModel);
  const actions: Map<string, THREE.AnimationAction> = new Map();
  const clipNames: string[] = [];

  rawGltf.animations.forEach((clip) => {
    clipNames.push(clip.name);
    const action = mixer.clipAction(clip);
    actions.set(clip.name.toUpperCase(), action);
  });

  // Play default animation if available
  const idleAction = actions.get('IDLE') ?? actions.get('IDLE_01') ?? (actions.size > 0 ? actions.values().next().value : null);
  if (idleAction) {
    idleAction.play();
  }

  // 4. Cloth Damage Layer Caching
  interface ArmorPart {
    readonly mesh: THREE.Mesh;
    readonly originalMaterial: THREE.Material | THREE.Material[];
  }
  const armorParts: ArmorPart[] = [];
  const damageKeywords = ['armor', 'pauldron', 'cuirass', 'plate', 'cloth', 'outer', 'skirt', 'jacket', 'coat'];

  sceneModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      // Enhance materials for cyberpunk neon lighting
      if (child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.roughness !== undefined && mat.roughness < 0.25) {
          mat.roughness = 0.35; // Soften harsh specular glares
        }
      }

      const lowerName = child.name.toLowerCase();
      if (damageKeywords.some((kw) => lowerName.includes(kw))) {
        armorParts.push({ mesh: child, originalMaterial: child.material });
      }
    }
  });

  let currentTier: ClothDamageTier = config.tier;

  const setClothTier = (tier: ClothDamageTier): void => {
    currentTier = tier;
    armorParts.forEach(({ mesh }) => {
      const lowerName = mesh.name.toLowerCase();
      const isOuterCapeOrJacket = lowerName.includes('cape') || lowerName.includes('coat') || lowerName.includes('jacket') || lowerName.includes('pauldron');

      if (tier === 3) {
        // Climax Extreme: Physically strip all outer armor and skirt layers to reveal sleek base lingerie/bodysuit
        mesh.visible = false;
      } else if (tier === 2) {
        // Torn: Physically strip outer mantle/cape/jacket/pauldrons, keep base bodice & skirt 100% solid and crisp
        if (isOuterCapeOrJacket) {
          mesh.visible = false;
        } else {
          mesh.visible = true;
          if (mesh.material && !Array.isArray(mesh.material)) {
            mesh.material.transparent = false;
            mesh.material.opacity = 1.0;
          }
        }
      } else {
        // Pristine: Fully visible and solid
        mesh.visible = true;
        if (mesh.material && !Array.isArray(mesh.material)) {
          mesh.material.transparent = false;
          mesh.material.opacity = 1.0;
        }
      }
    });

    // VRM BlendShapes if available
    if (isVRM && vrm?.expressionManager) {
      if (tier === 3) {
        vrm.expressionManager.setValue('surprised', 0.6);
        vrm.expressionManager.setValue('happy', 0.4);
      } else if (tier === 2) {
        vrm.expressionManager.setValue('angry', 0.5);
      } else {
        vrm.expressionManager.setValue('neutral', 1.0);
      }
      vrm.expressionManager.update();
    }
  };

  setClothTier(config.tier);

  // Combat Visual Effects Suite
  const combatVfx = createValkyrieCombatVfx(config.primaryColor);
  rootGroup.add(combatVfx.vfxGroup);

  // Combat Animation State
  let isAttacking = false;
  let attackProgress = 0;
  let hasTriggeredAttackVfx = false;
  let isUlting = false;
  let ultProgress = 0;
  let hasTriggeredUltVfx = false;
  let isHitted = false;
  let hitProgress = 0;

  // Combat animation triggers
  const triggerAttack = (): void => {
    const attackAction = actions.get('ATTACK') ?? actions.get('ATTACK_01') ?? actions.get('SLASH');
    if (attackAction) {
      attackAction.reset().setLoop(THREE.LoopOnce, 1).play();
    }
    isAttacking = true;
    attackProgress = 0;
    hasTriggeredAttackVfx = false;
    isUlting = false;
    isHitted = false;
  };

  const triggerUltimate = (): void => {
    const ultAction = actions.get('ULTIMATE') ?? actions.get('SKILL') ?? actions.get('ATTACK');
    if (ultAction) {
      ultAction.reset().setLoop(THREE.LoopOnce, 1).play();
    }
    isUlting = true;
    ultProgress = 0;
    hasTriggeredUltVfx = false;
    isAttacking = false;
    isHitted = false;
    combatVfx.triggerChargeAura(0.45);
  };

  const triggerHit = (): void => {
    const hitAction = actions.get('HIT') ?? actions.get('FLINCH') ?? actions.get('DAMAGE');
    if (hitAction) {
      hitAction.reset().setLoop(THREE.LoopOnce, 1).play();
    }
    isHitted = true;
    hitProgress = 0;
  };

  // 5. Update Cycle (60 FPS animation tick)
  let breatheTimer = 0;
  const update = (delta: number, _elapsedTime: number, state: UnitCombatVisualState): void => {
    mixer.update(delta);
    combatVfx.update(delta);

    const basePosY = scaledBox ? -scaledBox.min.y : 0;

    if (isVRM && vrm) {
      breatheTimer += delta;
      vrm.update(delta);

      if (vrm.humanoid) {
        const spine = vrm.humanoid.getNormalizedBoneNode('spine');
        const chest = vrm.humanoid.getNormalizedBoneNode('chest');
        const head = vrm.humanoid.getNormalizedBoneNode('head');
        const leftArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm');
        const rightArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm');
        const rightLower = vrm.humanoid.getNormalizedBoneNode('rightLowerArm');

        if (isAttacking) {
          attackProgress += delta;
          const attackDuration = 0.95;
          const t = Math.min(1, attackProgress / attackDuration);
          if (t < 1) {
            if (t < 0.30) {
              // Wind-up: Right arm draws back, weapon pulls back behind shoulder
              const p = t / 0.30;
              sceneModel.position.z = -p * 0.12;
              if (spine) spine.rotation.y = -p * 0.45;
              if (rightArm) rightArm.rotation.set(-0.35 - p * 1.15, 0.25 + p * 0.45, 0.45 + p * 0.75);
              if (rightLower) rightLower.rotation.set(0, 0.45 + p * 0.65, 0.25);
              if (weapon) {
                weapon.position.set(0.48 + p * 0.25, 1.20 + p * 0.35, -0.15 - p * 0.35);
                weapon.rotation.set(-0.75, 0.45, -1.05);
              }
            } else if (t < 0.65) {
              // Slash strike: Right arm sweeps across, body lunges forward
              const p = (t - 0.30) / 0.35;
              sceneModel.position.z = Math.sin(p * Math.PI) * 0.45;
              if (spine) spine.rotation.y = -0.45 + p * 0.95;
              if (rightArm) rightArm.rotation.set(-1.50 + p * 2.25, 0.70 - p * 1.15, 1.20 - p * 1.85);
              if (rightLower) rightLower.rotation.set(0, 1.10 - p * 0.95, 0.25);
              if (weapon) {
                weapon.position.set(0.73 - p * 1.25, 1.55 - p * 0.65, -0.50 + p * 1.25);
                weapon.rotation.set(-0.75 + p * 2.15, 0.45 - p * 1.45, -1.05 + p * 2.85);
              }
              if (p >= 0.20 && !hasTriggeredAttackVfx) {
                hasTriggeredAttackVfx = true;
                combatVfx.triggerSlashVfx(new THREE.Vector3(0, 1.15, 0.45));
              }
            } else if (t < 0.78) {
              // Impact Hold / Follow-Through
              const p = (t - 0.65) / 0.13;
              sceneModel.position.z = 0.25 - p * 0.08;
              if (weapon) {
                weapon.position.set(-0.52 + p * 0.15, 0.90 + p * 0.05, 0.75 - p * 0.15);
                weapon.rotation.set(1.40, -1.00, 1.80);
              }
            } else {
              // Recovery: Smoothly returns arm to resting posture
              const p = (t - 0.78) / 0.22;
              sceneModel.position.z = THREE.MathUtils.lerp(0.17, 0, p);
              if (spine) spine.rotation.y = THREE.MathUtils.lerp(0.50, 0, p);
              if (rightArm) rightArm.rotation.set(
                THREE.MathUtils.lerp(0.75, 0.08, p),
                THREE.MathUtils.lerp(-0.45, -0.02, p),
                THREE.MathUtils.lerp(-0.65, -1.18, p)
              );
              if (rightLower) rightLower.rotation.set(
                THREE.MathUtils.lerp(0.15, 0.22, p),
                THREE.MathUtils.lerp(-0.20, -0.28, p),
                THREE.MathUtils.lerp(-0.25, -0.18, p)
              );
              if (weapon) {
                weapon.position.set(
                  THREE.MathUtils.lerp(-0.37, 0.38, p),
                  THREE.MathUtils.lerp(0.95, 1.05, p),
                  THREE.MathUtils.lerp(0.60, 0.05, p)
                );
                weapon.rotation.set(
                  THREE.MathUtils.lerp(1.40, 0.12, p),
                  THREE.MathUtils.lerp(-1.00, -0.15, p),
                  THREE.MathUtils.lerp(1.80, -0.12, p)
                );
              }
            }
          } else {
            isAttacking = false;
            sceneModel.position.z = 0;
            if (rightArm) rightArm.rotation.set(0.08, -0.02, -1.18);
            if (rightLower) rightLower.rotation.set(0.22, -0.28, -0.18);
            if (weapon) {
              weapon.position.set(0.38, 1.05, 0.05);
              weapon.rotation.set(0.12, -0.15, -0.12);
            }
          }
        } else if (isUlting) {
          ultProgress += delta;
          const ultDuration = 1.60;
          const t = Math.min(1, ultProgress / ultDuration);
          if (t < 1) {
            if (t < 0.42) {
              // Phase 1: Sky Ascent & Overhead Charge
              const p = t / 0.42;
              sceneModel.position.y = basePosY + Math.sin((p * Math.PI) / 2) * 0.82;
              sceneModel.position.z = -p * 0.22;
              if (spine) spine.rotation.x = -p * 0.45;
              if (rightArm) rightArm.rotation.set(-1.25 - p * 0.45, 0.35, 0.75 + p * 0.25);
              if (leftArm) leftArm.rotation.set(-1.25 - p * 0.45, -0.35, -0.75 - p * 0.25);
              if (weapon) {
                weapon.position.set(0.12, 1.95 + p * 0.95, 0.10);
                weapon.rotation.set(0.1, 0, -Math.PI / 2);
              }
              if (halo) halo.rotation.z += delta * 12;
            } else if (t < 0.70) {
              // Phase 2: Sky Plunge & Impact Slam
              const p = (t - 0.42) / 0.28;
              sceneModel.position.y = basePosY + 0.82 - p * 0.98;
              sceneModel.position.z = -0.22 + p * 0.72;
              if (spine) spine.rotation.x = -0.45 + p * 0.95;
              if (rightArm) rightArm.rotation.set(1.25 + p * 0.65, 0.15, -0.45);
              if (leftArm) leftArm.rotation.set(1.25 + p * 0.65, -0.15, 0.45);
              if (weapon) {
                weapon.position.set(0.05, 2.90 - p * 2.75, 0.10 + p * 0.75);
                weapon.rotation.set(Math.PI / 2.2, 0, 0);
              }
              if (p >= 0.25 && !hasTriggeredUltVfx) {
                hasTriggeredUltVfx = true;
                combatVfx.triggerImpactShockwave(new THREE.Vector3(0, 0.02, 0.75));
              }
            } else {
              // Phase 3: Recovery
              const p = (t - 0.70) / 0.30;
              sceneModel.position.y = THREE.MathUtils.lerp(basePosY - 0.16, basePosY, p);
              sceneModel.position.z = THREE.MathUtils.lerp(0.50, 0, p);
              if (spine) spine.rotation.x = THREE.MathUtils.lerp(0.50, 0.04, p);
              if (rightArm) rightArm.rotation.set(
                THREE.MathUtils.lerp(1.90, 0.08, p),
                THREE.MathUtils.lerp(0.15, -0.02, p),
                THREE.MathUtils.lerp(-0.45, -1.18, p)
              );
              if (leftArm) leftArm.rotation.set(
                THREE.MathUtils.lerp(1.90, 0.08, p),
                THREE.MathUtils.lerp(-0.15, 0.02, p),
                THREE.MathUtils.lerp(0.45, 1.18, p)
              );
              if (weapon) {
                weapon.position.set(
                  THREE.MathUtils.lerp(0.05, 0.38, p),
                  THREE.MathUtils.lerp(0.15, 1.05, p),
                  THREE.MathUtils.lerp(0.85, 0.05, p)
                );
                weapon.rotation.set(
                  THREE.MathUtils.lerp(Math.PI / 2.2, 0.12, p),
                  THREE.MathUtils.lerp(0, -0.15, p),
                  THREE.MathUtils.lerp(0, -0.12, p)
                );
              }
            }
          } else {
            isUlting = false;
            sceneModel.position.y = basePosY;
            sceneModel.position.z = 0;
            if (rightArm) rightArm.rotation.set(0.08, -0.02, -1.18);
            if (leftArm) leftArm.rotation.set(0.08, 0.02, 1.18);
            if (weapon) {
              weapon.position.set(0.38, 1.05, 0.05);
              weapon.rotation.set(0.12, -0.15, -0.12);
            }
          }
        } else if (isHitted) {
          hitProgress += delta;
          const hitDuration = 0.32;
          const t = Math.min(1, hitProgress / hitDuration);
          if (t < 1) {
            const flinch = Math.sin(t * Math.PI);
            sceneModel.position.z = -flinch * 0.18;
            if (spine) spine.rotation.x = 0.04 - flinch * 0.25;
            if (head) head.rotation.x = -flinch * 0.20;
          } else {
            isHitted = false;
            sceneModel.position.z = 0;
            if (spine) spine.rotation.x = 0.04;
            if (head) head.rotation.x = 0;
          }
        } else {
          // Natural Idle Breathing
          const breathCycle = Math.sin(breatheTimer * 2.2);
          if (spine) spine.rotation.x = 0.04 + breathCycle * 0.02;
          if (chest) chest.rotation.x = -0.02 + breathCycle * 0.015;
          if (head) head.rotation.z = 0.02 + Math.sin(breatheTimer * 1.1) * 0.012;
          if (leftArm) leftArm.rotation.z = 1.18 + breathCycle * 0.015;
          if (rightArm) rightArm.rotation.z = -1.18 - breathCycle * 0.015;

          if (weapon) {
            weapon.position.y = 1.02 + Math.sin(breatheTimer * 2.5) * 0.04;
            weapon.rotation.y = Math.sin(breatheTimer * 1.2) * 0.16;
          }
        }
      }

      // Procedural Eye Blinking (Wide open sparkling anime eyes with natural blinks)
      if (vrm.expressionManager) {
        const blinkCycle = breatheTimer % 3.6;
        if (blinkCycle < 0.16) {
          const blinkW = Math.sin((blinkCycle / 0.16) * Math.PI);
          vrm.expressionManager.setValue('blink', blinkW);
        } else {
          vrm.expressionManager.setValue('blink', 0);
        }
        vrm.expressionManager.update();
      }
    } else if (actions.size === 0) {
      // Procedural Idle Breathing for models without baked animation clips
      breatheTimer += delta;
      const breathe = Math.sin(breatheTimer * 2.8) * 0.006;
      sceneModel.position.y = basePosY + breathe;
    }

    if (halo) {
      halo.rotation.z = breatheTimer * 0.75;
    }

    if (state.tier !== currentTier) {
      setClothTier(state.tier);
    }
  };

  // 6. Strict Dispose Lifecycle (Clean Memory)
  const dispose = (): void => {
    combatVfx.dispose();
    mixer.stopAllAction();
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
    if (isVRM && vrm) {
      VRMUtils.deepDispose(sceneModel);
    } else {
      sceneModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
    }

    if (objectUrlToRevoke) {
      URL.revokeObjectURL(objectUrlToRevoke);
    }
    rootGroup.clear();
  };

  const instance: Valkyrie3DModelInstance = {
    rootGroup,
    update,
    setClothTier,
    triggerAttack,
    triggerUltimate,
    triggerHit,
    dispose
  };

  return { instance, isVRM, clipNames };
}
