import * as THREE from 'three';
import { ClothDamageTier } from '@valkyrie/shared-domain';
import { Valkyrie3DModelInstance, ValkyrieModelInitConfig, UnitCombatVisualState } from '../valkyrie-3d-types.js';
import { getHologramValkyrieTexture } from '../../../utils/valkyrie-hologram-texture.js';
import {
  createValkyrie3DFullFigure,
  createDynamic3DArmorLayer,
  createValkyrie3DHalo
} from '../../../utils/valkyrie-3d-figure-builder.js';
import { createValkyrieCombatVfx } from '../vfx/valkyrie-combat-vfx.js';

/**
 * Creates an ultra-high-fidelity 3D Prismatic Hologram Model Instance.
 * Khởi tạo mô hình Lăng Kính Pha Lê 3D (3D Prismatic Diorama) đạt chuẩn thị giác Anime 18+ cực phẩm:
 * - Hiển thị 100% nguyên bản tác phẩm nghệ thuật Anime sắc nét từ VALK-01.jpg
 * - Khung lăng kính pha lê 3D phát quang Neon đổi màu theo Faction
 * - Vòng hào quang thiên thần 3D Faction Energy Halo bay lơ lửng phía sau đầu
 * - Đại kiếm / Song đao / Vũ khí 3D bay bồng bềnh bên cạnh nhân vật
 * - Hỗ trợ đầy đủ biến đổi 3 cấp độ rách giáp (Pristine -> Torn -> Climax Extreme)
 * - Tương thích 100% với giao diện Valkyrie3DModelInstance.
 */
export function createPrismaticValkyrieInstance(config: ValkyrieModelInitConfig): Valkyrie3DModelInstance {
  const rootGroup = new THREE.Group();
  rootGroup.name = `Prismatic_Valkyrie_${config.valkyrieId}`;

  let currentTier: ClothDamageTier = config.tier;
  let figureGroup: THREE.Group | null = null;

  const rebuildFigure = (tier: ClothDamageTier): void => {
    if (figureGroup) {
      rootGroup.remove(figureGroup);
      figureGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      figureGroup = null;
    }

    const texture = getHologramValkyrieTexture(config.valkyrieId, config.faction, tier);
    figureGroup = createValkyrie3DFullFigure(
      {
        valkyrieId: config.valkyrieId,
        faction: config.faction,
        tier,
        isEnemy: config.isEnemy,
        primaryColor: config.primaryColor
      },
      texture
    );
    rootGroup.add(figureGroup);
  };

  rebuildFigure(currentTier);

  // Combat Visual Effects Suite
  const combatVfx = createValkyrieCombatVfx(config.primaryColor);
  rootGroup.add(combatVfx.vfxGroup);

  let animTimer = 0;
  let attackShake = 0;
  let isAttacking = false;
  let attackProgress = 0;
  let hasTriggeredAttackVfx = false;
  let isUlting = false;
  let ultProgress = 0;
  let hasTriggeredUltVfx = false;
  let isHitted = false;
  let hitProgress = 0;
  let isPoked = false;
  let pokeProgress = 0;
  let actionBlendTimer = 0;
  const ACTION_BLEND_DURATION = 0.35;

  const update = (delta: number, _elapsedTime: number, state: UnitCombatVisualState): void => {
    animTimer += delta;
    combatVfx.update(delta);

    if (figureGroup) {
      // Harmonized organic sensual respiration (0.85 - 1.25 Hz)
      const breathFreq = currentTier === 3 ? 1.25 : currentTier === 2 ? 1.05 : 0.85;
      const breathWave = 0.5 - 0.5 * Math.cos(animTimer * breathFreq * Math.PI * 2);
      const floatY = breathWave * 0.024 * (currentTier === 3 ? 1.5 : 1.0);
      figureGroup.position.y = floatY;

      // Parallax 3D living tilt
      figureGroup.rotation.y = Math.sin(animTimer * 0.95) * 0.035;
      figureGroup.rotation.z = Math.cos(animTimer * 0.75) * 0.015;

      const weapon = figureGroup.getObjectByName('Prismatic_Weapon');
      const halo = figureGroup.getObjectByName('Prismatic_Halo');
      const portrait = figureGroup.getObjectByName('Prismatic_Portrait');

      // 2.5D Respiration & Camera Gaze Parallax for Character Portrait Plane
      if (portrait) {
        const breathY = 1.0 + (breathWave * 0.022) * (currentTier === 3 ? 1.5 : 1.0);
        const breathX = 1.0 + breathWave * 0.008;
        portrait.scale.set(breathX, breathY, 1.0);

        if (state.cameraPosition) {
          const toCamX = state.cameraPosition.x;
          const toCamY = state.cameraPosition.y - 1.05;
          portrait.rotation.y = THREE.MathUtils.clamp(toCamX * 0.04, -0.12, 0.12);
          portrait.rotation.x = THREE.MathUtils.clamp(-toCamY * 0.030, -0.08, 0.08);
        }
      }

      const armor = figureGroup.getObjectByName('Prismatic_Armor_Layer');
      if (armor && portrait) {
        armor.scale.copy(portrait.scale);
        armor.rotation.copy(portrait.rotation);
      }

      const aura = figureGroup.getObjectByName('Prismatic_Overdrive_Aura');
      if (aura && aura instanceof THREE.Mesh) {
        aura.rotation.z = animTimer * 1.5;
        (aura.material as THREE.MeshBasicMaterial).opacity = 0.65 + Math.sin(animTimer * 4.0) * 0.20;
      }

      if (halo) {
        halo.rotation.z = animTimer * (currentTier === 3 ? 1.8 : 0.85);
      }

      // Default resting weapon figure-8 hover
      const restWeaponPos = new THREE.Vector3(
        0.92 + Math.sin(animTimer * 1.5) * 0.040,
        0.96 + Math.cos(animTimer * 2.2) * 0.055,
        0.15 + Math.sin(animTimer * 1.2) * 0.030
      );
      const restWeaponRot = new THREE.Vector3(
        Math.sin(animTimer * 1.4) * 0.08,
        Math.sin(animTimer * 1.1) * 0.16,
        -0.05 + Math.cos(animTimer * 1.5) * 0.06
      );

      // Dynamic 3D Combat Action Animations
      if (isAttacking) {
        attackProgress += delta;
        const attackDuration = 0.52;
        const t = Math.min(1, attackProgress / attackDuration);
        if (t < 1) {
          // Forward physical lunge with C1 zero-derivative boundary bell curve
          const lunge = (0.5 - 0.5 * Math.cos(t * Math.PI * 2)) * 0.28;
          figureGroup.position.z = lunge;
          if (weapon) {
            const slashArc = Math.sin(t * Math.PI);
            weapon.position.set(
              restWeaponPos.x - slashArc * 0.65,
              restWeaponPos.y + slashArc * 0.35,
              restWeaponPos.z + slashArc * 0.75
            );
            weapon.rotation.z = restWeaponRot.z - slashArc * 2.10;
            weapon.rotation.x = restWeaponRot.x + slashArc * 0.85;
            weapon.rotation.y = restWeaponRot.y;
          }
          if (t >= 0.25 && !hasTriggeredAttackVfx) {
            hasTriggeredAttackVfx = true;
            combatVfx.triggerSlashVfx(new THREE.Vector3(0, 1.15, 0.45));
          }
        } else {
          isAttacking = false;
          figureGroup.position.z = 0;
          actionBlendTimer = ACTION_BLEND_DURATION;
        }
      } else if (isUlting) {
        ultProgress += delta;
        const ultDuration = 0.95;
        const t = Math.min(1, ultProgress / ultDuration);
        if (t < 1) {
          if (t < 0.45) {
            // Charging phase: diorama and weapon ascend with accelerating halo
            const chargeT = t / 0.45;
            figureGroup.position.y = floatY + chargeT * 0.25;
            if (weapon) {
              weapon.position.set(restWeaponPos.x, restWeaponPos.y + chargeT * 1.10, restWeaponPos.z);
              weapon.rotation.y = restWeaponRot.y + chargeT * Math.PI * 4;
            }
            if (halo) {
              halo.rotation.z += delta * 12;
            }
          } else {
            // Climax slam phase: powerful forward plunge
            const slamT = (t - 0.45) / 0.55;
            const slamPower = Math.sin(slamT * Math.PI);
            figureGroup.position.z = slamPower * 0.48;
            figureGroup.position.y = floatY - slamPower * 0.08;
            if (weapon) {
              weapon.position.set(
                restWeaponPos.x - slamPower * 0.45,
                restWeaponPos.y + (1 - slamT) * 1.10,
                restWeaponPos.z + slamPower * 0.85
              );
              weapon.rotation.z = restWeaponRot.z - 1.5 * slamPower;
              weapon.rotation.y = THREE.MathUtils.lerp(restWeaponRot.y + Math.PI * 4, restWeaponRot.y, slamT);
            }
            if (!hasTriggeredUltVfx) {
              hasTriggeredUltVfx = true;
              combatVfx.triggerImpactShockwave(new THREE.Vector3(0, 0.02, 0.55));
            }
          }
        } else {
          isUlting = false;
          figureGroup.position.z = 0;
          actionBlendTimer = ACTION_BLEND_DURATION;
        }
      } else if (isHitted) {
        hitProgress += delta;
        const hitDuration = 0.32;
        const t = Math.min(1, hitProgress / hitDuration);
        if (t < 1) {
          figureGroup.position.z = -(0.5 - 0.5 * Math.cos(t * Math.PI * 2)) * 0.18;
        } else {
          isHitted = false;
          figureGroup.position.z = 0;
          actionBlendTimer = ACTION_BLEND_DURATION;
        }
      } else if (isPoked) {
        pokeProgress += delta;
        const pokeDuration = 0.85;
        const t = Math.min(1, pokeProgress / pokeDuration);
        if (t < 1) {
          // Playful startled bounce & shy tilt
          const bounce = Math.sin(t * Math.PI * 3) * 0.035 * (1 - t);
          figureGroup.position.y = floatY + bounce;
          figureGroup.rotation.z = Math.sin(t * Math.PI) * 0.06;
          if (weapon) {
            weapon.rotation.z = -0.05 + Math.sin(t * Math.PI * 2) * 0.35;
          }
        } else {
          isPoked = false;
          actionBlendTimer = ACTION_BLEND_DURATION;
        }
      } else {
        // Smooth action-to-idle blend
        if (actionBlendTimer > 0) {
          actionBlendTimer = Math.max(0, actionBlendTimer - delta);
          const blendAlpha = 1.0 - (actionBlendTimer / ACTION_BLEND_DURATION);
          const smoothWeight = 0.5 - 0.5 * Math.cos(blendAlpha * Math.PI);
          if (weapon) {
            weapon.position.lerp(restWeaponPos, smoothWeight);
            weapon.rotation.x = THREE.MathUtils.lerp(weapon.rotation.x, restWeaponRot.x, smoothWeight);
            weapon.rotation.y = THREE.MathUtils.lerp(weapon.rotation.y, restWeaponRot.y, smoothWeight);
            weapon.rotation.z = THREE.MathUtils.lerp(weapon.rotation.z, restWeaponRot.z, smoothWeight);
          }
        } else if (weapon) {
          weapon.position.copy(restWeaponPos);
          weapon.rotation.set(restWeaponRot.x, restWeaponRot.y, restWeaponRot.z);
        }
      }

      // Attack impact shake decay (Smooth harmonic sinusoidal impulse)
      if (attackShake > 0.001) {
        attackShake = Math.max(0, attackShake - delta * 4.2);
        figureGroup.position.x = Math.sin(animTimer * 38.0) * attackShake * 0.35;
      } else {
        figureGroup.position.x = 0;
      }
    }

    if (state.tier !== currentTier) {
      updateFigureClothTier(state.tier);
    }
  };

  const updateFigureClothTier = (tier: ClothDamageTier): void => {
    if (tier === currentTier) return;
    currentTier = tier;

    if (!figureGroup) {
      rebuildFigure(tier);
      return;
    }

    // 1. Seamlessly update Portrait Texture without screen blank pop
    const newTex = getHologramValkyrieTexture(config.valkyrieId, config.faction, tier);
    const portrait = figureGroup.getObjectByName('Prismatic_Portrait');
    if (portrait && portrait instanceof THREE.Mesh) {
      (portrait.material as THREE.MeshBasicMaterial).map = newTex;
      (portrait.material as THREE.MeshBasicMaterial).needsUpdate = true;
    }

    // 2. Seamlessly update 3D Armor Layer
    const oldArmor = figureGroup.getObjectByName('Prismatic_Armor_Layer');
    if (oldArmor) {
      figureGroup.remove(oldArmor);
      oldArmor.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else if (child.material) child.material.dispose();
        }
      });
    }
    const newArmor = createDynamic3DArmorLayer(config.primaryColor, tier);
    newArmor.position.set(0, 1.05, 0.088);
    figureGroup.add(newArmor);

    // 3. Seamlessly update 3D Faction Halo
    const oldHalo = figureGroup.getObjectByName('Prismatic_Halo');
    if (oldHalo) {
      figureGroup.remove(oldHalo);
      oldHalo.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else if (child.material) child.material.dispose();
        }
      });
    }
    const newHalo = createValkyrie3DHalo(config.primaryColor, tier);
    newHalo.name = 'Prismatic_Halo';
    figureGroup.add(newHalo);

    // 4. Smoothly toggle Overdrive Aura Ring
    const oldAura = figureGroup.getObjectByName('Prismatic_Overdrive_Aura');
    if (tier === 3) {
      if (!oldAura) {
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
        figureGroup.add(flameMesh);
      }
    } else if (oldAura) {
      figureGroup.remove(oldAura);
      if (oldAura instanceof THREE.Mesh) {
        oldAura.geometry.dispose();
        (oldAura.material as THREE.Material).dispose();
      }
    }

    // 5. Impact feedback
    if (tier > 1) {
      combatVfx.triggerImpactShockwave(new THREE.Vector3(0, 1.05, 0));
      attackShake = tier === 3 ? 0.32 : 0.16;
    }
  };

  const setClothTier = (tier: ClothDamageTier): void => {
    updateFigureClothTier(tier);
  };

  const triggerAttack = (): void => {
    attackShake = 0.14;
    isAttacking = true;
    attackProgress = 0;
    hasTriggeredAttackVfx = false;
    isUlting = false;
    isHitted = false;
    isPoked = false;
  };

  const triggerUltimate = (): void => {
    attackShake = 0.28;
    isUlting = true;
    ultProgress = 0;
    hasTriggeredUltVfx = false;
    isAttacking = false;
    isHitted = false;
    isPoked = false;
    combatVfx.triggerChargeAura(0.45);
  };

  const triggerHit = (): void => {
    attackShake = 0.12;
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

  const dispose = (): void => {
    combatVfx.dispose();
    if (figureGroup) {
      rootGroup.remove(figureGroup);
      figureGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else if (child.material) {
            child.material.dispose();
          }
        }
      });
      figureGroup = null;
    }
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
    dispose
  };
}
